var testingAngularApp = angular.module('testingAngularApp', []);

testingAngularApp.controller('testingAngularCtrl', function ($rootScope, $scope, $http, $timeout, tempService) {
    
    $scope.apiKey = "2bc4e3555383fca80056d755bf8d11f3";

    $scope.title = 'Testing AngularJS Applications';

    $scope.destinations = [];
    
    $scope.newDestination = angular.copy(emptyDestination);
    
    var emptyDestination = {
        city: undefined,
        country: undefined
    };
    
    $scope.addDestination = function() {
        $scope.destinations.push({
            city: $scope.newDestination.city,
            country: $scope.newDestination.country
        });
        
        $scope.newDestination = angular.copy(emptyDestination);
    };
    
    $scope.removeDestination = function(index) {
        $scope.destinations.splice(index, 1);
    };
   
    
    $scope.messageWatcher = $scope.$watch('message', function() {
        if ( $scope.message ) {
            $timeout( function() {
                $scope.message = null;
            }, 3000);
        }
    });
    
});

testingAngularApp.filter('warmestDestinations', function() {
    return function(destinationsList, minimumTemp) {
        var warmDestinations = [];
        
        angular.forEach(destinationsList, function(dest) {
           
            if ( dest.weather && dest.weather.temp && dest.weather.temp >= minimumTemp ) {
                warmDestinations.push( dest );
            } 
        }); 
        
        return warmDestinations;
        
    };
});

testingAngularApp.factory('tempService', function() {
    return {
        convertKelvinToCelsius : convertKelvinToCelsius
    };
    
    function convertKelvinToCelsius(temp) {
        return Math.round( temp - 273 );
    }
});

testingAngularApp.directive('destinationDirective', function() {
    return {
        restrict: 'E',
        scope: {
            destinations: '=',
            apiKey: '=',
            onRemove: '&'
        },
        controller: function( $rootScope, $scope, $http, tempService ) {
                      
            $scope.getWeather = function( destination ) {
                $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + destination.city + '&appid=' + $scope.apiKey).then(
                    function(response){
                        if( response.data.weather) {
                            destination.weather = {};
                            destination.weather.main = response.data.weather[0].main;
                            destination.weather.temp = tempService.convertKelvinToCelsius( response.data.main.temp );
                        }
                        else {
                            $rootScope.message = "City not found";
                        }
                    }, 
                    function(err) {
                        //console.error(err);
                        $rootScope.message = 'Server error';//err.data.message;
                        $rootScope.$broadcast('messageUpdated', { type: 'error', message: 'Server error'} );
                    }
                );  
            };    
        },
      //  controllerAs: 'vm',
       // templateUrl: 'js/destinationDirective.tmpl.html'
    //    template: '<ul ng-repeat="dest in destinations"><li>{{ dest.city }} - {{ dest.country }} <span ng-if="dest.weather"> - {{ dest.weather.main }}, {{ dest.weather.temp }}</span> <button type="button" ng-click="vm.getWeather(dest)">Get weather</button> <button type="button" ng-click="onRemove( { index: $index } )">Remove</button> </li> </ul>'
        templateUrl: 'tpl/destinationDirective.html'
    }
});
