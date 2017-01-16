describe('TestingAngularJS Test Suite', function(){
    
    beforeEach( module('testingAngularApp') );  // include app module in our tests 
    
    describe('Testing AngularJS Controller', function() {
        
        var scope, ctrl, httpBackend, timeout;
        
        beforeEach(
            inject(function($controller, $rootScope, $httpBackend, $timeout) {
                scope = $rootScope.$new();
                ctrl = $controller('testingAngularCtrl',  {$scope: scope});
                httpBackend = $httpBackend;
                timeout = $timeout;
            })
        );
        
        afterEach( function() {
            // cleanup code here
            
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
        
        it('should initialize the title in the scope', function() {
                        
            expect(scope.title).toBeDefined();
            expect(scope.title).toBe('Testing AngularJS Applications');
            
        });
        
        it('should add 2 destinations to the destination list', function() {
            expect(scope.destinations).toBeDefined();
            expect(scope.destinations.length).toBe(0);
            
            scope.newDestination = {
                city: "London",
                country: "England"
            };
            
            scope.addDestination();
            
            expect(scope.destinations.length).toBe(1);
            expect(scope.destinations[0].city).toBe("London");
            expect(scope.destinations[0].country).toBe("England");
            
            scope.newDestination.city = 'Frankfurt';
            scope.newDestination.country = 'Germany';
            
            scope.addDestination();
            
            expect(scope.newDestination.city).toBe(undefined);
            
            expect(scope.destinations.length).toBe(2);
            expect(scope.destinations[1].city).toBe("Frankfurt");
            expect(scope.destinations[1].country).toBe("Germany");
            expect(scope.destinations[0].city).toBe("London");
            expect(scope.destinations[0].country).toBe("England");
            
            
        });
        
        it('should remove a destination from the destinations list', function() {
            scope.destinations = [
                {
                    city: 'London',
                    country: 'England'
                },
                {
                    city: 'Frankfurt',
                    country: 'Germany'
                }
            ];
            
            expect(scope.destinations.length).toBe(2);
                      
            scope.removeDestination( 0 );
        
            expect(scope.destinations.length).toBe(1);
            expect(scope.destinations[0].city).toBe("Frankfurt");
            expect(scope.destinations[0].country).toBe("Germany");
            
        });
        
        
        it('should update the weather for a specific destination', function() {
            scope.destination = {
                city: 'Bologna',
                country: 'Italy'
            };
            
            httpBackend.expectGET('http://api.openweathermap.org/data/2.5/weather?q=' + scope.destination.city + '&appid=' + scope.apiKey).respond(
                {
                    weather: [ { main : 'Rain', detail : 'Light rain'} ],
                    main: {temp: 288}
                }
            );
            
            scope.getWeather( scope.destination );
            
            httpBackend.flush();
            
            expect(scope.destination.weather.main).toBe('Rain');
            expect(scope.destination.weather.temp).toBe(15);
        });
        
        
        it('should remove the error message after a fixed period of time', function() {
            scope.message = 'Error';
            expect(scope.message).toBe('Error');
            
            scope.$apply();
            timeout.flush();
            
            expect(scope.message).toBeNull();
        });
    });
    
    describe('Testing AngularJS Filter', function() {
        it('should return only warm destinations', inject( function($filter) {
            var warmest = $filter('warmestDestinations');
            
            var destinations = [
                {
                    city: 'Bejing',
                    country: 'China',
                    weather: {
                        temp: 21
                    }
                },
                {
                    city: 'Rome',
                    country: 'Italy'
                   /* ,weather: {
                        temp: 9
                    }
                    */
                },
                {
                    city: 'Miami',
                    country: 'USA',
                    weather: {
                        temp: 25
                    }
                },
                {
                    city: 'Paris',
                    country: 'France',
                    weather: {
                        temp: 3
                    }
                }
            ];
            
            expect(destinations.length).toBe(4);
            
            var warmDestinations = warmest(destinations, 15);
            
            expect(warmDestinations.length).toBe(2);
            expect(warmDestinations[0].city).toBe('Bejing');
            expect(warmDestinations[1].city).toBe('Miami');
        }));
    });
    
    describe('Testing AngularJS Service', function() {
       it('should return Celsius temperature', inject( function(tempService) {
           var destination = {
               city: 'Moscow',
               country: 'Russia',
               weather: {
                   temp: 262 // Celsius = Kelvin - 273 
               }
           };
           
           expect(destination.weather.temp).toBe(262);
           var celsiusTemp = tempService.convertKelvinToCelsius( destination.weather.temp );
           expect( celsiusTemp ).toBe(-11);
           
       })); 
    });
});