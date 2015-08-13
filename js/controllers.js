'use strict';

/* Controllers */

var rentHouseControllers = angular.module('rentHouseControllers', []);

rentHouseControllers.controller('AdvertListCtrl', ['$scope', '$routeParams', '$sessionStorage', 'rentService', function($scope, $routeParams, $sessionStorage, rentService) {
   
    $sessionStorage.$default({
      rentCountOnPage : '10'
    });

    var pageNumber = $routeParams.pageNumb;
    var pagination = {
      count: 0,
      numbers: [],
      leftArrow: {},
      rightArrow: {}
    };
    pagination.leftArrow = $('#pagination li:first-of-type');
    pagination.rightArrow = $('#pagination li:last-of-type');
    $scope.pagination = pagination;
    $scope.selected = parseInt(pageNumber);
    $scope.countRentOnPage = $sessionStorage.rentCountOnPage;
    setDataOnPage();

    function setDataOnPage() {
      rentService.getCountPage($scope.countRentOnPage).then(
            function (result) { // success
              pagination.count = result;
              fillNumberPagination();
              getAdvertByNumbPage();
              checkDisableArrow($scope.selected);
            }, function (error) { console.log(error.statusText); } //error
        );
    };

    function getAdvertByNumbPage() {
      rentService.getPage($scope.countRentOnPage, pageNumber).then(function (result) {
          $scope.adverts = result;
          setImagesUrl();
        }, function (error) { console.log(error.statusText); }
      );
    }

    function setImagesUrl() {
      angular.forEach($scope.adverts, function(val, i) {
        $scope.adverts[i].images[0] = ($scope.adverts[i].images[0] !== undefined) ? used_domain +'/images/get/'+ $scope.adverts[i].images[0] : 'images/noimage.jpg';
      });
    }

    $scope.changeRentOnPage = function(count) {
      $scope.countRentOnPage = count;
      $sessionStorage.rentCountOnPage = count;
      setDataOnPage();
    }

    $scope.isSelected = function(number) {
        return $scope.selected === number;
    }

    function fillNumberPagination() {
      pagination.numbers = [];
      if (pagination.count < 5) {
        for(var i = 1; i < pagination.count + 1; i++) {
          pagination.numbers.push(i);
        }
      } else {
        if (pagination.count - pageNumber < 5) { // отображает 5 последних страниц
          for (var i = 0; i < 5; i++) {
            pagination.numbers.unshift(pagination.count - i);
          }
        } else { // вставляет троеточие
          for(var i = 0; i < 3; i++) {
            pagination.numbers.push(parseInt(pageNumber) + i);
          }
          pagination.numbers[3] = '...';
          pagination.numbers[4] = pagination.count;
        }
      }
      
    }

    function checkDisableArrow(number) {
      if (number == 1) {
        if (!$(pagination.leftArrow).hasClass('disabled')) { $(pagination.leftArrow).removeClass('waves-effect').addClass('disabled'); }
      } else {
        if (!$(pagination.leftArrow).hasClass('waves-effect')) { $(pagination.leftArrow).removeClass('disabled').addClass('waves-effect'); }
      }
      if (number == pagination.numbers[pagination.numbers.length - 1]) {
        if (!$(pagination.rightArrow).hasClass('disabled')) { $(pagination.rightArrow).removeClass('waves-effect').addClass('disabled'); }
      } else {
        if (!$(pagination.rightArrow).hasClass('waves-effect')) { $(pagination.rightArrow).removeClass('disabled').addClass('waves-effect'); }
      }
      if ($(pagination.leftArrow).hasClass('waves-effect')) { $(pagination.leftArrow).find('a').attr('href', '#rent/'+ ($scope.selected - 1)); }
      if ($(pagination.rightArrow).hasClass('waves-effect')) { $(pagination.rightArrow).find('a').attr('href', '#rent/'+ ($scope.selected + 1)); }
    }
}]);

rentHouseControllers.controller('OffersListCtrl', ['$scope', '$localStorage', 'wishService', function($scope, $localStorage, wishService) {

  $localStorage.$default({
    liked_wish: [],
    disliked_wish: []
  });

  var liked_enum = {LIKED: 'favorite', NONLIKED: 'favorite_border'};
  var disliked_enum = {DISLIKED: 'remove_circle', NONDISLIKED: 'remove_circle_outline'};

  wishService.getAll().then(function (result) {
        $scope.wishes = result;
        addLikedWish();
        addDislikedWish();
      }, function (error) { console.log(error.statusText); }
    );

  $scope.addWish = function() {
    console.log('submit');
    $scope.submitted = true;
    if ($scope.messageForm.$valid) {
      wishService.addWish($scope.message).then(function (result) {
          result.liked_icon = liked_enum.NONLIKED;
          result.disliked_icon = disliked_enum.NONDISLIKED;
          $scope.wishes.unshift(result);
          resetForm();
          Materialize.toast('Ваш отзыв или пожелание добавлены.', 3000);
        }, function (error) { console.log(error.statusText); }
      );
    } else {
      Materialize.toast('Заполните обязательные поля.', 3000);
    }
     
  }

  function resetForm() {
    $scope.message = '';
    $scope.submitted = false;
    $scope.messageForm.mes.$touched = false;
    $('[name = "mes"]').removeClass('valid');
  }

  $scope.addLike = function(wish) {
    if (!checkLikedWish(wish.id) && !checkDislikedWish(wish.id)) {
      wishService.addLike(wish.id).then(function (result) {
          wish.likes++;
          $localStorage.liked_wish.push(wish.id);
          wish.liked_icon = liked_enum.LIKED;
        }, function (error) { console.log(error.statusText); }
      );
    }
  }

  $scope.addDislike = function(wish) {
    if (!checkDislikedWish(wish.id) && !checkLikedWish(wish.id)) {
        wishService.addDislike(wish.id).then(function (result) {
            wish.dislikes++;
            $localStorage.disliked_wish.push(wish.id);
            wish.disliked_icon = disliked_enum.DISLIKED;
        }, function (error) { console.log(error.statusText); }
      );
    }
  }

  function checkLikedWish(checkId) {
    var isLike = false;
    angular.forEach($localStorage.liked_wish, function(value, key) {
      if (value == checkId) { isLike = true; }
    });
    return isLike;
  }

  function checkDislikedWish(checkId) {
    var isDislike = false;
    angular.forEach($localStorage.disliked_wish, function(value, key) {
      if (value == checkId) { isDislike = true; }
    });
    return isDislike;
  }

  function addLikedWish() {
    angular.forEach($scope.wishes, function(value, key) {
      if (checkLikedWish(value.id)) { value.liked_icon = liked_enum.LIKED; } else { value.liked_icon = liked_enum.NONLIKED; }
    });
  }

  function addDislikedWish() {
    angular.forEach($scope.wishes, function(value, key) {
      if (checkDislikedWish(value.id)) { value.disliked_icon = disliked_enum.DISLIKED; } 
      else { value.disliked_icon = disliked_enum.NONDISLIKED; }
    });
  }

}]);

rentHouseControllers.controller('AdvertDetailCtrl', ['$rootScope', '$scope', 'rentService', '$routeParams','$http', function($rootScope, $scope, rentService, $routeParams, $http) {

  $scope.$on('$viewContentLoaded', function(event) {
      $('.nav-wrapper .brand-logo').addClass('back-btn');
      $('.nav-wrapper .brand-logo').attr('href', '#' + $rootScope.getPrevPage());
      $('.nav-wrapper .brand-logo').html('<i class="material-icons">keyboard_arrow_left</i><span>Назад</span>');
  });

  $scope.$on("$destroy", function() {
      $('.nav-wrapper .brand-logo').removeClass('back-btn');
      $('.nav-wrapper .brand-logo').attr('href', '#!');
      $('.nav-wrapper .brand-logo').html('<img src="images/logo.png">');
  });

  rentService.get($routeParams.apartmentId).then(function (data) {
        if (data.images.length > 3) { data.images.length = 3; } // в будущем убрать и сделать слайдер для thumbnails
        setImagesUrl(data.images);
        if (data.images.length == 0) { data.images.push('images/noimage.jpg'); };

        $scope.notice = data;
        $scope.mainImageUrl = data.images[0];
        increaseViews();  
      }, function (error) { console.log(error.statusText); }
    );

  $scope.setImage = function(imageUrl) {
    console.log('setImage');
    $scope.mainImageUrl = imageUrl;
  }

  function setImagesUrl(data) {
    angular.forEach( data , function(value, index) {
      data[index] = used_domain +'/images/get/' + value;
    });
  }

  function increaseViews() {
    $http.post('http://services.nesterenya.com/rent/view/'+$routeParams.apartmentId).
      success(function(data) {
        $scope.notice.views++;
      }).error(function(data) { console.log('error increase views') });
  }

}]);

rentHouseControllers.controller('ContactCtrl', ['$scope', '$http', 'contactService', function($scope, $http, contactService) {

  $scope.$on('$viewContentLoaded', function(event) {
      $('.page-footer').css('display', 'none');
  });

  $scope.$on("$destroy", function() {
      $('.page-footer').css('display', 'block');
  });

  // var invalidStyle = { 'border-bottom': '1px solid #F44336', 'box-shadow': '0 1px 0 0 #F44336' };
  // $scope.invalidInputStyle = {};
  // $scope.textAreaStyle = {};

  // $scope.blurChangeStyle = function(types) {
  //   console.log(types)
  //   if ( types == "email") { $scope.invalidInputStyle = invalidStyle; }
  //   if ( types == "txt") { $scope.textAreaStyle = invalidStyle; }
  // }

  $scope.submitForm = function() {
    $scope.submitted = true;
    if ($scope.contactForm.$valid) {
        contactService.add($scope.contact).then(function (data) {
          resetForm();
          Materialize.toast('Сообщение успешно отправлено.', 3000);
        }, function (error) { console.log(error.statusText); }
      );
    } else {
      Materialize.toast('Заполните обязательные поля.', 3000);
    }
  }

  function resetForm() {
    $scope.contact= {};
    $scope.contactForm.myemail.$touched = false;
    $scope.contactForm.message.$touched = false;
    $scope.submitted = false;
    $('[name = "name"]').removeClass('valid');
    $('[name = "myemail"]').removeClass('valid');
    $('[name = "message"]').removeClass('valid');
  }

}]);

rentHouseControllers.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
  
  $scope.$on('$viewContentLoaded', function(event) {
      $('.page-footer').css('margin-top', '0');
  });

  $scope.$on("$destroy", function() {
      $('.page-footer').attr('style','');
  });

}]);