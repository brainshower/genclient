controllerModule.controller('UserCtrl', function($scope, Roles) {

    // Load all the roles available for assignment.
    $scope.loadAllRoles = function() {
        Roles.getRoles().then(

            function(roleObjects) {
                $scope.roles = [];
                for (var i = 0; i < roleObjects.length; i++) {
                    var role = roleObjects[i];
                    $scope.roles[i] = role.name;
                }
            },

            function(fail) {

            }
        );
    }
    
    // Load all the users and their associated roles.
    $scope.loadAllUsers = function() {
        
        $scope.loadAllRoles();
        
        Roles.getUsers().then(

            function(users) {
                $scope.users = [];
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    console.log("user = " + JSON.stringify(user));
                    $scope.users[i] = user;
                }
            },
            function(fail) {

            }
        );
    }
    
    // Assign a role to a user
    $scope.assignUserRole = function(username, role) {
        
        var user = {username: username};
        
        Roles.assignUserRole(user, role).then (
            
            function(success) {
                $scope.loadAllUsers();
            },
            function (fail) {
                console.log(fail);
            }
        );        
    }

    // Remove a role from a user
    $scope.removeUserRole = function(username, role) {
        
        var user = {username: username};
        
        Roles.removeUserRole(user, role).then (
            
            function(success) {
                $scope.loadAllUsers();
            },
            function (fail) {
                console.log(fail);
            }
        );        
    }
    
     
});

