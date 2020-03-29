""" OBJECT TYPES
The classes below define the object types.
These inform what the structure of the response data should look like.
"""
import graphene
from graphene.types.generic import GenericScalar

class filters(graphene.ObjectType):
	gender_list = graphene.List(GenericScalar)
	tokenName_list = graphene.List(GenericScalar)
	yearMonth_list = graphene.List(GenericScalar)
	spendType_list = graphene.List(GenericScalar)
	txType_list = graphene.List(GenericScalar)