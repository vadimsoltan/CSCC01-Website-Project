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

    document.addEventListener('login_', function(e){

      view.login();
    });

    document.addEventListener('signOut', function(e){
      // get data from the view
      model.signOut();
    });

    document.addEventListener('updateUserProfile', function(e){
      var data = e.detail;
      // get data from the view
      model.updateUserProfile(data);
    });

    document.addEventListener('contactForm', function(e){
      var data = e.detail;
      // get data from the view
      model.contactUs(data);
    });

    document.addEventListener('showUserProfile', function(e){
      model.showUserProfile();
    });

    document.addEventListener('miniShowUserProfile', function(e){
      model.miniShowUserProfile();
    });

}(model,view));
