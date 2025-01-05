from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

from .models import Account, Category, Transaction, Document, Budget
from .serializers import (
    UserSerializer, CategorySerializer, AccountSerializer,
    TransactionSerializer, DocumentSerializer, BudgetSerializer
)

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Garante que a conta fica associada ao utilizador logado
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # Só retorna as contas do utilizador logado
        return Account.objects.filter(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retorna apenas as transações das contas do utilizador
        return Transaction.objects.filter(account__user=self.request.user).order_by('-date')

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # Exemplo: associar automaticamente a conta do user, se for preciso
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retorna apenas documentos das transações do utilizador
        return Document.objects.filter(transaction__account__user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

# Endpoint para retornar o utilizador atual
from rest_framework.decorators import api_view

@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
