from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, FileResponse, Http404
from django.urls import reverse
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import get_connection, EmailMultiAlternatives
from django.contrib import messages
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.core import signing
from django.contrib.staticfiles.storage import staticfiles_storage
from django.contrib.staticfiles import finders

import requests

from threading import Thread
from pathlib import Path
import mimetypes
import re
import hashlib
import hmac
import secrets
import time

import phonenumbers
import pycountry

from .forms import ContactForm
from .utils_contact import normalize_phone_and_country, country_name_from_alpha2

# ---------- Validation patterns ----------
NAME_RE  = re.compile(r"^[A-Za-z\s'.-]{2,}$")
PHONE_RE = re.compile(r"^\+?\d[\d\s\-()]{6,}$")


# ---------- Email helpers ----------
def _send_email(subject: str, text_body: str, html_body: str | None, recipients: list[str] | None):
    """Low-level sender used by async wrappers."""
    try:
        if not recipients:
            # last-resort fallback
            fallback = getattr(settings, "EMAIL_HOST_USER", None) or getattr(settings, "DEFAULT_FROM_EMAIL", None)
            recipients = [fallback] if fallback else []

        if not recipients:
            print("EMAIL WARNING: no recipients configured")
            return

        conn = get_connection(timeout=getattr(settings, "EMAIL_TIMEOUT", 15))
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None) or getattr(settings, "EMAIL_HOST_USER", None),
            to=recipients,
            connection=conn,
        )
        if html_body:
            msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=False)
    except Exception as e:
        print("EMAIL ERROR:", repr(e))




def _send_demo_email_async(subject: str, text_body: str, html_body: str | None = None):
    recipients = getattr(settings, "DEMO_RECIPIENTS", None) or getattr(settings, "CONTACT_RECIPIENTS", None)
    Thread(target=_send_email, args=(subject, text_body, html_body, recipients), daemon=True).start()


def _send_contact_email_async(subject: str, text_body: str, html_body: str | None = None):
    """Fire-and-forget email for Contact form."""
    recipients = getattr(settings, "CONTACT_RECIPIENTS", None)
    Thread(target=_send_email, args=(subject, text_body, html_body, recipients), daemon=True).start()



# ============================================================
# CHANGE BY JYOTI - 12-Sep-2026
# EMAIL OTP VERIFICATION - START
# ============================================================

CONTACT_OTP_EXPIRY_SECONDS = 3 * 60
CONTACT_OTP_RESEND_SECONDS = 60
CONTACT_OTP_MAX_ATTEMPTS = 5
CONTACT_VERIFICATION_TOKEN_MAX_AGE = 15 * 60

CONTACT_OTP_SESSION_KEY = "contact_email_otp"
CONTACT_VERIFIED_SESSION_KEY = "contact_email_verified"
CONTACT_VERIFICATION_SALT = "contact-email-verification-v1"


def _normalise_email(email: str) -> str:
    return (email or "").strip().lower()


def _hash_contact_otp(email: str, otp: str) -> str:
    message = f"{_normalise_email(email)}:{otp}".encode("utf-8")
    key = settings.SECRET_KEY.encode("utf-8")
    return hmac.new(key, message, hashlib.sha256).hexdigest()


def _send_contact_otp_email(email: str, otp: str):
    subject = "Boilers Email Verification Code"
    text_body = (
        "Your email verification code for the Boilers website is: "
        f"{otp}\n\n"
        "This code will expire in 3 minutes.\n"
        "If you did not request this code, you can ignore this email."
    )

    conn = get_connection(timeout=getattr(settings, "EMAIL_TIMEOUT", 15))
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=(
            getattr(settings, "DEFAULT_FROM_EMAIL", None)
            or getattr(settings, "EMAIL_HOST_USER", None)
        ),
        to=[email],
        connection=conn,
    )
    msg.send(fail_silently=False)


@require_POST
def send_email_otp(request):
    email = _normalise_email(request.POST.get("email", ""))

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse(
            {"ok": False, "message": "Please enter a valid email address."},
            status=400,
        )

    now = int(time.time())
    current = request.session.get(CONTACT_OTP_SESSION_KEY) or {}

    if current.get("email") == email:
        elapsed = now - int(current.get("sent_at") or 0)

        if elapsed < CONTACT_OTP_RESEND_SECONDS:
            remaining = CONTACT_OTP_RESEND_SECONDS - elapsed
            return JsonResponse(
                {
                    "ok": False,
                    "message": f"Please wait {remaining} seconds before requesting another OTP.",
                    "resend_in": remaining,
                },
                status=429,
            )

    otp = f"{secrets.randbelow(1_000_000):06d}"

    request.session[CONTACT_OTP_SESSION_KEY] = {
        "email": email,
        "otp_hash": _hash_contact_otp(email, otp),
        "sent_at": now,
        "expires_at": now + CONTACT_OTP_EXPIRY_SECONDS,
        "attempts": 0,
    }

    request.session.pop(CONTACT_VERIFIED_SESSION_KEY, None)
    request.session.modified = True

    try:
        _send_contact_otp_email(email, otp)
    except Exception as exc:
        print("OTP EMAIL ERROR:", repr(exc))
        request.session.pop(CONTACT_OTP_SESSION_KEY, None)
        request.session.modified = True

        return JsonResponse(
            {
                "ok": False,
                "message": "We could not send the verification code. Please try again.",
            },
            status=500,
        )

    return JsonResponse(
        {
            "ok": True,
            "message": "Verification code sent.",
            "expires_in": CONTACT_OTP_EXPIRY_SECONDS,
            "resend_in": CONTACT_OTP_RESEND_SECONDS,
        }
    )


@require_POST
def verify_email_otp(request):
    email = _normalise_email(request.POST.get("email", ""))
    otp = (request.POST.get("otp") or "").strip()

    if not re.fullmatch(r"\d{6}", otp):
        return JsonResponse(
            {"ok": False, "message": "Please enter the 6-digit verification code."},
            status=400,
        )

    state = request.session.get(CONTACT_OTP_SESSION_KEY) or {}

    if not state or state.get("email") != email:
        return JsonResponse(
            {"ok": False, "message": "Please request a new verification code."},
            status=400,
        )

    now = int(time.time())

    if now > int(state.get("expires_at") or 0):
        request.session.pop(CONTACT_OTP_SESSION_KEY, None)
        request.session.modified = True
        return JsonResponse(
            {"ok": False, "message": "The verification code has expired. Please resend it."},
            status=400,
        )

    attempts = int(state.get("attempts") or 0)

    if attempts >= CONTACT_OTP_MAX_ATTEMPTS:
        request.session.pop(CONTACT_OTP_SESSION_KEY, None)
        request.session.modified = True
        return JsonResponse(
            {"ok": False, "message": "Too many incorrect attempts. Please request a new code."},
            status=429,
        )

    expected_hash = state.get("otp_hash") or ""
    supplied_hash = _hash_contact_otp(email, otp)

    if not hmac.compare_digest(expected_hash, supplied_hash):
        state["attempts"] = attempts + 1
        request.session[CONTACT_OTP_SESSION_KEY] = state
        request.session.modified = True

        return JsonResponse(
            {"ok": False, "message": "Incorrect verification code."},
            status=400,
        )

    nonce = secrets.token_urlsafe(24)

    request.session[CONTACT_VERIFIED_SESSION_KEY] = {
        "email": email,
        "nonce": nonce,
        "verified_at": now,
    }

    request.session.pop(CONTACT_OTP_SESSION_KEY, None)
    request.session.modified = True

    verification_token = signing.dumps(
        {"email": email, "nonce": nonce},
        salt=CONTACT_VERIFICATION_SALT,
        compress=True,
    )

    return JsonResponse(
        {
            "ok": True,
            "verified": True,
            "message": "Email verified successfully.",
            "verification_token": verification_token,
        }
    )


def _is_contact_email_verified(request, email: str, token: str) -> bool:
    email = _normalise_email(email)
    token = (token or "").strip()

    if not email or not token:
        return False

    try:
        payload = signing.loads(
            token,
            salt=CONTACT_VERIFICATION_SALT,
            max_age=CONTACT_VERIFICATION_TOKEN_MAX_AGE,
        )
    except signing.BadSignature:
        return False

    verified = request.session.get(CONTACT_VERIFIED_SESSION_KEY) or {}

    return (
        _normalise_email(payload.get("email", "")) == email
        and _normalise_email(verified.get("email", "")) == email
        and bool(payload.get("nonce"))
        and hmac.compare_digest(
            str(payload.get("nonce", "")),
            str(verified.get("nonce", "")),
        )
    )


def _consume_contact_email_verification(request):
    request.session.pop(CONTACT_VERIFIED_SESSION_KEY, None)
    request.session.modified = True


# ============================================================
# CHANGE BY JYOTI - 12-Sep-2026
# EMAIL OTP VERIFICATION - END
# ============================================================

# ---------- Views ----------

def request_demo_view(request):
    if request.method != "POST":
        return redirect("/")

    wants_json = request.headers.get("x-requested-with") == "XMLHttpRequest"

    if not verify_recaptcha(request):
        if wants_json:
            return JsonResponse(
                {"ok": False, "errors": {"captcha": "Please complete the CAPTCHA."}},
                status=400,
            )

        messages.error(request, "Please complete the CAPTCHA.")
        return redirect(request.META.get("HTTP_REFERER", "/"))

    full_name = (request.POST.get("full_name") or "").strip()
    company = (request.POST.get("company") or "").strip()
    email = _normalise_email(request.POST.get("email", ""))
    verification_token = (
        request.POST.get("email_verification_token") or ""
    ).strip()
    phone = (request.POST.get("phone") or "").strip()
    country = (request.POST.get("country") or "").strip()
    address = (request.POST.get("address") or "").strip()
    message = (request.POST.get("message") or "").strip()

    errors = {}

    if not NAME_RE.match(full_name):
        errors["full_name"] = "Please enter a valid full name (letters only)."

    if not company:
        errors["company"] = "Company is required."

    try:
        validate_email(email)
    except ValidationError:
        errors["email"] = "Enter a valid email address."

    if not PHONE_RE.match(phone):
        errors["phone"] = "Enter a valid phone number."

    if not country:
        errors["country"] = "Select a country."

    if errors:
        if wants_json:
            return JsonResponse({"ok": False, "errors": errors}, status=400)

        for msg in errors.values():
            messages.error(request, msg)

        return redirect(request.META.get("HTTP_REFERER", "/"))

    if not _is_contact_email_verified(request, email, verification_token):
        if wants_json:
            return JsonResponse(
                {
                    "ok": False,
                    "errors": {"email": "Please verify your email address."},
                },
                status=400,
            )

        messages.error(request, "Please verify your email address.")
        return redirect(request.META.get("HTTP_REFERER", "/"))

    country_code, dial = (country.split("|", 1) + [""])[:2]

    subject = "New Boilers Enquiry"

    text_body = "\n".join(
        [
            "A new Boilers enquiry was submitted:",
            f"Full name: {full_name}",
            f"Company: {company}",
            f"Email: {email}",
            f"Phone: {phone}",
            f"Country: {country_code} {dial}".strip(),
            f"Address: {address}",
            "",
            "Message:",
            message or "(none)",
        ]
    )

    html_body = f"""
        <h2 style="margin:0 0 8px">New Boilers Enquiry</h2>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;background:#f9fbfc">
          <tr><td><b>Full name</b></td><td>{full_name}</td></tr>
          <tr><td><b>Company</b></td><td>{company}</td></tr>
          <tr><td><b>Email</b></td><td>{email}</td></tr>
          <tr><td><b>Phone</b></td><td>{phone}</td></tr>
          <tr><td><b>Country</b></td><td>{country_code} {dial}</td></tr>
          <tr><td><b>Address</b></td><td>{address}</td></tr>
        </table>
        <p style="margin:12px 0 4px"><b>Message</b></p>
        <pre style="white-space:pre-wrap;font-family:system-ui,Segoe UI,Arial,sans-serif">{message or '(none)'}</pre>
    """

    _send_demo_email_async(subject, text_body, html_body)
    _consume_contact_email_verification(request)

    thanks_url = reverse("cmmsApp:contact_thanks")

    if wants_json:
        return JsonResponse({"ok": True, "redirect": thanks_url})

    return redirect(thanks_url)
def home(request):
    return render(request, "index.html", {
"RECAPTCHA_SITE_KEY": settings.RECAPTCHA_SITE_KEY
})



def request_demo(request):
    return render(
        request,
        "request_demo_modal.html",
        {"RECAPTCHA_SITE_KEY": settings.RECAPTCHA_SITE_KEY},
    )

def contact(request):     
    return render(request, "contact.html", {
        "RECAPTCHA_SITE_KEY": settings.RECAPTCHA_SITE_KEY
    })


def sitemap(request):
    with staticfiles_storage.open('sitemap.xml') as sitemap_file:
        return HttpResponse(sitemap_file, content_type='application/xml')

def contact_section(request):
    form = ContactForm(request.POST or None)

    if request.method == "POST" and not form.is_valid():
        messages.error(request, "Please correct the highlighted fields and resubmit.")

    if request.method == "POST" and form.is_valid():
        cd = form.cleaned_data

        # Normalize phone & resolve country name
        e164_phone, resolved_alpha2, resolved_country_name = normalize_phone_and_country(
            cd.get("phone", ""), cd.get("country", "")
        )

        # # Append to Excel
        # xlsx_path = Path(
        #     getattr(settings, "CONTACT_SUBMISSIONS_XLSX", Path(settings.BASE_DIR) / "contact_submissions.xlsx")
        # # )
        # append_submission_xlsx(
        #     xlsx_path,
        #     [
        #         datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        #         cd["first_name"],
        #         cd.get("last_name", ""),
        #         cd.get("company", ""),
        #         cd["email"],
        #         resolved_alpha2,
        #         resolved_country_name,
        #         e164_phone or cd.get("phone", ""),
        #         cd.get("message", ""),
        #     ],
        # )

        # Email body
        subject = "New website contact submission for Boiler Inquiry"
        text_body = "\n".join(
            [
                "New contact submission for Boiler Inquiry:",
                f"Name: {cd['first_name']} {cd.get('last_name','')}".strip(),
                f"Company: {cd.get('company','')}",
                f"Email: {cd['email']}",
                f"Country: {resolved_country_name or country_name_from_alpha2(resolved_alpha2) or cd.get('country','')}",
                f"Phone: {e164_phone or cd.get('phone','')}",
                "",
                "Message:",
                cd.get("message", ""),
            ]
        )

        _send_contact_email_async(subject, text_body, None)

        return redirect(reverse("cmmsApp:contact_thanks"))

    return render(request, "contact_section.html", {"form": form, "sent": request.GET.get("sent")})



# ---------- NEW: helper (not a view) ----------
def _dial_code_from_alpha2(alpha2: str) -> str:
    """Return '+<code>' from a country alpha2 code."""
    if not alpha2:
        return ""
    try:
        cc = phonenumbers.country_code_for_region(alpha2.upper())
        return f"+{cc}" if cc else ""
    except Exception:
        return ""


# ---------- NEW: JSON helper endpoint ----------
def phone_info(request):
    """
    Optional helper called by the form JS to keep Country <-> Phone in sync.
    Accepts ?phone=+.. OR ?country=Name/Alpha2
    Returns: e164 phone, country (full name), alpha2, dial_code, example
    """
    phone = (request.GET.get("phone") or "").strip()
    country = (request.GET.get("country") or "").strip()

    e164, resolved_alpha2, resolved_country_name = normalize_phone_and_country(phone, country)
    dial = _dial_code_from_alpha2(resolved_alpha2)

    # simple example for UI: prefill with a dial code if user typed only country
    example = ""
    if dial and phone and not phone.startswith("+"):
        example = f"{dial} 4xxxxxxxx"
    elif dial and not phone:
        example = f"{dial} 4xxxxxxxx"

    return JsonResponse({
        "e164": e164,
        "country": resolved_country_name,
        "alpha2": resolved_alpha2,
        "dial_code": dial,
        "example": example
    })


# ---------- NEW: consulting/contact form submit ----------
def contact_block_submit(request):
    if request.method != "POST":
        return redirect(request.META.get("HTTP_REFERER", "/"))

    if not verify_recaptcha(request):
        messages.error(request, "Please complete the CAPTCHA.")
        return redirect(request.META.get("HTTP_REFERER", "/"))

    name = (request.POST.get("name") or "").strip()
    email = _normalise_email(request.POST.get("email", ""))
    verification_token = (
        request.POST.get("email_verification_token") or ""
    ).strip()
    phone = (request.POST.get("phone") or "").strip()
    country = (request.POST.get("country") or "").strip()
    message = (request.POST.get("message") or "").strip()

    errors = []

    if not NAME_RE.match(name):
        errors.append("Please enter a valid name.")

    try:
        validate_email(email)
    except ValidationError:
        errors.append("Enter a valid email address.")

    if not PHONE_RE.match(phone):
        errors.append("Enter a valid phone number.")

    if not country and not phone.startswith("+"):
        errors.append("Please enter your country.")

    if errors:
        for error in errors:
            messages.error(request, error)

        return redirect(request.META.get("HTTP_REFERER", "/"))

    if not _is_contact_email_verified(request, email, verification_token):
        messages.error(request, "Please verify your email address.")
        return redirect(request.META.get("HTTP_REFERER", "/"))

    e164_phone, _alpha2, country_name = normalize_phone_and_country(
        phone,
        country,
    )

    subject = f"[Boilers Website] Consulting request: {name}"

    text_body = "\n".join(
        [
            "A new consulting request was submitted for Boilers:",
            f"Name: {name}",
            f"Email: {email}",
            f"Phone: {e164_phone or phone}",
            f"Country: {country_name or country}",
            "",
            "Message:",
            message or "(none)",
        ]
    )

    _send_contact_email_async(subject, text_body, None)
    _consume_contact_email_verification(request)

    return redirect(reverse("cmmsApp:contact_thanks"))
def country_list(request):
  """Return [{alpha2,name,dial}] sorted by name."""
  data = []
  for c in pycountry.countries:
      try:
          cc = phonenumbers.country_code_for_region(c.alpha_2)
      except Exception:
          cc = None
      if cc:
          data.append({"alpha2": c.alpha_2, "name": c.name, "dial": f"+{cc}"})
  data.sort(key=lambda x: x["name"])
  return JsonResponse(data, safe=False)
def contact_thanks(request):
    return render(request, "contact_thanks.html", {})


def verify_recaptcha(request):
    captcha_response = (request.POST.get("g-recaptcha-response") or "").strip()
    print("captcha_response:", captcha_response)
    print("captcha length:", len(captcha_response) if captcha_response else 0)
    if not captcha_response:
        print("reCAPTCHA failed: no captcha response")
        return False
    data = {
        "secret": settings.RECAPTCHA_SECRET_KEY,
        "response": captcha_response,
    }
    try:
        response = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data=data,
            timeout=10
        )
        result = response.json()
        print("reCAPTCHA result:", result)
        return result.get("success", False)
    except requests.RequestException as e:
        print("reCAPTCHA request error:", str(e))
        return False
