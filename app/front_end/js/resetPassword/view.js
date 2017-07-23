var view = (function(){

    var view = {};
    var id = location.href.substring(location.href.lastIndexOf('=')+1);
	window.onload = function() {
        var id = location.href.substring(location.href.lastIndexOf('=')+1);
		//document.dispatchEvent(new CustomEvent('getpost'));
		console.log(id);
    }

    document.getElementById("password-reset-index").onsubmit = function(e) {
        e.preventDefault();
        if (document.getElementById("password1").value != document.getElementById("password2").value) {
            alert("Password not same");
        } else {
            var data = {};
            data.email = location.href.substring(location.href.lastIndexOf('=')+1);
            data.newPassword = document.getElementById("password1").value;
            console.log(data)
            document.dispatchEvent(new CustomEvent('resetPassword',{detail:data}));
        }
    }

    









    return view;

}());
