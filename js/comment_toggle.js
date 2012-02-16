;(function($) {
	Drupal.behaviors.comment_toggle = function(context) {
		$('div.comments.block div.comment').hide();
		$('div.comments.block h2.comments-header').click(function() {
			$(this).toggleClass('expanded').parents('div.comments.block').find('div.comment').slideToggle('fast');
		});
		$('.comment-click', context).unbind('click').bind('click', function() {
			$(this).loadComments();
			return false;
		});
		$('.pager-next a.active', context).click( function(e){
				$(this).loadPager();
				e.preventDefault();
		});
		
		$('a.comment-link, context').unbind('click').bind('click', function(){
		    // open expanded comments if not expanded already
		    var row =  $(this).parents('.views-row');
		    var commentclick = row.find('.comment-click');
				var commentgroup = row.find('.comment-group');
				var reply = row.find('.comment-form');
		    if(commentclick){
		     if(commentgroup.is(':hidden') || commentgroup.length == 0){
		       commentclick.click();
		     }
		    }
				if(reply.length == 0 ) {
		    	options['targetEle'] = $(this).parents('.views-row').find('.comment-group');
		  		$(this).reply();
				}
    		return false;
		});
		$('a.closelink').click(function(e) {
		  var group =  $(this).parents('.comment-group');
			var theseComments = new closeComments(group);
			theseComments.group = $(this).parents('.comment-group');
			theseComments.slide();
			theseComments.scrollerUp();
			e.preventDefault();
		});

		$('a.formcloselink').click(function(e) {
		  var group =  $(this).parents('.comment-form');
		  var thoseComments = new closeComments(group);
			thoseComments.slide();
			thoseComments.scrollerUp();
			group.remove();
			e.preventDefault();
		});
		
		$('#comment-form', context).unbind('submit');
		var options = {};
    options['slideDown'] = false;
		options['targetEle'] = $(this).parents('.comment-group');
		if($('body.page-user').length > 0){
		  options['targetEle'] = $('.panel-pane.pane-node-comments .inner');
		}
		$('#comment-form', context).ajaxPost(options, function(){
		  	Drupal.attachBehaviors();
		});
		
		//$('#edit-comment').keyup(function() {
		//	$(this).charCount();
		//});
		
		$('.views-field-comment-count span a').each( function(){
			if($(this).text() == 'View 0 Comments' ){
				var row = $(this).parents('.views-row');
			  $(this).text('0 Comments');
			  var thisText = $(this).text();
				$(this).replaceWith(thisText);
				// add commentgroup 
				var comments = $('<div class=\'comment-group\'></div>');
				$(row).append(comments);
				comments.hide();
			}
			if($(this).text() =='View 1 Comments'){
				$(this).text('View 1 Comment');
			}
		});
		$('.reply_link').click( function(e){
		  e.preventDefault();
		  comment_content = $(this).parents('.links').prev().html();
		  submitted =  $(this).parents('.links').prev().prev().html();
			//html_comment = "<!-- Add your reply below this line  -->";
			quote = "<div class='comment_quote'>" + submitted  + comment_content + "</div>";
			re = /\n/gi;
			quote =  quote.replace(re, '');
			quote = quote + '\n';
		  addcomment =  $(this).parents('.views-row').find('.comment-form').length;
			if(addcomment == 0){
				$(this).reply({
					content: quote
				});
			}
		});
	};

})(jQuery);



function closeComments(group) {
	if(group) {
	  this.group = group;
	}
	this.scroller = group.offset().top -150;
}
closeComments.prototype.slide = function(){
  $(this.group).slideUp('slow');
};
closeComments.prototype.scrollerUp = function(){
  $('html,body').animate({
		scrollTop: this.scroller
	},
	1000);
};


