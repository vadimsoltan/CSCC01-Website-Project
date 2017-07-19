var view = (function(){

    var view = {};

	window.onload = function() {
        var id = location.href.substring(location.href.lastIndexOf('=')+1);
		//document.dispatchEvent(new CustomEvent('getpost'));
		console.log(id);
		document.dispatchEvent(new CustomEvent("onload",{detail:id}));
    }

    document.getElementById("poster").onclick = function(e) {
        
        document.dispatchEvent(new CustomEvent('miniShowUserProfile',{detail: null}));
    }

    document.getElementById("edit").onclick = function(e) {
        alert("stop");
        document.getElementById("close3").click();
        var id = location.href.substring(location.href.lastIndexOf('=')+1);
        document.dispatchEvent(new CustomEvent('editPost',{detail:id}));
        document.getElementById("close3").click();
    }
	
    document.getElementById("editPostForm").onsubmit = function(e){
        e.preventDefault();
        if (document.getElementById("currentUser").textContent == "") {
            alert("Please login first!");
            document.getElementById("close3").click();
            document.getElementById("sign").click();
        } else {
            var reader = new FileReader();
            var fileURL = document.getElementById("uploadImage").files[0];
            if (fileURL == undefined) {
                alert("Please add image!");
            } else {
                // get data when reader onloading
                reader.onload = function(){
                    var data = {};
                    var dataURL = reader.result;
                    data.username = document.getElementById("currentUser1").textContent;
                    data.author = document.getElementById("author").value;
                    data.price = document.getElementById("price").value;
                    data.title = document.getElementById("title").value;
                    data.description = document.getElementById("description").value;
                    data.tags = [document.getElementById("type").value, document.getElementById("subject").value];
                    data.image = dataURL;
                    document.getElementById("makePostForm").reset();
                    document.dispatchEvent(new CustomEvent('createNewPost',{detail: data}));

                };
                // display the image
                reader.readAsDataURL(fileURL);
            }
        }
        document.getElementById("close3").click();
    }
    









    return view;

}());
