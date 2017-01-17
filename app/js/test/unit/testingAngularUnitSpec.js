describe('TestingAngularJS Test Suite', function(){
    
    beforeEach( module('testingAngularApp' ));  // include app module in our tests 
    
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
    
    
    describe('Testing AngularJS Directive', function() {
        var scope, template, directiveController, httpBackend, isolateScope, rootScope;
        
        
       // beforeEach( module('tpl/destinationDirective.html') );
        beforeEach( module('test-templates') );
        
        
        // mock dependency (before inject)
        beforeEach( function() {
            module(function($provide) {
                var mockedConversionService = {
                    convertKelvinToCelsius: function( temp ) {
                        return Math.round( temp - 273 );
                    }
                }
                
                $provide.value('tempService', mockedConversionService);
            });
        });
        
        beforeEach(inject(function($compile, $rootScope, $httpBackend, _tempService_ ) {
            
            scope = $rootScope.$new();
            
            rootScope = $rootScope;
                     
            httpBackend = $httpBackend;
            
            conversionService = _tempService_;
            
            scope.apiKey = "xyz";
            
            scope.destinations = [
                {
                    city: 'Tokyo',
                    country: 'Japan'
                }
            ];
            
            var element = angular.element( 
                '<data-destination-directive destinations="destinations" api-key="apiKey" on-remove="removeDestinations(index)"></data-destination-directive>'
            );
            
                       
            template = $compile(element)(scope);
            scope.$digest();
            
            // because we are testing directive's isolated scope
            isolateScope = element.isolateScope();
            
            // if we are using directive controllers ('controllerAs') instead of isolated scope then we can get the instance like this
            directiveController = element.controller('destinationDirective');
            
        }));
    
        it('should update the weather for a specific destination', function() {
            spyOn(conversionService, 'convertKelvinToCelsius').and.callThrough(); // .and.returnValue(16); // .and.callFake( function(temp) { return temp - 272 });
             
            scope.destination = scope.destinations[0];
            
            httpBackend.expectGET('http://api.openweathermap.org/data/2.5/weather?q=' + scope.destination.city + '&appid=' + scope.apiKey).respond(
                {
                    weather: [ { main : 'Rain', detail : 'Light rain'} ],
                    main: {temp: 288}
                }
            );
            
            expect(scope.destination.city).toBe('Tokyo');
            
            //isolateScope.getWeather( scope.destination );
            directiveController.getWeather( scope.destination );
            
            httpBackend.flush();
            
            expect(scope.destination.weather.main).toBe('Rain');
            expect(scope.destination.weather.temp).toBe(15);
            // mocked service
            expect(conversionService.convertKelvinToCelsius).toHaveBeenCalledWith(288);
        });
        
        
        it('should add a message if no city is found', function() {
            scope.destination = scope.destinations[0];
            
            scope.message = undefined;
            
            httpBackend.expectGET('http://api.openweathermap.org/data/2.5/weather?q=' + scope.destination.city + '&appid=' + scope.apiKey).respond( {} );
            
            expect(scope.destination.city).toBe('Tokyo');
            
            //isolateScope.getWeather( scope.destination );
            directiveController.getWeather( scope.destination );
            
            httpBackend.flush();
            
            expect(rootScope.message).toBe('City not found');
        });
        
        
        
         it('should add a message if an HTTP error occurs', function() {
             
            spyOn(rootScope, '$broadcast');
             
            scope.destination = scope.destinations[0];
            
            rootScope.message = undefined;
            
            httpBackend.expectGET('http://api.openweathermap.org/data/2.5/weather?q=' + scope.destination.city + '&appid=' + scope.apiKey).respond( 500 );
            
            expect(scope.destination.city).toBe('Tokyo');
            
            //isolateScope.getWeather( scope.destination );
            directiveController.getWeather( scope.destination );
            
            httpBackend.flush();
            
            expect(rootScope.message).toBeDefined();
            expect(rootScope.$broadcast).toHaveBeenCalled(); // check that the spy was called at least once
            expect(rootScope.$broadcast).toHaveBeenCalledWith( 'messageUpdated', { type: 'error', message: 'Server error'} );
            expect(rootScope.$broadcast.calls.count()).toBe(1);
        });
        
        it('should call the parent controller removeDestination() function', function() {
            scope.removeTest = 1;
            
            scope.removeDestinations = function() {
                scope.removeTest++;
            };
            
            isolateScope.onRemove();
            
            expect(scope.removeTest).toBe(2);
        });
        
        
        it('should generate the correct HTML', function() {
            var templateAsHtml = template.html();
            
            expect(templateAsHtml).toContain('Tokyo - Japan');
            
            scope.destinations = [
                {
                    city: 'London',
                    country: 'England'
                }
            ];
            
            scope.$digest();
            templateAsHtml = template.html();
            
            expect(templateAsHtml).toContain('London - England');
        });
    
    });
    
});