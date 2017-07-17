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

	model.getPost() {
		
		doAjax("GET", "http://localhost:3000/api/posts/:id", null, true, function(err, newData){
			console.log(newData);
			document.getElementById("author").textContent = newData.author;
			document.getElementById("title").textContent = newData.title;
			document.getElementById("description").textContent = newData.description;
			document.getElementById("price").textContent = newData.price;
			document.getElementById("time").textContent = newData.createdAt.split("T",1);
		})
	}

	















    return model;
}());
