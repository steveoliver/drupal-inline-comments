(function($) {

  // Activates inline (AJAX) functionality on new and existing comments.
  Drupal.behaviors.inlineCommentsActivateCommentToggle = function(context) {

    // Hides comments.
    $('div.comments.block div.comment').hide();
    $('div.comments.block h2.comments-header').click(function() {
      $(this).toggleClass('expanded').parents('div.comments.block').find('div.comment').slideToggle('fast');
    });

    // Adds comment-loading behavior to special links.
    $('.inline-comments-loader-link', context).unbind('click').bind('click', function() {
      $(this).inlineCommentsLoadComments();
      return false;
    });

    // Overrides pager functionality.
    $('.pager-next a.active', context).click(function(e){
        $(this).inlineCommentsLoadPager();
        e.preventDefault();
    });

    // Overrides comment links.
    $('a.comment-link').unbind('click').bind('click', function(){
      // Open expanded comments if not expanded already
      var row =  $(this).parents('.views-row');
      var commentloader = row.find('.inline-comments-loader-link');
      var commentgroup = row.find('.inline-comments-comment-group');
      if (commentloader) {
        if (commentgroup.is(':hidden') || commentgroup.length == 0) {
          commentloader.click();
        }
      }
      var reply = row.find('.comment-reply-form');
      if (reply.length == 0 ) {
        options['targetEle'] = $(this).parents('.views-row').find('.inline-comments-comment-group');
        $(this).inlineCommentsAlterReplyLinks(options);
      }

      return false;
    });

    // Binds inline ajax editing to EDIT links.
    // THIS ONE IS THE ONE THAT MAKES IT ALL WORK!
    $('ul.links li.comment_edit a').unbind('click').bind('click', function() {

      // Open expanded comments if not expanded already
      var row =  $(this).parents('.views-row');
      var commentloader = row.find('.inline-comments-loader-link');
      var commentgroup = row.find('.inline-comments-comment-group');
      if (commentloader) {
        if (commentgroup.is(':hidden') || commentgroup.length == 0) {
          commentloader.click();
        }
      }
      var reply = row.find('.comment-form');
      if (reply.length == 0 ) {
        options['targetEle'] = $(this).parents('.views-row').find('.inline-comments-comment-group');
        $(this).inlineCommentsAlterEditLinks(options);
      }

      return false;
//      // options['targetEle'] = '...'; ?
//      $(this).inlineCommentsAlterEditLinks();
//      return false;
    });

    // Adds functionality to the Close link(s).
    $('a.closelink').click(function(e) {
      var group =  $(this).parents('.inline-comments-comment-group');
      var theseComments = new inlineCommentsCloseComments(group);
      theseComments.group = $(this).parents('.inline-comments-comment-group');
      theseComments.slide();
      theseComments.scrollerUp();
      e.preventDefault();
    });

    // Adds functionality to the Close (form?) link(s)?
    $('a.formcloselink').click(function(e) {
      var group =  $(this).parents('.comment-form');
      var thoseComments = new inlineCommentsCloseComments(group);
      thoseComments.slide();
      thoseComments.scrollerUp();
      group.remove();
      e.preventDefault();
    });

    // Unbind submit handler from current comment form?
    $('#comment-form', context).unbind('submit');

    //
    var options = {};
    options['slideDown'] = false;
    options['targetEle'] = $(this).parents('.inline-comments-comment-group');
    if ($('body.page-user').length > 0) {
      options['targetEle'] = $('.panel-pane.pane-node-comments .inner');
    }
//    $('#comment-form', context).inlineCommentsBindAjaxReplySubmit(options);
//    $('#comment-form[action^="/comment/reply"]', context).inlineCommentsBindAjaxReplySubmit(options);
//    $('.comment-edit-form #comment-form', context).inlineCommentsBindAjaxEditSubmit(options, function() {
//      Drupal.attachBehaviors();
//    });
    $('.comment-reply-form #comment-form', context).inlineCommentsBindAjaxReplySubmit(options, function() {
      Drupal.attachBehaviors();
    });

    // Transforms comment count views fields into inline commenting links.
    $('.views-field-comment-count span a').each( function(){
      if ($(this).text() == 'View 0 Comments' ) {
        var row = $(this).parents('.views-row');

        $(this).text('0 Comments');    // < with this here...
        var thisText = $(this).text();
        $(this).replaceWith(thisText); // ...is THIS necessary?

        // Create an initially hidden placeholder to put comments once loaded.
        var comments = $('<div class=\'inline-comments-comment-group\'></div>');
        $(row).append(comments);
        comments.hide();
      }
      if ($(this).text() =='View 1 Comments') {
        $(this).text('View 1 Comment');
        // Shouldn't this also create the inline-comments-comment-group?
      }
    });

    // I don't think this is used (the class doesn't exist in module codebase).
//    $('.reply_link').click( function(e){
//      e.preventDefault();
//      comment_content = $(this).parents('.links').prev().html();
//      submitted =  $(this).parents('.links').prev().prev().html();
//      //html_comment = "<!-- Add your reply below this line  -->";
//      quote = "<div class='comment_quote'>" + submitted  + comment_content + "</div>";
//      re = /\n/gi;
//      quote =  quote.replace(re, '');
//      quote = quote + '\n';
//      addcomment =  $(this).parents('.views-row').find('.comment-reply-form').length;
//      if(addcomment == 0){
//        $(this).inlineCommentsAjaxReply({
//          content: quote
//        });
//      }
//    });
  };

})(jQuery);


function inlineCommentsCloseComments(group) {
  if (group) {
    this.group = group;
  }
  this.scroller = group.offset().top -150;
}

inlineCommentsCloseComments.prototype.slide = function(){
  $(this.group).slideUp('slow');
};

inlineCommentsCloseComments.prototype.scrollerUp = function(){
  $('html,body').animate({
    scrollTop: this.scroller
  },
  1000);
};


