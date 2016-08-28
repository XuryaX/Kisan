from django.http.response import HttpResponse
from django.shortcuts import render
from  django.views.generic import View,TemplateView

import json,urllib
from django.core.serializers.json import DjangoJSONEncoder

from django.core import serializers

from Kisaan.models import Contact,Messages
# Create your views here.


class ContactList(View):

    def get(self,data):
        contact_list = Contact.objects.all()
        contact_list_json = serializers.serialize("json",contact_list)
        return HttpResponse(contact_list_json)


class MessageList(View):

    def get(self,data):
        message_list = Messages.objects.all()
        message_list_json = []
        for row in message_list:
            message_list_json.append({'name':row.contact.first_name+" "+row.contact.last_name,
                                      'otp':row.otp,
                                      'time':row.time
                                      })

        message_list_json = json.dumps(message_list_json,cls=DjangoJSONEncoder)
        return HttpResponse(message_list_json)


class SendOTP(View):

    def post(self,data):
        data = [data for data in data][0]
        dataDict = {}

        for element in data.split("&"):
            elementName = element.split("=")[0]
            value = element.split("=")[1]
            if(elementName=="message"):
                value = " ".join(value.split("+"))
            dataDict[elementName] = value

        hash = "8961b4a024a0f6d3fe315acc3bfa40dd7cad8559"
        no = "91"+dataDict["number"]

        resp = json.loads(self.sendSMS("shauryadeepc@hotmail.com",hash,no,"TXTLCL",dataDict['message']))
        if resp['status']=="failure":
            return HttpResponse("Error")

        new_msg = Messages()
        new_msg.contact = Contact.objects.filter(pk=dataDict['name'])[0]
        new_msg.otp = dataDict['message'].split()[-1]
        new_msg.save()

        return HttpResponse("Success")

    def sendSMS(self,uname, hashCode, numbers, sender, message):
        data =  urllib.urlencode({'username': uname, 'hash': hashCode, 'numbers': numbers,
            'message' : message, 'sender': sender})
        data = data.encode('utf-8')
        #request = urllib.request.Request()
        f = urllib.urlopen("http://api.textlocal.in/send/?", data)
        fr = f.read()
        print(fr)
        return(fr)

class HomePage(TemplateView):
    template_name = "index.html"