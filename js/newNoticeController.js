'use strict';

rentHouseControllers.controller('NewNoticeCtrl', ['$scope', 'rentService', 'Upload', '$document', '$window', function($scope, rentService, Upload, $document, $window) {
  
	$scope.$on('$viewContentLoaded', function(event) {
		// angular.element($document).on('dragstart', function(event){
		// 	// $('.document-drop-box').css('display','block');
  //       	console.log('dragstart')
  //   	});

		// angular.element($document).on('dragenter', function(event){
		// 	// $('.document-drop-box').attr('style','');
  //       	console.log('dragenter')
  //   	});
  //   	angular.element($document).on('dragleave', function(event){
  //       	console.log('dragleave')
  //   	});
  //   	angular.element($document).on('drag', function(event){
  //       	console.log('drag')
  //   	});
  //   	angular.element($document).on('dragend', function(event){
  //       	console.log('dragend')
  //   	});


		angular.element($window).on('dragover', function(event){
        	event.preventDefault();
        	// console.log('dragover')
    	});

    	angular.element($document).on('drop', function(event){
    		event.preventDefault();
        	// console.log('drop')
    	});
	});

	  $scope.loadFiles = [];
	  var loadedFilesId = [];
  	$scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
  	
    $scope.upload = function (files) { 
        if (files && files.length) {
          for(var i=0; i<files.length;i++) {
            uploadFile(files[i]);
          }
        }
    };

    function uploadFile(file) { // загружает одну картинку на сервер
      console.log(used_domain)
      console.log(file);
      if (file.size <= 2097152) {
          $('.file-field .file-path').val(file.name);
          $scope.loadFiles.unshift(file);
          if ($scope.loadFiles.length == 1) { $('.drag-box span').addClass('drag-white'); }
          Upload.upload({
              url: used_domain + '/images/upload',
              file: file
          }).progress(function (evt) {
              file.progress = parseInt(100.0 * evt.loaded / evt.total);;
          }).success(function (data, status, headers, config) {
            loadedFilesId.unshift(data.result);
              console.log('file uploaded. Response: ' + data.result);
          }).error(function (data, status, headers, config) {
              console.log('error status: ' + status);
          })
      } else {
        Materialize.toast('Файл превышает размер 2 мб.', 3000);
      }
    }

    $scope.submitForm = function() {
    	$scope.submitted = true;
	    if ($scope.createNotice.$valid) {

        rentService.add($scope.notice, loadedFilesId).then(
            function (result) { 
              resetForm();
              Materialize.toast('Объявление добавлено.', 3000);
            }, function (error) { console.log(error.statusText); } 
        );

	      	// $http.post('http://services.nesterenya.com/rent/add', {"address" : $scope.notice.adress , "cost" : $scope.notice.cost+$scope.notice.currency, 
	      	// 	"roomCount": $scope.notice.roomCount,"description" : $scope.notice.description,"contacts":$scope.notice.phone,
	      	// 	"images": loadedFilesId}).
		      // 	success(function(data) {
		      //     	resetForm();
		      //     	Materialize.toast('Объявление добавлено.', 3000);
		      // 	}).error(function(data) { console.log('error') });
	    } else {
	      	Materialize.toast('Заполните обязательные поля.', 3000);
	    }
    }

    function resetForm() {
	    $scope.notice= {};
	    $scope.createNotice.adress.$touched = false;
	    $scope.createNotice.cost.$touched = false;
	    $scope.createNotice.phone.$touched = false;
	    $scope.createNotice.description.$touched = false;
	    $scope.submitted = false;
	    $('[name = "adress"]').removeClass('valid');
	    $('[name = "cost"]').removeClass('valid');
	    $('[name = "phone"]').removeClass('valid');
	    $('[name = "description"]').removeClass('valid');
	    $scope.notice.roomCount = 1;
	    $('.file-field .file-path').val("");
	    $scope.loadFiles = [];
	    loadedFilesId = [];
	    $('.drag-box span').removeClass('drag-white');
	    $scope.notice.currency = ''
	}

	$scope.removeFile = function(image) {
		var removed;
		for(var i = 0; i < $scope.loadFiles.length; i++) {
			if ($scope.loadFiles[i].name === image.name) { removed = i; break; }
		}
		if (removed !== undefined) { $scope.loadFiles.splice(removed, 1); loadedFilesId.splice(removed, 1); }
	}

}]);