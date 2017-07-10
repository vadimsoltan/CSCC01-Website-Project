var view = (function(){

    document.getElementById("loginForm").onsubmit = function(e) {
        e.preventDefault();
        var data = {};
        data.username = document.getElementById("loginUsername").value;
        data.password = document.getElementById("loginPassword").value;
        document.dispatchEvent(new CustomEvent('login',{detail: data}));
        e.target.reset();
    }

    document.getElementById("registerForm").onsubmit = function(e) {
        e.preventDefault();
        if (document.getElementById("registerPassword").value != document.getElementById("confirmedPassword").value) {
            alert("password not same");
        } else {
            var data = {};
            data.username = document.getElementById("registerUsername").value;
            data.password = document.getElementById("registerPassword").value;
            data.email = document.getElementById("registerEmail").value;
            document.dispatchEvent(new CustomEvent('register',{detail: data}));
            e.target.reset();
        }
    }
    document.getElementById("signOut").onclick = function(e) {
        document.dispatchEvent(new CustomEvent('signOut',{detail: null}));
    }
    window.onload = function() {
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }


    document.getElementById("userProfileForm").onsubmit = function(e) {
        console.log("view");
        e.preventDefault();
        if (document.getElementById("currentUser").textContent == "") {
            alert("Please login first!");
            document.getElementById("close2").click();
        } else {
            var data = {};
            data.name = document.getElementById("userName").value;
            data.location = document.getElementById("userLocation").value;
            data.email = document.getElementById("userEmail").value;
            data.phone = document.getElementById("userPhone").value;
            console.log(data);
            document.dispatchEvent(new CustomEvent('updateUserProfile',{detail: data}));
            e.target.reset();
        }
    }

    document.getElementById("contactForm").onsubmit = function(e) {
        e.preventDefault();
        var data = {};
        data.name = document.getElementById("contactName").value;
        data.email = document.getElementById("contactEmail").value;
        data.subject = document.getElementById("contactSubject").value;
        data.message = document.getElementById("contactMessage").value;
        document.dispatchEvent(new CustomEvent('contactForm',{detail: data}));
        e.target.reset();
    }
    document.getElementById("postImg").onclick = function(e) {
        document.dispatchEvent(new CustomEvent('showUserProfile',{detail: null}));
    }

    document.getElementById("currentUser").onclick = function(e) {
        document.dispatchEvent(new CustomEvent('miniShowUserProfile',{detail: null}));
    }

    document.getElementById("makePostForm").onsubmit = function(e){
        e.preventDefault();
        // var data = {};
        // if (document.getElementById("currentUser").textContent == ""){
        //     data.username = "guest";
        // }
        // else{
        //     data.username = document.getElementById("currentUser").textContent;
        // }

        // data.image = "";
        // document.dispatchEvent(new CustomEvent("createNewPost",{detail: data}));
        // e.target.reset();
        if (document.getElementById("currentUser").textContent == "") {
            alert("Please login first!");
            document.getElementById("close3").click();
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
                    data.username = document.cookie.substr(9);
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