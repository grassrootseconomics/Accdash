""" RESOLVERS
The resolvers below provide infromation found on tiles
"""
from .. import models
from .. functions import *
from .types import *


FQ_TRADER_THRESHOLD = 4
cic_users = models.CicUsers
reporting_table = models.CicReportingTable

#######################
# TRADE VOLUMES TOKEN #
#######################

def tv_token(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	selected_months = [] 
	trade_volume_data  = summary_data.values('_month', 'tokenname').annotate(value = Sum("weight")).order_by("_month")
	populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
	tv_per_token = category_by_filter(trade_volume_data, selected_months, 'tokenname', token_name_filter)

	tv_token_response = [chart_custom_response(value = tv_per_token)]
	return(tv_token_response)


###########################
# TRADE VOLUMES SPENDTYPE #
###########################

def tv_spend(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	selected_months = [] 
	trade_volume_data  = summary_data.values('_month', 't_business_type')\
	.annotate(value = Sum("weight")).order_by("_month" , "t_business_type")

	populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
	tv_per_spend = category_by_filter(trade_volume_data, selected_months, 't_business_type', spend_filter)

	tv_spend_response = [chart_custom_response(value = tv_per_spend)]

	return(tv_spend_response)

########################
# TRADE VOLUMES GENDER #
########################

def tv_gender(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	trade_volume_data  = summary_data.values('_month', 's_gender').annotate(value = Sum("weight")).order_by("_month" , "s_gender")
	selected_months = [] 
	populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
	tv_gender = category_by_filter(trade_volume_data, selected_months, 's_gender', gender_filter)

	tv_gender_response = [chart_custom_response(value = tv_gender)]

	return(tv_gender_response)

##################################
# TRADE VOLUMES TRANSACTION TYPE #
##################################

def tv_txtype(kwargs):
	from_date, to_date, token_name, spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	tx_filter = reporting_table.objects.values_list("transfer_subtype", flat=True).distinct()

	selected_months = [] 
	trade_volume_data  = summary_data.values('_month', 'transfer_subtype').annotate(value = Sum("weight")).order_by("_month" , "transfer_subtype")
	populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in trade_volume_data if i['_month'].strftime('%Y-%m') not in selected_months]
	tv_txtype = category_by_filter(trade_volume_data, selected_months, 'transfer_subtype', tx_filter)
	tv_txtype_response = [chart_custom_response(value = tv_txtype)]

	return(tv_txtype_response)

#############################
# TRANSACTION COUNT TOKENS #
#############################

def tc_token(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = _from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	selected_months = []
	no_trans_data  = summary_data.values('_month', 'tokenname').annotate(value = Count("id")).order_by("_month")
	populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
	nt_per_token = category_by_filter(no_trans_data, selected_months, 'tokenname', token_name_filter)

	tc_token_response = [chart_custom_response(value = nt_per_token)]
	return(tc_token_response)


###############################
# TRANSACTION COUNT SPENDTYPE #
###############################

def tc_spend(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	selected_months = [] 
	no_trans_data  = summary_data.values('_month', 't_business_type').annotate(value = Count("id")).order_by("_month")
	populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
	nt_per_spend = category_by_filter(no_trans_data, selected_months, 't_business_type', spend_filter)

	tc_spend_response = [chart_custom_response(value = nt_per_spend)]
	return(tc_spend_response)


############################
# TRANSACTION COUNT GENDER #
############################

def tc_gender(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	selected_months = [] 
	no_trans_data  = summary_data.values('_month', 's_gender').annotate(value = Count("id")).order_by("_month")
	populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
	tc_gender = category_by_filter(no_trans_data, selected_months, 's_gender', gender_filter)

	tc_gender_response = [chart_custom_response(value = tc_gender)]
	return(tc_gender_response)


######################################
# TRANSACTION COUNT TRANSACTION TYPE #
######################################

def tc_txtype(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

	tx_filter = reporting_table.objects.values_list("transfer_subtype", flat=True).distinct()

	selected_months = [] 
	no_trans_data  = summary_data.values('_month', 'transfer_subtype').annotate(value = Count("id")).order_by("_month")
	populate_month = [selected_months.append(i['_month'].strftime('%Y-%m')) for i in no_trans_data if i['_month'].strftime('%Y-%m') not in selected_months]
	tc_txtype = category_by_filter(no_trans_data, selected_months, 'transfer_subtype', tx_filter)

	tc_txtype_response = [chart_custom_response(value = tc_txtype)]
	return(tc_txtype_response)

#############################
# TOTAL VS FREQUENT TRADERS #
#############################

def total_frequent(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects.annotate(_month=TruncMonth('timestamp'))\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("_month")

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
	
	total_frequent_response = [chart_custom_response(value = trader_vs_fqtrader_response)]

	return(total_frequent_response)



#####################
# SPENDTYPE SUMMARY #
#####################

def spend_summary(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_data\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("t_business_type")

	spend_summary_data = reporting_table.objects.annotate(label = F('t_business_type')).values("label").annotate(value=Sum("weight"))
	spend_summary_response = [category_chart(label=i['label'], value =i['value']) for i in spend_summary_data]

	return(spend_summary_response)

##################
# GENDER SUMMARY #
##################

def gender_summary(kwargs):
	from_date, to_date, token_name,spend_type, gender = kwargs['from_date'], kwargs['to_date'], kwargs['token_name'], kwargs['spend_type'], kwargs['gender']
	from_date, to_date, to_date_plus_one_month, from_date_plus_one_month = create_date_points(from_date, to_date)
	gender_filter, token_name_filter, spend_filter = get_filter_values(gender, token_name, spend_type)

	summary_data = reporting_table.objects\
	.filter(timestamp__gte = from_date,timestamp__lt = to_date_plus_one_month, tokenname__in = token_name_filter, t_business_type__in = spend_filter, s_gender__in = gender_filter)\
	.order_by("s_gender")

	gender_summary_data = summary_data.annotate(label = F('s_gender')).values("label").annotate(value=Sum("weight"))
	gender_summary_response = [category_chart(label=i['label'], value =i['value']) for i in gender_summary_data]

	return(gender_summary_response)