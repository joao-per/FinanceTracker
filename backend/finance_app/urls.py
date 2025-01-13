from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    AccountViewSet, CategoryViewSet, TransactionViewSet,
    DocumentViewSet, BudgetViewSet
)

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='accounts')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'documents', DocumentViewSet, basename='documents')
router.register(r'budgets', BudgetViewSet, basename='budgets')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]
