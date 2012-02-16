<?php 
$GLOBALS['uri'];
function inline_comments_add_comments(){
	
	//clean data and add comment to db
	$uid = check_plain($_POST['uid']);
	$nid = check_plain($_POST['nid']);
	$text = check_markup($_POST['comment_text']);
	$action = check_plain($_POST['action']);
	$action = preg_replace('/#.*/', '', $action);
	$action = preg_replace('/^\//', '', $action);
	$action = drupal_get_normal_path($action);
	$GLOBALS['uri'] = $action;
	//ctools_include('context');
	//ctools_include('plugins');
	//ctools_plugin_load_function('ctools', 'content_types', 'node_comments', 'ctools_comment_render');
	$comment = array();
	$comment['uid'] = $uid;
	$comment['nid'] = $nid;
	$comment['subject'] = substr($text, 0, 20);
  $comment['comment'] = $text;
  $comment['timestamp'] = time();
  comment_save($comment);
  $node = node_load($nid);
  $conf = array();
	$conf['mode'] = _comment_get_display_setting('mode', $node);
	$conf['order'] = _comment_get_display_setting('sort', $node);
	$conf['comments_per_page'] = _comment_get_display_setting('comments_per_page', $node);
	$comments = inline_comments_comment_render($node, $conf, $action);
	drupal_json(array( 'data' => $comments));
	
}

function inline_comments_get_comments(){
	//clean data 
	
	$nid = check_plain(arg(3));
	
	ctools_include('context');
	ctools_include('plugins');
	ctools_plugin_load_function('ctools', 'content_types', 'node_comments', 'ctools_comment_render');
  $node = node_load($nid);
  $conf = array(
    'mode' => _comment_get_display_setting('mode', $node),
    'order'=> _comment_get_display_setting('sort', $node),
    'comments_per_page'=> _comment_get_display_setting('comments_per_page', $node),
  );
	$comments = inline_comments_comment_render($node, $conf);

	drupal_json(array( 'data' => $comments));
	
}


function inline_comments_get_comment_form(){
	//clean data 
	if(module_exists('comment')){
	  $form = array();
  	$nid = check_plain(arg(3));
  	$pid = check_plain(arg(4));
  	$node = array('nid' => $nid);
  	$output = drupal_get_form('comment_form', $node, $title);
  	drupal_json(array( 'data' => $output));
	}
	else {
	  return;
	}	
}

function inline_comments_comment_render($node, $conf, $original_uri = NULL) {

  $output = '';
  if (!$node->comment) {
    return;
  }

  $mode = $conf['mode'];
  $order = $conf['order'];
  $comments_per_page = $conf['comments_per_page'];

  // Multiple comment view
  $query_count = 'SELECT COUNT(*) FROM {comments} c WHERE nid = %d';

    //We run drupal version > 6.13, users table has signature_format column
    $query = 'SELECT c.cid AS cid, c.pid, c.nid, c.subject, c.comment, c.format, c.timestamp, c.name, c.mail, c.homepage, u.uid, u.name AS registered_name, u.picture, u.signature, u.signature_format, u.data, c.thread, c.status, parent_user.uid as parent_uid, parent_user.data as parent_data, parent_user.name as parent_name, parent_user.picture as parent_picture FROM {comments} c INNER JOIN {users} u ON c.uid = u.uid LEFT OUTER JOIN {comments} parent ON c.pid = parent.cid LEFT OUTER JOIN {users} parent_user ON parent.uid = parent_user.uid WHERE c.nid = %d';

 

  $query_args = array($node->nid);
  if (!user_access('administer comments')) {
    $query       .= ' AND c.status = %d';
    $query_count .= ' AND status = %d';
    $query_args[] = COMMENT_PUBLISHED;
  }

  if ($order == COMMENT_ORDER_NEWEST_FIRST) {
    if ($mode == COMMENT_MODE_FLAT_COLLAPSED || $mode == COMMENT_MODE_FLAT_EXPANDED) {
      $query .= ' ORDER BY c.timestamp DESC';
    }
    else {
      $query .= ' ORDER BY c.thread DESC';
    }
  }
  else if ($order == COMMENT_ORDER_OLDEST_FIRST) {
    if ($mode == COMMENT_MODE_FLAT_COLLAPSED || $mode == COMMENT_MODE_FLAT_EXPANDED) {
      $query .= ' ORDER BY c.timestamp';
    }
    else {
      $query .= ' ORDER BY SUBSTRING(c.thread, 1, (LENGTH(c.thread) - 1))';
    }
  }
  $query = db_rewrite_sql($query, 'c', 'cid');
  $query_count = db_rewrite_sql($query_count, 'c', 'cid');
	$count = db_result(db_query($query_count, $node->nid));
	$pages = ceil($count / $comments_per_page);
	//$pages = 9;
  // Start a form, for use with comment control.
   $result = pager_query($query, $comments_per_page, 0, $query_count, $query_args);

  $divs = 0;
  $last_depth = 0;
  drupal_add_css(drupal_get_path('module', 'comment') .'/comment.css');
  while ($comment = db_fetch_object($result)) {
    $comment = drupal_unpack($comment);

    $comment->name  = $comment->uid ? $comment->registered_name : $comment->name;
    $comment->depth = count(explode('.', $comment->thread)) - 1;
		$links = module_invoke_all('link', 'comment', $comment, 1);
		drupal_alter('link', $links, $node, $comment);
    if ($mode == COMMENT_MODE_THREADED_COLLAPSED || $mode == COMMENT_MODE_THREADED_EXPANDED) {
      if ($comment->depth > $last_depth) {
        $divs++;
        $output .= '<div class="indented">';
        $last_depth++;
      }
      else {
        while ($comment->depth < $last_depth) {
          $divs--;
          $output .= '</div>';
          $last_depth--;
        }
      }
    }

    if ($mode == COMMENT_MODE_FLAT_COLLAPSED) {
      $output .= theme('comment_flat_collapsed', $comment, $node);
    }
    else if ($mode == COMMENT_MODE_FLAT_EXPANDED) {
      $output .= theme('comment_flat_expanded', $comment, $node);
    }
    else if ($mode == COMMENT_MODE_THREADED_COLLAPSED) {
      $output .= theme('comment_thread_collapsed', $comment, $node);
    }
    else if ($mode == COMMENT_MODE_THREADED_EXPANDED) {
      $output .= theme('comment_thread_expanded', $comment, $node);
    }
  }
  for ($i = 0; $i < $divs; $i++) {
    $output .= '</div>';
  }
  $output .= theme('pager', NULL, $comments_per_page, 0, NULL, $pages,  $original_uri);
	//inline_comments_pager($tags = array(), $limit = 10, $element = 0, $parameters = array(), $quantity = 9, $original_url = NULL)
  if (!empty($conf['anchor'])) {
    $output = '<div id="comments">' . $output . '</div>';
  }
  return $output;
}
