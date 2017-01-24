const app = angular.module('excise', ['ui.router', 'chart.js', 'ngAnimate', 'google.places']);

app.config(function ($urlRouterProvider, $stateProvider) {

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'templates/root.html',
            controller: 'homeCtrl',
            controllerAs: 'ctrl'
        });
    $stateProvider
        .state('dashboard', {
            templateUrl: 'templates/root.html',
            controller: 'dashboardCtrl',
            controllerAs: 'ctrl'
        })
        .state('dashboard.home', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html',
        })
        .state('dashboard.profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
        })
        .state('dashboard.logout', {
            url: '/logout',
            templateUrl: 'templates/profile.html',
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

    return user = {
        firstName: 'Jimmy',
        lastName: 'Favor',
        locations: [
            {
                estName: 'Jimmy\'s',
                county: 'Fulton',
                phone: '404-366-5050',
                payments: [
                    {
                        month: 'December',
                        date: '12/06/2016',
                        amount: 1100.00
                    },
                    {
                        month: 'January',
                        date: '12/06/2016',
                        amount: 1300.00
                    },
                    {
                        month: 'February',
                        date: '12/06/2016',
                        amount: 1900.00
                    },
                    {
                        month: 'March',
                        date: '12/06/2016',
                        amount: 1200.00
                    },
                ]
            },
            {
                estName: 'Jack\'s',
                county: 'Dekalb',
                phone: '404-366-5050',
                payments: [
                    {
                        month: 'December',
                        date: '12/06/2016',
                        amount: 800.00
                    },
                    {
                        month: 'January',
                        date: '12/06/2016',
                        amount: 300.00
                    },
                    {
                        month: 'February',
                        date: '12/06/2016',
                        amount: 500.00
                    },
                    {
                        month: 'March',
                        date: '12/06/2016',
                        amount: 600.00
                    },
                ]
            },
            {
                estName: 'Bobby\'s',
                county: 'Dekalb',
                phone: '404-366-5050',
                payments: []
            },
        ],
        // payments: [
        //     {
        //         month: 'December',
        //         date: '12/06/2016',
        //         amount: 1500.00
        //     },
        //     {
        //         month: 'January',
        //         date: '1/06/2016',
        //         amount: 1700.00
        //     },
        //     {
        //         month: 'February',
        //         date: '2/06/2016',
        //         amount: 1900.00
        //     },
        //     {
        //         month: 'March',
        //         date: '3/06/2016',
        //         amount: 2100.00
        //     },
        //     {
        //         month: 'April',
        //         date: '4/06/2016',
        //         amount: 2500.00
        //     },
        //     {
        //         month: 'May',
        //         date: '5/06/2016',
        //         amount: 2600.00
        //     },
        //     {
        //         month: 'June',
        //         date: '6/06/2016',
        //         amount: 2200.00
        //     },
        //     {
        //         month: 'July',
        //         date: '7/06/2016',
        //         amount: 2100.00
        //     },
        //     {
        //         month: 'August',
        //         date: '8/06/2016',
        //         amount: 2100.00
        //     },
        //     {
        //         month: 'September',
        //         date: '9/06/2016',
        //         amount: 2200.00
        //     },
        //     {
        //         month: 'October',
        //         date: '10/06/2016',
        //         amount: 2000.00
        //     },
        //     {
        //         month: 'November',
        //         date: '11/06/2016',
        //         amount: 500.00
        //     }
        // ]
    };

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

app.controller('homeCtrl', function () {
    var vm = this;
    vm.title = 'Home';
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

app.controller('profileCtrl', function (userService) {
    var vm = this;
    vm.title = 'Profile';
    vm.user = user;
});

app.controller('chartCtrl', function (userService) {
    var vm = this;
    vm.user = user;

    vm.labels = ['Jan', 'Feb', 'March', 'April'];
    vm.data = [];
    vm.series = ['Location A', 'Location B'];


    var chartMin = 0,
        chartMax = 0;

    // function generateLabels() {
    //     var arr = vm.user.locations;
    //     for (let i = 0; i < arr.length; i++) {
    //         console.log('looping over locations');
    //     }
    // }

    function pullSales() {
        var arr = vm.user.locations;
        for (let i = 0; i < arr.length; i++) {
            var temp = [];
            for (let ii = 0; ii < arr[i].payments.length; ii++) {
                temp.push(arr[i].payments[ii].amount);
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
    // generateLabels();
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
    vm.user = {};

    userService.authUser()
        .then(function (res) {
            vm.user = res.data;
            console.log("from Nav Ctrl: ", vm.user);
        })
        .catch(function (err) {
            console.log("navCtrl userService error: ", err);
        })
});

app.controller('loginCtrl', function ($http, $location) {
    console.log('login is here');
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
    console.log('Profile is here');

    vm.user = {};

    userService.authUser()
        .then(function (res) {
            vm.user = res.data;
            //console.log(vm.user);
        })
        .catch(function (err) {
            console.log("profileCtrl userService error: ", err);
        });

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