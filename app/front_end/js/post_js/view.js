var view = (function(){

    var view = {};

	window.onload = function() {
        var id = location.href.substring(location.href.lastIndexOf('=')+1);
		//document.dispatchEvent(new CustomEvent('getpost'));
		console.log(id);
		document.dispatchEvent(new CustomEvent("onload",{detail:id}));
    }
	
    









    return view;

}());
