from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AccountViewSet, CategoryViewSet, TransactionViewSet,
    DocumentViewSet, BudgetViewSet, current_user
)

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='accounts')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'documents', DocumentViewSet, basename='documents')
router.register(r'budgets', BudgetViewSet, basename='budgets')

urlpatterns = [
    path('current_user/', current_user, name='current_user'),
    path('', include(router.urls)),
]
