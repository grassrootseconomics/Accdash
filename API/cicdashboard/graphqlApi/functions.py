""" HELPER FUNCTIONS
This script contains helper functions for the main django application.
"""
### common imports
import graphene
import calendar
import collections
from . import models
from django.conf import settings
from django.core.cache import cache
from collections import Counter,OrderedDict
from datetime import datetime,date,timedelta
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.db.models.functions import TruncMonth, Coalesce
from django.db.models import Count, Sum, F, Case, When, Value, CharField

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)
reporting_table = models.CicReportingTable

""" DATE FILTER
Date filter for from and to date. fromDate remains the same, except in the case of registered users.
toDate is moved by one month ahead.
"""
def create_date_points(from_date, to_date):
	from_date = datetime.strptime("{}-01".format(from_date), '%Y-%m-%d')
	to_date = datetime.strptime("{}-01".format(to_date), '%Y-%m-%d')
	to_date_plus_one_month = to_date + timedelta(days= calendar.monthrange(to_date.year, to_date.month)[1])
	from_date_plus_one_month = from_date + timedelta(days= calendar.monthrange(from_date.year, from_date.month)[1])

	return(from_date, to_date, to_date_plus_one_month, from_date_plus_one_month)


""" CATEGORY BY FILTER
help to calculate measures based on the selected categories.
"""
def category_by_filter(data, yearMonth_list, category, filter_list):
	filter_list = sorted(filter_list)
	result =[]
	for month in yearMonth_list:
		temp_dict = {"yearMonth":month}
		filtered_results = [result for result in data if result['_month'].strftime('%Y-%m') == month]
		for item in filter_list: 
			x = [temp_dict.update({e[category]:e['value']}) for e in filtered_results if e[category] == item]
			if len(x) == 0: temp_dict.update({item:0})

		result.append(temp_dict)
	return(result)


""" CACHE
function to get and return cache data
"""
def get_cache_values(key, query):
	cache_key = key
	cache_key.update({"Query":query})
	result = cache.get(cache_key)
	return(cache_key, result)


""" FILTERS FOR QUERIES
common query filter used in a significant number of queries
"""
def get_filter_values(gender, token_name, spend_type):
	reporting_data = reporting_table.objects.values('s_gender', 'tokenname', 't_business_type')
	g_filter = reporting_data.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender
	t_filter = reporting_data.values_list("tokenname", flat=True).distinct() if len(token_name) == 0 else token_name
	s_filter = reporting_data.values_list("t_business_type", flat=True).distinct() if len(spend_type) == 0 else spend_type
	return (g_filter,t_filter, s_filter)