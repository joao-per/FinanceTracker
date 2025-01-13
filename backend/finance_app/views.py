from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Account, Category, Transaction, Document, Budget
from .serializers import (
    UserSerializer, CategorySerializer, AccountSerializer, 
    TransactionSerializer, DocumentSerializer, BudgetSerializer
)
from rest_framework.decorators import action
from rest_framework.views import APIView

# Registar novo user (exemplo) – endpoint custom
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Faltam campos obrigatórios'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Utilizador já existe'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'Conta criada com sucesso'}, status=201)


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(account__user=self.request.user).order_by('-date')

    def create(self, request, *args, **kwargs):
        # Validar e salvar
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Verificar se a account pertence ao user
        account_id = request.data.get('account')
        if account_id:
            try:
                acc = Account.objects.get(id=account_id, user=request.user)
            except Account.DoesNotExist:
                return Response({'error': 'Conta não encontrada ou não pertence ao utilizador'}, 
                                status=status.HTTP_403_FORBIDDEN)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(transaction__account__user=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        # Verificar se a transação pertence ao user
        transaction = serializer.validated_data.get('transaction')
        if transaction.account.user != self.request.user:
            return Response({'error': 'Transação não pertence ao utilizador autenticado.'},
                            status=status.HTTP_403_FORBIDDEN)
        serializer.save()

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
