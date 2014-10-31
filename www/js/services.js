// Prefixes for localstorage
var STORAGEPREFIX = "austintechjobs.";
var AUTHSTORAGE = STORAGEPREFIX + "auth"

// Web API URLs
var SITEPREFIX   = "http://www.msgme.info:3000";
var AUTHAPI      = SITEPREFIX + "/login";

// Node API
var NODEAPI      = SITEPREFIX + "/node";
var NODEAPI_CREATE = NODEAPI;
var NODEAPI_FINDALL = NODEAPI + "/all";
var NODEAPI_FINDID = NODEAPI;
var NODEAPI_UPDATE = NODEAPI + "/update";
var NODEAPI_DELETE = NODEAPI + "/delete";

// Admin Role API
var ROLEAPI      = SITEPREFIX + "/admin/role";
var ROLEAPI_GETROLES = ROLEAPI + "/getroles";
var ROLEAPI_GETUSERS = ROLEAPI + "/getusers";
var ROLEAPI_CREATEROLE = ROLEAPI + "/create";
var ROLEAPI_DELETEROLE = ROLEAPI + "/delete";
var ROLEAPI_CREATEPERMGROUP = ROLEAPI + "/permgroup/create";
var ROLEAPI_DELETEPERMGROUP = ROLEAPI + "/permgroup/delete";
var ROLEAPI_SETPERM = ROLEAPI + "/perm/set";
var ROLEAPI_DELETEPERM = ROLEAPI + "/perm/delete";
var ROLEAPI_ASSIGNUSERROLE = ROLEAPI + "/user/assign";
var ROLEAPI_REMOVEUSERROLE = ROLEAPI + "/user/remove";

// OLD STUFF
var JOBSAPI      = SITEPREFIX + "/jobs";
var COMPANIESAPI = SITEPREFIX + "/companies";
var SKILLSAPI    = SITEPREFIX + "/skills";
var USERSAPI     = SITEPREFIX + "/users";
var USERSEMAIL   = USERSAPI + "/email"; // Check for user by email address

var USERSTORAGE = STORAGEPREFIX + "user";
var SKILLSPREFIX = STORAGEPREFIX + "skills.";




// Starter Services Module for Angular
//
angular.module('starter.services', [])


// User/Authentication API to node server.
.factory('Nodes', function($q, $http, Users) {

    return {

        // Handle session authentication for actions that require user accounts.
        _authHandler : function (action, successCallback, failCallback) {

            // If there's an existing session, attempt the action.
            var session = Users.getSession();
            if (session) {
                console.log("Node._authHandler: Have session " + JSON.stringify(session));
                // Call action and if successful, jump out to the success function.  We're done.
                action(session).then(
                    function (success) {
                        console.log("Node._authHandler: Success callback, success = " + JSON.stringify(success));
                        successCallback(success);
                    },
                    // Otherwise, see if the fail was due to authentication.  If so, re-authenticate.
                    function (fail) {
                        if (fail.type === "auth") {
                            console.log("Node._authHandler: Re-auth starting.");
                            // Call User service to reauthenticate session.
                            Users.reAuthUser(session).then(
                                // Re-authentication succesful, so try the action again.
                                function (newSession) {
                                    console.log("Node._authHandler: Successful re-auth. New session = " + JSON.stringify(newSession) );
                                    action(newSession).then(
                                        function (success3) {
                                            console.log("Node._authHandler: Second action attempt success = " + JSON.stringify(success3) );
                                            successCallback(success3);
                                        },
                                        // Re-authentication didn't help, so we're done.
                                        function (fail3) {
                                            console.log("Node._authHandler: Second action attempt fail = " + JSON.stringify(fail3) );
                                            failCallback(fail3);
                                        }
                                    );
                                },
                                // Re-authentication failed, so we're done.
                                function (fail2) {
                                    console.log("Node._authHandler: Failed re-auth.  fail2 = " + JSON.stringify(fail2) );
                                    failCallback(fail);
                                }
                            ); // reAuth.then
                        }
                        else {
                            // Unknown error - cannot reauthenticate.
                            console.log("Node._authHandler: Failed first attempt at action.  fail = " + JSON.stringify(fail) );
                            failCallback(fail);
                        }
                    }
                ); // action.then
            }
            else {
                console.log("Node._authHandler: No session found.");
                // No session exists (therefore no userid or pwd info), user must login so we must call failCallback.
                failCallback();
            }
        },


        // Create a node passing in a title and optional body.
        createNode : function(title, body) {

            var createNodeDeferred = $q.defer();
            
            this._authHandler(
                function(session) {
                    var node = {
                        title: title,
                        body: body ? body : null,
                    };
                    var data = {
                        session: session,
                        data: node,
                    }

                    var deferred = $q.defer();
                    
                    console.log("Node.createNode: title " + title + ", body " + body + ", session " + JSON.stringify(session));

                    $http.post(NODEAPI_CREATE, data).success(function (data, status, headers, config) {
                        console.log("Node.createNode: Resolved data:");
                        console.log(data);
                        deferred.resolve(data);
                    }).error(function(data, status, headers, config) {
                        console.log("Node.createNode: Rejected data:");
                        console.log(data);
                        deferred.reject(data);
                    });
                    
                    return deferred.promise;
                    
                },
                function (success) {
                    console.log("Node.createNode: Success callback called.  success = " + JSON.stringify(success));
                    createNodeDeferred.resolve(success);
                },
                function (fail) {
                    console.log("Node.createNode: Fail callback called.  fail = " + JSON.stringify(fail));
                    createNodeDeferred.reject(fail);
                }
            );

            return createNodeDeferred.promise;

        },

        
        // Update a node passing in a title and optional body.
        updateNode : function(nid, title, body) {

            var nodeDeferred = $q.defer();
            
            this._authHandler(
                function(session) {

                    var deferred = $q.defer();
                    var putData = {
                        session: session,
                        data: {},
                    }

                    if (title) {
                        putData.data.title = title;   
                    }
                    if (body) {
                        putData.data.body = body;
                    }

                    $http.post(NODEAPI_UPDATE+"/"+nid, putData).success(function (data, status, headers, config) {
                        console.log("Node.updateNode: Resolved data:");
                        console.log(data);
                        deferred.resolve(data);
                    }).error(function(data, status, headers, config) {
                        console.log("Node.updateNode: Rejected data:");
                        console.log(data);
                        deferred.reject(data);
                    });

                    return deferred.promise;
                    
                },
                function (success) {
                    console.log("Node.updateNode: Success callback called.  success = " + JSON.stringify(success));
                    nodeDeferred.resolve(success);
                },
                function (fail) {
                    console.log("Node.updateNode: Fail callback called.  fail = " + JSON.stringify(fail));
                    nodeDeferred.reject(fail);
                }
            );

            return nodeDeferred.promise;
        },

        
        // Delete a node passing in a node ID
        deleteNode : function(nid) {

            var nodeDeferred = $q.defer();
            
            this._authHandler(
                function(session) {

                    var postData = {
                        session: session,
                    }

                    var deferred = $q.defer();

                    $http.post(NODEAPI_DELETE+"/"+nid, postData).success(function (data, status, headers, config) {
                        console.log("Node.deleteNode: Resolved data:");
                        console.log(data);
                        deferred.resolve(data);
                    }).error(function(data, status, headers, config) {
                        console.log("Node.deleteNode: Rejected data:");
                        console.log(data);
                        deferred.reject(data);
                    });

                    return deferred.promise;
                    
                },
                function (success) {
                    console.log("Node.deleteNode: Success callback called.  success = " + JSON.stringify(success));
                    nodeDeferred.resolve(success);
                },
                function (fail) {
                    console.log("Node.deleteNode: Fail callback called.  fail = " + JSON.stringify(fail));
                    nodeDeferred.reject(fail);
                }
            );

            return nodeDeferred.promise;
        },

        
        // List all nodes
        findAllNodes : function() {
            
            var nodeDeferred = $q.defer();
            
            this._authHandler(
                function(session) {

                    var data = {
                        session: session,
                    }

                    var deferred = $q.defer();

                    console.log("Node.findAllNodes:");

                    $http.post(NODEAPI_FINDALL, data).success(function (data, status, headers, config) {
                        console.log("Node.findAllNodes: Resolved data:");
                        console.log(data);
                        deferred.resolve(data);
                    }).error(function(data, status, headers, config) {
                        console.log("Node.findAllNodes: Rejected data:");
                        console.log(data);
                        deferred.reject(data);
                    });

                    return deferred.promise;
                    
                },
                function (success) {
                    console.log("Node.findAllNodes: Success callback called.  success = " + JSON.stringify(success));
                    nodeDeferred.resolve(success);
                },
                function (fail) {
                    console.log("Node.findAllNodes: Fail callback called.  fail = " + JSON.stringify(fail));
                    nodeDeferred.reject(fail);
                }
            );

            return nodeDeferred.promise;
        },
        
    } // return
})


// User/Authentication API to node server.
.factory('Users', function($q, $http) {

    return {
        // Create a user account on the server; pass in username + plain text password
        createUser : function(username, email, password) {
            console.log("Users.createUser: " + username + ", " + email);
            var passwordHash = CryptoJS.SHA256(password);
            var passwordHashHex = CryptoJS.enc.Hex.stringify(passwordHash);
            var deferred = $q.defer();
            var user = {
              u: username,
              e: email,
              p: passwordHashHex,
            };

            $http.post(AUTHAPI+"/create", user).success(function (data, status, headers, config) {
                console.log("Users.createUser: Resolved data:");
                console.log(data);
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                console.log("Users.createUser: Rejected data:");
                console.log(data);
                deferred.reject(data);
            });

            return deferred.promise;
        },
      
        // Authenticate a user on the server by passing in username + plain text password, returning session object.
        authUser : function(username, password) {
            console.log("Users.authUser: " + username);
            var passwordHash = CryptoJS.SHA256(password);
            var passwordHashHex = CryptoJS.enc.Hex.stringify(passwordHash);
            var user = {
                u: username,
                p: passwordHashHex,
            };
            var deferred = $q.defer();          

            $http.post(AUTHAPI+"/auth", user).success(function (data, status, headers, config) {  
                console.log("Users.authUser: Resolved data:");
                console.log(data);
                // Next, put authentication object in location storage.
                window.localStorage[AUTHSTORAGE] = JSON.stringify({uid : data.uid, token : data.token});
                deferred.resolve(data);
                
            }).error(function(data, status, headers, config) {
                console.log("Users.authUser: Rejected data:");
                console.log(data);
                // Clear out any authentication object in location storage.
                window.localStorage.removeItem(AUTHSTORAGE);
                deferred.reject(data);
            });

            return deferred.promise;
        },

        // Reauthenticate a user on the server by passing in current session object (whether expired or not).  
        reAuthUser : function(session) {
            console.log("Users.reAuthUser: ");

            var deferred = $q.defer();          

            $http.post(AUTHAPI+"/reauth", session).success(function (data, status, headers, config) {  
                console.log("Users.reauthUser: Resolved data:");
                console.log(data);
                // Next, put authentication object in location storage.
                window.localStorage[AUTHSTORAGE] = JSON.stringify({uid : data.uid, token : data.token});
                deferred.resolve(data);
                
            }).error(function(data, status, headers, config) {
                console.log("Users.reauthUser: Rejected data:");
                console.log(data);
                // Clear out any authentication object in location storage.
                window.localStorage.removeItem(AUTHSTORAGE);
                deferred.reject(data);
            });

            return deferred.promise;
        },
        
        // Logout the current user, if exists.  Check for local session object, and remove it from the server.
        logoutUser : function() {
            var deferred = $q.defer();
            var authStr = window.localStorage[AUTHSTORAGE];
            if (authStr) {
                var authObj = JSON.parse(authStr);
                if ((authObj !== undefined) && (authObj.uid !== undefined) && (authObj.token !== undefined)) {

                    $http.post(AUTHAPI+"/logout", authObj).success(function (data, status, headers, config) {  
                        console.log("Users.logoutUser: Success.  Return data =");
                        console.log(data);
                        // Remove object from local storage.
                        window.localStorage.removeItem(AUTHSTORAGE);
                        deferred.resolve(data);

                    }).error(function(data, status, headers, config) {
                        console.log("Users.logoutUser: Error.  Return data =");
                        console.log(data);
                        // Remove object from local storage.
                        window.localStorage.removeItem(AUTHSTORAGE);
                        deferred.reject(data);
                    });
                }
            }
            
            return deferred.promise;
        },
      
        // Return auth object if there is a stored session token, meaning we have at least a 
        // previously authenticated user.  The token may or may not be expired or valid.  Returns null otherwise.
        getSession : function() {
            var authStr = window.localStorage[AUTHSTORAGE];
            if (authStr) {
                var authObj = JSON.parse(authStr);
                return ((authObj !== undefined) && (authObj.uid !== undefined) && (authObj.token !== undefined)) ? authObj : null;
            }
            else {
                return null;
            }
        },
    }
})


// Manages all role commands to server.
.factory('Roles', function($q, $http) {

    return {
        getRoles : function() {
            var deferred = $q.defer();

            $http.get(ROLEAPI_GETROLES).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        getUsers : function() {
            var deferred = $q.defer();

            $http.get(ROLEAPI_GETUSERS).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        createRole : function(roleName) {
            
            var postData = {
                role: roleName,
            };
            
            var deferred = $q.defer();

            $http.post(ROLEAPI_CREATEROLE, postData).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        deleteRole : function(roleName) {
            
            var postData = {
                role: roleName,
            };
            
            var deferred = $q.defer();

            $http.post(ROLEAPI_DELETEROLE, postData).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        createPermGroup : function(roleName, permGroup) {
            
            var postData = {
                role: roleName,
                permGroup: permGroup,
            };
            
            var deferred = $q.defer();

            $http.post(ROLEAPI_CREATEPERMGROUP, postData).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        deletePermGroup : function(roleName, permGroup) {
            
            var postData = {
                role: roleName,
                permGroup: permGroup,
            };
            
            var deferred = $q.defer();

            $http.post(ROLEAPI_DELETEPERMGROUP, postData).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        setPerm : function(role, permGroup, perm, value) {
            
            var postData = {
                role: role,
                permGroup: permGroup,
                permName: perm,
                permValue: value,
            };
            
            var deferred = $q.defer();

            $http.post(ROLEAPI_SETPERM, postData).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        deletePerm : function(role, permGroup, perm) {
            
            var postData = {
                role: role,
                permGroup: permGroup,
                permName: perm,
            };
            
            var deferred = $q.defer();

            $http.post(ROLEAPI_DELETEPERM, postData).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        assignUserRole : function(user, role) {
            
            var postData = {
                user: user,
                role: role,
            };
            
            var deferred = $q.defer();

            $http.post(ROLEAPI_ASSIGNUSERROLE, postData).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

        removeUserRole : function(user, role) {
            
            var postData = {
                user: user,
                role: role,
            };
            
            var deferred = $q.defer();

            $http.post(ROLEAPI_REMOVEUSERROLE, postData).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        },

    }
})


// Pull companies from server.
.factory('Companies', function($q, $http) {

    return {
        all : function() {
            var deferred = $q.defer();

            $http.get(COMPANIESAPI).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject({});
            });

            return deferred.promise;
        },
        get : function(companyid) {
            var deferred = $q.defer();

            $http.get(COMPANIESAPI+"/"+companyid).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject({});
            });

            return deferred.promise;
        }
    }
})


// Pull skills from server.
.factory('Skills', function($q, $http) {

    return {
        all : function() {
            var deferred = $q.defer();

            $http.get(SKILLSAPI).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject({});
            });

            return deferred.promise;
        },
        get : function(id) {
            var deferred = $q.defer();

            $http.get(SKILLSAPI+"/"+id).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject({});
            });

            return deferred.promise;
        }
    }
})

// Manage local storage
.factory('Storage', function($q, $http) {

    return {

        // Check on the server for an existing user account by email addres
        _remoteCheckUser : function(plainEmail) {
            
            var deferred = $q.defer();

            $http.get(USERSEMAIL+"/"+plainEmail)
            .success(function (data, status, headers, config) {
                // Data array will be empty if not found, or contain the user record if found on the server.
                console.log("_remoteCheckUser: Get from server successful.  Data = ");
                console.log(data);
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config) {
                // Happens when couldn't connect, or other network issue.
                console.log("_remoteCheckUser: Unsuccessful get from server.  Data = ");
                console.log(data);
                deferred.reject({});
            });

            return deferred.promise;
        },

        
        // Check on the server for an existing user account by email addres
        _remoteCheckUserID : function(userID) {
            
            var deferred = $q.defer();

            $http.get(USERSAPI+"/"+userID)
            .success(function (data, status, headers, config) {
                // Data array will be empty if not found, or contain the user record if found on the server.
                console.log("_remoteCheckUserID: Get from server successful.  Data = ");
                console.log(data);
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config) {
                // Happens when couldn't connect, or other network issue.
                console.log("_remoteCheckUserID: Unsuccessful get from server.  Data = ");
                console.log(data);
                deferred.reject({});
            });

            return deferred.promise;
        },

        
        // Saves a new user object to the server.
        _saveUserToServer : function (user) {
            var deferred = $q.defer();

            $http.post(USERSAPI, user).success(function (data, status, headers, config) {
                console.log("_saveUserToServer: User saved on server.");
                // Successful.
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config) {
                // Connection error doing the POST to the server.
                console.log("_saveUserToServer: Save error.");
                deferred.reject(data);
            });

            return deferred.promise;
        }, // _saveUserToServer

        
        // Updates an existing user object to the server.  Pass in the user object to be sent.
        _updateUserOnServer : function (user) {
            var deferred = $q.defer();
            var userID = user._id;  // Save the user ID.
            var userCopy = JSON.parse(JSON.stringify(user));  // Copy the user object.
            userCopy._id = undefined;   // Zero out the ID field of the user object.
            $http.put(USERSAPI+"/"+userID, userCopy).success(function (data, status, headers, config) {
                console.log("_updateUserOnServer: User saved on server. Data = ");
                console.log(data);
                // Update successful.
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config) {
                // Connection error doing the POST to the server.
                console.log("_updateUserOnServer: Update error.");
                deferred.reject(data);
            });

            return deferred.promise;
        }, // _updateUserOnServer

        
        // Create a user object and store on the server.  If successful, the new user object
        // is stored in localStorage.
        _createUserOnServer : function (plainEmail, plainPassword) {
            // Create the user object.
            var hashPassword = CryptoJS.MD5(plainPassword).words.toString();
            var user = {
                _id : undefined,
                email : plainEmail,
                pwdHash : hashPassword,
                firstName : undefined,
                lastName : undefined,
                skills : Array(),
                companies : Array(),
            }

            var deferred = $q.defer();
            var promise = this._saveUserToServer(user).then(function(data) {
                console.log("_createUserOnServer: User created.");
                // Account creation successful.
                deferred.resolve(data);
                return deferred.promise
            },
            function(faildata) {
                // Connection error doing the POST to the server.
                console.log("_createUserOnServer: Creation error.");
                deferred.reject(data);
                return deferred.promise
            });
            return promise;
        }, // _createUserOnServer

        
        // Create the new user object.  Hash function comes from: https://code.google.com/p/crypto-js/#MD5
        // Resulting user object from database is stored in localStorage.
        createUser : function(plainEmail, plainPassword) {
            // First, check if the email address exists on the server.
            var that = this;
            var deferred = $q.defer();
            var promise1 = this._remoteCheckUser(plainEmail).then(function(result) {
                if (result.length == 0) {
                    // Server reachable, and email does not exist on server.  Can create a new user account.
                    that._createUserOnServer(plainEmail, plainPassword).then(function(result2) {
                        console.log("createUser: Successful creation of user account.  Result = ");
                        console.log(result2);
                        // Store user object locally.
                        window.localStorage[USERSTORAGE] = JSON.stringify(result);
                        deferred.resolve(result2);
                        return deferred.promise;
                    });
                }
                else {
                    // Server reachable, but email exists on server.  Cannot create account.
                    console.log("createUser: Email already exists on server.");
                    deferred.reject({reason : 0});
                    return deferred.promise;
                }
            }, 
            function(reason) {
                // Server unreachable.  Cannot create account.
                console.log("createUser: Failed due to _remoteCheckUser rejected promise. Reason = ");
                console.log(reason);
                deferred.reject({reason : 1});
                return deferred.promise;
            });
            return promise1;
        }, // createUser
        
        // Login a user account: Check if on server, and if so, check password.
        loginUser : function(plainEmail, plainPassword) {
            // First, check if the email address exists on the server.
            var deferred = $q.defer();
            var promise1 = this._remoteCheckUser(plainEmail).then(function(result) {
                if (result.length == 0) {
                    // Server reachable, but email does not exist on server.  Cannot login.
                    console.log("loginUser: Email does not exist on server.");
                    deferred.reject({reason : 0});
                    return deferred.promise;
                }
                else {
                    // Found email address.
                    console.log("loginUser: Email found.  Result = ");
                    console.log(result);
                    var hashPassword = CryptoJS.MD5(plainPassword).words.toString();
                    if (hashPassword === result.pwdHash) {
                        console.log("loginUser: Email found on server, password match.  Login successful.");
                        // Store user object locally.
                        window.localStorage[USERSTORAGE] = JSON.stringify(result);
                        deferred.resolve(result);
                        return deferred.promise;
                    } else {
                        console.log("loginUser: Email found on server, password mismatch. Login unsuccessful.");
                        deferred.reject({reason : 2});
                        return deferred.promise;
                    }
                }
            }, 
            function(reason) {
                // Server unreachable.  Cannot authenticate account.
                console.log("loginUser: Failed due to _remoteCheckUser rejected promise. Reason = ");
                console.log(reason);
                deferred.reject({reason : 1});
                return deferred.promise;
            });
            return promise1;

        }, // loginUser


        // Authenticate a user: Given a user record already in localStorage, authenticate password on server, and sync up user object.
        authenticateUser : function() {
            var deferred = $q.defer();
            var that = this;
            // First, check if there's a user object in local storage.  If not, we're done.
            if (!window.localStorage[USERSTORAGE]) {
                console.log("authenticateUser: No local user object. Cannot proceed.");
                deferred.reject({reason : 0});  // No local user object.
                return deferred.promise;
            }
            // Get the user object.
            var user = JSON.parse(window.localStorage[USERSTORAGE]);
            // Check if the user object is still on the server.
            var promise1 = this._remoteCheckUserID(user._id).then(function(result) {
                if (result.length == 0) {
                    // Server reachable, but user ID does not exist on server.  Cannot authenticate.
                    console.log("authenticateUser: User ID does not exist on server.");
                    deferred.reject({reason : 1});  // User record not on server.
                    return deferred.promise;
                }
                else {
                    // Found user record address.
                    console.log("authenticateUser: User record found on server.  Result = ");
                    console.log(result);
                    if (user.pwdHash === result.pwdHash) {
                        console.log("authenticateUser: Passwords match.");
                        
                        // Upload the local user record to the server.
                        var promise2 = that._updateUserOnServer(user).then(function(data) {
                            console.log("authenticateUser: User object successfully updated on server. Data = ");
                            console.log(data);
                            deferred.resolve(data);
                            return deferred.promise;
                        },
                        function(faildata) {
                            // Connection error doing the POST to the server.
                            console.log("authenticateUser: Update connection error.");
                            deferred.reject({reason : 2});  // SAVE Connection error to server.
                            return deferred.promise;
                        });
                        return promise2;

                    } else {
                        console.log("authenticateUser: User ID found on server, password mismatch. Unsuccessful.");
                        deferred.reject({reason : 3}); // Password mismatch
                        return deferred.promise;
                    }
                }
            }, 
            function(reason) {
                // Server unreachable.  Cannot authenticate account.
                console.log("authenticateUser: Cannot reach server to download user object.");
                console.log(reason);
                deferred.reject({reason : 4});  // GET Connection error to server.
                return deferred.promise;
            });
            return promise1;

        }, // authenticateUser

        
        // Check if the user has a skill (by skill ID)?
        hasUserSkill : function(skillId) {
            var user = JSON.parse(window.localStorage[USERSTORAGE]);
            return _.contains(user.skills, skillId);
        },
        
        
        // Set the skill ID for the user be enabled (true) or disabled (false).
        setUserSkill : function(skillId, enabled) {
            var user = JSON.parse(window.localStorage[USERSTORAGE]);  // Load the user from localStorage.
            if (enabled) {
                user.skills.push(skillId);
            } 
            else {
                _.remove(user.skills, function(num) {return num == skillId;});
            }
            window.localStorage[USERSTORAGE] = JSON.stringify(user);  // Save the user back to localStorage.
            console.log("Storage.setSkill user = ");
            console.log(user);
        },

    }
});
