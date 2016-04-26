'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);
angular.module('Employees', []);
angular.module('Add', []);
angular.module('Project', []);


angular.module('mainApp', [
    'Authentication',
    'Home',
    'Employees',
    'Add',
    'Project',
    'ngRoute',
    'ngCookies',
    'ui.bootstrap'
    // ,'ngAnimate'


])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'Login/View/login.html'
        })

        .when('/', {
            controller: 'HomeController',
            templateUrl: 'Home/View/home.html'
        })

        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'Home/View/home.html',
            activetab: 'home'
        })

        .when('/employee', {
            controller: 'EmployeeController',
            templateUrl: 'Employees/View/employees.html'
        })


        // .when('/employee/add', {
        //     // controller: 'EmployeeAddController',
        //     templateUrl: 'EmployeeAdd/View/add.html'
        // })

         .when('/project', {
            controller: 'ProjectController',
            templateUrl: 'Project/View/project.html'
        })

        .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });

        //added for active nav
        var path = function() { return $location.path();};
                    $rootScope.$watch(path, function(newVal, oldVal){
                    $rootScope.activetab = newVal;
        });


    }]);

