!function () {
    angular
        .module('App')
        .config(function($httpProvider) {
            $httpProvider.interceptors.push(errorsInterceptor);
        });


    function errorsInterceptor($q, $log, $location, ApiServerHost, AuthorizationServerHost) {
        return {
            response: response,
            responseError: responseError
        };

        function response(response) {
            if (_isDataEmpty(ApiServerHost, response) || _isDataEmpty(AuthorizationServerHost, response)) {
                $log.error(new Error('Data from API is empty'));
                _goTo404();
            }

            return response;
        }

        function responseError(rejection) {
            if (rejection.status === 404) {
                _goTo404();
            }

            return $q.reject(rejection);
        }

        function _isDataEmpty(url, response) {
            return (response.data === null) && new RegExp(url).test(response.config.url);
        }

        function _goTo404() {
            $location.url('/404');
        }
    }
}();