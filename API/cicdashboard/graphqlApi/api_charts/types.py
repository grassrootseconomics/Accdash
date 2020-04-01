""" OBJECT TYPES
The classes below define the object types.
These inform what the structure of the response data should look like.
"""
import graphene
from graphene.types.generic import GenericScalar

class summary_tiles(graphene.ObjectType):
	total = graphene.Int()
	start_month = graphene.Int()
	end_month = graphene.Int()

class time_summary(graphene.ObjectType):
	value = graphene.List(GenericScalar)

class category_summary(graphene.ObjectType):
	label = graphene.String()
	value = graphene.Int()

class subtype_summary(graphene.ObjectType):
	trade_volumes = graphene.Field(summary_tiles)
	transaction_count = graphene.Field(summary_tiles)
