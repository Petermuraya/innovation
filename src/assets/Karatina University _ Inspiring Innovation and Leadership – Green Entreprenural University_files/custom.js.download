(function( $ ) {
	
	$(window).bind("load", function() {
		$.ajax({
			type: 'POST',
			url: wpspagevisit.ajaxurl,
			async : false,
			data: {
				action : 'wps_count_page_visit',
				nonce : wpspagevisit.ajax_nonce,
			},
			success: function( data ) {

			}
		});
		
	});

})( jQuery );