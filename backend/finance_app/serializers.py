from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Account, Category, Transaction, Document, Budget, UserPreference, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    # avatar será um ImageField
    class Meta:
        model = UserProfile
        fields = ['dark_mode', 'language', 'avatar']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']
        read_only_fields = ['id', 'username', 'email']

class UpdateUserSerializer(serializers.ModelSerializer):
    """Para actualizar email/password, etc."""
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def update(self, instance, validated_data):
        pwd = validated_data.pop('password', None)
        instance.email = validated_data.get('email', instance.email)
        if pwd:
            instance.set_password(pwd)
        instance.save()
        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Account
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
       model = Document
       fields = ['id', 'file', 'uploaded_at', 'transaction', 'description']

class TransactionSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True
    )

    class Meta:
        model = Transaction
        fields = [
            'id', 'account', 'category', 'category_id', 'transaction_type', 
            'amount', 'description', 'date', 'created_at', 'documents'
        ]

class BudgetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True
    )

    class Meta:
        model = Budget
        fields = '__all__'

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ['dark_mode', 'language', 'currency']
