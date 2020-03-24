""" OBJECT TYPES
The classes below define the object types.
These inform what the structure of the response data should look like.
"""
import graphene
from graphene.types.generic import GenericScalar

class tiles(graphene.ObjectType):
	total = graphene.Int()
	start_month = graphene.Int()
	end_month = graphene.Int()


class tilesextended(graphene.ObjectType):
	category = graphene.String()
	total = graphene.Int()
	start_month = graphene.Int()
	end_month = graphene.Int()