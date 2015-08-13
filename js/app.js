'use strict';

var myApp = angular.module('rentHouseApp', [
  'ngRoute',
  'ngStorage',
  'materializeInit',
  'myAnimation',
  'myInputDirectives',
  'ngFileUpload',
  // 'ui.materialize',
  // 'ngSanitize',
  'rentHouseServices',
  'rentHouseControllers'

]);

myApp.config(['$routeProvider','$locationProvider',
  function($routeProvider, $locationProvider) {
  
    $routeProvider.
      when('/main', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      }).
      when('/rent/:pageNumb', {
        templateUrl: 'partials/rent.html',
        controller: 'AdvertListCtrl'
      }).
      when('/offers', {
        templateUrl: 'partials/offers.html',
        controller: 'OffersListCtrl'
      }).
      when('/apartment/:apartmentId', {
        templateUrl: 'partials/apartment-detail.html',
        controller: 'AdvertDetailCtrl'
      }).
      when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      }).
      when('/new-notice', {
        templateUrl: 'partials/new-notice.html',
        controller: 'NewNoticeCtrl'
      }).
      otherwise({
        redirectTo: '/main'
      });
	  
	  $locationProvider.html5Mode(true);
  }]);

myApp.run(function ($rootScope, $location, $sessionStorage) {

    $sessionStorage.$default({
      history : []
    });

    $rootScope.$on('$routeChangeSuccess', function() { /*sessionStorage нужен для сохранения истории после обновления страницы*/
        if ($sessionStorage.history[1] !== $location.$$path) {$sessionStorage.history.push($location.$$path);};
        if ($sessionStorage.history.length > 2) {  $sessionStorage.history.splice(0, 1); }
    });

    $rootScope.getPrevPage = function () {
        if ( $sessionStorage.history.length == 1 ) { 
          return '!'; 
        } else {
          return $sessionStorage.history[0];
        }
    };

});

