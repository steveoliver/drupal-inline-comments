;(function($) {
  jQuery.fn.ajaxPost = function(options) {
    var $$ = $(this);
    $$.options = options;
    return this.each(function(index) {
      this.ajaxPost = new ajaxCommentsPoster($$.options);
      this.ajaxPost.callAjax();
    });
  };
})(jQuery);



function ajaxCommentsPoster(options) {
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
  },
  options);
  if (this.targetEle.size() == 0) {
    this.targetEle = this.commentform.parent().next(); // get the .comment-group 
  }
  $('#comment-form').parents('.views-row').find('#edit-preview').remove();
  $('#comment-form').find('fieldset').remove();
  $('#comment-form').find('.form-item').not('#edit-comment-wrapper').remove();
  //$$.comment_text.keyup(function() {
//    $(this).charCount();
  //});
  $$.formdata = {
    'comment_text': $(ctext).attr('value'),
    'nid': $$.nid,
    'uid': $$.uid,
    'action': $$.action
  };
};

ajaxCommentsPoster.prototype.callAjax = function(context) {
  var $$ = this;

  $$.commentform.submit(function(e) {
    var clength = $$.comment_text.attr('value').length;
    //if (clength > Drupal.settings.inline_comments.max_comment_length) {
    //  $$.comment_text.css('color', 'red');
    //  return false;
    //} 
    //else {
      
      var quotation = $$.comment_text.parents('form#comment-form').prev('.comment_quote');
      if($(quotation).length){
        commentplusquote = '<div class=\'comment_quote\'>' + $(quotation).html() + '</div>'+ $$.comment_text.attr('value');
      }
      else {
         commentplusquote = $$.comment_text.attr('value');
      }
      $$.formdata['comment_text'] = commentplusquote; // set here to get value when submit is called NOT document.ready
//      $$.commentform.slideUp('fast');
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
          // find number of comment and increment it 
          var commentContainer = $$.commentform.parents('.views-row').find('.views-field-comment-count a.comment-click');
          if(commentContainer.length == 0){  // if ther are no comments  and the  anchor has been removed
            commentContainer = $$.commentform.parents('.views-row').find('.views-field-comment-count span');
          }
          var commentGroup = $$.commentform.parents('.views-row').find('.comment-group');
          var numcomments = commentContainer.text();
          var regex = /([0-9]+) Comment/i;
          var params = numcomments.match(regex);
          if(params){
            var NewNumComments = Number(params[1]) + 1;
            if (NewNumComments == 1) {
              $$.commentform.parents('.views-row').find('.views-field-comment-count').addClass('views-field-comment-count ajaxloaded');
              commentGroup.show();
              var nid = $$.commentform.parents('.views-row').find('.views-field-nid span').text();
              commentContainer.wrap('<a href="/node/' + nid + '" class="comment-click"/>');
            }
          
            commentContainer.text('View ' + NewNumComments + ' Comments');
            $('#edit-comment').attr('value', '');
            if ($$.slideDown == true) {
              $$.commentform.slideDown('slow');
            } else {
              // remove form 
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
    //}
  });
};