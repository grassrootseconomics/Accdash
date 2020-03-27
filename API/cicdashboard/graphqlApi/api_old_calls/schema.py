""" SCHEMA SCRIPT
This script control how the API returns data after an API call.
The various query sub-types are defined here e.g. Summary, monthlySummary.
GenericScaler types have been used in order to return the data in a format that is usable for the front end
REMINDER - remove all unused pivots, libraries and variables after development is complete.
"""

import time
import graphene
import collections
from .. functions import *
from django.conf import settings
from django.core.cache import cache
from collections import Counter,OrderedDict
from datetime import datetime,date,timedelta
from graphene.types.generic import GenericScalar
from django.db.models.functions import TruncMonth, Coalesce
from django.db.models import Count, Sum, F, Value
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from .types import summary, summary_tiles, spendtypesummary, monthlySummary

from .. import models
FQ_TRADER_THRESHOLD = 4
cic_users = models.CicUsers
reporting_table = models.CicReportingTable
CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

month_dict = {"January":1,"February":2,"March":3,"April":4,"May":5,"June":6,"July":7,"August":8,"September":9, "October":10, "November":11, "December":12}

""" QUERY CLASS 
The Query class below holds the resolver functions.
these functions perfrom the neccessary data manipulations
and returns the data as defined by the respective classes above
"""

def get_cache_values(key, query):
	cache_key = key
	cache_key.update({"Query":query})
	result = cache.get(cache_key)

	return(cache_key, result)

class Query(graphene.ObjectType):


	summary = graphene.List(summary,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_summary(self, info, **kwargs):
		from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']

		cache_key = kwargs
		cache_key.update({"Query":"summary"})
		summary_response = cache.get(cache_key)

		if summary_response is not None:
			return(summary_response)

		from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
		reporting_data = reporting_table.objects

		gender_filter = reporting_data.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender
		token_name_filter = reporting_data.values_list("tokenname", flat=True).distinct() if len(token_name) == 0 else token_name
		spend_filter = reporting_data.values_list("t_business_type", flat=True).distinct() if len(spend_type) == 0 else spend_type

		summary_data = reporting_data.annotate(_month=TruncMonth('timestamp'))\
		.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter).order_by("_month")

		# get number of months selected, used in frequent trader calculation
		month_count = summary_data.values_list("_month", flat=True).distinct()

		## get the trade volume data based on filters and schema response definition
		trade_volume_data_total = summary_data.aggregate(value = Coalesce(Sum("weight"),0))['value']
		trade_volume_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
		trade_volume_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
		trade_volume_data_response = {"total":trade_volume_data_total, "start_month":trade_volume_data_first_month, "end_month":trade_volume_data_last_month}

		all_users = cic_users.objects.all()
		registered_user_data_from_date = all_users.filter(created__lt = from_date_plus_one_month, gender__in = gender_filter).aggregate(value = Count('current_blockchain_address'))['value']
		registered_user_data_to_date = all_users.filter(created__lt = to_date_plus_one_month, gender__in = gender_filter).aggregate(value = Count('current_blockchain_address'))['value']
		registered_user_data_response = {"total":registered_user_data_to_date, "start_month":registered_user_data_from_date, "end_month":registered_user_data_to_date}

		trader_count_data_total = summary_data.aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
		trader_count_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
		trader_count_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
		trader_count_data_response = {"total":trader_count_data_total, "start_month":trader_count_data_first_month, "end_month":trader_count_data_last_month}


		FQT_total = summary_data.annotate(_month=TruncMonth('timestamp')).values('_month','source')\
		.annotate(value = Count("id", distinct=True)).filter(value__gte = (FQ_TRADER_THRESHOLD * len(month_count))).order_by("-value").order_by("_month")
		FQT_total_all = FQT_total.count()

		FQT_months = summary_data.values('_month','source').annotate(value = Count("id", distinct=True)).filter(value__gte = FQ_TRADER_THRESHOLD).order_by("-value").order_by("_month")
		FQT_first_month = FQT_months.filter(_month = from_date).count()
		FQT_last_month = FQT_months.filter(_month = to_date).count()
		fq_trader_count_response = {"total":FQT_total_all, "start_month":FQT_first_month, "end_month":FQT_last_month}

		no_transactions_data_total = summary_data.aggregate(value = Coalesce(Count("id"),0))['value']
		no_transactions_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Count("id"),0))['value']
		no_transactions_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Count("id"),0))['value']
		no_transactions_data_response = {"total":no_transactions_data_total, "start_month":no_transactions_data_first_month, "end_month":no_transactions_data_last_month}

		summary_response = [summary(
			trade_volumes = trade_volume_data_response,
			registered_users= registered_user_data_response,
			traders = trader_count_data_response,
			frequent_traders = fq_trader_count_response,
			no_transactions = no_transactions_data_response)]

		cache.set(cache_key,summary_response, CACHE_TTL)
		return(summary_response)

	monthlysummary = graphene.List(monthlySummary,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name=graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String), required=True)

	def resolve_monthlysummary(self, info, **kwargs):
		from_date,to_date, token_name, spend_type,gender= kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']

		cache_key = kwargs
		cache_key.update({"Query":"monthlysummary"})
		mSummary = cache.get(cache_key)

		if mSummary is not None:
			return(mSummary)

		reporting_data = reporting_table.objects.all()

		gender_filter = reporting_data.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender
		token_name_filter = reporting_data.values_list("tokenname", flat=True).distinct() if len(token_name) == 0 else token_name
		spend_filter = reporting_data.values_list("t_business_type", flat=True).distinct() if len(spend_type) == 0 else spend_type

		_from_date, _to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)

		summary_data = reporting_data.annotate(_month=TruncMonth('timestamp'))\
		.filter(timestamp__gte = _from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter).order_by("_month")
		
		""" PER TOKEN
		Trade volume 
			- get list of selected months
			- get list of all tokens
			- for each month in selected months, get the tokens found and update the tokens not found to 0
			- note: refactor the common functions here
		"""
		trade_volume_data  = summary_data.values('_month', 'tokenname').annotate(value = Sum("weight")).order_by("_month")
		selected_months = [] 
		populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
		tv_per_token = category_by_filter(trade_volume_data, selected_months, 'tokenname', token_name_filter)


		no_trans_data  = summary_data.values('_month', 'tokenname').annotate(value = Count("id")).order_by("_month")
		selected_months = [] 
		populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
		nt_per_token = category_by_filter(no_trans_data, selected_months, 'tokenname', token_name_filter)


		""" PER SPENDTYPE
		"""
		trade_volume_data  = summary_data.values('_month', 't_business_type').annotate(value = Sum("weight")).order_by("_month" , "t_business_type")
		selected_months = [] 
		populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
		tv_per_spend = category_by_filter(trade_volume_data, selected_months, 't_business_type', spend_filter)


		no_trans_data  = summary_data.values('_month', 't_business_type').annotate(value = Count("id")).order_by("_month")
		selected_months = [] 
		populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
		nt_per_spend = category_by_filter(no_trans_data, selected_months, 't_business_type', spend_filter)


		""" Traders Vs Frequent traders
		"""
		traders_dict = {}
		traders = summary_data.values("_month").annotate(trader_count = Count('source', distinct=True)).order_by('_month')
		trader_update = [traders_dict.update({x["_month"].strftime("%Y-%m"):x["trader_count"]}) for x in traders]

		## get the list of frequent traders by month and source
		fq_trader_count_data = summary_data.values('_month','source').annotate(value = Count("id", distinct=True)).filter(value__gte = FQ_TRADER_THRESHOLD).order_by("-value").order_by("_month")
		month_list = summary_data.values_list("_month", flat=True).distinct()


		## now group the query extracted above by just the month
		fq_trader_count_values_per_month = collections.Counter()
		for data in fq_trader_count_data:
			fq_trader_count_values_per_month[data['_month'].strftime("%Y-%m")] += 1

		trader_vs_fqtrader_response = []

		for m in list(traders_dict.keys()):
			au_month_dict = {}
			tr_count = traders_dict[m]
			if m in list(fq_trader_count_values_per_month.keys()):
				fq_count = fq_trader_count_values_per_month[m]
			else:
				fq_count = 0

			au_month_dict.update({"yearMonth":m,"Total":tr_count, "Frequent":fq_count})
			trader_vs_fqtrader_response.append(au_month_dict)

		mSummary = [monthlySummary(
			trade_volumes_tokens =tv_per_token,
			trade_volumes_spend_type = tv_per_spend,
			no_transactions_token = nt_per_token,
			no_transactions_spend_type = nt_per_spend,
			Traders_Vs_Fqtrader=trader_vs_fqtrader_response)]

		cache.set(cache_key,mSummary, CACHE_TTL)
		return (mSummary)


	spendtypesummary = graphene.List(spendtypesummary,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)


	def resolve_spendtypesummary(self, info, **kwargs):
		from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
		
		cache_key = kwargs
		cache_key.update({"Query":"spendtypesummary"})
		summary_st_response = cache.get(cache_key)

		if summary_st_response is not None:
			return(summary_st_response)

		""" 
		format the date so it can be used in the query filters
		e.g. 2019-01 will have -01 appened to it
		if its the to date, add +1 to the month unless its 12, then add +1 to the year (find a better way to do this)
		"""
		reporting_data = reporting_table.objects.all()

		_from_date, _to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)

		## set the filters so if an empty array is passed, it get all the unique elements of the filter

		gender_filter = reporting_data.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender
		token_name_filter = reporting_data.values_list("tokenname", flat=True).distinct() if len(token_name) == 0 else token_name
		spend_filter = reporting_data.values_list("t_business_type", flat=True).distinct() if len(spend_type) == 0 else spend_type

		## get the main query with filters applied
		summary_data = reporting_data.filter(timestamp__gte = _from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter).order_by("t_business_type")

		spend_type_data = summary_data.annotate(label = F('t_business_type')).values("label").annotate(value=Sum("weight"))
		spend_type_data_response = [spendtypesummary(label=i['label'], value =i['value']) for i in spend_type_data]

		cache.set(cache_key,summary_st_response, CACHE_TTL)
		return(spend_type_data_response)