from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from .serializers import UserSerializer, PhishingRequestSerializer
from datetime import datetime
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import EmailAnalysis
from .serializers import (
    UserSerializer, 
    PhishingRequestSerializer, 
    EmailSerializer
)


from .phishing_detector import perform_phishing_detection
from rest_framework.decorators import api_view
import logging
import nltk


# Download necessary packages (only needed once)
nltk.download('punkt')  # For tokenization
nltk.download('stopwords')  # If you're using stop words
nltk.download('punkt_tab')

logger = logging.getLogger(__name__)

class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'email': user.email  # Send the email instead of username
                })
            else:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_user_by_email(request, email):
    try:
        user = User.objects.get(email=email)
        user_data = {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'date_joined': user.date_joined,
            'last_login': user.last_login,
            'is_active': user.is_active
        }
        return Response(user_data, status=200)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
  
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            "username": user.username,
            "email": user.email,
            "password": "****"  # Masked password
        }
        return Response(user_data)


@api_view(['POST'])
def analyze_email(user, sender, subject, content):
    # Perform your email analysis logic
    is_phishing = perform_analysis(content)  # Example analysis logic
    confidence_score = calculate_confidence(content)

    # Create a new EmailAnalysis record and associate it with the user
    email_analysis = EmailAnalysis.objects.create(
        user=user,  # Associate the logged-in user
        sender=sender,
        subject=subject,
        content=content,
        is_phishing=is_phishing,
        confidence_score=confidence_score
    )
    return email_analysis

class PhishingDetectionView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PhishingRequestSerializer(data=request.data)
        if serializer.is_valid():
            sender = serializer.validated_data['sender']
            subject = serializer.validated_data['subject']
            content = serializer.validated_data['content']

            email_data = EmailAnalysis(sender=sender, subject=subject, content=content)
            email_data.save()

            try:
                detection_result = perform_phishing_detection({'sender': sender, 'subject': subject, 'content': content})
                email_data.is_phishing = detection_result['is_phishing']
                email_data.confidence_score = detection_result['confidence_score']
                email_data.save()  # Save the updated is_phishing and confidence score

                message = "This email is considered phishing." if detection_result['is_phishing'] else "This email is not considered phishing."
                return Response({'is_phishing': detection_result['is_phishing'], 'message': message, 'confidence_score': detection_result['confidence_score']}, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"Error in PhishingDetectionView: {str(e)}")
                return Response({'detail': 'There was an error detecting phishing. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'detail': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)