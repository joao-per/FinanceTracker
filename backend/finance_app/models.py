from django.db import models
from django.contrib.auth.models import User

def avatar_upload_path(instance, filename):
    # Ex: user_<id>/avatar/<filename>
    return f"user_{instance.user.id}/avatar/{filename}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    dark_mode = models.BooleanField(default=False)
    language = models.CharField(max_length=5, default='pt')  # 'pt' ou 'en'
    avatar = models.ImageField(upload_to=avatar_upload_path, null=True, blank=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"

class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    name = models.CharField(max_length=100)
    initial_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class Category(models.Model):
    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=50, default='expense')  # 'expense' ou 'income'

    def __str__(self):
        return self.name

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

def user_directory_path(instance, filename):
    return f"user_{instance.transaction.account.user.id}/documents/{filename}"

class Document(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to=user_directory_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Documento para transação {self.transaction.id}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount_limit = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"Orçamento {self.category.name} para {self.user.username}"

class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preference')
    dark_mode = models.BooleanField(default=False)
    language = models.CharField(max_length=5, default='pt')  # 'pt' ou 'en'
    currency = models.CharField(max_length=10, default='EUR')  # 'EUR', 'USD', etc.

    def __str__(self):
        return f"Preferências de {self.user.username}"


class RecurringTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    frequency = models.CharField(max_length=20)  # daily, weekly, monthly
    next_run_date = models.DateField()  # próxima data em que será gerada

    def __str__(self):
        return f"Recorrente: {self.description} para {self.user.username}"
