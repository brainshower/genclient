controllerModule.controller('NodeCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, Nodes) {

    // Set indicator that loading is not happening (by default)
    $scope.loadingNodes = false;

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    
    $scope.createNode = function (title, body) {
        Nodes.createNode(title, body).then(
            function (success) {
                $scope.newNode.closeModal();
                $scope.findAllNodes();
            },
            function (fail) {
                console.log("createNode (controller):  fail = " + JSON.stringify(fail));
            }
        );  
    }

    $scope.createJob = function (title, body, company) {
        Nodes.createJob(title, body, company).then(
            function (success) {
                $scope.findAllNodes();
            },
            function (fail) {
                console.log("createJob (controller):  fail = " + JSON.stringify(fail));
            }
        );  
    }

    $scope.updateNode = function (nid, title, body) {
        Nodes.updateNode(nid, title, body).then(
            function(success) {
                $scope.findAllNodes();   
                $scope.editNode.closeModal();
            },
            function(fail) {
                console.log("updateNode (controller):  fail = " + JSON.stringify(fail));
            }
        );
    }

    $scope.findAllNodes = function() {
        
        $scope.loadingNodes = true;
        Nodes.findAllNodes().then(
            function(result) {
                // Filter out any "null" nodes
                var nodes = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i] !== null) {
                        nodes.push(result[i]);
                    }
                }
                $scope.allNodes = nodes;
                $scope.loadingNodes = false;
            },
            function(error) {
                $scope.loadingNodes = false;
            }
        );
    }
    
    $scope.deleteNode = function(nid) {
        
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete',
            template: 'Are you sure you want to delete this node?',
        });
        confirmPopup.then(function(res) {
            if(res) {
                Nodes.deleteNode(nid).then(
                    function(result) {
                        console.log("deleteNode (controller):  success = " + JSON.stringify(result));
                        $scope.findAllNodes();   
                    },
                    function(error) {
                    }
                );
            }
        });

    }    

    
    // New node modal
    $ionicModal.fromTemplateUrl('newNodeModal.html', function($ionicModal) {
        
        $scope.newNode = {}
        $scope.newNode.modal = $ionicModal;
        
        $scope.newNode.openModal = function () {
            $scope.newNode.nodeTitle = "";
            $scope.newNode.nodeBody = "";
            $scope.newNode.modal.show();
        };
        
        $scope.newNode.closeModal = function() {
            $scope.newNode.modal.hide();
        }
        
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up',
        focusFirstInput: true,
    });  

    
    // Edit node modal
    $ionicModal.fromTemplateUrl('editNodeModal.html', function($ionicModal) {
        
        $scope.editNode = {}
        $scope.editNode.modal = $ionicModal;
        
        $scope.editNode.openModal = function (nid, title, body) {
            $scope.editNode.nodeNID = nid;
            $scope.editNode.nodeTitle = title;
            $scope.editNode.nodeBody = body;
            $scope.editNode.modal.show();
        };
        
        $scope.editNode.closeModal = function() {
            $scope.editNode.modal.hide();
        }
        
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up',
        focusFirstInput: true,
    });  
});


// Date filter
controllerModule.filter('prettyDate', function() {
    
    return function(input) {
        if (input) {
            var d = new Date(input);
            var date = d.toLocaleDateString();
            var time = d.toLocaleTimeString();
            var out = date + ", " + time;
            return out;
        }
        else {return "";}
    };
  })