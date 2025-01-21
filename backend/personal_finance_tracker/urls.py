from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from finance_app.views import UserProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Endpoints para login JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # App
    path('api/', include('finance_app.urls')),

    path('api/profile/', UserProfileView.as_view({
        'get': 'me',
        'patch': 'update_profile'
    })),
    # Para endpoints custom (ex.: /profile/me e /profile/update):
    path('api/profile/me', UserProfileView.as_view({'get': 'me'}), name='profile-me'),
    path('api/profile/update', UserProfileView.as_view({'patch': 'update_profile'}), name='profile-update'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)