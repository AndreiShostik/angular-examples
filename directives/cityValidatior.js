angular
    .module('App')
    .directive('cityExistsValidator', function($q, _, AddressSvc) {
        return {
            require: '^ngModel',
            scope: {
                stateId: "=",
                showMessages: '='
            },
            link : function($scope, element, attrs, ngModel) {
                ngModel.customInvalid = false;
                ngModel.stateIsChanged = false;
                ngModel.showWarning = function () {
                    return _.isEmpty(ngModel.$error) && ngModel.customInvalid;
                };
    
                ngModel.$asyncValidators.cityExists = function(city) {
                    if (ngModel.$dirty || $scope.showMessages || ngModel.stateIsChanged) {
                        $scope.stateId && AddressSvc.doesCityExist($scope.stateId, city)
                            .then(function () {
                                ngModel.customInvalid = false;
                            })
                            .catch(function () {
                                ngModel.customInvalid = true;
                            });
                    }
    
                    return $q.when(true);
                };
    
                $scope.$parent.$watch(attrs.stateId, function(newValue, oldValue) {
                    ngModel.stateIsChanged = newValue != oldValue;
    
                    if (ngModel.stateIsChanged) {
                        ngModel.$validate();
                    }
                });
    
                $scope.$parent.$watch(attrs.showMessages, function() {
                    if (ngModel.$viewValue) {
                        ngModel.customInvalid = $scope.$eval(attrs.showMessages);
                    } else {
                        ngModel.customInvalid = false;
                    }
                });
            }
        };
});

/**
 * Non-strict validation
 * 
 ...
    <div class="row">
        <label class="col-xs-3 control-label required" for="city">City</label>
        <div class="col-xs-9" >
            <input id="city"
                   class="form-control"
                   name="city"
                   type="text"
                   ng-model="vm.currentAddress.city"
                   ng-model-options="{ debounce : { 'default' : 500, 'blur' : 0 }}"
                   required
                   ng-maxlength="50"
                   city-exists-validator
                   state-id="vm.currentAddress.stateId"
                   show-messages="vm.showMessages">
            <div ng-if="changeAddressForm.$submitted || changeAddressForm.city.$touched || vm.showMessages"
                 ng-messages="changeAddressForm.city.$error">
                <div class="alert alert-danger" ng-message="required">You didn't enter your City.</div>
                <div class="alert alert-danger" ng-message="maxlength">City can not be longer that 50 characters.</div>
            </div>
            <div class="alert alert-warning"
                 ng-if="changeAddressForm.city.showWarning()">The City you entered is not valid.
                We don't have it in the US Cities list or it doesn't comply with the State selected. Please, try again.</div>
        </div>
    </div>
 ...
 */