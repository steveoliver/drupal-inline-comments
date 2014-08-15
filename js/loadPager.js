(function($) { // wrapping $ jQuery alias in a local function to allow compatibilty with other libraries
	jQuery.fn.inlineCommentsLoadPager = function(options) {
		return this.each(function(index) {
		  var $$ = $(this);
      var loadlink = $$.attr('href');
    	$$.fadeOut('fast');
    	var commentgroup = $$.parents('.inline-comments-comment-group');
    	commentgroup = $(commentgroup);
    	var loading = $$.parents('.spinner');
    	$(loading).fadeIn('fast');
    	$.ajax({
    		type: 'GET',
    		url: loadlink,
    		success: function(res) {
    			var result = Drupal.parseJson(res);
    			markup = $(result.data);
    			commentgroup.append(markup);
    			$(loading).fadeOut('fast');
    			var options = {};
					options['ele'] = commentgroup;
    			commentgroup.inlineCommentsReformatPager(options);
    			Drupal.attachBehaviors(commentgroup);
    		}
    	});
    	return false;
		});
	};
})(jQuery);