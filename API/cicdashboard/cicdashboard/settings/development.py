from cicdashboard.settings.common import *

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '1$qpv*d%uoex8xe!as6r0#3s@kz1)e&tpb5a@@@)y#dr(5_**t'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']
CORS_ORIGIN_ALLOW_ALL = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'Adminuser',
        'PASSWORD': 'Accenture123',
        'HOST': 'cic-dashboard-dev-db.chsn5n41tx4z.eu-central-1.rds.amazonaws.com',
        'PORT': '',
    }
}

# Cache time to live in seconds.
CACHE_TTL = 30

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        #"LOCATION": "redis://cic-dev-redis.13yrwl.0001.euc1.cache.amazonaws.com:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        },
        "KEY_PREFIX": "dashboard"
    }
}