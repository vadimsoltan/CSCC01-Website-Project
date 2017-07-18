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

    document.addEventListener('stillLogin', function(e){
      // get data from the view
      var data = e.detail;
      // forwards it to the model
      model.stillLogin(data);
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

    document.addEventListener('createNewPost', function(e){
      var data = e.detail;
      // get data from the view
      model.createPost(data);
    });

    document.addEventListener('createList', function(e){

      model.createList();
    });

    document.addEventListener('createList_', function(e){
      var data = e.detail;
      view.createList(data);
    });

    document.addEventListener('showMyPosts', function(e){
      model.showMyPosts();
    });

    document.addEventListener('next', function(e){
      var data = e.detail;
      model.next(data);
    });


    document.addEventListener('previous', function(e){
      var data = e.detail;
      model.previous(data);
    });

    document.addEventListener('facebookLogin', function(e){
      var data = e.detail;
      model.facebookLogin(data);
    });

    // document.addEventListener("sendMessage", function(e){
    //   var data = e.detail;
    //   model.sendMessage(data);
    // });

    document.addEventListener('search', function(e){
      var data = e.detail;
      model.search(data);
    });

    document.addEventListener('nextSearch', function(e){
      var data = e.detail;
      model.nextSearch(data);
    });

    document.addEventListener('previousSearch', function(e){
      var data = e.detail;
      model.previousSearch(data);
    });

    document.addEventListener('contact', function(e){
      var data = e.detail;
      model.contact(data);
    });





}(model,view));
