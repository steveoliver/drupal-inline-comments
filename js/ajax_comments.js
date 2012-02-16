;(function($) {
	Drupal.behaviors.lazyAjaxComments = function(context) {
	   var options = {};
	   options['targetEle'] = $('#comments');
		options['slideDown'] = true;
		$('#comment-form').ajaxPost();
	};

})(jQuery);

