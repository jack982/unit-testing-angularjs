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
        
    });
    
});