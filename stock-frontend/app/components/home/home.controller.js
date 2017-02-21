(function() {
    'use strict';
    angular.module('stockMonitoringApp').controller('homeController', homeController);
    homeController.$inject = ["$scope", "$http", "$window", "$q", "stockMonitoringService"];

    function homeController($scope, $http, $window, $q, stockMonitoringService) {
        var vm = this;
        vm.stockListData = {}
        vm.stockSymbolList = {};
        vm.subscriptionList = {}
        vm.initateStates = initateStates;
		vm.staticHeadersTexts=["Company"," Live Price"," %change"];

        function initateStates() {
                vm.angularstrapService = stockMonitoringService;
                var serverListener = new EventSource("http://localhost:8081/stats");
                serverListener.onmessage = function(event) {
                    vm.stockSymbolList = JSON.parse(event.data);
                    $scope.$apply(vm.stockSymbolList);
                };
            }
            //services                                  
        stockMonitoringService.getsubscriptionData().then(function(data) {
            vm.subscriptionList = data.subscriptionList;
        }, function(error) {
            vm.col1heading = "Error";
            vm.col1text = error.statusText;
        });
        vm.getLivePriceById = function(id) {
            var currentPrice = ""
            _.map(vm.stockSymbolList.stockSymbolList, function(value, key) {
                if (value.id == id) {
                    currentPrice = value.currentRate;
                }
            });
            return parseFloat(currentPrice).toFixed(2);;
        }
        vm.calculateProfitOrLoss = function(sp, cp, Obj) {
            var returnPercent = ""
            sp = parseFloat(sp)
            cp = parseFloat(cp)
            if (sp == cp) {
                Obj.color = "ok"
                returnPercent = "0.00"
            }
            else if (sp > cp) {
                Obj.color = "increment"
                returnPercent = ((sp - cp) / cp) * 100;
            }
            else {
                Obj.color = "decrement"
                returnPercent = ((cp - sp) / cp) * 100;
            }
            returnPercent = returnPercent
            return parseFloat(returnPercent).toFixed(2);;
        }
        stockMonitoringService.getTemplateHeaderText().then(function(data) {
            vm.templateHeaderText = stockMonitoringService.templateData.templateHeaderText;
            vm.templateHeaderDescription = stockMonitoringService.templateData.templateHeaderDescription;
        }, function(error) {
            vm.templateHeaderText = "Error";
            vm.templateHeaderDescription = error
        });
        return vm;
    }
})();