""" SCHEMA SCRIPT
This script control how the API returns data after an API call.
The various query sub-types are defined here e.g. Summary, monthlySummary.
GenericScaler types have been used in order to return the data in a format that is usable for the front end
REMINDER - remove all unused pivots, libraries and variables after development is complete.
"""

from .resolvers import *
from .. functions import *
from .types import *

class Query(graphene.ObjectType):
	########################
	# TRADE VOLUME QUERIES #
	########################

	tradeVolumesTokens = graphene.List(chart_custom_response,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_tradeVolumesTokens(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "tradeVolumesTokens")
		if cache_data is not None:
			return cache_data

		data = tv_token(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data


	tradeVolumesSpendType = graphene.List(chart_custom_response,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_tradeVolumesSpendType(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "tradeVolumesSpendType")
		if cache_data is not None:
			return cache_data

		data = tv_spend(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data


	tradeVolumesGender = graphene.List(chart_custom_response,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_tradeVolumesGender(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "tradeVolumesGender")
		if cache_data is not None:
			return cache_data

		data = tv_gender(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	#############################
	# TRANSACTION COUNT QUERIES #
	#############################

	noTransactionsToken = graphene.List(chart_custom_response,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_noTransactionsToken(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "noTransactionsToken")
		if cache_data is not None:
			return cache_data

		data = tc_token(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data


	noTransactionsSpendType = graphene.List(chart_custom_response,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_noTransactionsSpendType(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "noTransactionsSpendType")
		if cache_data is not None:
			return cache_data

		data = tc_spend(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	noTransactionsGender = graphene.List(chart_custom_response,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_noTransactionsGender(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "noTransactionsGender")
		if cache_data is not None:
			return cache_data

		data = tc_gender(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	#################
	# OTHER QUERIES #
	#################

	TradersVsFqtrader = graphene.List(chart_custom_response,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_TradersVsFqtrader(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "TradersVsFqtrader")
		if cache_data is not None:
			return cache_data

		data = total_frequent(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	spendtypesummary = graphene.List(category_chart,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_spendtypesummary(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "spendtypesummary")
		if cache_data is not None:
			return cache_data

		data = spend_summary(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	gendersummary = graphene.List(category_chart,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_gendersummary(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "gendersummary")
		if cache_data is not None:
			return cache_data

		data = gender_summary(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data