from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class UserDetail(APIView):
	def get(self, request):
		user = request.user
		serializer = UserSerializer(user)
		return Response(serializer.data)

	def put(self, request):
		user = request.user
		serializer = UserSerializer(user, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserList(APIView):
	def get(self, request):
		users = User.objects.all()
		serializer = UserSerializer(users, many=True)
		return Response(serializer.data)

	def post(self, request):
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPreferenceView(APIView):
	def get(self, request):
		user = request.user
		preference = UserPreference.objects.get(user=user)
		serializer = UserPreferenceSerializer(preference)
		return Response(serializer.data)

	def put(self, request):
		user = request.user
		preference = UserPreference.objects.get(user=user)
		serializer = UserPreferenceSerializer(preference, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)