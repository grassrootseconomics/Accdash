""" SCHEMA SCRIPT
This script control how the API returns data after an API call.
The various query sub-types are defined here e.g. Summary, monthlySummary.
GenericScaler types have been used in order to return the data in a format that is usable for the front end
REMINDER - remove all unused pivots, libraries and variables after development is complete.
"""

import time
import graphene
import collections
from .types import *
from .. import models
from .. functions import *
from django.conf import settings
from django.core.cache import cache
from collections import Counter,OrderedDict
from datetime import datetime,date,timedelta
from graphene.types.generic import GenericScalar
from django.db.models.functions import TruncMonth, Coalesce
from django.db.models import Count, Sum, F, Value
from django.core.cache.backends.base import DEFAULT_TIMEOUT


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


class Query(graphene.ObjectType):

	# define query object and the filters required
	summaryData = graphene.List(summary_tiles,
		from_date = graphene.String(required=True), 
		to_date = graphene.String(required=True),
		token_name = graphene.List(graphene.String,required=True),
		spend_type = graphene.List(graphene.String,required=True),
		gender = graphene.List(graphene.String,required=True), 
		tx_type = graphene.List(graphene.String,required=True),
		request = graphene.String(required=True))

	# resolving the query object
	def resolve_summaryData(self, info, **kwargs):
		cache_key = kwargs
		cache_key.update({"Query":"summaryData"})
		response = cache.get(cache_key)

		if response is not None:
			return(response)

		from_date, to_date, token_name, spend_type, gender, tx_type, request = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender'], kwargs['tx_type'], kwargs['request']
		from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
		reporting_data = reporting_table.objects

		# setting the filters
		gender_filter = gender_list if len(gender) == 0 else gender
		tx_type_filter = transfer_subtypes if len(tx_type) == 0 else tx_type
		spend_filter = spend_type_list if len(spend_type) == 0 else spend_type
		token_name_filter = token_list if len(token_name) == 0 else token_name

		summary_data = reporting_data.annotate(_month=TruncMonth('timestamp'))\
		.filter(
			timestamp__gte = from_date,
			timestamp__lt = to_date_plus_one_month, 
			tokenname__in = token_name_filter, 
			t_business_type__in = spend_filter, 
			s_gender__in = gender_filter,
			transfer_subtype__in = tx_type_filter
			).order_by("_month")

		request = request.lower()

		if request == 'registeredusers':
			all_users = cic_users.objects.all()
			registered_user_data_from_date = all_users.filter(created__lt = from_date_plus_one_month, gender__in = gender_filter).aggregate(value = Count('current_blockchain_address'))['value']
			registered_user_data_to_date = all_users.filter(created__lt = to_date_plus_one_month, gender__in = gender_filter).aggregate(value = Count('current_blockchain_address'))['value']
			response = [summary_tiles(
				total = registered_user_data_to_date,
				start_month = registered_user_data_from_date,
				end_month = registered_user_data_to_date
				)]
			cache.set(cache_key,response, CACHE_TTL)
			return(response)


		if request == 'traders':
			trader_count_data_total = summary_data.aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
			trader_count_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
			trader_count_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
			response = [summary_tiles(
				total = trader_count_data_total,
				start_month = trader_count_data_first_month,
				end_month = trader_count_data_last_month
				)]
			cache.set(cache_key,response, CACHE_TTL)
			return(response)

		if request == 'frequenttraders':
			# get number of months selected, used in frequent trader calculation
			month_count = summary_data.values_list("_month", flat=True).distinct()
			FQT_total = summary_data.values('_month','source')\
			.annotate(value = Count("id", distinct=True)).filter(value__gte = (FQ_TRADER_THRESHOLD * len(month_count))).order_by("-value").order_by("_month")
			FQT_total_all = FQT_total.count()

			FQT_months = summary_data.values('_month','source').annotate(value = Count("id", distinct=True)).filter(value__gte = FQ_TRADER_THRESHOLD).order_by("-value").order_by("_month")
			FQT_first_month = FQT_months.filter(_month = from_date).count()
			FQT_last_month = FQT_months.filter(_month = to_date).count()

			response = [summary_tiles(
				total = FQT_total_all,
				start_month = FQT_first_month,
				end_month = FQT_last_month
				)]
			cache.set(cache_key,response, CACHE_TTL)
			return(response)

		if request == 'tradevolumes':
			## get the trade volume data based on filters and schema response definition
			trade_volume_data_total = summary_data.aggregate(value = Coalesce(Sum("weight"),0))['value']
			trade_volume_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
			trade_volume_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
			response = [summary_tiles(
				total = trade_volume_data_total,
				start_month = trade_volume_data_first_month,
				end_month = trade_volume_data_last_month
				)]

			cache.set(cache_key,response, CACHE_TTL)
			return(response)

		if request == 'transactioncount':
			no_transactions_data_total = summary_data.aggregate(value = Coalesce(Count("id"),0))['value']
			no_transactions_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Count("id"),0))['value']
			no_transactions_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Count("id"),0))['value']

			response = [summary_tiles(
				total = no_transactions_data_total,
				start_month = no_transactions_data_first_month,
				end_month = no_transactions_data_last_month
				)]

			cache.set(cache_key,response, CACHE_TTL)
			return(response)

		if request == 'txsubtype':

			query_data_total = summary_data.values('_month', 'transfer_subtype').annotate(value = Sum("weight")).order_by("_month" , "transfer_subtype")
			query_data_first = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
			query_data_end = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Sum("weight"),0))['value']

			response = [summary_tiles(
				total = query_data_total,
				start_month = query_data_first,
				end_month = query_data_end
				)]

			cache.set(cache_key,response, CACHE_TTL)
			return(response)
	

	monthlySummaryData = graphene.List(time_summary,
		from_date = graphene.String(required=True), 
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String,required=True), 
		tx_type =graphene.List(graphene.String,required=True),
		request = graphene.String(required=True))

	def resolve_monthlySummaryData(self, info, **kwargs):
		cache_key = kwargs
		cache_key.update({"Query":"monthlySummaryData"})
		response = cache.get(cache_key)

		if response is not None:
			return(response)

		from_date, to_date, token_name, spend_type, gender, tx_type, request = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender'], kwargs['tx_type'], kwargs['request']
		from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)

		reporting_data = reporting_table.objects.all()

		gender_filter = gender_list if len(gender) == 0 else gender
		tx_type_filter = transfer_subtypes if len(tx_type) == 0 else tx_type
		spend_filter = spend_type_list if len(spend_type) == 0 else spend_type
		token_name_filter = token_list if len(token_name) == 0 else token_name

		summary_data = reporting_data.annotate(_month=TruncMonth('timestamp'), _day =TruncDay('timestamp'))\
		.filter(
			timestamp__gte = from_date,
			timestamp__lt = to_date_plus_one_month, 
			tokenname__in = token_name_filter, 
			t_business_type__in = spend_filter, 
			s_gender__in = gender_filter,
			transfer_subtype__in = tx_type_filter
			).order_by("_month")
		
		request = request.lower()

		if request == 'tradevolumes-time-spendtype':
			if from_date == to_date:
				selected_days = []
				trade_volume_data  = summary_data.values('_day', 't_business_type').annotate(value = Sum("weight")).order_by("_day" , "t_business_type")
				populate_day = [selected_days.append(i['_day'].strftime('%Y-%m-%d')) for i in trade_volume_data if i['_day'].strftime('%Y-%m-%d') not in selected_days]
				response = category_by_filter(trade_volume_data, selected_days,"dayMonth","_day", '%Y-%m-%d', 't_business_type', spend_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

			else:
				selected_months = []
				trade_volume_data  = summary_data.values('_month', 't_business_type').annotate(value = Sum("weight")).order_by("_month" , "t_business_type")
				populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
				response = category_by_filter(trade_volume_data, selected_months,"yearMonth","_month", '%Y-%m', 't_business_type', spend_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

		if request == 'transactioncount-time-spendtype':
			if from_date == to_date:
				selected_days = []
				no_trans_data  = summary_data.values('_day', 't_business_type').annotate(value = Count("id")).order_by("_day" , "t_business_type")
				populate_day = [selected_days.append(i['_day'].strftime('%Y-%m-%d')) for i in no_trans_data if i['_day'].strftime('%Y-%m-%d') not in selected_days]
				response = category_by_filter(no_trans_data, selected_days,"dayMonth","_day", '%Y-%m-%d', 't_business_type', spend_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

			else:
				selected_months = []
				no_trans_data  = summary_data.values('_month', 't_business_type').annotate(value = Count("id")).order_by("_month")
				populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
				response = category_by_filter(no_trans_data, selected_months,"yearMonth","_month", '%Y-%m', 't_business_type', spend_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

		if request == 'tradevolumes-time-gender':
			if from_date == to_date:
				selected_days = []
				trade_volume_data  = summary_data.values('_day', 's_gender').annotate(value = Count("id")).order_by("_day" , "s_gender")
				populate_day = [selected_days.append(i['_day'].strftime('%Y-%m-%d')) for i in trade_volume_data if i['_day'].strftime('%Y-%m-%d') not in selected_days]
				response = category_by_filter(trade_volume_data, selected_days,"dayMonth","_day", '%Y-%m-%d', 's_gender', gender_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

			else:
				selected_months = [] 
				trade_volume_data  = summary_data.values('_month', 's_gender').annotate(value = Sum("weight")).order_by("_month" , "s_gender")
				populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
				response = category_by_filter(trade_volume_data, selected_months,"yearMonth","_month", '%Y-%m', 's_gender', gender_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)


		if request == 'transactioncount-time-gender':
			if from_date == to_date:
				selected_days = []
				no_trans_data  = summary_data.values('_day', 's_gender').annotate(value = Count("id")).order_by("_day")
				populate_day = [selected_days.append(i['_day'].strftime('%Y-%m-%d')) for i in no_trans_data if i['_day'].strftime('%Y-%m-%d') not in selected_days]
				response = category_by_filter(no_trans_data, selected_days,"dayMonth","_day", '%Y-%m-%d', 's_gender', gender_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

			else:
				selected_months = []
				no_trans_data  = summary_data.values('_month', 's_gender').annotate(value = Count("id")).order_by("_month")
				populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
				response = category_by_filter(no_trans_data, selected_months,"yearMonth","_month", '%Y-%m', 's_gender', gender_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

		if request == 'tradevolumes-time-txsubtype':
			if from_date == to_date:
				selected_days = []
				trade_volume_data  = summary_data.values('_day', 'transfer_subtype').annotate(value = Count("id")).order_by("_day")
				populate_day = [selected_days.append(i['_day'].strftime('%Y-%m-%d')) for i in trade_volume_data if i['_day'].strftime('%Y-%m-%d') not in selected_days]
				response = category_by_filter(trade_volume_data, selected_days,"dayMonth","_day", '%Y-%m-%d', 'transfer_subtype', tx_type_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

			else:
				selected_months = [] 
				trade_volume_data  = summary_data.values('_month', 'transfer_subtype').annotate(value = Sum("weight")).order_by("_month")
				populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
				response = category_by_filter(trade_volume_data, selected_months,"yearMonth","_month", '%Y-%m', 'transfer_subtype', tx_type_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)


		if request == 'transactioncount-time-txsubtype':
			if from_date == to_date:
				selected_days = []
				no_trans_data  = summary_data.values('_day', 'transfer_subtype').annotate(value = Count("id")).order_by("_day")
				populate_day = [selected_days.append(i['_day'].strftime('%Y-%m-%d')) for i in no_trans_data if i['_day'].strftime('%Y-%m-%d') not in selected_days]
				response = category_by_filter(no_trans_data, selected_days,"dayMonth","_day", '%Y-%m-%d', 'transfer_subtype', tx_type_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

			else:
				selected_months = []
				no_trans_data  = summary_data.values('_month', 'transfer_subtype').annotate(value = Count("id")).order_by("_month")
				populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
				response = category_by_filter(no_trans_data, selected_months,"yearMonth","_month", '%Y-%m', 'transfer_subtype', tx_type_filter)
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

		if request == 'users-time-totalvsfrequent':
			
			if from_date == to_date:
				traders_dict = {}
				traders = summary_data.values("_day").annotate(trader_count = Count('source', distinct=True)).order_by('_day')
				trader_update = [traders_dict.update({x["_day"].strftime("%Y-%m-%d"):x["trader_count"]}) for x in traders]

				response = []

				for m in list(traders_dict.keys()):
					au_day_dict = {}
					tr_count = traders_dict[m]
					au_day_dict.update({"dayMonth":m,"Total":tr_count, "Frequent":0})
					response.append(au_day_dict)

				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

			else:
				# first get total tarder information
				traders_dict = {}
				traders = summary_data.values("_month").annotate(trader_count = Count('source', distinct=True)).order_by('_month')
				trader_update = [traders_dict.update({x["_month"].strftime("%Y-%m"):x["trader_count"]}) for x in traders]

				## next get the list of frequent traders by month and source
				fq_trader_count_data = summary_data.values('_month','source').annotate(value = Count("id", distinct=True)).filter(value__gte = FQ_TRADER_THRESHOLD).order_by("-value").order_by("_month")
				month_list = summary_data.values_list("_month", flat=True).distinct()

				## now group the query extracted above by just the month > to get the number of frequent tarders per month
				fq_trader_count_values_per_month = collections.Counter()
				for data in fq_trader_count_data:
					fq_trader_count_values_per_month[data['_month'].strftime("%Y-%m")] += 1

				response = []

				for m in list(traders_dict.keys()):
					au_month_dict = {}
					tr_count = traders_dict[m]
					if m in list(fq_trader_count_values_per_month.keys()):
						fq_count = fq_trader_count_values_per_month[m]
					else:
						fq_count = 0

					au_month_dict.update({"yearMonth":m,"Total":tr_count, "Frequent":fq_count})
					response.append(au_month_dict)
				
				response = [time_summary(value=response)]
				cache.set(cache_key,response, CACHE_TTL)
				return(response)

	categorySummary = graphene.List(category_summary,
		from_date = graphene.String(required=True), 
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String,required=True), 
		tx_type =graphene.List(graphene.String,required=True),
		request = graphene.String(required=True))


	def resolve_categorySummary(self, info, **kwargs):

		cache_key = kwargs
		cache_key.update({"Query":"categorySummary"})
		response = cache.get(cache_key)

		if response is not None:
			return(response)

		from_date, to_date, token_name, spend_type, gender, tx_type, request = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender'], kwargs['tx_type'], kwargs['request']
		from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
		
		reporting_data = reporting_table.objects.all()
		gender_filter = gender_list if len(gender) == 0 else gender
		tx_type_filter = transfer_subtypes if len(tx_type) == 0 else tx_type
		spend_filter = spend_type_list if len(spend_type) == 0 else spend_type
		token_name_filter = token_list if len(token_name) == 0 else token_name

		summary_data = reporting_data\
		.filter(
			timestamp__gte = from_date,
			timestamp__lt = to_date_plus_one_month, 
			tokenname__in = token_name_filter,
			t_business_type__in = spend_filter,
			s_gender__in = gender_filter,
			transfer_subtype__in = tx_type_filter)

		request = request.lower()

		if request == 'tradevolumes-category-spendtype':
			data =summary_data.annotate(label = F('t_business_type')).values("label").annotate(value=Sum("weight"))
			response = [category_summary(label=i['label'], value =i['value']) for i in data]
			cache.set(cache_key,response, CACHE_TTL)
			return(response)

		if request == 'tradevolumes-category-gender':
			data =summary_data.annotate(label = F('s_gender')).values("label").annotate(value=Sum("weight"))
			response = [category_summary(label=i['label'], value =i['value']) for i in data]
			cache.set(cache_key,response, CACHE_TTL)
			return(response)

	summaryDataSubtype = graphene.List(subtype_summary,
		from_date = graphene.String(required=True), 
		to_date = graphene.String(required=True),
		token_name = graphene.List(graphene.String,required=True),
		spend_type = graphene.List(graphene.String,required=True),
		gender = graphene.List(graphene.String,required=True), 
		tx_type = graphene.List(graphene.String,required=True),
		request = graphene.String(required=True))

	def resolve_summaryDataSubtype(self, info, **kwargs):
		cache_key = kwargs
		cache_key.update({"Query":"summaryDataSubtype"})
		response = cache.get(cache_key)

		if response is not None:
			return(response)

		from_date, to_date, token_name, spend_type, gender, tx_type, request = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender'], kwargs['tx_type'], kwargs['request']
		from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)

		reporting_data = reporting_table.objects.all()


		gender_filter = gender_list if len(gender) == 0 else gender
		tx_type_filter = transfer_subtypes if len(tx_type) == 0 else tx_type
		spend_filter = spend_type_list if len(spend_type) == 0 else spend_type
		token_name_filter = token_list if len(token_name) == 0 else token_name

		summary_data = reporting_data.annotate(_month=TruncMonth('timestamp'))\
		.filter(
			timestamp__gte = from_date,
			timestamp__lt = to_date_plus_one_month, 
			tokenname__in = token_name_filter, 
			t_business_type__in = spend_filter, 
			s_gender__in = gender_filter,
			transfer_subtype__in = tx_type_filter
			).order_by("_month")

		request = request.upper()

		if request in tx_type_filter:

			no_transactions_data_total = summary_data.filter(transfer_subtype = request).aggregate(value = Coalesce(Count("id"),0))['value']
			no_transactions_data_first_month = summary_data.filter(transfer_subtype = request, _month = from_date).aggregate(value = Coalesce(Count("id"),0))['value']
			no_transactions_data_last_month = summary_data.filter(transfer_subtype = request, _month = to_date).aggregate(value = Coalesce(Count("id"),0))['value']

			tv = summary_tiles(total = no_transactions_data_total, start_month = no_transactions_data_first_month,end_month = no_transactions_data_last_month)

			trade_volume_data_total = summary_data.filter(transfer_subtype = request).aggregate(value = Coalesce(Sum("weight"),0))['value']
			trade_volume_data_first_month = summary_data.filter(transfer_subtype = request, _month = from_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
			trade_volume_data_last_month = summary_data.filter(transfer_subtype = request, _month = to_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
			
			tc = summary_tiles(total = trade_volume_data_total, start_month = trade_volume_data_first_month, end_month = trade_volume_data_last_month)

			response = [subtype_summary(trade_volumes = tv, transaction_count = tc)]
			cache.set(cache_key,response, CACHE_TTL)
			return(response)

		else:
			tv = summary_tiles(total = 0, start_month = 0,end_month = 0)
			tc = summary_tiles(total = 0, start_month = 0, end_month = 0)
			response = [subtype_summary(trade_volumes = tv, transaction_count = tc)]
			cache.set(cache_key,response, CACHE_TTL)
			return(response)

	summaryDataBalance = graphene.List(time_summary,gender = graphene.List(graphene.String,required=True))

	def resolve_summaryDataBalance(self, info, **kwargs):
		cache_key = kwargs
		cache_key.update({"Query":"summaryDataBalance"})
		response = cache.get(cache_key)

		if response is not None:
			return(response)

		gender = kwargs['gender']
		gender_filter = gender_list if len(gender) == 0 else gender

		all_users = cic_users.objects.filter(gender__in = gender_filter)
		total_balance = all_users.aggregate(value = Sum('bal'))['value']
		circulation = all_users.exclude(roles__has_key ='ADMIN').aggregate(value = Sum('bal'))['value']
		balance = [{"total":total_balance, "circulation":circulation}]
		response = [time_summary(value=balance)]

		cache.set(cache_key,response, CACHE_TTL)

		return(response)

	summaryDataTopTraders = graphene.List(time_summary,
		from_date = graphene.String(required=True), 
		to_date = graphene.String(required=True),
		token_name = graphene.List(graphene.String,required=True),
		business_type = graphene.List(graphene.String,required=True),
		gender = graphene.List(graphene.String,required=True))

	def resolve_summaryDataTopTraders(self, info, **kwargs):
		cache_key = kwargs
		cache_key.update({"Query":"summaryDataTopTraders"})
		response = cache.get(cache_key)

		if response is not None:
			return(response)

		from_date, to_date, token_name, business_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['business_type'], kwargs['gender']
		from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)

		reporting_data = reporting_table.objects.all()
		gender_filter = gender_list if len(gender) == 0 else gender
		business_filter = spend_type_list if len(business_type) == 0 else business_type
		token_name_filter = token_list if len(token_name) == 0 else token_name

		summary_data = reporting_data.annotate(_month=TruncMonth('timestamp'))\
		.filter(
			timestamp__gte = from_date,
			timestamp__lt = to_date_plus_one_month, 
			tokenname__in = token_name_filter, 
			s_business_type__in = business_filter, 
			s_gender__in = gender_filter,
			transfer_subtype = 'STANDARD'
			).order_by("_month")

		top_ten_traders = summary_data.values('source', 's_gender', 's_business_type')\
		.annotate(volume = Coalesce(Sum("weight"),0), count = Coalesce(Count("id"),0),).order_by('-volume')[:10]

		response = [time_summary(value=top_ten_traders)]
		cache.set(cache_key,response, CACHE_TTL)

		return(response)