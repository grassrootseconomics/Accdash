"""
WSGI config for cicdashboard project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

if os.environ.get('ENVIRONMENT') is None: os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cicdashboard.settings.development')
elif os.environ.get("ENVIRONMENT") == 'PROD': os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cicdashboard.settings.production')
else: os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cicdashboard.settings.development')

application = get_wsgi_application()
