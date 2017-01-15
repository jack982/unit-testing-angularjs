var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', function ($rootScope, $scope, $http, $timeout) {
    
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
    
    $scope.getWeather = function(destination) {
      $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + destination.city + '&appid=' + $scope.apiKey).then(
        function(response){
            if( response.data.weather) {
                destination.weather = {};
                destination.weather.main = response.data.weather[0].main;
                destination.weather.temp = convertKelvinToCelsius(response.data.main.temp);
            }
            else {
                $scope.message = "City not found";
            }
        }, 
        function(err) {
            //console.error(err);
            $scope.message = err.data.message;
        }
      );  
    };
    
    $scope.messageWatcher = $scope.$watch('message', function() {
        if ( $scope.message ) {
            $timeout( function() {
                $scope.message = null;
            }, 3000);
        }
    });
    
    var convertKelvinToCelsius = function( temp ) {
        return Math.round( temp - 273 );
    }
});
