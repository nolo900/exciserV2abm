const app = angular.module('excise', ['ui.router', 'chart.js', 'ngAnimate', 'google.places']);

app.config(function ($urlRouterProvider, $stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl',
            controllerAs: 'ctrl'
        });
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl',
            controllerAs: 'ctrl'
        });
    $stateProvider
        .state('dashboard', {
            templateUrl: 'templates/dashboard.html',
            controller: 'dashboardCtrl',
            controllerAs: 'ctrl'
        })
        .state('dashboard.home', {
            url: '/dashboard',
            templateUrl: 'components/dashboard.home.html',
        })
        .state('dashboard.profile', {
            url: '/profile',
            templateUrl: 'components/dashboard.profile.html',
        })
        .state('dashboard.logout', {
            url: '/logout',
            templateUrl: 'components/dashboard.logout.html',
        });
    $urlRouterProvider.otherwise('/');
});

////////////////// SERVICES ////////////////////////////////////////////////////////
app.service('userService', function ($http) {
    console.log('userService is alive!');
    // this.authUser = function () {
    //     return $http.get("/api/users");
    // };
    // this.getUsers = function () {
    //     return $http.get('/api/users');
    // };
    // this.getUser = function () {
    //     return $http.get('/api/users', id);
    // };
    // this.updateUser = function (user) {
    //     return $http.post('/api/users/:id', user, user._id);
    // };

    return user = null;

    // return user = {
    //     is_logged_in: true,
    //     firstName: 'Jimmy',
    //     lastName: 'Favor',
    //     entityName: 'Favor LLC',
    //     entityAddr1: '1234 Main Street',
    //     entityAddr2: '#202',
    //     entityCity: 'Atlanta',
    //     entityState: 'GA',
    //     entityZip: '30309',
    //     entityFEIN: 'ABCD1234',
    //     locations: [
    //         {
    //             estName: 'Jimmy\'s',
    //             county: 'Fulton',
    //             phone: '404-366-5050',
    //             payments: [
    //                 {
    //                     month: 'Dec',
    //                     date: '12/06/2016',
    //                     taxDue: 1100.00,
    //                     totalSales: 1100.00,
    //                 },
    //                 {
    //                     month: 'Jan',
    //                     date: '12/06/2016',
    //                     taxDue: 1300.00,
    //                     totalSales: 1100.00
    //                 },
    //                 {
    //                     month: 'Feb',
    //                     date: '12/06/2016',
    //                     taxDue: 1900.00,
    //                     totalSales: 1100.00
    //                 },
    //                 {
    //                     month: 'Mar',
    //                     date: '12/06/2016',
    //                     taxDue: 1200.00,
    //                     totalSales: 1100.00,
    //                 },
    //             ]
    //         },
    //         {
    //             estName: 'Jack\'s',
    //             county: 'Dekalb',
    //             phone: '404-366-5050',
    //             payments: [
    //                 {
    //                     month: 'Dec',
    //                     date: '12/06/2016',
    //                     taxDue: 800.00,
    //                     totalSales: 1100.00,
    //
    //                 },
    //                 {
    //                     month: 'Feb',
    //                     date: '12/06/2016',
    //                     taxDue: 300.00,
    //                     totalSales: 1100.00,
    //
    //                 },
    //                 {
    //                     month: 'March',
    //                     date: '12/06/2016',
    //                     taxDue: 500.00,
    //                     totalSales: 1100.00,
    //                 },
    //                 {
    //                     month: 'April',
    //                     date: '12/06/2016',
    //                     taxDue: 600.00,
    //                     totalSales: 1100.00,
    //                 },
    //             ]
    //         },
    //         {
    //             estName: 'Bobby\'s',
    //             county: 'Dekalb',
    //             phone: '404-366-5050',
    //             payments: [],
    //         },
    //     ],
    // };
});

app.service('formService', function ($http) {
    console.log('formService is alive');
    this.saveForm = function () {
        return $http.post('/api/forms/:id', form, form._id);
    }
});

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

app.controller('homeCtrl', function (userService) {
    var vm = this;
    vm.title = 'Home';
    vm.user = user;
});

app.controller('dashboardCtrl', function (userService) {
    var vm = this;
    vm.title = 'Dashboard';
    vm.user = user;
    vm.navToggle = "";
    vm.toggleNav = function () {
        if (vm.navToggle === "") {
            vm.navToggle = "active";
        } else {
            vm.navToggle = "";
        }
    };


});

app.controller('chartCtrl', function (userService) {
    var vm = this;
    vm.user = user;

    vm.labels = ['Jan', 'Feb', 'March', 'April'];
    vm.data = [];
    vm.series = ['Location A', 'Location B'];


    var chartMin = 0,
        chartMax = 0;

    function pullSales() {
        var arr = vm.user.locations;
        for (let i = 0; i < arr.length; i++) {
            var temp = [];
            for (let ii = 0; ii < arr[i].payments.length; ii++) {
                temp.push(arr[i].payments[ii].taxDue);
            }
            vm.data.push(temp);
        }
    }

    function chartMinMax() {
        for (let i = 0; i < vm.data.length; i++ ) {
            for (let ii = 0; ii < vm.data[i].length; ii++) {
                if (vm.data[i][ii] > chartMax) {
                    chartMax = vm.data[i][ii];
                }
                if (vm.data[i][ii] < chartMin || chartMin === 0) {
                    chartMin = vm.data[i][ii];
                }
            }
        }
    }

    // Init
    pullSales();
    chartMinMax();

    vm.onClick = function (points, evt) {
        console.log(points, evt);
    };

    vm.datasetOverride = [
        {
            yAxisID: 'y-axis-1'
        },
        {
            yAxisID: 'y-axis-2'
        }
    ];

    vm.options = {
        animation: {
            easing: 'easeOutQuad',
            duration: 700
        },
        elements: {
            line: {
                tension: 0.001,
                startAtZero: true,
            }
        },
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: false,
                    position: 'left',
                    ticks: {
                        min: chartMin - (chartMin * 0.2),
                        max: chartMax + (chartMax * 0.1)
                    }
                },
                {
                    id: 'y-axis-2',
                    display: false,
                    position: 'left',
                    ticks: {
                        min: chartMin - (chartMin * 0.2),
                        max: chartMax + (chartMax * 0.2)
                    }
                }
            ],

        }
    };
});

app.controller('navCtrl', function (userService) {
    var vm = this;
    vm.user = user;

    // userService.authUser()
    //     .then(function (res) {
    //         vm.user = res.data;
    //         console.log("from Nav Ctrl: ", vm.user);
    //     })
    //     .catch(function (err) {
    //         console.log("navCtrl userService error: ", err);
    //     })


});

app.controller('loginCtrl', function ($http, $location) {
    var vm = this;
    vm.title = 'Login';

    vm.login = function () {
        var url = 'http://localhost:3000/login';
        var user = vm.user;
        $http.post(url, user)
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

app.controller('signupCtrl', function ($http, $location) {
    var vm = this;
    vm.title = 'Sign Up';

    vm.signup = function () {
        var url = 'http://localhost:3000/signup';
        var user = vm.user;

        $http.post(url, user)
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

app.controller('profileCtrl', function (userService) {
    var vm = this;
    vm.title = 'Profile';
    vm.user = user;

    vm.updateUser = function () {
        userService.updateUser(vm.user)
            .then(function (res) {
                console.log("User Updated", res)
            })
            .catch(function (err) {
                alert('Error: ' + err);
            })
    }

});

app.controller('FormCtrl', function ($scope, $http, $location) {

    $scope.data = {
        estName: 'Default',
        reportMonthYear: '01/2017',
        grossSales: 0,
    };

    $scope.submitForm = function () {
        $http.post('/forms/make/', JSON.stringify($scope.data))
            .then(
                console.log('submitted')
            ).catch(function (err) {
            console.log(err)
        });
    };
});