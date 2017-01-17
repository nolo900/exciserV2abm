const app = angular.module('excise', ['ui.router','google.places']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/templates/home.html',
            controller: 'homeCtrl',
            controllerAs: '$ctrl'
        });
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '/templates/login.html',
            controller: 'loginCtrl',
            controllerAs: '$ctrl'
        });
    $stateProvider
        .state('signup', {
            url: '/signup',
            templateUrl: '/templates/signup.html',
            controller: 'signupCtrl',
            controllerAs: '$ctrl',
        });

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: '/templates/dashboard.html',
            controller: 'dashboardCtrl',
            controllerAs: '$ctrl',
        });

    $stateProvider
        .state('profile', {
            url: '/profile',
            templateUrl: '/templates/profile.html',
            controller: 'profileCtrl',
            controllerAs: '$ctrl',
        });

    $urlRouterProvider.otherwise("/");
    // $locationProvider.html5Mode({ enabled: true, requireBase: false });
});

// //////////////// SERVICES //////////////////////
app.service('userService', function ($http) {
    console.log('userService is alive!');
    this.authUser = function () {
        return $http.get("/api/auth");
    }
    this.getUsers = function () {
        return $http.get('/api/auth');
    }
    this.getUser = function () {
        return $http.get('/api/auth', id);
    }
    this.updateUser = function (user) {
        return $http.post('/api/auth/:id', user, user._id);
    }

});

app.service('formService', function ($http) {
    console.log('formService is alive');
    this.saveForm = function () {
        return $http.post('/api/forms/:id', form, form._id);
    }
})





app.service('locationService', function ($http) {
    console.log('locationService is alive!');
    this.getLocations = function () {
        return $http.get('/api/locations');
    };
    this.getLocation = function (id) {
        return $http.get('/api/locations', id);
    };
    this.addLocation = function (location) {
        return $http.post('/api/locations', location);
    }
});



////////////// CONTROLLERS ////////////////////////////////////////////////////////
app.controller('navCtrl', function (userService) {
    var vm = this;
    vm.user = {};

    userService.authUser()
        .then(function (res) {
            vm.user = res.data;
            console.log("from Nav Ctrl: ", vm.user);
        })
        .catch(function (err) {
            console.log("navCtrl userService error: ",err);
        })
})

app.controller('homeCtrl', function() {
    console.log('home is here');
    this.title = 'Welcome to Exciser';

});

app.controller('loginCtrl', function($http,$location) {
    console.log('login is here');
    var vm = this;
    vm.title = 'Login';

    vm.login = function () {
        var url = 'http://localhost:3000/login';
        var user = vm.user;

        $http.post(url,user)
            .then(
                function (res) {
                    console.log("success!");
                    $location.path('/profile');
                },
                function (res) {
                    console.log("failure");
                    $location.path('/');
                }
            )

    }
});

app.controller('signupCtrl', function($http,$location) {
    var vm = this;
    vm.title = 'Sign Up';


    vm.signup = function () {
        var url = 'http://localhost:3000/signup';
        var user = vm.user;

        $http.post(url,user)
            .then(
                function (res) {
                    console.log("success!!");
                    $location.path("/profile")
                }, //success
                function (res) {
                    console.log('error!');
                    $location.path('/login');
                } //error
            )
    };
});

app.controller('dashboardCtrl', function ($scope, $http) {
    var vm = $scope;
    vm.title = 'Dashboard';

    console.log(vm.user);

});

app.controller('profileCtrl', function(userService) {
    var vm = this;
    vm.title = 'Profile';
    console.log('Profile is here');

    vm.user = {

    };

    userService.authUser()
        .then(function (res) {
            vm.user = res.data;
            //console.log(vm.user);
        })
        .catch(function (err) {
            console.log("profileCtrl userService error: ",err);
        })

    vm.updateUser = function () {
        userService.updateUser(vm.user)
            .then( function (res) {
                console.log("User Updated", res)
            })
            .catch(function (err) {
                alert('Error: '+ err);
            })
    }

});


app.controller('FormCtrl', function ($scope, $http, $location) {

    $scope.data = {
        estName: 'Default',
        reportMonthYear: '01/2017',
        grossSales: 0,
    };

    $scope.submitForm = function() {
        $http.post('/forms/make/', JSON.stringify($scope.data))
            .then(
                console.log('submitted')
            ).catch(function (err) {
            console.log(err)
        });
    };
});