app.factory('projectDetail', ['$http', function($http) {
    return {
        getProject: function(id) {
            return $http.get('/api/project_detail/id=' + id)
                .success(function(data) {
                    return data;
                })
                .error(function(err) {
                    return err;
                });
        }
    };
}]);
app.factory('projectList', ['$http', function($http) {
    return $http.get('/api/project_list')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });
}]);

app.factory('createNewUser', ['$http', function($http) {
    return {
        newUser: function(data) {
            $http.put('/api/createUser',data)
                .success(function(data) {
                    return data;
                })
                .error(function(err) {
                    return err;
                });
        }
    };
}]);

// check if logged in
app.factory('UserService', [function() {
    var sdo = {
        isLogged: false,
        username: '',
    };
    return sdo
}]);


app.controller('loginCtrl', ['$scope', '$http', 'UserService', function($scope, $http, User) {
    $scope.login = function() {
        // var config();
        $http(config)
            .success(function(data, status, headers, config) {
                if (data.status) {
                    // successful login
                    User.isLogged = true;
                    User.username = data.username;
                } else {
                    User.isLogged = false;
                    User.username = "";
                }
            })
            .error(function(data, status, headers, congig) {
                User.isLogged = false;
                User.username = "";
            })
    }
}]);
