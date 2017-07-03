var model = (function(){
    "use strict";
    // var local_datastore
    var model = {};
    var doAjax = function (method, url, body, json, callback){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(e){

            switch(this.readyState){
                 case (XMLHttpRequest.DONE):
                    if (this.status === 200) {
                        if(json) return callback(null, JSON.parse(this.responseText));
                        return callback(null, this.responseText);
                    }else{
                        return callback(this.responseText, null);
                    }
            }
        };
        xhttp.open(method, url, true);
        if (json && body){
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(body));  
        }else{
            xhttp.send(body);  
        }        
    };

    model.register = function(newData) {
        doAjax('PUT','http://localhost:3000/api/users/',newData, true, function(err,newData) {
            if(newData === null) {
                alert("Username has already existed.");
            } else {
                document.getElementById("sign").style.display = 'none';
                document.getElementById("signOut").style.display = 'block';
                document.getElementById("currentUser").textContent = "current user: " + document.cookie.substr(9);
                document.getElementById("close1").click();
            }
        })
    }
    model.login = function(newData) {
        console.log("here");
        doAjax('POST','http://localhost:3000/signIn/',newData, true, function(err,newData) {
            if(newData === "notRegistered") {
                alert("Username has not be registered.");
            } else if(newData === "wrong") {
                alert("The password is not correct.");
            } else {
                document.getElementById("sign").style.display = 'none';
                document.getElementById("signOut").style.display = 'block';
                document.getElementById("currentUser").textContent = "current user: " + document.cookie.substr(9);
                document.getElementById("close1").click();
            }
        })
    }

    model.signOut = function() {
        doAjax('DELETE','http://localhost:3000/signOut/',null,false, function(err,newData) {
            location.reload();
        })
    }

    model.updateUserProfile = function(newData) {
        var username = document.cookie.substr(9);
        doAjax('PUT','http://localhost:3000/api/' + username + '/profile/',newData,true, function(err,newData) {
            console.log(newData);
            if (newData == 1) {
                document.getElementById("close2").click();
            } else {
                alert("Some errors exist");
            }
        })
    }

    model.contactUs = function(newData) {
        doAjax('POST','http://localhost:3000/api/contactUs/',newData,true, function(err,newData) {
            console.log(newData);
        })
    }

    model.showUserProfile = function() {
        doAjax('GET','http://localhost:3000/api/' + document.cookie.substr(9) + '/',null,true, function(err,newData) {
            document.getElementById("userName").value = newData.name;
            document.getElementById("userLocation").value = newData.location;
            document.getElementById("userEmail").value = newData.email;
            document.getElementById("userPhone").value = newData.phone;
        })
    }





















    return model;
}());