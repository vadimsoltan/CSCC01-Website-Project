var view = (function(){

    var view = {};

	window.onload = function() {
        var id = location.href.substring(location.href.lastIndexOf('=')+1);
		//document.dispatchEvent(new CustomEvent('getpost'));
		document.dispatchEvent(new CustomEvent("onload",{detail:id}));
    }

    document.getElementById("poster").onclick = function(e) {
        
        var currName;
        for (var i=0;i < document.cookie.split(";").length; i++) {
            if (document.cookie.split(";")[i].split("=")[0].replace(/\s+/g, '') == "username") {
                currName = document.cookie.split(";")[i].split("=")[1]
            }
        }
        if (currName == "j%3Anull" || currName == undefined) {
            alert("Please login first");
        } else {
            document.dispatchEvent(new CustomEvent('miniShowUserProfile'));
            document.getElementById("testUserProfile").click();
        }
    }

    document.getElementById("edit").onclick = function(e) {
        var id = location.href.substring(location.href.lastIndexOf('=')+1);
        document.dispatchEvent(new CustomEvent('editPost',{detail:id}));
    }
	
    document.getElementById("editPostForm").onsubmit = function(e){
        e.preventDefault();
            var reader = new FileReader();
            var fileURL = document.getElementById("uploadImage").files[0];
            if (fileURL == undefined) {
                alert("Please add image!");
            } else {
                // get data when reader onloading
                reader.onload = function(){
                    var data = {};
                    var dataURL = reader.result;
                    data.id = location.href.substring(location.href.lastIndexOf('=')+1);
                    data.author = document.getElementById("editAuthor").value;
                    data.price = document.getElementById("editPrice").value;
                    data.title = document.getElementById("editTitle").value;
                    data.description = document.getElementById("editDescription").value;
                    data.tags = [document.getElementById("type").value, document.getElementById("subject").value];
                    data.image = dataURL;
                    document.getElementById("editPostForm").reset();
                    document.dispatchEvent(new CustomEvent('editPostFormSubmit',{detail: data}));

                };
                // display the image
                reader.readAsDataURL(fileURL);
        }
        document.getElementById("close3").click();
    }
    document.getElementById("deleteForm").onsubmit = function(e) {
        e.preventDefault();
        if (document.getElementById("answer").value != "30") {
            alert("Answer is wrong");
            document.getElementById("deleteClose").click();
        } else {
            var id = location.href.substring(location.href.lastIndexOf('=')+1);
            document.dispatchEvent(new CustomEvent("delete",{detail:id}));
        }
    }

    document.getElementById("reportForm").onsubmit = function(e) {
        e.preventDefault();
        var currName;
        for (var i=0;i < document.cookie.split(";").length; i++) {
          if (document.cookie.split(";")[i].split("=")[0].replace(/\s+/g, '') == "username") {
              currName = document.cookie.split(";")[i].split("=")[1]
             }
        }
        var data = {};
        data.reporter = currName;
        data.reason = document.getElementById("reason").value;
        data.id = location.href.substring(location.href.lastIndexOf('=')+1);
        document.dispatchEvent(new CustomEvent("report",{detail:data}));
    }
    









    return view;

}());
