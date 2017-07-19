(function(model,view){
    "use strict";

    document.addEventListener('onload', function(e){
      // get data from the view
      var data = e.detail;
      // forwards it to the model
      model.onload(data);
    });

    document.addEventListener('miniShowUserProfile', function(e){
      model.miniShowUserProfile();
    });

    document.addEventListener('editPost', function(e){
      var data = e.detail;
      model.editPost(data);
    });


}(model,view));
