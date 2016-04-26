var tes = angular.module('Project', ['ui.bootstrap']);
tes.controller('ProjectController', ['$scope', '$http', '$modal', '$log', function($scope, $http, $modal, $log) {
    var getProject = function() {
        $http.get('/backend/projects.php').success(function(data) {
            $scope.project = data;
            console.log( $scope.project);
            $scope.editableProjects = angular.copy($scope.project);
        });
    };
    getProject();
    $scope.forsort = 'projectName';
    $scope.reverse = true;


    //This is to create new project and call create modal
    $scope.createModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/New/ProjectAdd/View/create.html',
            controller: 'ModalInstanceCtrl'
        });
        modalInstance.result.then(function(newProject) {
             $http({
                method: 'POST',
                url: '/backend/projectInsert.php',
                data: {"name":newProject.projectName,"client":newProject.client,"startdate":newProject.startdate,"status":newProject.status},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
                if (data == true) {
                    $scope.editableProjects.push(newProject);
                    }
                });
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //This is for update project modal
    $scope.updateModal = function(size, selectedProject) {
        var modalInstance = $modal.open({
            templateUrl: '/New/ProjectAdd/View/edit.html',
            backdrop: 'static',
            controller: function($scope, $modalInstance, prj) {
                $scope.prj = prj;
                $scope.ok = function() {
                    $scope.project = angular.copy($scope.editableProjects);
                     
                     //for update in database
                     $http.post('/backend/projectUpdate.php',{"id":prj.id,"name":prj.projectName,"client":prj.client,"startdate":prj.startdate,
                        "status":prj.status}).
                     success(function(data){
                            if (data == true) {
                                getProject();
                            }
                    });
                    $modalInstance.close($scope.prj);
                };
                $scope.cancel = function() {
                    $scope.editableProjects = angular.copy($scope.project);
                    $modalInstance.dismiss('cancel');
                    getProject();
                };
            },
            size: size,
            resolve: {
                prj: function() {
                    return selectedProject;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };  

//This is to call delete modal and delete selected project
    $scope.remove = function(size, projectRemove) {
        var modalInstance = $modal.open({
            templateUrl: '/New/ProjectAdd/View/delete.html',
            controller: function($scope, $modalInstance) {
                $scope.ok = function() {
                      //delete from database   
                    $http.post('/backend/projectDelete.php',{"name":projectRemove.projectName}).success(function(data){
                        if (data == true) {
                            getProject();
                            }
                    });
                    $modalInstance.close();
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: size,
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

}]);

//This controller is of create modal and used to pass information from the form
tes.controller('ModalInstanceCtrl', function($scope, $modalInstance) {
    $scope.ok = function() {
        $modalInstance.close({
            'id': $scope.id,
            'projectName': $scope.projectName,
            'client': $scope.client,
            'startdate': $scope.startdate,
            'status': $scope.status,
            'option': $scope.option
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});