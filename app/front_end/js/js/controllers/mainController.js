// controllers
app.controller('ProjectController', ['projectDetail', '$scope', '$stateParams', function(projectDetail, $scope, $stateParams) {
    // id needs to be passed by routeparam 
    id = String($stateParams.projectId);
    this.state = 0;
    this.setState = function(setState) {
        this.state = setState;
    };
    this.isSelected = function(checkState) {
        return this.state == checkState;
    };
    projectDetail.getProject(id).success(function(data) {
        $scope.initial = data;
        $scope.initial.publishDate = new Date($scope.initial.publishDate);
        $scope.initial.dueDate = new Date($scope.initial.dueDate);
        $scope.project = angular.copy($scope.initial);
        $scope.reset = function() {
            angular.copy($scope.initial, $scope.project);

        };
        $scope.change = function() {
            angular.copy($scope.project, $scope.initial)
        }
    });



}]);

app.controller('DiscussionController', function() {
    this.discussion = {};
    this.addDiscussion = function(project) {
        // need to change
        this.discussion.author = "Me";
        // this.discussion.createdOn = Date.now();
        this.discussion.createdOn = new Date();
        project.discussions.push(this.discussion);
        this.discussion = {};
    }
});

app.controller('ProjectListController', ['projectList', '$scope', function(projectList, $scope) {
    projectList.success(function(data) {
        $scope.projects = data;
    });
}]);

app.controller('UserController',['createNewUser',function(createNewUser){
    // state = 1 when logged in
    this.state=0;
    this.setState = function(setState) {
        this.state = setState;
    };
    this.isSelected = function(checkState) {
        return this.state == checkState;
    };
    this.query={};
    // formState = 1 in the login form
    this.formState=0;
    this.setFormState = function(setState) {
        this.formState = setState;
    };
    this.isFormSelected = function(checkState) {
        return this.formState == checkState;
    };
    this.submitSignUpForm=function(){
        var data=[];
        data.query=this.query;
        createNewUser.newUser(data).success(function(){
            this.state=1;
        });
    }
}]);




