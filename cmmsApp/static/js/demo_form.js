const COUNTRIES = [
  { code: "AF", name: "Afghanistan", dial: "+93" },
  { code: "AL", name: "Albania", dial: "+355" },
  { code: "DZ", name: "Algeria", dial: "+213" },
  { code: "AD", name: "Andorra", dial: "+376" },
  { code: "AO", name: "Angola", dial: "+244" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "AM", name: "Armenia", dial: "+374" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "AT", name: "Austria", dial: "+43" },
  { code: "AZ", name: "Azerbaijan", dial: "+994" },
  { code: "BS", name: "Bahamas", dial: "+1-242" },
  { code: "BH", name: "Bahrain", dial: "+973" },
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "BB", name: "Barbados", dial: "+1-246" },
  { code: "BY", name: "Belarus", dial: "+375" },
  { code: "BE", name: "Belgium", dial: "+32" },
  { code: "BZ", name: "Belize", dial: "+501" },
  { code: "BJ", name: "Benin", dial: "+229" },
  { code: "BT", name: "Bhutan", dial: "+975" },
  { code: "BO", name: "Bolivia", dial: "+591" },
  { code: "BA", name: "Bosnia and Herzegovina", dial: "+387" },
  { code: "BW", name: "Botswana", dial: "+267" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "BN", name: "Brunei", dial: "+673" },
  { code: "BG", name: "Bulgaria", dial: "+359" },
  { code: "BF", name: "Burkina Faso", dial: "+226" },
  { code: "BI", name: "Burundi", dial: "+257" },
  { code: "KH", name: "Cambodia", dial: "+855" },
  { code: "CM", name: "Cameroon", dial: "+237" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "CV", name: "Cape Verde", dial: "+238" },
  { code: "CF", name: "Central African Republic", dial: "+236" },
  { code: "TD", name: "Chad", dial: "+235" },
  { code: "CL", name: "Chile", dial: "+56" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "CO", name: "Colombia", dial: "+57" },
  { code: "KM", name: "Comoros", dial: "+269" },
  { code: "CR", name: "Costa Rica", dial: "+506" },
  { code: "HR", name: "Croatia", dial: "+385" },
  { code: "CU", name: "Cuba", dial: "+53" },
  { code: "CY", name: "Cyprus", dial: "+357" },
  { code: "CZ", name: "Czech Republic", dial: "+420" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "DJ", name: "Djibouti", dial: "+253" },
  { code: "DM", name: "Dominica", dial: "+1-767" },
  { code: "DO", name: "Dominican Republic", dial: "+1-809" },
  { code: "EC", name: "Ecuador", dial: "+593" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "SV", name: "El Salvador", dial: "+503" },
  { code: "GQ", name: "Equatorial Guinea", dial: "+240" },
  { code: "ER", name: "Eritrea", dial: "+291" },
  { code: "EE", name: "Estonia", dial: "+372" },
  { code: "SZ", name: "Eswatini", dial: "+268" },
  { code: "ET", name: "Ethiopia", dial: "+251" },
  { code: "FJ", name: "Fiji", dial: "+679" },
  { code: "FI", name: "Finland", dial: "+358" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "GA", name: "Gabon", dial: "+241" },
  { code: "GM", name: "Gambia", dial: "+220" },
  { code: "GE", name: "Georgia", dial: "+995" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "GH", name: "Ghana", dial: "+233" },
  { code: "GR", name: "Greece", dial: "+30" },
  { code: "GD", name: "Grenada", dial: "+1-473" },
  { code: "GT", name: "Guatemala", dial: "+502" },
  { code: "GN", name: "Guinea", dial: "+224" },
  { code: "GY", name: "Guyana", dial: "+592" },
  { code: "HT", name: "Haiti", dial: "+509" },
  { code: "HN", name: "Honduras", dial: "+504" },
  { code: "HU", name: "Hungary", dial: "+36" },
  { code: "IS", name: "Iceland", dial: "+354" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "IR", name: "Iran", dial: "+98" },
  { code: "IQ", name: "Iraq", dial: "+964" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "IL", name: "Israel", dial: "+972" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "CI", name: "Ivory Coast", dial: "+225" },
  { code: "JM", name: "Jamaica", dial: "+1-876" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "JO", name: "Jordan", dial: "+962" },
  { code: "KZ", name: "Kazakhstan", dial: "+7" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "KI", name: "Kiribati", dial: "+686" },
  { code: "KW", name: "Kuwait", dial: "+965" },
  { code: "KG", name: "Kyrgyzstan", dial: "+996" },
  { code: "LA", name: "Laos", dial: "+856" },
  { code: "LV", name: "Latvia", dial: "+371" },
  { code: "LB", name: "Lebanon", dial: "+961" },
  { code: "LS", name: "Lesotho", dial: "+266" },
  { code: "LR", name: "Liberia", dial: "+231" },
  { code: "LY", name: "Libya", dial: "+218" },
  { code: "LI", name: "Liechtenstein", dial: "+423" },
  { code: "LT", name: "Lithuania", dial: "+370" },
  { code: "LU", name: "Luxembourg", dial: "+352" },
  { code: "MG", name: "Madagascar", dial: "+261" },
  { code: "MW", name: "Malawi", dial: "+265" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "MV", name: "Maldives", dial: "+960" },
  { code: "ML", name: "Mali", dial: "+223" },
  { code: "MT", name: "Malta", dial: "+356" },
  { code: "MH", name: "Marshall Islands", dial: "+692" },
  { code: "MR", name: "Mauritania", dial: "+222" },
  { code: "MU", name: "Mauritius", dial: "+230" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "FM", name: "Micronesia", dial: "+691" },
  { code: "MD", name: "Moldova", dial: "+373" },
  { code: "MC", name: "Monaco", dial: "+377" },
  { code: "MN", name: "Mongolia", dial: "+976" },
  { code: "ME", name: "Montenegro", dial: "+382" },
  { code: "MA", name: "Morocco", dial: "+212" },
  { code: "MZ", name: "Mozambique", dial: "+258" },
  { code: "MM", name: "Myanmar", dial: "+95" },
  { code: "NA", name: "Namibia", dial: "+264" },
  { code: "NR", name: "Nauru", dial: "+674" },
  { code: "NP", name: "Nepal", dial: "+977" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "NI", name: "Nicaragua", dial: "+505" },
  { code: "NE", name: "Niger", dial: "+227" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "KP", name: "North Korea", dial: "+850" },
  { code: "MK", name: "North Macedonia", dial: "+389" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "OM", name: "Oman", dial: "+968" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "PW", name: "Palau", dial: "+680" },
  { code: "PA", name: "Panama", dial: "+507" },
  { code: "PG", name: "Papua New Guinea", dial: "+675" },
  { code: "PY", name: "Paraguay", dial: "+595" },
  { code: "PE", name: "Peru", dial: "+51" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "PL", name: "Poland", dial: "+48" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "CG", name: "Republic of the Congo", dial: "+242" },
  { code: "RO", name: "Romania", dial: "+40" },
  { code: "RU", name: "Russia", dial: "+7" },
  { code: "RW", name: "Rwanda", dial: "+250" },
  { code: "KN", name: "Saint Kitts and Nevis", dial: "+1-869" },
  { code: "LC", name: "Saint Lucia", dial: "+1-758" },
  { code: "VC", name: "Saint Vincent and the Grenadines", dial: "+1-784" },
  { code: "WS", name: "Samoa", dial: "+685" },
  { code: "SM", name: "San Marino", dial: "+378" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "SN", name: "Senegal", dial: "+221" },
  { code: "RS", name: "Serbia", dial: "+381" },
  { code: "SC", name: "Seychelles", dial: "+248" },
  { code: "SL", name: "Sierra Leone", dial: "+232" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "SK", name: "Slovakia", dial: "+421" },
  { code: "SI", name: "Slovenia", dial: "+386" },
  { code: "SB", name: "Solomon Islands", dial: "+677" },
  { code: "SO", name: "Somalia", dial: "+252" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "SS", name: "South Sudan", dial: "+211" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "SD", name: "Sudan", dial: "+249" },
  { code: "SR", name: "Suriname", dial: "+597" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "SY", name: "Syria", dial: "+963" },
  { code: "TW", name: "Taiwan", dial: "+886" },
  { code: "TJ", name: "Tajikistan", dial: "+992" },
  { code: "TZ", name: "Tanzania", dial: "+255" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "TL", name: "Timor-Leste", dial: "+670" },
  { code: "TG", name: "Togo", dial: "+228" },
  { code: "TO", name: "Tonga", dial: "+676" },
  { code: "TT", name: "Trinidad and Tobago", dial: "+1-868" },
  { code: "TN", name: "Tunisia", dial: "+216" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "TM", name: "Turkmenistan", dial: "+993" },
  { code: "TV", name: "Tuvalu", dial: "+688" },
  { code: "UG", name: "Uganda", dial: "+256" },
  { code: "UA", name: "Ukraine", dial: "+380" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "UY", name: "Uruguay", dial: "+598" },
  { code: "UZ", name: "Uzbekistan", dial: "+998" },
  { code: "VU", name: "Vanuatu", dial: "+678" },
  { code: "VA", name: "Vatican City", dial: "+379" },
  { code: "VE", name: "Venezuela", dial: "+58" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "YE", name: "Yemen", dial: "+967" },
  { code: "ZM", name: "Zambia", dial: "+260" },
  { code: "ZW", name: "Zimbabwe", dial: "+263" }
];


// ============================================================
// CHANGE BY JYOTI - 10-Sep-2026
// Submit Enquiry - Email OTP Verification
// ============================================================

(function () {

  const modal = document.getElementById("demoModal");
  const openers = document.querySelectorAll(
    ".js-open-demo, .book-demo-btn"
  );

  const form = document.getElementById("demoForm");

  if (!modal || !form) return;


  // ==========================================================
  // EXISTING FORM ELEMENTS
  // ==========================================================

  const submitBtn =
    document.getElementById("submitBtn");

  const countrySelect =
    document.getElementById("country");

  const phoneInput =
    document.getElementById("phone");

  const closers =
    modal.querySelectorAll("[data-close-demo]");


  // ==========================================================
  // CHANGE BY JYOTI
  // EMAIL OTP ELEMENTS
  // ==========================================================

  const emailInput =
    document.getElementById("email");

  const verifyEmailBtn =
    document.getElementById("demo_verify_email");

  const otpInput =
    document.getElementById("demo_otp");

  const otpActions =
    document.getElementById("demo_otp_actions");

  const otpTimer =
    document.getElementById("demo_otp_timer");

  const verifyOtpBtn =
    document.getElementById("demo_verify_otp");

  const resendOtpBtn =
    document.getElementById("demo_resend_otp");

  const verifiedBadge =
    document.getElementById("demo_email_verified");

  const otpMessage =
    document.getElementById("demo_otp_message");

  const verificationToken =
    document.getElementById(
      "demo_email_verification_token"
    );


  if (
    !submitBtn ||
    !countrySelect ||
    !phoneInput ||
    !emailInput ||
    !verifyEmailBtn ||
    !otpInput ||
    !otpActions ||
    !otpTimer ||
    !verifyOtpBtn ||
    !resendOtpBtn ||
    !verifiedBadge ||
    !verificationToken
  ) {
    return;
  }


  // ==========================================================
  // OTP URLS
  // ==========================================================

  /*
    IMPORTANT:
    demoform.js is a static JS file.

    Therefore do NOT write:

    {% url 'cmmsApp:send_email_otp' %}

    inside this file.
  */

  const SEND_OTP_URL =
    "/api/contact/send-email-otp/";

  const VERIFY_OTP_URL =
    "/api/contact/verify-email-otp/";


  const OTP_EXPIRY_SECONDS = 180;
  const RESEND_SECONDS = 60;


  let emailVerified = false;
  let emailUsedForOtp = "";

  let remainingSeconds = 0;
  let resendRemaining = 0;

  let expiryInterval = null;
  let resendInterval = null;

  let submitting = false;


  // ==========================================================
  // TOAST
  // ==========================================================

  function showToast(
    msg,
    type = "error",
    timeoutMs = 4000
  ) {

    /*
      CHANGE BY JYOTI:
      Toast does NOT scroll the page.
    */

    const root =
      document.getElementById("cmmsToastRoot") ||
      document.getElementById("transformerToastRoot");


    if (!root) {

      alert(msg);

      return;
    }


    const el =
      document.createElement("div");


    el.className =
      "transformer-toast " +
      (
        type === "ok"
          ? "transformer-toast--ok"
          : "transformer-toast--error"
      );


    el.innerHTML = `
      <span aria-hidden="true">
        ${type === "ok" ? "✔️" : "⚠️"}
      </span>

      <div>${msg}</div>

      <button
        class="transformer-toast__close"
        type="button"
        aria-label="Close"
      >
        ×
      </button>
    `;


    root.appendChild(el);


    const remove = () => {

      el.remove();

    };


    const closeBtn =
      el.querySelector(
        ".transformer-toast__close"
      );


    if (closeBtn) {

      closeBtn.addEventListener(
        "click",
        remove
      );

    }


    setTimeout(
      remove,
      timeoutMs
    );
  }


  // ==========================================================
  // CSRF TOKEN
  // ==========================================================

  function getCsrfToken() {

    const token =
      form.querySelector(
        'input[name="csrfmiddlewaretoken"]'
      );


    return token
      ? token.value
      : "";
  }


  // ==========================================================
  // EMAIL VALIDATION
  // ==========================================================

  function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
      email
    );
  }


  // ==========================================================
  // TIMER FORMAT
  // ==========================================================

  function formatTime(seconds) {

    const minutes =
      Math.floor(
        seconds / 60
      );


    const secs =
      seconds % 60;


    return (
      String(minutes).padStart(2, "0")
      +
      ":"
      +
      String(secs).padStart(2, "0")
    );
  }


  // ==========================================================
  // STOP TIMERS
  // ==========================================================

  function stopExpiryTimer() {

    if (expiryInterval) {

      clearInterval(
        expiryInterval
      );

      expiryInterval = null;
    }
  }


  function stopResendTimer() {

    if (resendInterval) {

      clearInterval(
        resendInterval
      );

      resendInterval = null;
    }
  }


  // ==========================================================
  // SUBMIT BUTTON
  // ==========================================================

  function updateSubmitAvailability() {

    if (submitting) {

      submitBtn.disabled = true;

      return;
    }


    /*
      CHANGE BY JYOTI:
      Submit is enabled ONLY after successful OTP verification.
    */

    submitBtn.disabled =
      !(
        emailVerified &&
        verificationToken.value
      );
  }


  // ==========================================================
  // VERIFY EMAIL LINK
  // ==========================================================

  function updateVerifyEmailButton() {

    const email =
      emailInput.value.trim();


    if (
      !emailVerified &&
      !emailUsedForOtp &&
      validEmail(email)
    ) {

      verifyEmailBtn.style.display =
        "inline-block";

    } else {

      verifyEmailBtn.style.display =
        "none";
    }
  }


  // ==========================================================
  // RESET OTP VERIFICATION
  // ==========================================================

  function resetEmailVerification() {

    emailVerified = false;

    emailUsedForOtp = "";

    verificationToken.value = "";


    stopExpiryTimer();
    stopResendTimer();


    verifiedBadge.style.display =
      "none";


    otpInput.value = "";

    otpInput.style.display =
      "none";


    otpActions.style.display =
      "none";


    resendOtpBtn.style.display =
      "none";

    resendOtpBtn.disabled =
      false;

    resendOtpBtn.textContent =
      "Resend";


    emailInput.style.display =
      "block";

    emailInput.readOnly =
      false;


    if (otpMessage) {

      otpMessage.textContent = "";

      otpMessage.style.display =
        "none";
    }


    updateVerifyEmailButton();

    updateSubmitAvailability();
  }


  // ==========================================================
  // OTP EXPIRY TIMER
  // ==========================================================

  function startExpiryTimer(expiresIn) {

    stopExpiryTimer();


    remainingSeconds =
      Number(expiresIn)
      ||
      OTP_EXPIRY_SECONDS;


    otpTimer.textContent =
      formatTime(
        remainingSeconds
      );


    verifyOtpBtn.disabled =
      false;


    expiryInterval =
      setInterval(
        function () {

          remainingSeconds -= 1;


          otpTimer.textContent =
            formatTime(
              Math.max(
                remainingSeconds,
                0
              )
            );


          if (
            remainingSeconds <= 0
          ) {

            stopExpiryTimer();


            verifyOtpBtn.disabled =
              true;


            showToast(
              "OTP expired. Please request a new OTP.",
              "error"
            );
          }

        },
        1000
      );
  }


  // ==========================================================
  // RESEND TIMER
  // ==========================================================

  function startResendTimer() {

    stopResendTimer();


    resendRemaining =
      RESEND_SECONDS;


    resendOtpBtn.style.display =
      "inline-block";


    resendOtpBtn.disabled =
      true;


    resendOtpBtn.textContent =
      `Resend OTP (${resendRemaining}s)`;


    resendInterval =
      setInterval(
        function () {

          resendRemaining -= 1;


          if (
            resendRemaining <= 0
          ) {

            stopResendTimer();


            resendOtpBtn.disabled =
              false;


            resendOtpBtn.textContent =
              "Resend OTP";


            return;
          }


          resendOtpBtn.textContent =
            `Resend OTP (${resendRemaining}s)`;

        },
        1000
      );
  }


  // ==========================================================
  // CHANGE BY JYOTI
  // SEND EMAIL OTP
  // ==========================================================

  async function sendEmailOtp() {

    const email =
      emailInput.value
        .trim()
        .toLowerCase();


    if (!email) {

      showToast(
        "Please enter your email address.",
        "error"
      );


      emailInput.focus({
        preventScroll: true
      });


      return;
    }


    if (!validEmail(email)) {

      showToast(
        "Please enter a valid email address.",
        "error"
      );


      emailInput.focus({
        preventScroll: true
      });


      return;
    }


    verifyEmailBtn.disabled =
      true;


    resendOtpBtn.disabled =
      true;


    const oldText =
      verifyEmailBtn.textContent;


    verifyEmailBtn.textContent =
      "Sending...";


    const body =
      new FormData();


    body.append(
      "email",
      email
    );


    try {

      const response =
        await fetch(
          SEND_OTP_URL,
          {

            method: "POST",

            headers: {

              "X-CSRFToken":
                getCsrfToken(),

              "X-Requested-With":
                "XMLHttpRequest"
            },

            credentials:
              "same-origin",

            body: body
          }
        );


      let data = {};


      try {

        data =
          await response.json();

      } catch (e) {

        throw new Error(
          "Invalid response from server."
        );
      }


      if (
        !response.ok ||
        !data.ok
      ) {

        throw new Error(
          data.message
          ||
          "Unable to send OTP."
        );
      }


      emailUsedForOtp =
        email;


      /*
        Hide email and show OTP
        in the same position.
      */

      emailInput.style.display =
        "none";


      verifyEmailBtn.style.display =
        "none";


      otpInput.style.display =
        "block";


      otpActions.style.display =
        "flex";


      otpInput.value =
        "";


      otpInput.focus({
        preventScroll: true
      });


      startExpiryTimer(
        data.expires_in
        ||
        OTP_EXPIRY_SECONDS
      );


      startResendTimer();


      showToast(
        "OTP sent successfully. Please check your email.",
        "ok"
      );


    } catch (error) {


      updateVerifyEmailButton();


      showToast(
        error.message
        ||
        "Unable to send OTP.",
        "error"
      );


    } finally {


      verifyEmailBtn.disabled =
        false;


      verifyEmailBtn.textContent =
        oldText
        ||
        "Verify email";


      if (!resendInterval) {

        resendOtpBtn.disabled =
          false;
      }

    }
  }


  // ==========================================================
  // CHANGE BY JYOTI
  // VERIFY EMAIL OTP
  // ==========================================================

  async function verifyEmailOtp() {

    const email =
      emailInput.value
        .trim()
        .toLowerCase();


    const otp =
      otpInput.value.trim();


    if (
      email !== emailUsedForOtp
    ) {

      resetEmailVerification();


      showToast(
        "Email address changed. Please request a new OTP.",
        "error"
      );


      return;
    }


    if (
      remainingSeconds <= 0
    ) {

      showToast(
        "OTP expired. Please request a new OTP.",
        "error"
      );


      return;
    }


    if (
      !/^\d{6}$/.test(otp)
    ) {

      showToast(
        "Please enter the 6-digit OTP.",
        "error"
      );


      otpInput.focus({
        preventScroll: true
      });


      return;
    }


    verifyOtpBtn.disabled =
      true;


    verifyOtpBtn.textContent =
      "Verifying...";


    const body =
      new FormData();


    body.append(
      "email",
      email
    );


    body.append(
      "otp",
      otp
    );


    try {


      const response =
        await fetch(
          VERIFY_OTP_URL,
          {

            method: "POST",

            headers: {

              "X-CSRFToken":
                getCsrfToken(),

              "X-Requested-With":
                "XMLHttpRequest"
            },

            credentials:
              "same-origin",

            body: body
          }
        );


      let data = {};


      try {

        data =
          await response.json();

      } catch (e) {

        throw new Error(
          "Invalid response from server."
        );
      }


      if (
        !response.ok ||
        !data.ok ||
        !data.verified ||
        !data.verification_token
      ) {

        throw new Error(
          data.message
          ||
          "OTP verification failed."
        );
      }


      emailVerified =
        true;


      verificationToken.value =
        data.verification_token;


      stopExpiryTimer();

      stopResendTimer();


      otpInput.style.display =
        "none";


      otpActions.style.display =
        "none";


      emailInput.style.display =
        "block";


      emailInput.readOnly =
        true;


      verifyEmailBtn.style.display =
        "none";


      verifiedBadge.style.display =
        "inline-block";


      /*
        CHANGE BY JYOTI:
        Enable Submit after OTP verification.
      */

      updateSubmitAvailability();


      showToast(
        "Email verified successfully.",
        "ok",
        5000
      );


    } catch (error) {


      showToast(
        error.message
        ||
        "OTP verification failed.",
        "error"
      );


      otpInput.focus({
        preventScroll: true
      });


      otpInput.select();


    } finally {


      if (
        !emailVerified &&
        remainingSeconds > 0
      ) {

        verifyOtpBtn.disabled =
          false;
      }


      verifyOtpBtn.textContent =
        "Verify OTP";

    }
  }


  // ==========================================================
  // LOADING
  // ==========================================================

  function setLoading(isLoading) {

    if (isLoading) {

      submitBtn.classList.add(
        "is-loading"
      );


      submitBtn.disabled =
        true;


    } else {


      submitBtn.classList.remove(
        "is-loading"
      );


      /*
        CHANGE BY JYOTI:
        Do not automatically enable Submit.
      */

      updateSubmitAvailability();
    }
  }


  function resetSubmitState() {

    submitting = false;

    setLoading(false);
  }


  // ==========================================================
  // MODAL OPEN / CLOSE
  // ==========================================================

  const open = (e) => {

    if (e) {

      e.preventDefault();
    }


    modal.classList.add(
      "is-open"
    );


    resetSubmitState();

    updateVerifyEmailButton();
  };


  const close = (e) => {

    if (e) {

      e.preventDefault();
    }


    modal.classList.remove(
      "is-open"
    );


    resetSubmitState();
  };


  openers.forEach(
    el => {

      el.addEventListener(
        "click",
        open
      );

    }
  );


  closers.forEach(
    el => {

      el.addEventListener(
        "click",
        close
      );

    }
  );


  document.addEventListener(
    "keydown",
    function (e) {

      if (
        e.key === "Escape"
      ) {

        close(e);
      }

    }
  );


  // ==========================================================
  // FORM ERRORS
  // ==========================================================

  const err = (
    name,
    msg = ""
  ) => {

    const el =
      document.querySelector(
        `[data-error-for="${name}"]`
      );


    if (el) {

      el.textContent =
        msg;
    }
  };


  const clearErr = () => {


    form
      .querySelectorAll(".error")
      .forEach(
        function (e) {

          e.textContent =
            "";
        }
      );


    form
      .querySelectorAll(".is-error")
      .forEach(
        function (el) {

          el.classList.remove(
            "is-error"
          );
        }
      );


    form
      .querySelectorAll(
        "[aria-invalid='true']"
      )
      .forEach(
        function (el) {

          el.removeAttribute(
            "aria-invalid"
          );
        }
      );
  };


  // ==========================================================
  // COUNTRY / PHONE
  // ==========================================================

  const normalizeDial = (s) =>
    (s || "").replace(
      /[^0-9+]/g,
      ""
    );


  let COUNTRY_OPT_CACHE = [];


  function rebuildCountryCache() {

    COUNTRY_OPT_CACHE =
      Array.from(
        countrySelect.options
      )
        .slice(1)
        .map(
          function (o) {

            const [code, dial] =
              (o.value || "")
                .split("|");


            return {

              value:
                o.value,

              code:
                code,

              dial:
                dial,

              nDial:
                normalizeDial(
                  dial || ""
                )
            };
          }
        );
  }


  function findOptionByPhone(val) {

    const p =
      normalizeDial(
        (val || "").trim()
      );


    if (
      !p.startsWith("+")
    ) {

      return null;
    }


    let best =
      null;


    for (
      const opt of COUNTRY_OPT_CACHE
    ) {


      if (
        opt.nDial &&
        p.startsWith(
          opt.nDial
        )
      ) {


        if (
          !best ||
          opt.nDial.length >
          best.nDial.length
        ) {

          best =
            opt;
        }
      }
    }


    return best;
  }


  function setPhoneDial(dial) {

    if (!dial) return;


    const rest =
      (phoneInput.value || "")
        .replace(
          /^\+\s*[\d\-\s()]+/,
          ""
        )
        .trim();


    phoneInput.value =
      `${dial}${rest ? " " + rest : ""}`;
  }


  // ==========================================================
  // BUILD COUNTRY LIST
  // ==========================================================

  if (
    countrySelect.options.length <= 1
  ) {


    const frag =
      document.createDocumentFragment();


    const def =
      document.createElement(
        "option"
      );


    def.value =
      "";


    def.textContent =
      "-- Select Country --";


    frag.appendChild(
      def
    );


    COUNTRIES.forEach(
      function (c) {


        const o =
          document.createElement(
            "option"
          );


        o.value =
          `${c.code}|${c.dial}`;


        o.textContent =
          `${c.name} (${c.dial})`;


        frag.appendChild(
          o
        );
      }
    );


    countrySelect.appendChild(
      frag
    );
  }


  rebuildCountryCache();


  // ==========================================================
  // PHONE -> COUNTRY
  // ==========================================================

  phoneInput.addEventListener(
    "input",
    function () {


      const match =
        findOptionByPhone(
          phoneInput.value
        );


      if (match) {

        countrySelect.value =
          match.value;
      }

    }
  );


  // ==========================================================
  // COUNTRY -> PHONE
  // ==========================================================

  countrySelect.addEventListener(
    "change",
    function () {


      const [, dial] =
        (countrySelect.value || "")
          .split("|");


      if (!dial) {


        phoneInput.placeholder =
          "+61 4xx xxx xxx";


        return;
      }


      phoneInput.placeholder =
        `${dial} ...`;


      const current =
        normalizeDial(
          phoneInput.value
        );


      if (
        !current.startsWith(
          normalizeDial(dial)
        )
      ) {


        setPhoneDial(
          dial
        );
      }

    }
  );


  // ==========================================================
  // CHANGE BY JYOTI
  // EMAIL EVENT
  // ==========================================================

  emailInput.addEventListener(
    "input",
    function () {


      if (
        emailVerified ||
        emailUsedForOtp
      ) {


        resetEmailVerification();
      }


      updateVerifyEmailButton();

    }
  );


  emailInput.addEventListener(
    "blur",
    updateVerifyEmailButton
  );


  verifyEmailBtn.addEventListener(
    "click",
    sendEmailOtp
  );


  verifyOtpBtn.addEventListener(
    "click",
    verifyEmailOtp
  );


  resendOtpBtn.addEventListener(
    "click",
    function () {


      if (
        !emailVerified &&
        !resendOtpBtn.disabled
      ) {


        sendEmailOtp();
      }

    }
  );


  otpInput.addEventListener(
    "input",
    function () {


      this.value =
        this.value
          .replace(/\D/g, "")
          .slice(0, 6);

    }
  );


  otpInput.addEventListener(
    "keydown",
    function (e) {


      if (
        e.key === "Enter"
      ) {


        e.preventDefault();


        verifyEmailOtp();
      }

    }
  );


  // ==========================================================
  // VALIDATION
  // ==========================================================

  function validate() {

    clearErr();


    const fail = (
      name,
      msg
    ) => {


      err(
        name,
        msg
      );


      showToast(
        msg,
        "error"
      );


      const input =
        form.querySelector(
          `[name="${name}"]`
        );


      if (input) {


        input.classList.add(
          "is-error"
        );


        input.setAttribute(
          "aria-invalid",
          "true"
        );


        /*
          Existing behavior:
          Scroll only to invalid FORM field.

          Toast itself does not scroll.
        */

        input.scrollIntoView({
          block:
            "center",

          behavior:
            "smooth"
        });


        setTimeout(
          function () {


            input.focus({
              preventScroll:
                true
            });

          },
          250
        );
      }


      return false;
    };


    const fullName =
      (
        form.full_name?.value
        ||
        ""
      ).trim();


    if (
      !/^[A-Za-z\s'.-]{2,}$/.test(
        fullName
      )
    ) {


      return fail(
        "full_name",
        "Please enter a valid full name (letters only)."
      );
    }


    const company =
      (
        form.company?.value
        ||
        ""
      ).trim();


    if (
      company.length < 2
    ) {


      return fail(
        "company",
        "Company is required."
      );
    }


    const email =
      (
        form.email?.value
        ||
        ""
      ).trim();


    if (
      !validEmail(email)
    ) {


      return fail(
        "email",
        "Enter a valid email address."
      );
    }


    /*
      CHANGE BY JYOTI:
      Require OTP verification.
    */

    if (
      !emailVerified ||
      !verificationToken.value
    ) {


      return fail(
        "email",
        "Please verify your email address."
      );
    }


    const phone =
      (
        form.phone?.value
        ||
        ""
      ).trim();


    if (
      !/^\+?\d[\d\s\-()]{6,}$/.test(
        phone
      )
    ) {


      return fail(
        "phone",
        "Enter a valid phone number."
      );
    }


    if (
      !form.country?.value
    ) {


      return fail(
        "country",
        "Please select a country."
      );
    }


    return true;
  }


  // ==========================================================
  // PREVENT DOUBLE BINDING
  // ==========================================================

  if (
    form.dataset.boundSubmit === "1"
  ) {

    return;
  }


  form.dataset.boundSubmit =
    "1";


  // ==========================================================
  // SUBMIT FORM
  // ==========================================================

  form.addEventListener(
    "submit",
    async function (e) {


      e.preventDefault();


      if (submitting) {

        return;
      }


      /*
        CHANGE BY JYOTI:
        First ensure email OTP is verified.
      */

      if (
        !emailVerified ||
        !verificationToken.value
      ) {


        showToast(
          "Please verify your email address before submitting the enquiry.",
          "error"
        );


        err(
          "email",
          "Please verify your email address."
        );


        return;
      }


      if (!validate()) {


        resetSubmitState();


        return;
      }


      submitting =
        true;


      setLoading(
        true
      );


      const safetyTimer =
        setTimeout(
          function () {


            if (submitting) {


              showToast(
                "Taking too long. Please try again.",
                "error"
              );


              resetSubmitState();
            }

          },
          15000
        );


      try {


        const res =
          await fetch(
            form.action,
            {

              method:
                "POST",

              body:
                new FormData(form),

              headers: {

                "X-Requested-With":
                  "XMLHttpRequest"
              },

              credentials:
                "same-origin",

              redirect:
                "follow"
            }
          );


        const contentType =
          (
            res.headers.get(
              "content-type"
            )
            ||
            ""
          ).toLowerCase();


        // ================================================
        // JSON RESPONSE
        // ================================================

        if (
          contentType.includes(
            "application/json"
          )
        ) {


          const data =
            await res
              .json()
              .catch(
                function () {

                  return {};
                }
              );


          if (
            !res.ok ||
            !data.ok
          ) {


            const errors =
              data.errors
              ||
              {};


            Object.keys(
              errors
            ).forEach(
              function (key) {


                err(
                  key,
                  errors[key]
                );
              }
            );


            showToast(
              errors.email
              ||
              "Please fix the errors and try again.",
              "error"
            );


            return;
          }


          form.reset();


          clearErr();


          emailVerified =
            false;


          emailUsedForOtp =
            "";


          verificationToken.value =
            "";


          stopExpiryTimer();

          stopResendTimer();


          modal.classList.remove(
            "is-open"
          );


          const redirectUrl =
            data.redirect
            ||
            form.querySelector(
              'input[name="next"]'
            )?.value
            ||
            "/thanks/";


          window.location.assign(
            redirectUrl
          );


          return;
        }


        // ================================================
        // HTML / DJANGO REDIRECT RESPONSE
        // ================================================

        if (res.ok) {


          form.reset();


          clearErr();


          emailVerified =
            false;


          emailUsedForOtp =
            "";


          verificationToken.value =
            "";


          stopExpiryTimer();

          stopResendTimer();


          modal.classList.remove(
            "is-open"
          );


          window.location.assign(
            res.url
          );


          return;
        }


        showToast(
          "Server error. Please try again.",
          "error"
        );


      } catch (error) {


        showToast(
          "Network error. Please try again.",
          "error"
        );


      } finally {


        clearTimeout(
          safetyTimer
        );


        resetSubmitState();
      }

    }
  );


  // ==========================================================
  // BROWSER BACK BUTTON
  // ==========================================================

  window.addEventListener(
    "pageshow",
    function () {


      form.reset();


      clearErr();


      resetEmailVerification();


      submitting =
        false;


      submitBtn.classList.remove(
        "is-loading"
      );


      updateSubmitAvailability();

    }
  );


  // ==========================================================
  // INITIAL STATE
  // ==========================================================

  resetEmailVerification();

  updateSubmitAvailability();

})();