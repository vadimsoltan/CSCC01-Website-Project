(function(model,view){
    "use strict";
    document.addEventListener('register', function(e){
      // get data from the view
      var data = e.detail;
      // forwards it to the model
      model.register(data);
    });

    document.addEventListener('login', function(e){
      // get data from the view
      var data = e.detail;
      // forwards it to the model
      model.login(data);
    }); 


}(model,view)); 

