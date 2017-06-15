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
    	var data = {};
    	data.username = document.getElementById("registerUsername").value;
    	data.password = document.getElementById("registerPassword").value;
    	document.dispatchEvent(new CustomEvent('register',{detail: data}));
        e.target.reset();
    }










    return view;
    
}());
