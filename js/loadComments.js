(function($) { // wrapping $ jQuery alias in a local function to allow compatibilty with other libraries
	jQuery.fn.loadComments = function(options) {
		return this.each(function(index) {
			var $$ = $(this);
			var row = $$.parents('.views-row');
			var ccount = $(row).find('.views-field-comment-count');
			var nid = $(row).find('.node-nid').text();
			var comments = $('<div class=\'comment-group\'></div>');
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
						$(row).find('.comment-group .comment').css('height', '0');
						$(row).find('.spinner').fadeOut('fast');
						var markup = $(result.data);
						var cgroup = row.find('.comment-group');
						cgroup.append(markup);
						var options = {};
						options['ele'] = cgroup;
						cgroup.reformatPager(options);
						$(row).find('.views-field-comment-count').addClass('ajaxloaded');
						Drupal.attachBehaviors(row);
					}
				});
			} else {
				// find the comment group  in question
				var group = row.find('.comment-group');
		    $(group).toggle();
				return;
			}
		});
	};
})(jQuery);