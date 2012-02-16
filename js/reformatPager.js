(function($) {
	jQuery.fn.reformatPager = function(options) {
		var $$ = $(this);
		$$.options = options;
		return this.each(function(index) {
			jQuery.extend($$, {
				ele: $('.comment-group')
			},
			$$.options);
			var pagerText = 'View More Comments ...';
			var link = $$.ele.find('.item-list li.pager-next a.active');
			if (link.size() > 0) {
				var href = link.attr('href');
				link.text(pagerText).attr('title', pagerText);
				// rewrite href if it does not have a nid on the end
				var baseHref = href.split('?');
				var regex = /\/ajax\/inline_comments\/(get|add)_comments/gi;
				var params = baseHref[0].match(regex);
				if (params[1] == 'add') {
					regex = /nid=([0-9]+)/i;
					params = baseHref[1].match(regex);

					var newhref = '/ajax/tumblrstyle/get_comments/' + params[1] + '?page=1';
					link.attr('href', newhref);
				}
				$$.ele.find('.pager-current, .pager-item, .pager-last, .pager-first, .pager-previous, .pager-ellipsis').remove();
				$$.ele.find('.closelink').remove();
			}
			var closeLink = $('<a href=\'#\' class=\'closelink\'>X Close</a>');
			$$.ele.append(closeLink);
		});
	};
})(jQuery);
