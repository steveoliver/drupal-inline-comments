<?php

class inline_comments_handler_field_inline_comments extends views_handler_field {
  var $output; 
  function render($values) {
      global $user;
      drupal_add_css(drupal_get_path('module', 'inline_comments') . '/css/inline_comments_views.css');
			drupal_add_js(drupal_get_path('module', 'inline_comments') . '/js/loadComments.js');
			drupal_add_js(drupal_get_path('module', 'inline_comments') . '/js/reformatPager.js');
			drupal_add_js(drupal_get_path('module', 'inline_comments') . '/js/loadPager.js');
			drupal_add_js(drupal_get_path('module', 'inline_comments') . '/js/reply.js');
//			drupal_add_js(drupal_get_path('module', 'inline_comments') . '/js/charCount.js');
			drupal_add_js(drupal_get_path('module', 'inline_comments') . '/js/ajaxPoster.js');
			drupal_add_js(drupal_get_path('module', 'inline_comments') . '/js/comment_toggle.js');
			$output = '<div class="node-nid">'  .  $values->nid .  '</div>';
			$output .= '<div class="user-uid">'  .  $user->uid .  '</div>';
			if(user_access('access comments')){
			  switch($values->node_comment_statistics_comment_count){
          case 0:
            $output .= '0 Comments';
          break;
          case 1: 
            $output .= l('View 1 Comment', 'node/' .  $values->nid, array('attributes' => array('class' => 'comment-click')));
          break;

          default: 
            $output .= l(t('View ') . $values->node_comment_statistics_comment_count .  ' Comments', 'node/' .  $values->nid, array('attributes' => array('class' => 'comment-click')));
          break;
        }
			}

      if(user_access('post comments without approval')){
        $output .= l(t('Add Comment '), 'comment/reply/' .  $values->nid,  array('attributes' => array('class' => 'comment-link')));
      }
    return $output;
  }
}