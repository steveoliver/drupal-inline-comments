(function($) {
	Drupal.behaviors.lazyAjaxComments = function(context) {
	  var options = {};
	  options['targetEle'] = $('#comments');
		options['slideDown'] = true;
		$('#comment-form[action^="/comment/reply"]').inlineCommentsBindAjaxReplySubmit(options);
//    // different targetEle for Edit??
    $('#comment-form[action^="/comment/edit"]').inlineCommentsBindAjaxEditSubmit(options);
	};
})(jQuery);
