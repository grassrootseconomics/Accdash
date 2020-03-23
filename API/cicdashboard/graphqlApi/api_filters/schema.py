""" SCHEMA SCRIPT
This script control how the API returns data after an API call.
The various query sub-types are defined here e.g. Summary, monthlySummary.
GenericScaler types have been used in order to return the data in a format that is usable for the front end
REMINDER - remove all unused pivots, libraries and variables after development is complete.
"""

from .. functions import *
from .types import filters
from .resolvers import resolve_filters

class Query(graphene.ObjectType):

	filters = graphene.List(filters)

	def resolve_filters(self, info, **kwargs):
		cache_key, cache_data = get_cache_values(kwargs, "filters")
		if cache_data is not None:
			return cache_data

		data = resolve_filters(kwargs)
		cache.set(cache_key,data, CACHE_TTL)
		return data