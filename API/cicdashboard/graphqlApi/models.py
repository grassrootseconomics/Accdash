# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.postgres.fields import JSONField

class CicReportingTable(models.Model):
    timestamp = models.DateTimeField(blank=True, null=True)
    hash = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)
    s_gender = models.CharField(max_length=50, blank=True, null=True)
    s_business_type = models.CharField(max_length=255, blank=True, null=True)
    s_location = models.TextField(blank=True, null=True)
    target = models.CharField(max_length=255, blank=True, null=True)
    t_gender = models.CharField(max_length=50, blank=True, null=True)
    t_business_type = models.CharField(max_length=255, blank=True, null=True)
    t_location = models.TextField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    tokenname = models.CharField(max_length=50, blank=True, null=True)
    updated = models.DateTimeField(blank=True, null=True)
    transfer_subtype = models.CharField(max_length=255, blank=True, null=True)
    transfer_use = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    row_created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'cic_reporting_table'

class CicUsers(models.Model):
    postgres_id = models.AutoField(primary_key=True)
    created = models.DateTimeField(blank=True, null=True)
    gender = models.CharField(max_length=50, blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    roles = JSONField()
    current_blockchain_address = models.CharField(unique=True, max_length=255, blank=True, null=True)
    previous_blockchain_address = models.CharField(max_length=255, blank=True, null=True)
    business_type = models.CharField(max_length=255, blank=True, null=True)
    bal = models.FloatField(blank=True, null=True)
    start = models.DateTimeField(blank=True, null=True)
    last_send = models.DateTimeField(blank=True, null=True)
    delete_flag = models.BooleanField()
    row_created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'cic_users'