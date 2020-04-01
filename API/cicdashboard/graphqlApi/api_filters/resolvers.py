""" RESOLVERS
"""

from .. import models
from .. functions import *
from .types import filters

reporting_table = models.CicReportingTable

def resolve_filters(kwargs):

	reporting_data = reporting_table.objects

	yearMonth_list = reporting_data.annotate(_month = TruncMonth('timestamp')).values_list("_month", flat=True).distinct().order_by('_month')
	yearMonth_list = [{"Item":i.strftime("%Y-%m")} for i in yearMonth_list]

	tokenName_list = reporting_data.values_list("tokenname", flat=True).distinct()
	tokenName_list = [{"Item":i} for i in tokenName_list]

	spendType_list = reporting_data.values_list("t_business_type", flat=True).distinct()
	spendType_list = [{"Item":i} for i in spendType_list]

	gender_list = reporting_data.values_list("s_gender", flat=True).distinct()
	gender_list = [{"Item":i} for i in gender_list]

	txType_list = reporting_data.values_list("transfer_subtype", flat=True).distinct()
	txType_list = [{"Item":i} for i in txType_list]

	filter_list = [filters(yearMonth_list = yearMonth_list, tokenName_list = tokenName_list, spendType_list = spendType_list, gender_list = gender_list, txType_list = txType_list)]

	return(filter_list)