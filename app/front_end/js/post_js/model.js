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
      console.log(id);
        doAjax('GET','http://localhost:3000/api/postsId/' + id + "/",null, true, function(err,newData) {
          var currName;
          for (var i=0;i < document.cookie.split(";").length; i++) {
              if (document.cookie.split(";")[i].split("=")[0].replace(/\s+/g, '') == "username") {
                  currName = document.cookie.split(";")[i].split("=")[1]
              }
          }
           document.getElementById("bookName").textContent = newData.title;
           document.getElementById("author").textContent = newData.author;
           document.getElementById("description").textContent = newData.description;
           console.log(newData.username)
           console.log(newData.username.length > 15)
           if (check_username(newData.username) === "need character") {
              document.getElementById("name").textContent = newData.name;
              document.getElementById("username").textContent = newData.username;

           } else {
              document.getElementById("name").textContent = newData.username;
              document.getElementById("username").textContent = newData.username;
           }
           document.getElementById("price").textContent = newData.price;
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
           console.log(currName)

          doAjax('GET','http://localhost:3000/api/' + currName + "/",null, true, function(err,currUser) {
            console.log(currUser);
            if (currUser != null) {
              if (currName == newData.username || currUser.type == "admin") {
                document.getElementById("edit").style.display = "block";
                document.getElementById("delete").style.display = "block";
              }
            }
          })
        })
    }

    model.miniShowUserProfile = function() {
      console.log(document.getElementById("username").textContent)
        doAjax('GET','http://localhost:3000/api/' + document.getElementById("username").textContent + '/',null,true, function(err,newData) {
                document.getElementById("currUserName").textContent = newData.username;
                document.getElementById("currName").textContent = newData.name;
                document.getElementById("currUserEmail").textContent = newData.email;
                document.getElementById("currUserPhone").textContent = newData.phone;
                document.getElementById("currUserLocation").textContent = newData.location;
        })
    }

    model.editPost = function (id){
      doAjax('GET','http://localhost:3000/api/postsId/' + id + "/",null, true, function(err,newData) {
        console.log(newData);
        document.getElementById("editTitle").value = newData.title;
        document.getElementById("editAuthor").value = newData.author;
        document.getElementById("editDescription").value = newData.description;
        document.getElementById("editPrice").value = newData.price;
      })
    }

    model.delete = function (id){
      doAjax('DELETE','http://localhost:3000/api/posts/' + id + "/",null, true, function(err,newData) {
        console.log(newData);
        if (newData == 1) {
          alert("Delete successfully!");
          location.replace("./index.html");
        } else {
          alert("Some errors happen. Please try again!");
          document.getElementById("deleteClose").click();
        }

      })
    }

    model.report = function(newData) {
      console.log("model")
        alert("Report successfully!");
        document.getElementById("reportClose").click();
        doAjax('POST','http://localhost:3000/api/report/',newData,true, function(err,newData) {
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


    return model;
}());