!function() {
    angular
        .module('App')
        .config(httpDecorator);

    function httpDecorator($provide) {
        $provide.decorator('$http', function ($delegate) {
            $delegate.getDataFromResult = function (result) {
                return result.data;
            };

            return $delegate;
        });
    }
}();