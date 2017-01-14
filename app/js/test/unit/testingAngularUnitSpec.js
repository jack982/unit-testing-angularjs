describe('TestingAngularJS Test Suite', function(){
    
    beforeEach( module('testingAngularApp') );  // include app module in our tests 
    
    describe('Testing AngularJS Controller', function() {
        
        var scope, ctrl;
        
        beforeEach(
            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                ctrl = $controller('testingAngularCtrl',  {$scope: scope});
            })
        );
        
        afterEach( function() {
            // cleanup code here
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
    });
    
});