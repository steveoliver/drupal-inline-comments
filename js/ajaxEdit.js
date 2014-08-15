(function($) {
  $.fn.inlineCommentsBindAjaxEditSubmit = function(options) {
    var $$ = $(this);
    $$.options = options;
    return this.each(function(index) {
      this.inlineCommentsAjaxEdit = new inlineCommentsAjaxCommentEdit($$.options);
      this.inlineCommentsAjaxEdit.callAjax();
    });
  };
})(jQuery);

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

inlineCommentsAjaxCommentEdit.prototype.callAjax = function(context) {
  var $$ = this;

  // Override the submit handler.
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
      $.ajax({
        type: $$.ajaxtype,
        url: $$.url,
        data: $$.formdata,
        success: function(res) {
          $$.result = Drupal.parseJson(res);
          data = $($$.result.data);
          $$.targetEle.html(data);
          $$.targetEle.reformatPager($$.targetEle);
          var commentContainer = $$.commentform.parents('.views-row').find('.views-field-comment-count a.inline-comments-loader-click');
          if (commentContainer.length == 0) {
            commentContainer = $$.commentform.parents('.views-row').find('.views-field-comment-count span');
          }
          var commentGroup = $$.commentform.parents('.views-row').find('.comment-group');
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
              commentContainer.wrap('<a href="/node/' + nid + '" class="inline-comments-loader-click"/></a>');
            }
            commentContainer.text('View ' + NewNumComments + ' Comments');
            $('#edit-comment').attr('value', '');
            if ($$.slideDown == true) {
              $$.commentform.slideDown('slow');
            } else {
              $$.commentform.parents('.comment-form').remove();
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
