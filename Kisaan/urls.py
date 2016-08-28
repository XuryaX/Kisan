from views import HomePage,ContactList,MessageList,SendOTP

from django.conf.urls import url

urlpatterns = [
    url(r'^$', HomePage.as_view(),name='homepage'),
    url(r'^contacts', ContactList.as_view(),name='contact-details'),
    url(r'^messages', MessageList.as_view(),name='message-details'),
    url(r'^send-otp', SendOTP.as_view(),name='send-otp'),
]