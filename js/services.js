'use strict';

var rentHouseServices = angular.module('rentHouseServices', []);
var domains = {
	LOCAL : 'http://services.nesterenya.com',
	PRODUCTION : 'http://rent.nesterenya.com'
}; 
var used_domain = domains.LOCAL;

rentHouseServices.service("rentService", function( $http, $q ) {

	this.getCountPage = function(countRentOnPage) {
		var deferred = $q.defer();
		httpGet(deferred, used_domain + '/rent/count/'+ countRentOnPage);
		return deferred.promise;
	}

	this.getPage = function(countRentOnPage, pageNumber) {
		var deferred = $q.defer();
		httpGet(deferred, used_domain + '/rent/get/'+ countRentOnPage +'/'+ pageNumber);
		return deferred.promise;
	}

	this.get = function(apartmentId) {
		var deferred = $q.defer();
		httpGet(deferred, used_domain + '/rent/one/' + apartmentId);
		return deferred.promise;
	}

	this.add = function(notice, loadedFilesId) {
		var deferred = $q.defer();
		$http.post(used_domain + '/rent/add', {"address" : notice.adress , "cost" : notice.cost + notice.currency, 
      		"roomCount": notice.roomCount,"description" : notice.description,"contacts": notice.phone,
      		"images": loadedFilesId})
      	.then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
	}

	function httpGet(deferred, url) {

		$http.get(url)
			.then(function (response) {
				// console.log("url "+url+" response "+response.data)
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
	}

});

rentHouseServices.service("wishService", function( $http, $q ) {

	this.getAll = function() {
		var deferred = $q.defer();
		$http.get(used_domain + '/wish/all')
			.then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
	}

	this.addWish = function(message) {
		var deferred = $q.defer();
		$http.post(used_domain + '/wish/add/', {'text': message})
			.then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
	}

	this.addLike = function(id) {
		var deferred = $q.defer();
		httpPost(deferred, used_domain + '/wish/like/' + id);
        return deferred.promise;
	}

	this.addDislike = function(id) {
		var deferred = $q.defer();
		httpPost(deferred, used_domain + '/wish/dislike/' + id);
        return deferred.promise;
	}

	function httpPost(deferred, url) {
		$http.post(url)
			.then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
	}

});

rentHouseServices.service("contactService", function( $http, $q ) {

	this.add = function(contact) {
		var deferred = $q.defer();
		$http({
	        url: "http://formspree.io/stdart9@gmail.com",
	        data: $.param( contact ),
	        method: 'POST',
	        headers: {'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}})
	    .then(function (response) {
	        deferred.resolve(response.data);
	    }, function (response) {
	        deferred.reject(response);
	    });
        return deferred.promise;
	}

});
