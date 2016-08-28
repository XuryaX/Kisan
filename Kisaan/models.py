from __future__ import unicode_literals

from django.db import models


class Contact(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(null=False,max_length=25)
    last_name = models.CharField(null=False,max_length=25)
    phone_no = models.IntegerField(null=False)

class Messages(models.Model):
    contact = models.ForeignKey(Contact)
    time = models.DateTimeField(auto_now_add=True)
    otp = models.IntegerField()