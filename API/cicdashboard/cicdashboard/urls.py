"""cicdashboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
import os
from django.urls import path
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt

if os.environ.get('ENVIRONMENT') is None: graphiqlflag = True
elif os.environ.get("ENVIRONMENT") == 'PROD': graphiqlflag = False
else: graphiqlflag = True

urlpatterns = [
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=graphiqlflag))),
    path('health_check/', include('health_check.urls')),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
