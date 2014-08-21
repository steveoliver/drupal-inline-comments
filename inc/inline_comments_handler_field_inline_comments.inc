<?php

class inline_comments_handler_field_inline_comments extends views_handler_field {

  function render($values) {
    global $user;

    $path = drupal_get_path('module', 'inline_comments');

    drupal_add_css($path . '/css/inline_comments_views.css');
    drupal_add_js($path . '/js/loadComments.js');
//    drupal_add_js($path . '/js/reformatPager.js');
    drupal_add_js($path . '/js/loadPager.js');
    drupal_add_js($path . '/js/ajaxReply.js');
    drupal_add_js($path . '/js/ajaxEdit.js');
    // drupal_add_js(drupal_get_path('module', 'inline_comments') . '/js/charCount.js');
    drupal_add_js($path . '/js/ajax_comments.js');
    drupal_add_js($path . '/js/comment_toggle.js');

    $output = '';
    $output .= '<div class="node-nid">' . $values->nid . '</div>';
    $output .= '<div class="user-uid">' . $user->uid . '</div>';

    if (user_access('access comments')) {
      switch ($values->node_comment_statistics_comment_count) {
        case 0:
          $output .= l('0 Comments', '#', array('attributes' => array('class' => 'inline-comments-loader-link')));
        break;
        case 1:
          $output .= l('View 1 Comment', 'node/' .  $values->nid, array('attributes' => array('class' => 'inline-comments-loader-link')));
        break;
        default:
          $output .= l(t('View ') . $values->node_comment_statistics_comment_count .  ' Comments', 'node/' .  $values->nid, array('attributes' => array('class' => 'inline-comments-loader-link')));
        break;
      }
    }

    if (user_access('post comments without approval')) {
      $output .= l(t('Add Comment '), 'comment/reply/' . $values->nid, array('attributes' => array('class' => 'comment-link')));
    }

    return $output;
  }
}
