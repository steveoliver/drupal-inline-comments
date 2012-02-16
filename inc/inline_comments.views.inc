
<?php 

/**
 * Implementation of hook_views_handlers().
 *
 * @return array
 */
function inline_comments_views_handlers() {
  return array(
    'info' => array(
      'path' => drupal_get_path('module', 'inline_comments') .'/inc',
    ),
    'handlers' => array(
      'inline_comments_handler_field_inline_comments' => array(
        'parent' => 'views_handler_field',
      ),
    ),
  );
}


/**
 * Implementation of hook_views_data().
 *
 * @return array
 */
function inline_comments_views_data_alter(&$data) {
  // node_comment_statistics table

  // comment_count
  $data['node_comment_statistics']['comment_count'] = array(
    'title' => t('Inline Comments'),
    'help' => t('Inline ajax commeting on nodein a views field.'),
    'field' => array(
      'handler' => 'inline_comments_handler_field_inline_comments',
       'notafield' => TRUE,
    ),
  );
}