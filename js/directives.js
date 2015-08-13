angular.module("materializeInit", ["materializeInit.tooltipped", "materializeInit.dropdown", "materializeInit.floatingBtn",
    "materializeInit.navmenu", "materializeInit.scrollTopBtn", "materializeInit.boxed", "materializeInit.parallax",
    'materializeInit.select', 'materializeInit.watchOffset']);

angular.module("myAnimation",['myAnimation.fadeIn']);
angular.module("myInputDirectives",['myInputDirectives.numbers', 'myInputDirectives.phone']);

angular.module("materializeInit.tooltipped", ['myInputDirectives.numbers'])
    .directive("tooltipped", ["$timeout", function ($timeout) {
        return {
        restrict: "EA",
            scope: true,
            link: function (scope, element) {
                $timeout(function () {
                    $('.tooltipped').tooltip({delay: 50});
                });
            }
        };
    }]);

angular.module("materializeInit.dropdown", [])
    .directive("dropdownInit", ["$timeout", function ($timeout) {
        return {
        restrict: "EA",
            scope: true,
            link: function (scope, element) {
                $timeout(function () {
                   $('.dropdown-button').dropdown();
                });
            }
        };
    }]);

angular.module("materializeInit.floatingBtn", [])
    .directive("loadScript", [function () {
        return {
        restrict: "EA",
            scope: true,
            link: function (scope, element) {

                scope.$watch('__offset', function(newValue, oldValue) {
                    checkPosition();
                });

                $(window).scroll(function() {
                    if ($('div').is('.fixed-action-btn')) {
                        checkPosition();
                    }       
                });

                if ($('div').is('.fixed-action-btn')) { var btn_heignt = $('.fixed-action-btn').height(); }
                function checkPosition() {
                    var fixed_bottom_height = 45;
                    var padding_top = 20;
                    // высота сверху до footer
                    var top_footer = $('.page-footer').offset().top;
                    var top_btn = $('.fixed-action-btn').offset().top;
                    // проскроллено сверху 
                    var top_scroll = $(document).scrollTop();
                     // высота видимой страницы
                    var screen_height = $(window).height();
                    // расстояние от начала страницы до низу плавающей кнопки
                    var bottom_btn_to_top_height = top_scroll + screen_height - fixed_bottom_height;

                    if (bottom_btn_to_top_height >= top_footer ) {
                        $('.fixed-action-btn').css('position', 'absolute').css('top', (top_footer - btn_heignt / 2 - padding_top));
                    } else {
                        $('.fixed-action-btn').removeAttr('style').css('bottom','45px').css('right','24px');
                    }
                }    
            }
        };
    }]);

angular.module("materializeInit.watchOffset", [])
    .directive( 'watchOffsetSource', function() {//следит за изменением высоты сверху до элемента
        return {
            link: function( scope, elem, attrs ) {
                scope.$watch( function() {
                    scope.__offset = $('.page-footer').offset().top;
                } );
            }
        }
    } );

angular.module("materializeInit.navmenu", [])
    .directive("navmenuInit", ["$timeout", function ($timeout) {
        return {
        restrict: "EA",
            scope: true,
            link: function (scope, element) {
                $timeout(function () {
                   $(".button-collapse").sideNav({
                        closeOnClick: true 
                   });
                });
            }
        };
    }]);

angular.module("materializeInit.scrollTopBtn", [])
    .directive("scrollTopBtnInit", ["$timeout", function ($timeout) {
        return {
        restrict: "EA",
            scope: true,
            link: function (scope, element) {
                $timeout(function () {
                   $('#scroll-top').click(function(e) {
                        $('body, html').animate({scrollTop: 0}, 400);
                        return false;
                    });
                });
            }
        };
    }]);

angular.module("materializeInit.boxed", [])
    .directive("boxedInit", ["$timeout", function ($timeout) {
        return {
        restrict: "EA",
            scope: true,
            link: function (scope, element) {
                $timeout(function () {
                    $('.materialboxed').materialbox();
                });
            }
        };
    }]);

angular.module("myAnimation.fadeIn", [])
    .directive('fadeIn', function($timeout){
        return {
            restrict: 'A',
            link: function($scope, $element, attrs){
                $element.on('load', function() {
                    $element.css("opacity", '0');
                    $timeout(function() {
                        $element.css("opacity", '1');
                    }, 600);
                });
            }
        }
    });

angular.module("materializeInit.parallax", [])
    .directive("parallaxInit", ["$timeout", function ($timeout) {
        return {
        restrict: "EA",
            scope: true,
            link: function (scope, element) {
                $timeout(function () {
                   $('.parallax').parallax();
                });
            }
        };
    }]);

angular.module("materializeInit.select", [])
    .directive("materialSelect", ["$compile", "$timeout", function ($compile, $timeout) {
        return {
            link: function (scope, element, attrs) {
                if (element.is("select")) {
                    $compile(element.contents())(scope);
                    $timeout(function () {
                        element.material_select();
                    });
                }
            }
        };
    }]);

angular.module('myInputDirectives.numbers', [])
    .directive('numbersOnly', function(){
       return {
         require: 'ngModel',
         link: function(scope, element, attrs, modelCtrl) {
           modelCtrl.$parsers.push(function (inputValue) {
               // this next if is necessary for when using ng-required on your input. 
               // In such cases, when a letter is typed first, this parser will be called
               // again, and the 2nd time, the value will be undefined
               var regExp = /[^0-9]{3}$/;
               if (inputValue == undefined) return '' 
               var transformedInput = inputValue.replace(/[^0-9]/g, '');
               if (transformedInput!=inputValue) {
                  modelCtrl.$setViewValue(transformedInput);
                  modelCtrl.$render();
               }         

               return transformedInput;         
           });
         }
       };
    });

angular.module('myInputDirectives.phone', [])
    .directive("phoneMask", ["$timeout", function ($timeout) {
        return {
        restrict: "EA",
            scope: true,
            link: function (scope, element) {
                $timeout(function () {
                   $('.new-notice #phone').mask("+375 (99) 999-99-99");
                });
            }
        };
    }]);

myApp.directive('orientable', function () {       
    return {
        link: function(scope, element, attrs) {   

            element.bind("load" , function(e){ 

                // success, "onload" catched
                // определение ориентации картинки

                if(this.naturalHeight > this.naturalWidth){
                    $(this).hasClass("horizontal") && $(this).removeClass("horizontal");
                    $(this).addClass("vertical");
                } 
                if(this.naturalHeight < this.naturalWidth || $('.photo-content').outerWidth() < this.naturalWidth){
                    $(this).hasClass("vertical") && $(this).removeClass("vertical");
                    $(this).addClass("horizontal");
                }
            });
        }
    }
});