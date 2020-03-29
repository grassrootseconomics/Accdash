from cicdashboard.settings.common import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECURITY WARNING: update this when you have the production host
ALLOWED_HOSTS = ['*']
CORS_ORIGIN_ALLOW_ALL = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'Adminuser',
        'PASSWORD': 'q!DtaGq8BPIhu',
        'HOST': 'cic-dashboard-prod-db.chsn5n41tx4z.eu-central-1.rds.amazonaws.com',
        'PORT': '5432',
    }
}

# Cache time to live in seconds.
CACHE_TTL = 30

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        #"LOCATION": "redis://127.0.0.1:6379/1",
        "LOCATION": "redis://cic-prod-redis.13yrwl.ng.0001.euc1.cache.amazonaws.com:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        },
        "KEY_PREFIX": "dashboard"
    }
}