# app/urls.py
from django.urls import path
from .views import RegisterView, LoginView, PhishingDetectionView
from .views import UserProfileView
from .views import get_user_by_email

urlpatterns = [
    path('detect/', PhishingDetectionView.as_view(), name='detect_phishing'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('users/<str:email>/', get_user_by_email, name='get_user_by_email'),

]

