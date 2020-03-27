import graphene
from .api_filters import schema as filters
from .api_tiles import schema as tiles
from .api_charts import schema as charts
from .api_old_calls import schema as old_calls

class Query(filters.Query, tiles.Query, charts.Query, old_calls.Query, graphene.ObjectType):
	pass

schema = graphene.Schema(query=Query)