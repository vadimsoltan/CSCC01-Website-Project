var view = (function(){
	
    document.getElementById("loginForm").onsubmit = function(e) {
    	e.preventDefault();
        console.log("here");
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
    // document.getElementById("signOut").onclick = function(e) {
    //     document.dispatchEvent(new CustomEvent('signOut',{detail: null}));
    // }
    // window.onload = function() {

    // }










    return view;
    
}());