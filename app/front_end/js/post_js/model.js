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

    model.onload = function(id) {
        doAjax('GET','http://localhost:3000/api/postsId/' + id + "/",null, true, function(err,newData) {
           console.log(newData.userImage)
           document.getElementById("bookName").textContent = newData.title;
           document.getElementById("author").textContent = newData.author;
           document.getElementById("description").textContent = newData.description;
           document.getElementById("username").textContent = newData.username;
           document.getElementById("image").src = newData.image;
           document.getElementById("userImage").src = newData.userImage;
           if (newData.tags[0] == "None" && newData.tags[1] == "None") {
            document.getElementById("tags").textContent = "None";
           } else if (newData.tags[0] == "None" && newData.tags[1] != "None") {
            document.getElementById("tags").textContent = newData.tags[1];
           } else if (newData.tags[1] == "None" && newData.tags[0] != "None") {
            document.getElementById("tags").textContent = newData.tags[0];
           } else {
            document.getElementById("tags").textContent = newData.tags[0] + "     ,     " + newData.tags[1]
           }
        })
    }
















    return model;
}());