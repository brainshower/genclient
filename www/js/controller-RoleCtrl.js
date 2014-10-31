controllerModule.controller('RoleCtrl', function($scope, Roles, $ionicModal, $ionicPopup) {

    // Set indicator that loading is not happening (by default)
    $scope.loadingRoles = false;

    // Load all the roles and populate the role/permgroup/perm listing
    $scope.loadAllRoles = function() {
        
        $scope.loadingRoles = true;
        Roles.getRoles().then(

            function(roleObjects) {
                $scope.roles = [];
                for (var i = 0; i < roleObjects.length; i++) {
                    var role = roleObjects[i];
                    console.log("role = " + JSON.stringify(role));
                    $scope.roles[i] = role;
                }
                $scope.loadingRoles = false;
            },

            function(fail) {
                $scope.loadingRoles = false;
            }
        );
    }
    
    // Create a role
    $scope.createRole = function(role) {
        
        Roles.createRole(role).then (
            
            function(success) {
                $scope.loadAllRoles();
                $scope.newRole.closeModal();
            },
            function (fail) {
                console.log(fail);
            }
        );        
    }

    // Delete a role
    $scope.deleteRole = function(role) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Group',
            template: 'Are you sure you want to delete the role "' + role + '"',
        });
        confirmPopup.then(function(res) {
            if(res) {
                Roles.deleteRole(role).then (

                    function(success) {
                        $scope.loadAllRoles();
                    },
                    function (fail) {
                        console.log(fail);
                    }
                );        
            }
        });
    }
    
    // Create a permissions group
    $scope.createPermGroup = function(role, permGroup) {
        
        Roles.createPermGroup(role, permGroup).then (
            
            function(success) {
                $scope.loadAllRoles();
                $scope.newPermGroup.closeModal();
            },
            function (fail) {
                console.log(fail);
            }
        );
    }

    // Delete a permissions group
    $scope.deletePermGroup = function(role, permGroup) {
        
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Group',
            template: 'Are you sure you want to delete the group "' + permGroup + '"',
        });
        confirmPopup.then(function(res) {
            if(res) {
                Roles.deletePermGroup(role, permGroup).then (

                    function(success) {
                        $scope.loadAllRoles();
                    },
                    function (fail) {
                        console.log(fail);
                    }
                );
            }
        });
    }
    
    // Create a permission.
    $scope.createPerm = function(role, permGroup, perm) {
        
        Roles.setPerm(role, permGroup, perm, false).then (
            
            function(success) {
                $scope.newPerm.closeModal();
                $scope.loadAllRoles();
            },
            function (fail) {
                console.log(fail);
            }
        );
    }
    
    
    // Set a permission value within a role & permission group.
    $scope.setPerm = function(role, permGroup, perm, value) {
        
        Roles.setPerm(role.name, permGroup, perm, value).then (
            
            function(success) {
                role.permGroups[permGroup][perm] = value;
            },
            function (fail) {
                console.log(fail);
            }
        );        
    }

    
    // Delete a permission within a role & permission group.
    $scope.deletePerm = function(role, permGroup, perm) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Permission',
            template: 'Are you sure you want to delete the permission "' + perm + '"',
        });
        confirmPopup.then(function(res) {
            if(res) {
                Roles.deletePerm(role, permGroup, perm).then (

                    function(success) {
                        $scope.loadAllRoles();
                    },
                    function (fail) {
                        console.log(fail);
                    }
                );   
            }
        });
    }

    
    // New role modal
    $ionicModal.fromTemplateUrl('newRoleModal.html', function($ionicModal) {
        
        $scope.newRole = {}
        $scope.newRole.modal = $ionicModal;
        
        $scope.newRole.openModal = function () {
            $scope.newRole.roleName = "";
            $scope.newRole.modal.show();
        };
        
        $scope.newRole.closeModal = function() {
            $scope.newRole.modal.hide();
        }

        
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up',
        focusFirstInput: true,
    });  
    
    
    // New permission group modal
    $ionicModal.fromTemplateUrl('newPermGroupModal.html', function($ionicModal) {
        
        $scope.newPermGroup = {};
        $scope.newPermGroup.modal = $ionicModal;
        
        $scope.newPermGroup.openModal = function (roleName) {
            $scope.newPermGroup.roleName = roleName;
            $scope.newPermGroup.permGroupName = "";
            $scope.newPermGroup.modal.show();
        };
        
        $scope.newPermGroup.closeModal = function() {
            $scope.newPermGroup.modal.hide();
        }
        
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up',
        focusFirstInput: true,
    });  

    
    // New permission modal
    $ionicModal.fromTemplateUrl('newPermModal.html', function($ionicModal) {
        
        $scope.newPerm = {};
        $scope.newPerm.modal = $ionicModal;
        
        $scope.newPerm.openModal = function (roleName, permGroupName) {
            $scope.newPerm.roleName = roleName;
            $scope.newPerm.permGroupName = permGroupName;
            $scope.newPerm.permName = "";
            $scope.newPerm.modal.show();
        };
        
        $scope.newPerm.closeModal = function() {
            $scope.newPerm.modal.hide();
        }
        
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up',
        focusFirstInput: true,
    });  
     
});

