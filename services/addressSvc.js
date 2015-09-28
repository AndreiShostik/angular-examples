!function () {
    angular.module('App')
        .factory('AddressSvc', function ($http, $q, _, ApiServerHost, ConstantSvc) {
            var apiUrl = ApiServerHost + 'address/';
            
            return {
                getAllCountries: getAllCountries,
                getAllStates: getAllStates,
                getAddressKinds: getAddressKinds,
                getCitiesByStateId: getCitiesByStateId,
                doesCityExist: doesCityExist,
                checkIfCityExists: checkIfCityExists
            };

            function getAllCountries() {
                return $http.get(apiUrl + 'allCountries')
                    .then($http.getDataFromResult)
                    .then(function (data) {
                        var usa = _.find(data, function (elem) {
                            return elem.code == 'USA';
                        });

                        ConstantSvc.usCode = usa.id;

                        return data;
                    })
            }
            function getAllStates() {
                return $http.get(apiUrl + 'allStates')
                    .then($http.getDataFromResult)
            }
            function getAddressKinds() {
                return $http.get(apiUrl + 'kinds')
                    .then($http.getDataFromResult);
            }
            function getCitiesByStateId(stateId) {
                return $http.post(apiUrl + 'cities', [stateId])
                    .then($http.getDataFromResult);
            }
            function doesCityExist(stateId, city) {
                var _this = this;

                return $q(function (resolve, reject) {
                    _this.checkIfCityExists(stateId, city)
                        .success(function (exists) {
                            if (exists) {
                                resolve();
                            } else {
                                reject();
                            }
                        }).error(function () {
                            reject()
                        });
                });
            }
            function checkIfCityExists(stateId, city) {
                return $http.get(apiUrl + 'state/' + stateId + '/checkexistcity?city=' + city);
            }
        });
}();