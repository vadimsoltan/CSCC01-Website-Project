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
                alert("Username or email has already existed.");
            } else {
                document.getElementById("sign").style.display = 'none';
                document.getElementById("signOut").style.display = 'block';
                document.getElementById("currentUser").style.display ='block';
                document.getElementById("currentUser").textContent = "current user: " + newData;
                document.getElementById("currentUser1").textContent = newData;
                document.getElementById("close1").click();
                document.dispatchEvent(new CustomEvent('miniShowUserProfile'));
            }
        })
    }
    model.login = function(newData) {
        doAjax('POST','http://localhost:3000/signIn/',newData, true, function(err,newData) {
            if(newData === "notRegistered") {
                alert("Username has not be registered.");
            } else if(newData === "wrong") {
                alert("The password is not correct.");
            } else {
                document.getElementById("sign").style.display = 'none';
                document.getElementById("signOut").style.display = 'block';
                document.getElementById("currentUser").style.display ='block';
                document.getElementById("currentUser").textContent = "current user: " + newData;
                document.getElementById("currentUser1").textContent = newData;
                document.getElementById("close1").click();
                document.dispatchEvent(new CustomEvent('miniShowUserProfile'));
            }
        })
    }

    model.stillLogin = function(newData) {
        doAjax('POST','http://localhost:3000/stillLogin/' + newData + "/",null, true, function(err,newData) {
            document.getElementById("sign").style.display = 'none';
            document.getElementById("signOut").style.display = 'block';
            document.getElementById("currentUser").style.display ='block';
            document.getElementById("currentUser").textContent = "current user: " + newData;                
            document.getElementById("currentUser1").textContent = newData;
            document.getElementById("close1").click();
            document.dispatchEvent(new CustomEvent('miniShowUserProfile'));
        })
    }

    model.facebookLogin = function(data) {
        doAjax('POST','http://localhost:3000/facebookLogin/',data,true, function(err,newData) {
            document.getElementById("sign").style.display = 'none';
            document.getElementById("signOut").style.display = 'block';
            document.getElementById("currentUser").style.display ='block';
            document.getElementById("currentUser").textContent = "current user: " + newData.name;
            document.getElementById("currentUser1").textContent = newData.username;
            document.getElementById("close1").click();

        })
    }

    model.signOut = function() {
        doAjax('DELETE','http://localhost:3000/signOut/',null,false, function(err,newData) {
            if (document.getElementById("currentUser").textContent.substr(14) != document.getElementById("currentUser1").textContent) {

                FB.logout(function(response) {
                    location.reload();
                });
            } else {
                location.reload();
            }
        })
    }

    model.updateUserProfile = function(newData) {
        doAjax('PUT','http://localhost:3000/api/' + document.getElementById("currentUser1").textContent + '/profile/',newData,true, function(err,newData) {
            console.log(newData);
            if (newData == 1) {
                console.log("close");
                document.getElementById("close2").click();
            } else {
                alert("Some errors exist");
            }
        })
    }

    model.contactUs = function(newData) {
        doAjax('POST','http://localhost:3000/api/contactUs/',newData,true, function(err,newData) {
        })
    }

    model.showUserProfile = function() {
        doAjax('GET','http://localhost:3000/api/' + document.getElementById("currentUser1").textContent + '/',null,true, function(err,newData) {
            document.getElementById("userName").value = newData.name;
            document.getElementById("userLocation").value = newData.location;
            document.getElementById("userEmail").value = newData.email;
            document.getElementById("userPhone").value = newData.phone;
        })
    }

    model.miniShowUserProfile = function() {
        doAjax('GET','http://localhost:3000/api/' + document.getElementById("currentUser1").textContent+ '/',null,true, function(err,newData) {
            console.log(newData);
            document.getElementById("currUserName").textContent = newData.username;
            document.getElementById("currName").textContent = newData.name;
            document.getElementById("currUserEmail").textContent = newData.email;
            document.getElementById("currUserPhone").textContent = newData.phone;
            document.getElementById("currUserLocation").textContent = newData.location;
        })
    }

    model.createPost = function(data){
        doAjax("POST", "http://localhost:3000/api/posts/", data, true, function(err, newData){
            if (newData == "Max") {
                alert("One user can only have 10 posts at same time")
            } else {
                model.createList();
            }
        })
    }

    model.createList = function() {
        doAjax("GET", "http://localhost:3000/api/posts/all/", null, true, function(err, newData){
            document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
            document.getElementById("txtBookSearch").value = "";
            document.getElementById("status").textContent = "";
        })

    }

    model.showMyPosts = function() {
        doAjax("GET", "http://localhost:3000/api/posts/" + document.getElementById("currentUser1").textContent + "/", null, true, function(err, newData){
            document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
        })
    }

    model.next = function(data) {
        doAjax("GET", "http://localhost:3000/api/posts/next/" + data + "/", null, true, function(err, newData){
            if (newData.length == 0) {
                alert("This is the last page");
            } else {
                document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
                document.getElementById("postList").click();
            }
        })
    }

    model.previous = function(data) {
        doAjax("GET", "http://localhost:3000/api/posts/previous/" + data + "/", null, true, function(err, newData){
            if (newData.length == 0) {
                alert("This is the first page");
            } else {
                document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
                document.getElementById("postList").click();
            }
        })
    }

    model.search = function(data) {
        doAjax('GET','http://localhost:3000/api/search/' + data + "/",null, true, function(err,newData) {
            console.log(newData)
            if (newData.length == 0) {
                alert("Nothing found by the info")
            } else {
                document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
            }
        })
    }

    model.nextSearch = function(data) {
        doAjax('GET','http://localhost:3000/api/posts/nextSearch/' + data.lastId + "/" + data.info + "/",null, true, function(err,newData) {
            if (newData.length == 0) {
                alert("This is the last page");
            } else {
                document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
                document.getElementById("postList").click();
            }
            //document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
        })
    }

    model.previousSearch = function(data) {
        doAjax('GET','http://localhost:3000/api/posts/previousSearch/' + data.firstId + "/" + data.info + "/",null, true, function(err,newData) {
            if (newData.length == 0) {
                alert("This is the first page");
            } else {
                document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
                document.getElementById("postList").click();
            }
            //document.dispatchEvent(new CustomEvent('createList_',{detail: newData}));
        })
    }



    model.setContactButtonForm = function(id) {
        doAjax('GET','http://localhost:3000/api/postsId/' + id + "/",null, true, function(err,newData) {
            if (check_username(newData.username) === "need character") {
                document.getElementById("contactButtonReceiver").textContent = newData.name;
            } else {
                document.getElementById("contactButtonReceiver").textContent = newData.username;
            }
            document.getElementById("contactButtonReceiverEmail").textContent = newData.email;
            document.getElementById("contactButtonSubject").value = "Your ad   " + newData.title;
            document.getElementById("contactButtonEmail").value = document.getElementById("currUserEmail").textContent;
        })
    }


    var check_username = function (userName){
        var index;
        var count = 0;
        for (index = 0; index < userName.length; index++){
            var thischar = userName.charAt(index);
            var regex = /a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z/g;
            if(thischar.match(regex) != null || thischar.toUpperCase().match(regex) != null){
                count++;
            }
            else if(!(!isNaN(parseFloat(thischar)) && isFinite(thischar))){
                return "---";
            }
        }
        if(count == 0){
            return "need character";
        }
        return "good";
    };

    model.contactButtonForm = function(newData) {
        alert("Sent Message Successfully!")
        document.getElementById("contactButtonClose3").click();
        doAjax('POST','http://localhost:3000/api/contactForm/',newData,true, function(err,newData) {
            console.log(newData);
        })
    }


    model.reset = function(newData) {
        console.log("model")
        doAjax('POST','http://localhost:3000/api/reset/' + newData + "/",null,true, function(err,newData) {
        })
    }
















    return model;
}());
