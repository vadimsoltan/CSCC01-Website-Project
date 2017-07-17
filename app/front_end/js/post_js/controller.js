(function(model,view){
    "use strict";

    document.addEventListener('onload', function(e){
      // get data from the view
      var data = e.detail;
      // forwards it to the model
      model.onload(data);
    });



}(model,view));
