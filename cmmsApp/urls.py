from django.urls import path
from . import views

app_name = "cmmsApp"

urlpatterns = [
    # Main pages
    path("", views.home, name="home"),
    path("contact/", views.contact, name="contact"),

    # Submit Enquiry
    path("request-demo/", views.request_demo_view, name="request_demo"),

    # CHANGE BY JYOTI - 12-Sep-2026
    # Email OTP verification
    path(
        "api/contact/send-email-otp/",
        views.send_email_otp,
        name="send_email_otp",
    ),
    path(
        "api/contact/verify-email-otp/",
        views.verify_email_otp,
        name="verify_email_otp",
    ),

    # Contact form and helpers
    path("contact/submit/", views.contact_block_submit, name="contact_submit"),
    path("contact/phone-info/", views.phone_info, name="phone_info"),
    path("contact/country-list/", views.country_list, name="country_list"),

    # Existing Boilers thanks URL
    path("thanks/", views.contact_thanks, name="contact_thanks"),

    # Sitemap
    path("sitemap.xml", views.sitemap, name="sitemap"),
]
