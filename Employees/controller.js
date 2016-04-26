var tes = angular.module('Employees', ['ui.bootstrap']);
tes.controller('EmployeeController', ['$scope', '$http', '$modal', '$log', function($scope, $http, $modal, $log) {
    var test = function() {
        //for reading from json file for test, we have test.json
        $http.get('/backend/employees.php').success(function(data) {
            $scope.employees = data;
            console.log($scope.employees);
            $scope.editableEmployees = angular.copy($scope.employees);
        });

    };
    test();
    $scope.forsort = 'Contact';
    $scope.reverse = true;


    //To call server in specific time 
    // $interval(function(){
    //     test();
    // },300);


    //This is to create new employee and call create modal
    $scope.createModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/New/EmployeeAdd/View/create.html',
            controller: 'CreatEmpCtrl'
        });
        modalInstance.result.then(function(newUser) {

            //front-end display only
            //console.log(newUser);
            // $scope.editableEmployees.push(newUser);

            console.log(newUser);
            // $http.post('/backend/insert.php',
            //     {"name":newUser.Name,"designation":newUser.Designation,"contact":newUser.Contact,"email":newUser.Email,"address":newUser.Address})

            // inserting into the database
            $http({
                method: 'POST',
                url: '/backend/insert.php',
                data: {"name":newUser.Name,"designation":newUser.Designation,"contact":newUser.Contact,"email":newUser.Email,"address":newUser.Address},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })

            .success(function(data){
                if (data == true) {
                    console.log("m here");

                    //not the best way 
                        //test();

                        //alternate way but doesn't refreshes
                         // $scope.editableEmployees.push({"name":newUser.Name,"designation":newUser.Designation,"contact":newUser.Contact,"email":newUser.Email,"address":newUser.Address});
                         // console.log($scope.editableEmployees);

                         // client side new user update
                         $scope.editableEmployees.push(newUser);
                }
                });
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

     //This is for update employee modal
    $scope.updateModal = function(size, selectedEmployee) {
        var modalInstance = $modal.open({
            templateUrl: '/New/EmployeeAdd/View/edit.html',
            backdrop: 'static',
            controller: function($scope, $modalInstance, emp) {
                $scope.emp = emp;
                $scope.ok = function() {
                     $scope.employees = angular.copy($scope.editableEmployees);
                     
                     //for update in database
                     $http.post('/backend/update.php',{"id":emp.Id,"name":emp.Name,"designation":emp.Designation,"contact":emp.Contact,
                        "email":emp.Email,"address":emp.Address}).
                     success(function(data){
                            $scope.show_form = true;
                            if (data == true) {
                                test();
                            }
                    });
                    $modalInstance.close($scope.emp);
                };
                $scope.cancel = function() {
                    $scope.editableEmployees = angular.copy($scope.employees);
                    $modalInstance.dismiss('cancel');
                    test();
                };
            },
            size: size,
            resolve: {
                emp: function() {
                    return selectedEmployee;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


    //This is for update employee modal
    $scope.watchModal = function(size, watchSelectedEmployee) {
        var modalInstance = $modal.open({
            templateUrl: '/New/EmployeeAdd/View/watch.html',
            backdrop: 'static',
            controller: function($scope, $modalInstance, empWatch) {
                $scope.empWatch = empWatch;
                $scope.ok = function() {
                     $scope.employees = angular.copy($scope.editableEmployees);
                      console.log('m called at watch');
                    $modalInstance.close($scope.empWatch);
                    test();

                };
                $scope.cancel = function() {
                    $scope.editableEmployees = angular.copy($scope.employees);
                    $modalInstance.dismiss('cancel');
                    test();
                };
            },
            size: size,
            resolve: {
                empWatch: function() {
                    return watchSelectedEmployee;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

   

//This is to call delete modal and delete selected employee
    $scope.remove = function(size, empRemove) {
        console.log(empRemove.Name);
        //var index = this.editableEmployees.indexOf(empRemove);
        // var anotherTest = function() {
        //     $scope.editableEmployees.splice(index, 1);
        // }

        var modalInstance = $modal.open({
            templateUrl: '/New/EmployeeAdd/View/delete.html',
            controller: function($scope, $modalInstance) {
                $scope.ok = function() {
                    // anotherTest();
                    console.log(empRemove.Name);

                     //delete from database   
                    $http.post('/backend/delete.php',{"name":empRemove.Name}).success(function(data){
                        console.log(data);
                        if (data == true) {
                            test();
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
tes.controller('CreatEmpCtrl', function($scope, $modalInstance) {
    $scope.ok = function() {
        $modalInstance.close({
            'Name': $scope.name,
            'Designation': $scope.designation,
            'Contact': $scope.contact,
            'Email': $scope.email,
            'Address': $scope.address,
            'Option': $scope.option
        });
        // console.log($scope.Name);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});



//File upload
tes.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
            $scope.uploadFile = function(n){
           // var s= $scope.empWatch.name;       
               var file = $scope.myFile;
               var uploadUrl = "/backend/upload.php";
               fileUpload.uploadFileToUrl(file, uploadUrl, n);               
               };          
         }]);

tes.service('fileUpload', ['$http', '$location','$route', function ($http, $location, $route) {
            this.uploadFileToUrl = function(file, uploadUrl, n){
               var fd = new FormData();
               fd.append('file', file);
               fd.append('guy', n);
            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })  

               .success(function(){
                   console.log('m at sevice');
                  $route.reload();
               })
            
               .error(function(){
               });
            }
         }]);



//orignal one
tes.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope.$parent, element[0].files[0]);
                     });
                  });
               }
            };
         }]);

 function PreviewImage() {
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);

        oFReader.onload = function (oFREvent) {
            document.getElementById("uploadPreview").src = oFREvent.target.result;
        };
    };


