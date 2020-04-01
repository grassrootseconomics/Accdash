import pytest
from django.test import TestCase
from graphene.test import Client
 
from .models import CicReportingTable, CicUsers
from .api import schema

## get more test data in
## and complete the rest of the test cases
filters_query = """
    query {
        filters {
            yearMonthList
            tokenNameList
            genderList
            txTypeList
            spendTypeList
        }
    }
"""
@pytest.mark.django_db
class TestBlogSchema(TestCase):
 
    def setUp(self):
        self.client = Client(schema)
        CicReportingTable.objects.create(
            timestamp='2020-09-10 10:00:00',
            hash="",
            source="",
            s_gender="Male",
            s_business_type="Education",
            s_location="",
            target="",
            t_gender="",
            t_business_type="Education",
            t_location="",
            weight=100,
            tokenname="Sarafu",
            updated='2020-09-10 10:00:00',
            transfer_subtype="STANDARD",
            transfer_use="",
            address="",
            row_created_date = '2020-09-10 10:00:00'
            )

        self.reportingtable = CicReportingTable
 
    def test_filters_query(self):
        response = self.client.execute(filters_query)
        response_filters = response.get("data").get('filters')
        expected =  [{'yearMonthList': [{'Item': '2020-09'}], 'tokenNameList': [{'Item': 'Sarafu'}], 'genderList': [{'Item': 'Male'}], 'txTypeList': [{'Item': 'STANDARD'}], 'spendTypeList': [{'Item': 'Education'}]}]
        assert response_filters == expected