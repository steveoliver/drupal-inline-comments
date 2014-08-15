/**
 * @file
 * Inline Comments jQuery EDIT functions.
 */

(function ($) {
  $.fn.inlineCommentsAlterEditLinks = function (options) {
    var defaults = {
      content: ''
    };
    options = $.extend(defaults, options);
    return this.each(function (index) {
      var $$ = $(this);
      var hreflink = $$.attr('href');
      var regex = /\/comment\/edit\/([0-9]+)/i;
      var params = hreflink.match(regex);
      var url = '/ajax/inline_comments/edit_load/' + params[1];
      var comment_group = $$.parents('.inline-comments-comment-group');
      var comment = $$.parents('.comment');
      comment = $(comment);
      comment.replaceWith('<div class=\'comment-form\'>put that comment form here!</div>');
      var form = $(comment_group).find('.comment-form');
      form = $(form);
      $.ajax({
        type: 'GET',
        url: url,
        success: function (res) {
          var result = Drupal.parseJson(res);
          form.append(result.data).show();
          form.prepend(options.content);
          var counter = $("<div>You have used <span class=\'totalcharsused\'>0</span> characters</div>");
          var action = form.find('form').attr('action');
          var newAction = action.replace("load", "save");
          form.find('form').attr('action', newAction);
          form.find('.description').append(counter);
          form.find('#edit-comment').addClass('ajaxComments');
          var closeLink = $('<a href=\'#\' class=\'formcloselink\'>X Close</a>');
          form.append(closeLink);
          Drupal.attachBehaviors(form);
          form.find('.description div').append(' including reply quotes');
        }
      });
    });
  };
})(jQuery);
