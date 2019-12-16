

$(document).ready(function() {
	/*** Header fixed ***/
	$(window).scroll(function () {
		scroll_pixel = $(window).scrollTop();
		((scroll_pixel < 80) ? $('header').removeClass('header-fix') : $('header').addClass('header-fix'));
	});

	/*** For Custom Selectbox ***/
	$(".custom-select-box").append('<span></span>');
	$(".custom-select-box").each(function () {
		$(this).find('span').text($(this).find("select option:selected").text());
	});
	$(".custom-select-box").find('span').addClass('empty');
	$('.custom-select-box select').change(function () {
		if ($(this).val() == "0" || $(this).val() == "") {
			$(this).closest(".custom-select-box").find('span').addClass('empty');
		}
		else {
			$(this).closest(".custom-select-box").find('span').removeClass('empty');
		}
		$selected_val = ($(this).val());
		$(this).closest('.custom-select-box').find('span').text($(this).closest('.custom-select-box').find("select option:selected").text());
	});
		
	/*** Header nav toggle for responsive   ***/
	$(".navbar-toggle").click(function(){
		$('header').toggleClass("navbar-close");
		$('body').toggleClass("open-navbar");
		$(".nav-brand").slideToggle(200,function(){
			if(!$('header').hasClass('navbar-close'))	
			{
				$(".nav-brand > ul > li.parent").find('> .submenu-wrap').hide();
				$(".nav-brand > ul > li.parent").find('a').removeClass('open-subnav');
			}			
		});
	});

	var screen_width = $( window ).width();
	if(screen_width < 767) {
		$('.submenu-wrap').hide();
		$('.nav-brand > ul > li.parent > a').click(function(event){
			event.preventDefault();
			$(this).closest(".nav-brand > ul > li.parent").find('> .submenu-wrap').slideToggle('slow');
			$(this).toggleClass('open-subnav');
		});
		
		$('li.has-submenu .submenu-nav').hide();
		$('.nav-brand li.parent li.has-submenu a').click(function(event){
			event.preventDefault();
			$(this).closest(".nav-brand li.parent li.has-submenu").find('.submenu-nav').slideToggle('slow');
			$(this).parent().toggleClass('open-second-subnav');
		});
				/*** Portfolio toggle ***/
		$(".filter-toggle").click(function () {
			$("#filters").slideToggle().siblings().toggleClass('open-filter');
		});
	}

});

$(window).resize(function(){
    var screen_width = $( window ).width();
	if(screen_width > 767) {
		$('header').removeClass("navbar-close");
		$('body').removeClass("open-navbar");
		$(".nav-brand").css("display", "inline-block");	  
	}
	else
	{
		$('header').removeClass("navbar-close");
		$('body').removeClass("open-navbar");
		$(".nav-brand").css("display", "none");
	}
});

// $(document).ready(function() {
// 	/*** Header fixed ***/
// 	$(window).scroll(function () {
// 		scroll_pixel = $(window).scrollTop();
// 		((scroll_pixel < 80) ? $('header').removeClass('header-fix') : $('header').addClass('header-fix'));
// 	});

// 	/*** For Custom Selectbox ***/
// 	$(".custom-select-box").append('<span></span>');
// 	$(".custom-select-box").each(function () {
// 		$(this).find('span').text($(this).find("select option:selected").text());
// 	});
// 	$(".custom-select-box").find('span').addClass('empty');
// 	$('.custom-select-box select').change(function () {
// 		if ($(this).val() == "0" || $(this).val() == "") {
// 			$(this).closest(".custom-select-box").find('span').addClass('empty');
// 		}
// 		else {
// 			$(this).closest(".custom-select-box").find('span').removeClass('empty');
// 		}
// 		$selected_val = ($(this).val());
// 		$(this).closest('.custom-select-box').find('span').text($(this).closest('.custom-select-box').find("select option:selected").text());
// 	});
		
// 	/*** Header nav toggle for responsive   ***/
// 	$(".navbar-toggle").click(function(){
// 		$('header').toggleClass("navbar-close");
// 		$('body').toggleClass("open-navbar");
// 		$(".nav-brand").slideToggle(200,function(){
// 			if(!$('header').hasClass('navbar-close'))	
// 			{
// 				$(".nav-brand > ul > li.parent").find('> .submenu-wrap').hide();
// 				$(".nav-brand > ul > li.parent").find('a').removeClass('open-subnav');
// 			}			
// 		});
// 	});

// 	var screen_width = $( window ).width();
// 	if(screen_width < 767) {
// 		$('.submenu-wrap').hide();
// 		$('.nav-brand > ul > li.parent > a').click(function(event){
// 			event.preventDefault();
// 			$(this).closest(".nav-brand > ul > li.parent").find('> .submenu-wrap').slideToggle('slow');
// 			$(this).toggleClass('open-subnav');
// 		});
		
// 		$('li.has-submenu .submenu-nav').hide();
// 		$('.nav-brand li.parent li.has-submenu a').click(function(event){
// 			event.preventDefault();
// 			$(this).closest(".nav-brand li.parent li.has-submenu").find('.submenu-nav').slideToggle('slow');
// 			$(this).parent().toggleClass('open-second-subnav');
// 		});
// 	}

// });

// $(window).resize(function(){
//     var screen_width = $( window ).width();
// 	if(screen_width > 767) {
// 		$('header').removeClass("navbar-close");
// 		$('body').removeClass("open-navbar");
// 		$(".nav-brand").css("display", "inline-block");	  
// 	}
// 	else
// 	{
// 		$('header').removeClass("navbar-close");
// 		$('body').removeClass("open-navbar");
// 		$(".nav-brand").css("display", "none");
// 	}
// });