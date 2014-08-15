(function($) { // wrapping $ jQuery alias in a local function to allow compatibilty with other libraries
	jQuery.fn.inlineCommentsLoadComments = function(options) {
		return this.each(function(index) {
			var $$ = $(this);
			var row = $$.parents('.views-row');
			var ccount = $(row).find('.views-field-comment-count');
			var nid = $(row).find('.node-nid').text();
			var comments = $('<div class=\'inline-comments-comment-group\'></div>');
			var spinner = $('<div class=\'spinner\'>Loading ...</div>');
			if (!$(ccount).hasClass('ajaxloaded')) {
				$(row).append(spinner).fadeIn('fast');
				$(row).append(comments);
				$.ajax({
					type: 'GET',
					url: '/ajax/inline_comments/get_comments/' + nid,
					error:function(xhr,err){		

              return false;
          },
					success: function(res) {
						var result = Drupal.parseJson(res);
						$(row).find('.inline-comments-comment-group .comment').css('height', '0');
						$(row).find('.spinner').fadeOut('fast');
						var markup = $(result.data);
						var cgroup = row.find('.inline-comments-comment-group');
						cgroup.append(markup);
						var options = {};
						options['ele'] = cgroup;
//						cgroup.inlineCommentsReformatPager(options);
						$(row).find('.views-field-comment-count').addClass('ajaxloaded');
						Drupal.attachBehaviors(row);
					}
				});
			} else {
				// find the comment group  in question
				var group = row.find('.inline-comments-comment-group');
		    $(group).toggle();
				return;
			}
		});
	};
})(jQuery);