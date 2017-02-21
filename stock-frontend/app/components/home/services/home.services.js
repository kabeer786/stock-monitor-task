(function() {
    'use strict';

    angular.module('stockMonitoringApp.homeServices', [])
        .service('stockMonitoringService', stockMonitoringService);
    stockMonitoringService.$inject = ['$http', '$q', "$rootScope"];

    function stockMonitoringService($http, $q, $rootScope) {
        var baseUrl = "http://localhost:8081";		
        var factory = {
            //properties
            templateData: [],
            getTemplateHeaderText: getTemplateHeaderText,
            getsubscriptionData: getsubscriptionData

        };

        function getTemplateHeaderText() {
            var defer = $q.defer()
            factory.templateData = {
                templateHeaderText: "Stock monitor",
                templateHeaderDescription: "Live Stock Monitoring"
            };
            defer.resolve();
            return defer.promise
        }

        function getsubscriptionData() {
            var defer = $q.defer()
            $http({
                method: 'GET',
                headers: {
                    'Content-type': 'application/json	'
                },
                url: baseUrl + "/getSubscriptionList"
            }).then(function successCallback(response) {
                defer.resolve(response.data);
            }, function errorCallback(response) {
                defer.reject(response);
            });
            return defer.promise
        }
        return factory;
    }
})();