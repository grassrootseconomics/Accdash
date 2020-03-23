""" SCHEMA SCRIPT
This script control how the API returns data after an API call.
The various query sub-types are defined here e.g. Summary, monthlySummary.
GenericScaler types have been used in order to return the data in a format that is usable for the front end
REMINDER - remove all unused pivots, libraries and variables after development is complete.
"""

from .types import tiles
from .. functions import *
from .resolvers import registeredusers, frequenttraders, tradevolumes, traders, notransactions

class Query(graphene.ObjectType):

	registeredusers = graphene.List(tiles,from_date = graphene.String(required=True),to_date = graphene.String(required=True),gender =graphene.List(graphene.String),required=True)

	def resolve_registeredusers(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "registeredusers")
		if cache_data is not None:
			return cache_data

		data = registeredusers(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	frequenttraders = graphene.List(tiles,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_frequenttraders(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "resolve_frequenttraders")
		if cache_data is not None:
			return cache_data

		data = frequenttraders(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	tradevolumes = graphene.List(tiles,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_tradevolumes(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "tradevolumes")
		if cache_data is not None:
			return cache_data

		data = tradevolumes(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	traders = graphene.List(tiles,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_traders(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "traders")
		if cache_data is not None:
			return cache_data

		data = traders(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data

	notransactions = graphene.List(tiles,
		from_date = graphene.String(required=True),
		to_date = graphene.String(required=True),
		token_name= graphene.List(graphene.String,required=True),
		spend_type =graphene.List(graphene.String,required=True),
		gender =graphene.List(graphene.String),required=True)

	def resolve_notransactions(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "notransactions")
		if cache_data is not None:
			return cache_data

		data = notransactions(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data