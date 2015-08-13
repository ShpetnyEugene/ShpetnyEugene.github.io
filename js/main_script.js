$( document ).ready(function() {

    $(".button-collapse").sideNav();
    
    
    $('#scroll-top').click(function(e) {
    	$('body, html').animate({scrollTop: 0}, 400);
    	return false;
    });

    
	$(window).scroll(function() {
		checkPosition();    	
	});

	var btn_heignt = $('.fixed-action-btn').height();
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
			console.log('top footer '+btn_heignt);
			$('.fixed-action-btn').css('position', 'absolute').css('top', (top_footer - btn_heignt / 2 - padding_top));
		} else {
			$('.fixed-action-btn').removeAttr('style').css('bottom','45px').css('right','24px');
		}
	}    

});