(function(model,view){
    "use strict";

    document.addEventListener('resetPassword', function(e){
      // get data from the view
      var data = e.detail;
      // forwards it to the model
      console.log(data);
      model.resetPassword(data);
    });

    


}(model,view));
