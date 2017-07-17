var view = (function(){

    var view = {};
	window.onload() {
		var id = location.href.substring(location.href.lastIndexOf('=')+1);
		document.dispatchEvent(new CustomEvent('getpost'));
	}
	
    









    return view;

}());
