controllerModule.controller('AccountCtrl', function($scope, Storage, Users) {
    
    $scope.errorMessage = "";
    var context = this;
    
    // By default, the login form is shown (versus the account creation form).
    $scope.create = false;
    
    // Return if there is a session object found in the app.  Does not indicate whether it's expired (no server test).
    $scope.isSession = function() {
        return (Users.getSession() !== null);
    }
    
    // Create an account on the server.
    $scope.createAccount = function (username, email, password) {
        Users.createUser(username, email, password).then(function(result) {
            console.log("createAccount (Controller): Success result = ");
            console.log(result);
            $scope.errorMessage = "";
            // Create a session for the account.
            $scope.authAccount(username, password);
        },
        // Failure
        function(failed) {
            //$scope.accountCreate.$setPristine();
            if (failed.code === "1") {
                console.log("createAccount (Controller): Could not created record on server.");
                $scope.errorMessage = "Error: Could not create your account on the server.";
            }
            else if (failed.code === "2") {
                console.log("createAccount (Controller): Email address already exists on server.");
                $scope.errorMessage = "Error: Account already exists using this email address.";
            }
            else if (failed.code === "3") {
                console.log("createAccount (Controller): Username already exists on server.");
                $scope.errorMessage = "Error: Account already exists using this username.";
            }
            else {
                console.log("createAccount (Controller): Unknown error occurred.  Data = ");
                console.log(failed);
                $scope.errorMessage = "Error: Account could not be created on the server.";
            }
        });         
    }
    
    // Authorize (login to) an account on the server.
    $scope.authAccount = function (username, password) {
        Users.authUser(username, password).then(function(result) {
            console.log("authAccount (Controller): Success result = ");
            console.log(result);
            $scope.errorMessage = ""
        },
        // Failure
        function(failed) {
            //$scope.accountLogin.$setPristine();
            if (failed.code === "1") {
                console.log("authAccount (Controller): Couldn't find username on server.");
                $scope.errorMessage = "Error: Username and/or password credentials do not match.";
            }
            else if (failed.code === "2") {
                console.log("authAccount (Controller): Password hashes do not match.");
                $scope.errorMessage = "Error: Username and/or password credentials do not match.";
            }
            else if (failed.code === "3") {
                console.log("authAccount (Controller): Session could not be created on server.");
                $scope.errorMessage = "Error: Could not login on the server.";
            }
            else {
                console.log("authAccount (Controller): Unknown error occurred.  Data = ");
                console.log(failed);
                $scope.errorMessage = "Error: Cannot reach the server.";
            }
        });         

    }
    
    // Logout on the server.
    $scope.logout = function () {
        Users.logoutUser().then(function(result) {
            console.log("logout (Controller): Success result = ");
            console.log(result);
        },
        // Failure
        function(failed) {
            console.log("logout (Controller): Unknown error occurred.  Data = ");
            console.log(failed);
        });         
    }
    
    $scope.loginAccount = function (email, password) {

        // If anything is not filled in, return now.
        if (!(email && password)) {
            return;
        }

        Storage.loginUser (email, password).then(function(result) {
            console.log("loginAccount (Controller): Success result = ");
            console.log(result);
        },
        // Failure
        function(failed) {
            console.log("loginAccount (Controller): Failed result = ");
            console.log(failed);
            if (failed.reason === 0) {
                console.log("loginAccount (Controller): Account doesn't exist on server.")
            }
            else if (failed.reason === 1) {
                console.log("loginAccount (Controller): Server not reachable.")
            }
            else if (failed.reason === 2) {
                console.log("loginAccount (Controller): Password mismatch.")
            }
            else {
                console.log("loginAccount (Controller): Shouldn't get here.")
            }
        });
    }
    
    $scope.authenticate = function () {

        Storage.authenticateUser().then(function(result) {
            console.log("authenticateUser (Controller): Success result = ");
            console.log(result);
        },
        // Failure
        function(failed) {
            console.log("authenticateUser (Controller): Failed result = ");
            console.log(failed);
            if (failed.reason === 0) {
                console.log("authenticateUser (Controller): No local user object.")
            }
            else if (failed.reason === 1) {
                console.log("authenticateUser (Controller): User record not found on server.")
            }
            else if (failed.reason === 2) {
                console.log("authenticateUser (Controller): Cannot upload user object to server.")
            }
            else if (failed.reason === 3) {
                console.log("authenticateUser (Controller): Password mismatch.")
            }
            else if (failed.reason === 4) {
                console.log("authenticateUser (Controller): Cannot download user object from server.")
            }
            else {
                console.log("authenticateUser (Controller): Shouldn't get here.")
            }
        });
    }

});