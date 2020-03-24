""" OBJECT TYPES
The classes below define the object types.
These inform what the structure of the response data should look like.
"""
import graphene
from graphene.types.generic import GenericScalar

class chart_custom_response(graphene.ObjectType):
	value = graphene.List(GenericScalar)

class category_chart(graphene.ObjectType):
	label = graphene.String()
	value = graphene.Int()