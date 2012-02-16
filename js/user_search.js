;(function($) {
	Drupal.behaviors.user_search = function(context) {
	  $('#edit-submit-user-search').attr('value', 'Search');
	  $('#edit-mail').attr('size', 20);
	  emailsearch = $('#edit-mail').attr('value');
	  namesearch = $('#edit-uid').attr('value');
	  if(emailsearch == '' && namesearch == ''){
	    $('.view-user-search  .view-content').addClass('hidden');
  	  $('.block #views-pager .item-list').addClass('hidden');
	  }
	};
})(jQuery);