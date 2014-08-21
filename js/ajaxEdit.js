(function($) {

  // Alters comment edit links.
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
      comment.replaceWith('<div class="comment-form comment-edit-form">put that comment form here!</div>');
      var form = $(comment_group).find('.comment-edit-form');
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

  // Binds ajax functionality to comment edit link.
  $.fn.inlineCommentsBindAjaxEditSubmit = function(options) {
    var $$ = $(this);
    $$.options = options;
    return this.each(function(index) {
      this.inlineCommentsAjaxEdit = new inlineCommentsAjaxCommentEdit($$.options);
      this.inlineCommentsAjaxEdit.callAjax();
    });
  };

})(jQuery);

//
function inlineCommentsAjaxCommentEdit(options) {
  var $$ = this;
  console.log($$);
  ctext = $('.ajaxComments').length > 0 ? $('.ajaxComments') : $('#edit-comment');
  jQuery.extend($$, {
    commentform: $('#comment-form'),
    comment_text: ctext,
    action: $('#comment-form').attr('action'),
    nid: $('#comment-form').parents('.views-row').find('.node-nid').text(),
    uid: $('#comment-form').parents('.views-row').find('.user-uid').text(),
    cid: '000',
    targetEle: $('#comments'),
    url: '/ajax/inline_comments/edit_load/' + 000, // $('#comment-form').attr('action'), // '/ajax/inline_comments/add_comments',
    slideDown: false,
    ajaxtype: 'POST'
  }, options);
  if (this.targetEle.size() == 0) {
    this.targetEle = $$.commentform.parents('.comment-form'); // get the .comment-group
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
    'cid': $$.cid,
    'action': $$.action
  };
};

//
inlineCommentsAjaxCommentEdit.prototype.callAjax = function(context) {
  var $$ = this;

  // Custom submit handler for comment edit forms.
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

    // Make an ajax call.
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
            $$.commentform.parents('.comment-edit-form').remove();
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
