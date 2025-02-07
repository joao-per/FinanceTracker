from urllib.parse import urljoin
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Account, Category, Transaction, Document, Budget, UserPreference, UserProfile
from .serializers import (
	UserSerializer, CategorySerializer, AccountSerializer, 
	TransactionSerializer, DocumentSerializer, BudgetSerializer, UserPreferenceSerializer, UserProfileSerializer, UpdateUserSerializer
)
from rest_framework.decorators import action
from rest_framework.views import APIView
import csv
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from openai import OpenAI
import requests
import fitz  # PyMuPDF
import tempfile

class UserProfileView(viewsets.ViewSet):
	permission_classes = [IsAuthenticated]

	@action(detail=False, methods=['put'])
	def upload_profile_picture(self, request):
		user = request.user
		user.profile.avatar = request.FILES['avatar']
		user.profile.save()
		return Response({'message': 'Avatar atualizado com sucesso'})

	@action(detail=False, methods=['get'])
	def me(self, request):
		"""GET /api/profile/me -> retorna dados do user + profile."""
		user = request.user
		if not hasattr(user, 'profile'):
			UserProfile.objects.create(user=user)
		ser = UserSerializer(user)
		return Response(ser.data)
	
	@action(detail=False, methods=['patch'], url_path='update')
	def update_profile(self, request):
		"""PATCH /api/profile/update -> atualiza email/password e prefs."""
		user = request.user
		user_data = {}
		if 'email' in request.data:
			user_data['email'] = request.data['email']
		if 'password' in request.data:
			user_data['password'] = request.data['password']

		if user_data:
			user_ser = UpdateUserSerializer(user, data=user_data, partial=True)
			user_ser.is_valid(raise_exception=True)
			user_ser.save()

		# Atualizar profile (dark_mode, language, avatar)
		if not hasattr(user, 'profile'):
			UserProfile.objects.create(user=user)
		profile = user.profile

		profile_data = {}
		if 'dark_mode' in request.data:
			profile_data['dark_mode'] = request.data['dark_mode']
		if 'language' in request.data:
			profile_data['language'] = request.data['language']
		# se for upload de imagem
		if 'avatar' in request.FILES:
			profile_data['avatar'] = request.FILES['avatar']

		if profile_data:
			prof_ser = UserProfileSerializer(profile, data=profile_data, partial=True)
			prof_ser.is_valid(raise_exception=True)
			prof_ser.save()

		return Response({'detail': 'Perfil atualizado com sucesso'})



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

	def get_queryset(self):
		qs = Transaction.objects.filter(account__user=self.request.user)
		# Exemplos de query params: ?date_after=2025-01-01&date_before=2025-01-31&category=2
		date_after = self.request.query_params.get('date_after')
		date_before = self.request.query_params.get('date_before')
		category_id = self.request.query_params.get('category')

		if date_after:
			qs = qs.filter(date__gte=date_after)
		if date_before:
			qs = qs.filter(date__lte=date_before)
		if category_id:
			qs = qs.filter(category__id=category_id)

		return qs.order_by('-date')

class DocumentViewSet(viewsets.ModelViewSet):
	serializer_class = DocumentSerializer
	permission_classes = [IsAuthenticated]


	def get_queryset(self):
		return Document.objects.filter(transaction__account__user=self.request.user).order_by('-uploaded_at')

	def download_pdf(self, pdf_url):
		
		base_url = 'http://localhost:8000'  # Isto tem que ter a env base da app dependendo do ambiente

		# Se o url usado for relativo, dá join com o base
		if not pdf_url.startswith('http'):
			pdf_url = urljoin(base_url, pdf_url)

		try:
			response = requests.get(pdf_url)
			response.raise_for_status()  # Will raise an error for non-2xx status codes

			pdf_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
			pdf_file.write(response.content)
			pdf_file.close()

			return pdf_file.name
		except requests.exceptions.RequestException as e:
			print(f"Error occurred while trying to download PDF: {e}")
			raise 
	
	def extract_text_from_pdf(self, pdf_path):
		doc = fitz.open(pdf_path)
		text = ""
		for page in doc:
			text += page.get_text()
		return text

	def perform_create(self, serializer):
		# Verificar se a transação pertence ao user
		transaction = serializer.validated_data.get('transaction')
		client = OpenAI(api_key='') #KEY DO OPENAI AQUI OU  ALGO DO GENERO
		

		
		if transaction.account.user != self.request.user:
			return Response({'error': 'Transação não pertence ao utilizador autenticado.'},
							status=status.HTTP_403_FORBIDDEN)
		
		document = serializer.save()
		uploaded_file_url = document.file.url

		try:
			pdf_file_path = self.download_pdf(uploaded_file_url)
		except requests.exceptions.RequestException as e:
			return Response({'error': f"Error downloading the PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

		
		pdf_text = self.extract_text_from_pdf(pdf_file_path)

		if not pdf_text:
			return Response({'error': 'Could not extract text from the PDF.'}, status=status.HTTP_400_BAD_REQUEST)


		response = client.chat.completions.create(
			model="gpt-4o-mini",
			messages=[
				{
					"role": "user",
					"content": f"Can you extract the company, recipient, and value from this document and provide a summary of the finances along with any suggestions? Here's the extracted text: {pdf_text[:1500]}"  # Limit text to avoid overloading
				}
			],
			max_tokens=300,
		)
		print(response.choices[0].message.content)
		document.description = response.choices[0].message.content
		document.save()
		
		if response.choices and len(response.choices) > 0:
			content = response.choices[0].message.content
			print(content)

			# Mudar consoante  o prompt, seria melhor isto ser dinamico
			company, recipient, value, summary, suggestions = None, None, None, None, None

			# Mudar consoante o prompt
			lines = content.split("\n")
			for line in lines:
				if "Company" in line:
					company = line.split(":")[1].strip() if ":" in line else line.strip()
				elif "Recipient" in line:
					recipient = line.split(":")[1].strip() if ":" in line else line.strip()
				elif "Amount" in line or "Value" in line:
					value = line.split(":")[1].strip() if ":" in line else line.strip()
				elif "Summary" in line:
					summary = line.split(":")[1].strip() if ":" in line else line.strip()
				elif "Suggestions" in line:
					suggestions = line.split(":")[1].strip() if ":" in line else line.strip()

			# If any values are missing or could not be extracted, handle gracefully
			if not company:
				company = "Not found"
			if not recipient:
				recipient = "Not found"
			if not value:
				value = "Not found"
			if not summary:
				summary = "Not available"
			if not suggestions:
				suggestions = "No suggestions"

			document.description = f"Company: {company}\nRecipient: {recipient}\nValue: {value}\nSummary: {summary}\nSuggestions: {suggestions}"
			document.save()

			return Response(DocumentSerializer(document).data, status=status.HTTP_201_CREATED)

		else:
			return Response({'error': 'Failed to generate a valid response from GPT.'}, status=status.HTTP_400_BAD_REQUEST)


class BudgetViewSet(viewsets.ModelViewSet):
	serializer_class = BudgetSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		return Budget.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)

	@action(detail=False, methods=['get'], url_path='check-alerts')
	def check_alerts(self, request):
		budgets = Budget.objects.filter(user=request.user)
		alerts = []
		for b in budgets:
			# soma das despesas dessa categoria no período
			expenses = Transaction.objects.filter(
				account__user=request.user,
				category=b.category,
				date__gte=b.start_date,
				date__lte=b.end_date,
				transaction_type='expense'
			).aggregate(total=Sum('amount'))['total'] or 0

			if expenses >= b.amount_limit * 0.8 and expenses < b.amount_limit:
				alerts.append({
					'budget_id': b.id,
					'message': f"Já atingiu 80% do orçamento de {b.category.name}"
				})
			elif expenses >= b.amount_limit:
				alerts.append({
					'budget_id': b.id,
					'message': f"Excedeu o orçamento de {b.category.name}"
				})

		return Response({'alerts': alerts})

class UserPreferenceView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		# Se não existir preferências para o user, cria
		preference, created = UserPreference.objects.get_or_create(user=request.user)
		serializer = UserPreferenceSerializer(preference)
		return Response(serializer.data)

	def patch(self, request):
		preference, _ = UserPreference.objects.get_or_create(user=request.user)
		serializer = UserPreferenceSerializer(preference, data=request.data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=400)


class TransactionExportView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, format=None):
		# Filtra as transações do user
		transactions = Transaction.objects.filter(account__user=request.user)

		response = HttpResponse(content_type='text/csv')
		response['Content-Disposition'] = 'attachment; filename="transactions.csv"'

		writer = csv.writer(response)
		writer.writerow(['Date', 'Type', 'Category', 'Amount', 'Description'])

		for t in transactions:
			writer.writerow([
				t.date,
				t.transaction_type,
				t.category.name if t.category else '',
				t.amount,
				t.description
			])

		return response



class TransactionImportView(APIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [MultiPartParser, FormParser]

	def post(self, request, format=None):
		file_obj = request.FILES.get('file')
		if not file_obj:
			return Response({'error': 'No file provided'}, status=400)

		import csv, io
		decoded_file = file_obj.read().decode('utf-8')
		reader = csv.reader(io.StringIO(decoded_file), delimiter=',')

		# Assumimos que a primeira linha contém cabeçalhos
		next(reader, None) 

		account = Account.objects.filter(user=request.user).first()
		if not account:
			return Response({'error': 'No account found for user'}, status=400)

		for row in reader:
			# row -> [date, type, category_name, amount, description]
			date_str, tx_type, category_name, amount_str, desc = row
			category, _ = Category.objects.get_or_create(name=category_name)
			Transaction.objects.create(
				account=account,
				category=category,
				transaction_type=tx_type.lower(),
				amount=float(amount_str),
				description=desc,
				date=date_str
			)

		return Response({'message': 'Import successful'})

