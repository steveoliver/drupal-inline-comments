;(function($) { // wrapping $ jQuery alias in a local function to allow compatibilty with other libraries
	jQuery.fn.charCount = function(options) {
		return this.each(function(index) {
		  var $$ = $(this);
      numchars = $$.attr('value').length;
      var quotation = $$.parents('form#comment-form').prev('.comment_quote');
      if($(quotation).length){
        numchars  = numchars + $(quotation).html(). length;
      }
      var parentForm = $$.parents('#comment-form');
      if(parentForm.find('.totalcharsused').size() == 0){
         var counter = $("<div>You have used <span class=\'totalcharsused\'>0</span> characters</div>");
    		 parentForm.find('.description').append(counter);
      }
     
      $('#comment-form .totalcharsused').html(numchars);
      if(numchars > Drupal.settings.inline_comments.max_comment_length) {
        $('#comment-form .totalcharsused').addClass('error');
      }
      else{
        $('#comment-form .totalcharsused').removeClass('error');
      }
		});
	};
})(jQuery);