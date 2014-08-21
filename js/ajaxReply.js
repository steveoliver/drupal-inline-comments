(function($) {

  // Alters comment reply form links.
  $.fn.inlineCommentsAlterReplyLinks = function(options) {
    var defaults = {
      content: ''
    };
    options = $.extend(defaults, options);
    return this.each(function(index) {
      var $$ = $(this);
      //$('.comment-form').remove();
      var hreflink = $$.attr('href');
      var regex = /\/comment\/reply\/([0-9]+)/i;
      //var regex = /(comment)/
      var params = hreflink.match(regex);
      var theurl = '/ajax/inline_comments/get_comment_form/' + params[1]; //+ '/' + params[2];
      var row =  $$.parents('.views-row');
      row = $(row);
      var comment = row.find('.inline-comments-comment-group');
      comment = $(comment);
      $('<div class="comment-form comment-reply-form"></div>').insertBefore(comment).hide();
      var cform = row.find('.comment-reply-form');
      cform = $(cform);
      $.ajax({
        type: 'GET',
        url: theurl,
        success: function(res) {
          var result = Drupal.parseJson(res);
          cform.append(result.data).show();
          cform.prepend(options.content);
          var counter = $("<div>You have used <span class=\'totalcharsused\'>0</span> characters</div>");
          cform.find('.description').append(counter);
          cform.find('#edit-comment').addClass('ajaxComments');
          var closeLink = $('<a href=\'#\' class=\'formcloselink\'>X Close</a>');
          cform.append(closeLink);
          Drupal.attachBehaviors(cform);
          cform.find('#edit-comment').val('').keyup();
          cform.find('.description div').append(' including reply quotes');
        }
      });
    });
  };

  // Binds ajax functionality to comment reply form button.
  $.fn.inlineCommentsBindAjaxReplySubmit = function(options) {
    var $$ = $(this);
    $$.options = options;
    return this.each(function(index) {
      this.inlineCommentsAjaxReply = new inlineCommentsAjaxCommentReply($$.options);
      this.inlineCommentsAjaxReply.callAjax();
    });
  };

})(jQuery);

//
function inlineCommentsAjaxCommentReply(options) {
  var $$ = this;
  console.log($$);
  ctext = $('.ajaxComments').length > 0 ? $('.ajaxComments') : $('#edit-comment');
  jQuery.extend($$, {
    commentform: $('#comment-form'),
    comment_text: ctext,
    action: $('#comment-form').attr('action'),
    nid: $('#comment-form').parents('.views-row').find('.node-nid').text(),
    uid: $('#comment-form').parents('.views-row').find('.user-uid').text(),
    targetEle: $('#comments'),
    url: '/ajax/inline_comments/add_comments',
    slideDown: false,
    ajaxtype: 'POST'
  }, options);
  if (this.targetEle.size() == 0) {
    this.targetEle = $$.commentform.parents('.comment-reply-form'); // get the .inline-comments-comment-group
  }
  $('#comment-form').parents('.views-row').find('#edit-preview').remove();
  $('#comment-form').find('fieldset').remove();
  $('#comment-form').find('.form-item').not('#edit-comment-wrapper').remove();
  //$$.comment_text.keyup(function() {
  //  $(this).charCount();
  //});
  $$.formdata = {
    'comment_text': $(ctext).attr('value'),
    'nid': $$.nid,
    'uid': $$.uid,
    'action': $$.action
  };
};

//
inlineCommentsAjaxCommentReply.prototype.callAjax = function(context) {
  var $$ = this;

  // Custom submit handler for comment reply forms.
  $$.commentform.submit(function(e) {
    var clength = $$.comment_text.attr('value').length;
    var quotation = $$.comment_text.parents('form#comment-form').prev('.comment_quote');
    if ($(quotation).length) {
      commentplusquote = '<div class=\'comment_quote\'>' + $(quotation).html() + '</div>'+ $$.comment_text.attr('value');
    }
    else {
       commentplusquote = $$.comment_text.attr('value');
    }
    $$.formdata['comment_text'] = commentplusquote; // set here to get value when submit is called NOT document.ready

    // Clear out the comment form for next usage.
    $('#edit-comment').attr('value', '');

    // Make AJAX call.
    $.ajax({
      type: $$.ajaxtype,
      url: $$.url,
      data: $$.formdata,
      success: function(res) {
        $$.result = Drupal.parseJson(res);
        data = $($$.result.data);
        $$.targetEle.html(data);
        $$.targetEle.inlineCommentsReformatPager($$.targetEle);
        var commentContainer = $$.commentform.parents('.views-row').find('.views-field-comment-count a.inline-comments-loader-link');
        if (commentContainer.length == 0) {
          commentContainer = $$.commentform.parents('.views-row').find('.views-field-comment-count span');
        }
        var commentGroup = $$.commentform.parents('.views-row').find('.inline-comments-comment-group');
        var numcomments = commentContainer.text();
        var regex = /([0-9]+) Comment/i;
        var params = numcomments.match(regex);
        if (params) {
          var editing = ($($$).attr('action').match(/edit_save/).length == 0);
          var NewNumComments = (editing) ? Number(params[1]) + 1 : Number(params[1]);
          if (NewNumComments == 1) {
            $$.commentform.parents('.views-row').find('.views-field-comment-count').addClass('views-field-comment-count ajaxloaded');
            commentGroup.show();
            var nid = $$.commentform.parents('.views-row').find('.views-field-nid span').text();
            commentContainer.wrap('<a href="/node/' + nid + '" class="inline-comments-loader-link"/></a>');
          }
          commentContainer.text('View ' + NewNumComments + ' Comments');
          $('#edit-comment').attr('value', '');
          if ($$.slideDown == true) {
            $$.commentform.slideDown('slow');
          } else {
            $$.commentform.parents('.comment-reply-form').remove();
          }
          $('.totalcharsused').text('0');
        }
        Drupal.attachBehaviors();
      },
      error: function() {
        alert('ajax error');
        e.preventDefault();
      }
    });
    e.preventDefault();
  });
};
