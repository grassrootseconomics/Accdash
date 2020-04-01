""" OBJECT TYPES
The classes below define the object types.
These inform what the structure of the response data should look like.
"""
import graphene
from graphene.types.generic import GenericScalar

class summary(graphene.ObjectType):
	traders = GenericScalar()
	trade_volumes = GenericScalar()
	no_transactions = GenericScalar()
	frequent_traders = GenericScalar()
	registered_users = GenericScalar()

class summary_tiles(graphene.ObjectType):
	total = graphene.Int()
	start_month = graphene.Int()
	end_month = graphene.Int()

class summary_tiles_extended(graphene.ObjectType):
	category = graphene.String()
	total = graphene.Int()
	start_month = graphene.Int()
	end_month = graphene.Int()

class spendtypesummary(graphene.ObjectType):
	label = graphene.String()
	value = graphene.Int()

class monthlysummary(graphene.ObjectType):
	Traders_Vs_Fqtrader = graphene.List(GenericScalar)
	trade_volumes_tokens = graphene.List(GenericScalar)
	no_transactions_token = graphene.List(GenericScalar)
	trade_volumes_spend_type = graphene.List(GenericScalar)
	no_transactions_spend_type = graphene.List(GenericScalar)