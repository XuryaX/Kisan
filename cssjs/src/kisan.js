/**
 * Created by shaur on 28-08-2016.
 */

$(document).ready(function(){

    (function (){
        $.ajax({
            url : "/contacts",
            complete: function(data){
                var id;
                var no;
                var fname;
                var lname;
                response = JSON.parse(data.responseText);
                for (nodeIndex in response){
                    id = response[nodeIndex].pk;

                    fname = response[nodeIndex].fields.first_name;
                    lname = response[nodeIndex].fields.last_name;
                    no = response[nodeIndex].fields.phone_no;

                    addContactRow(id,fname,lname,no);
                }
            }

        })

    }());

    function loadMessages(){
        $.ajax({
            url : "/messages",
            complete: function(data){
                var otp;
                var name;
                var time;
                response = JSON.parse(data.responseText);
                for (nodeIndex in response){
                    otp = response[nodeIndex].otp;
                    name = response[nodeIndex].name;
                    time = response[nodeIndex].time;
                    console.log(otp,name,time)
                    addMessageRow(otp,name,time);
                }
            }

        })

    };

    loadMessages();



    $("#ContactList").on('click',".contact",
        function(evt){
            $("#sendbox").css({"display":"block"});

            var targetNode = evt.target;

            if(targetNode.nodeName == "TD"){
                infoElements = targetNode.parentNode.children;
            }
            else{
                infoElements = targetNode.children;
            }

            var phNo = infoElements[3].innerHTML;
            var id = infoElements[0].innerHTML;

            var otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            var desc = "Your OTP is "+otp;

            var titleNode = $("#sendNo")[0];
            titleNode.innerHTML = phNo;

            var descNode = $("#sendContent")[0];
            descNode.innerHTML = desc;

            var nameNode = $("#sendId")[0];
            nameNode.innerHTML = id;
        }

    );

    $("#send").click(
        function(){

            var details = {
                "name": $("#sendId")[0].innerHTML,
                "number": $("#sendNo")[0].innerHTML,
                "message": $("#sendContent")[0].innerHTML
            };

            $.ajax({
                type:"POST",
                url:"/send-otp",
                data:details,
                success: function(data){
                    if(data=="Error"){
                        alert("There was an error, " +
                        "check if the Number is in DND")
                    }
                    else{
                        loadMessages();
                        $("#sendbox").css({"display":"none"});
                    }
                }
            });
        }
    );

    $(".dismiss").click(
        function(){
            $("#sendbox").css({"display":"none"});
        }
    );

    function addContactRow(id,fname,lname,no){
        var tbody = $("#ContactList")[0];

        var row = document.createElement("tr");
        row.className = "contact";

        var fnameNode = document.createElement("td");
        fnameNode.innerHTML = fname;

        var lnameNode = document.createElement("td");
        lnameNode.innerHTML = lname;

        var idNode = document.createElement("td");
        idNode.innerHTML = id;

        var noNode = document.createElement("td");
        noNode.innerHTML = no;

        row.appendChild(idNode);
        row.appendChild(fnameNode);
        row.appendChild(lnameNode);
        row.appendChild(noNode);

        tbody.appendChild(row);

    }

    function addMessageRow(otp,name,time){
        var tbody = $("#MessageList")[0];

        var row = document.createElement("tr");

        var nameNode = document.createElement("td");
        nameNode.innerHTML = name;

        var otpNode = document.createElement("td");
        otpNode.innerHTML = otp;

        var timeNode = document.createElement("td");
        timeNode.innerHTML = time;

        row.appendChild(nameNode);
        row.appendChild(timeNode);
        row.appendChild(otpNode);

        tbody.appendChild(row);

    }



});