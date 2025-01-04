from django.db import models
from django.contrib.auth.models import User

# Exemplo de modelo para as contas (conta à ordem, poupança, etc.)
class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    name = models.CharField(max_length=100)
    initial_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

# Categorias de despesa/rendimento
class Category(models.Model):
    name = models.CharField(max_length=100)
    # Exemplo: 'expense', 'income', etc.
    category_type = models.CharField(max_length=50, default='expense')

    def __str__(self):
        return self.name

# Transações (despesas e rendimentos)
class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} [{self.category}]"

# Documentos (faturas, comprovativos)
def user_directory_path(instance, filename):
    # Exemplo de função para organizar os ficheiros
    # Ex: user_<id>/documents/<filename>
    return f'user_{instance.transaction.account.user.id}/documents/{filename}'

class Document(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to=user_directory_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Documento para transação {self.transaction.id}"

# Orçamentos (Budget)
class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount_limit = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"Orçamento {self.category.name} para {self.user.username}"
