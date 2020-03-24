""" RESOLVERS
The resolvers below provide infromation found on tiles
"""
from .. import models
from .. functions import *
from .types import *


FQ_TRADER_THRESHOLD = 4
cic_users = models.CicUsers
reporting_table = models.CicReportingTable

####################
# REGISTERED USERS #
####################

def registeredusers(kwargs):
	from_date, to_date, gender = kwargs['from_date'], kwargs['to_date'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)

	gender_filter = reporting_table.objects.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender

	all_users = cic_users.objects.all()
	registered_user_data_from_date = all_users.filter(created__lt = from_date_plus_one_month, gender__in = gender_filter).aggregate(value = Count('current_blockchain_address'))['value']
	registered_user_data_to_date = all_users.filter(created__lt = to_date_plus_one_month, gender__in = gender_filter).aggregate(value = Count('current_blockchain_address'))['value']
	registered_user_data_response = [tiles(total=registered_user_data_to_date, start_month = registered_user_data_from_date, end_month = registered_user_data_to_date)]
	
	return(registered_user_data_response)

####################
# FREQUENT TRADERS #
####################

def frequenttraders(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	
	reporting_data = reporting_table.objects.all()
	gender_filter = reporting_data.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender
	token_name_filter = reporting_data.values_list("tokenname", flat=True).distinct() if len(token_name) == 0 else token_name
	spend_filter = reporting_data.values_list("t_business_type", flat=True).distinct() if len(spend_type) == 0 else spend_type

	summary_data = reporting_data.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter).order_by("_month")

	# get number of months selected, used in frequent trader calculation
	month_count = summary_data.values_list("_month", flat=True).distinct()
	
	FQT_total = summary_data.annotate(_month=TruncMonth('timestamp')).values('_month','source')\
	.annotate(value = Count("id", distinct=True)).filter(value__gte = (FQ_TRADER_THRESHOLD * len(month_count))).order_by("-value").order_by("_month")
	FQT_total_all = FQT_total.count()

	FQT_months = summary_data.values('_month','source').annotate(value = Count("id", distinct=True)).filter(value__gte = FQ_TRADER_THRESHOLD).order_by("-value").order_by("_month")
	FQT_first_month = FQT_months.filter(_month = from_date).count()
	FQT_last_month = FQT_months.filter(_month = to_date).count()

	fq_trader_count_response = [tiles(total=FQT_total_all, start_month = FQT_first_month, end_month = FQT_last_month)]

	return(fq_trader_count_response)

#################
# TRADE VOLUMES #
#################

def tradevolumes(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	
	reporting_data = reporting_table.objects.all()
	gender_filter = reporting_data.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender
	token_name_filter = reporting_data.values_list("tokenname", flat=True).distinct() if len(token_name) == 0 else token_name
	spend_filter = reporting_data.values_list("t_business_type", flat=True).distinct() if len(spend_type) == 0 else spend_type

	summary_data = reporting_data.annotate(_month=TruncMonth('timestamp')).values('_month','weight')\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month,tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	## get the trade volume data based on filters and schema response definition
	trade_volume_data_total = summary_data.aggregate(value = Coalesce(Sum("weight"),0))['value']
	trade_volume_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
	trade_volume_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Sum("weight"),0))['value']
	trade_volume_data_response = [tiles(total=trade_volume_data_total, start_month = trade_volume_data_first_month, end_month = trade_volume_data_last_month)]

	return(trade_volume_data_response)

#####################################
# TRADE VOLUMES BY TRANSACTION TYPE #
#####################################

def tradevolumessubtype(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	query_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month,tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.values('_month','transfer_subtype')
	
	all_sub_types = query_data.values_list('transfer_subtype', flat = True).distinct()
	query_data_all = query_data.values('transfer_subtype').annotate(value = Coalesce(Sum("weight"),0)).order_by()
	query_data_first = query_data.filter(_month = from_date).annotate(value = Coalesce(Sum("weight"),0))
	query_data_end = query_data.filter(_month = to_date).annotate(value = Coalesce(Sum("weight"),0))

	trade_volume_data_response = []
	for i in query_data_all:
		first_month = [x['value'] for x in query_data_first if i['transfer_subtype'] == x['transfer_subtype']]
		end_month = [x['value'] for x in query_data_end if i['transfer_subtype'] == x['transfer_subtype']]
		trade_volume_data_response.append(
			tilesextended(
				category=i['transfer_subtype'],
				total=i['value'], 
				start_month = 0 if len(first_month) == 0 else first_month[0], 
				end_month = 0 if len(end_month) == 0 else end_month[0]))
		
	return(trade_volume_data_response)


#################
# TRADERS COUNT #
#################

def traders(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	
	reporting_data = reporting_table.objects.all()
	gender_filter = reporting_data.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender
	token_name_filter = reporting_data.values_list("tokenname", flat=True).distinct() if len(token_name) == 0 else token_name
	spend_filter = reporting_data.values_list("t_business_type", flat=True).distinct() if len(spend_type) == 0 else spend_type

	summary_data = reporting_data.annotate(_month=TruncMonth('timestamp')).values('_month','source')\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month,tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	trader_count_data_total = summary_data.aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
	trader_count_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
	trader_count_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Count("source", distinct=True),0))['value']
	trader_count_data_response = [tiles(total=trader_count_data_total, start_month = trader_count_data_first_month, end_month = trader_count_data_last_month)]
	
	return(trader_count_data_response)

######################
# TRANSACTIONS COUNT #
######################

def notransactions(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	
	reporting_data = reporting_table.objects.all()
	gender_filter = reporting_data.values_list("s_gender", flat=True).distinct() if len(gender) == 0 else gender
	token_name_filter = reporting_data.values_list("tokenname", flat=True).distinct() if len(token_name) == 0 else token_name
	spend_filter = reporting_data.values_list("t_business_type", flat=True).distinct() if len(spend_type) == 0 else spend_type

	summary_data = reporting_data.annotate(_month=TruncMonth('timestamp')).values('_month','id')\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month,tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	no_transactions_data_total = summary_data.aggregate(value = Coalesce(Count("id"),0))['value']
	no_transactions_data_first_month = summary_data.filter(_month = from_date).aggregate(value = Coalesce(Count("id"),0))['value']
	no_transactions_data_last_month = summary_data.filter(_month = to_date).aggregate(value = Coalesce(Count("id"),0))['value']
	no_transactions_data_response = [tiles(total=no_transactions_data_total, start_month = no_transactions_data_first_month, end_month = no_transactions_data_last_month)]
	
	return(no_transactions_data_response)


