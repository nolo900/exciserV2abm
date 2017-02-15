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
        .state('signup', {
            url: '/go',
            templateUrl: 'templates/signup.html',
            controller: 'signupCtrl',
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
    this.authUser = function () {
        return $http.get("/api/users");
    };

    this.updateUser = function (user) {
        return $http.post('/api/users/:id', user, user._id);
    };

});

app.service('formService', function ($http) {
    console.log('formService is alive');
    this.makeForm = function (payment) {
        return $http.post('/api/forms/makepdf', payment);
    }
});

app.service('locationService', function ($http) {
    this.getLocations = function () {
        return $http.get('/api/locations');
    };
    this.getLocation = function (id) {
        return $http.get('/api/locations', id);
    };
    this.addLocation = function (location) {
        return $http.post('/api/locations', location);
    };
    this.updateLocation = function (location) {
        console.log('in loc service post, updateLoc...', location);
        return $http.post('/api/locations/' + location._id, location);
    }
});

////////////// CONTROLLERS ////////////////////////////////////////////////////////

app.controller('homeCtrl', function (userService) {
    var vm = this;
    vm.title = 'Home';
	vm.user = {};

	vm.getUser = userService.authUser()
		.then(function (user) {
			console.log("USER from homeCtrl: ", user.data);
			vm.user = user.data;
		})
		.catch(function (err) {
			console.log("home Ctrl:User Service ERROR: ", err);
		});
});

app.controller('dashboardCtrl', function ($http, userService, locationService, formService) {
    var vm = this;
    vm.title = 'Dashboard';
    vm.user = {};
    vm.navToggle = "";
    vm.locations ={};
    vm.data = {};
    vm.payments = [{reportMonth:'', grossSales: ''}];


    vm.locations = locationService.getLocations()
        .then(function (res) {
            console.log("LocationService: Locations:",res.data.locations);
            vm.locations = res.data.locations;
        },
        function (res) {
            console.log('error: ', res)
        }
    );

	vm.getUser = userService.authUser()
        .then(function (user) {
            console.log("USER from DashCtrl: ", user.data);
            vm.user = user.data;
        })
        .catch(function (err) {
            console.log("Dash Ctrl:User Service ERROR: ", err);
        });

    vm.toggleNav = function () {
        if (vm.navToggle === "") {
            vm.navToggle = "active";
        } else {
            vm.navToggle = "";
        }
    };


	vm.updateLocation = function (location, payment) {
		vm.payment = {reportMonth:payment.reportMonth, grossSales: payment.grossSales};
	    console.log(vm.payment);
		location.payments.push(vm.payment);

	    console.log('inside update loc:', location);
	    locationService.updateLocation(location)
			.then(function (res) {
				console.log("Location Updated", res)
			})
			.catch(function (err) {
				alert('Error, location not updated: ' + err);
			});

		vm.payment = {reportMonth:'', grossSales: ''};

	};

	vm.makePDF = function (payment) {
		console.log('payment:', payment);
			formService.makeForm(payment)
				.then(function (res) {
					console.log('payment:', payment);
					console.log("form make", res);
					//redirect to show form
				})
				.catch(function (err) {
					alert("Error, form not generated", err);
				});
	};

	vm.deletePmt = function (location, payment, index) {
        location.payments.splice(index,1);
		console.log('inside delete pmt:', location, "index: ", index);
		locationService.updateLocation(location)
			.then(function (res) {
				console.log("Location pmt Updated", res)
			})
			.catch(function (err) {
				alert('Error, location pmt not updated: ' + err);
			});
	}


});

app.controller('chartCtrl', function (userService) {
    var vm = this;
	vm.user = {};

	vm.getUser = userService.authUser()
		.then(function (user) {
			console.log("USER from ChartCtrl: ", user.data);
			vm.user = user.data;
		})
		.catch(function (err) {
			console.log("Chart Ctrl:User Service ERROR: ", err);
		});

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
    vm.user = {};

	vm.getUser = userService.authUser()
		.then(function (user) {
			console.log("USER from NavCtrl: ", user.data);
			vm.user = user.data;
		})
		.catch(function (err) {
			console.log("Nav Ctrl:User Service ERROR: ", err);
		});


});

app.controller('loginCtrl', function ($http, $location, userService) {
    var vm = this;
    vm.title = 'Login';

    vm.login = function () {
        var url = '/login';
        var user = vm.user;
        $http.post(url, user)
            .then(
                function (res) {
                    console.log("login success!");
                    $location.path('/dashboard');
                },
                function (res) {
                    console.log("login failure");
                    $location.path('/');
                }
            )
    }

});

app.controller('signupCtrl', function ($http, $location) {
    var vm = this;
    vm.title = 'Sign Up';

    vm.signup = function () {
        var url = '/signup';
        var user = vm.user;

        console.log(vm.user);


        $http.post(url, user)
            .then(
                function (res) {
                    console.log("signup success!!");
                    $location.path("/profile")
                }, //success
                function (res) {
                    console.log('signup error!', res);
                    $location.path('/login');
                } //error
            )
    };
});

app.controller('profileCtrl', function (userService) {
    var vm = this;
    vm.title = 'Profile';
    vm.user = {};

	vm.getUser = userService.authUser()
		.then(function (user) {
			console.log("USER from ProfileCtrl: ", user.data);
			vm.user = user.data;
		})
		.catch(function (err) {
			console.log("Profile Ctrl:User Service ERROR: ", err);
		});

    vm.updateUser = function () {
	    userService.updateUser(vm.user)
		    .then(function (res) {
			    console.log("User Updated", res)
		    })
		    .catch(function (err) {
			    alert('Error: ' + err);
		    })
    };

});

app.controller('FormCtrl', function ($scope, $http) {

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