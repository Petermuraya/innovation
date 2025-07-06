(function($){
	"use strict";

	$(document).ready(function(){

		$('select#display_name').wrap('<div class="kingster-lp-combobox" ></div>');

		$('#learn-press-course-tabs').each(function(){
			var tab_head = $(this).find('.learn-press-nav-tabs');
			var tab_slide_bar = $(this).find('.kingster-tab-slidebar');

			// init
			var slide_bar_width = tab_head.children('.active').outerWidth();
			var slide_bar_pos = tab_head.children('.active').position().left;
			tab_slide_bar.css({ 'width': slide_bar_width, 'margin-left': slide_bar_pos });

			$(window).on('load, resize', function(){
				slide_bar_width = tab_head.children('.active').outerWidth();
				slide_bar_pos = tab_head.children('.active').position().left;
				tab_slide_bar.css({ 'width': slide_bar_width, 'margin-left': slide_bar_pos });
			});

			// hover
			tab_head.children().hover(function(){
				tab_slide_bar.animate({ 'width': $(this).outerWidth(), 'margin-left': $(this).position().left }, { duration: 200, queue: false });
			}, function(){
				tab_slide_bar.animate({ 'width': slide_bar_width, 'margin-left': slide_bar_pos }, { duration: 200, queue: false });
			});


			//click
			tab_head.children().click(function(){
				slide_bar_width = $(this).outerWidth();
				slide_bar_pos = $(this).position().left;
				tab_slide_bar.animate({ 'width': slide_bar_width, 'margin-left': slide_bar_pos }, { duration: 200, queue: false });
			});
		});
	});


})(jQuery);