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
            data.email = document.getElementById("email").value;
        	document.dispatchEvent(new CustomEvent('register',{detail: data}));
            e.target.reset();
        }
    }
    document.getElementById("signOut").onclick = function(e) {
        document.dispatchEvent(new CustomEvent('signOut',{detail: null}));
    }
    window.onload = function() {
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        console.log(document.cookie);
    }


    document.getElementById("userProfileForm").onsubmit = function(e) {
    	e.preventDefault();
    	var data = {};
    	data.name = document.getElementById("userName").value;
    	data.location = document.getElementById("userLocation").value;
    	data.email = document.getElementById("userEmail").value;
    	data.phone = document.getElementById("userPhone").value;
    	document.dispatchEvent(new CustomEvent('updateUserProfile',{detail: data}));
        e.target.reset();
    }



    // view.login = function() {
    //     document.getElementById("sign").style.display = 'none';
    //     document.getElementById("signOut").style.display = 'block';
    // }










    return view;
    
}());