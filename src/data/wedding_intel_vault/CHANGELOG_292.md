(newClassList);
				});
			} else {
				moveElements(newClassList);
			}
		}
	});

})();

(function () {
	var cookies = {};
	var style = document.createElement('style');
	var documentClassList = document.documentElement.classList;

	document.head.appendChild(style);

	document.cookie.split('; ').forEach(function (c) {
		var cc = c.split('=');
		cookies[cc[0]] = cc[1];
	});

	if (Journal['popup']) {
		for (var i in Journal['popup']) {
			if (!cookies['p-' + Journal['popup'][i]['c']]) {
				documentClassList.add('popup-open');
				documentClassList.add('popup-center');
				break;
			}
		}
	}

	if (Journal['notification']) {
		for (var i in Journal['notification']) {
			if (cookies['n-' + Journal['notification'][i]['c']]) {
				style.sheet.insertRule('.module-notification-' + Journal['notification'][i]['m'] + '{ display:none }');
			}
		}
	}

	if (Journal['headerNotice']) {
		for (var i in Journal['headerNotice']) {
			if (cookies['hn-' + Journal['headerNotice'][i]['c']]) {
				style.sheet.insertRule('.module-header_notice-' + Journal['headerNotice'][i]['m'] + '{ display:none }');
			}
		}
	}

	if (Journal['layoutNotice']) {
		for (var i in Journal['layoutNotice']) {
			if (cookies['ln-' + Journal['layoutNotice'][i]['c']]) {
				style.sheet.insertRule('.module-layout_notice-' + Journal['layoutNotice'][i]['m'] + '{ display:none }');
			}
		}
	}
})();
</script>
<link href="catalog/view/javascript/bootstrap/css/bootstrap.min.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/javascript/font-awesome/css/font-awesome.min.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/theme/journal3/icons/style.minimal.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/theme/journal3/lib/imagezoom/imagezoom.min.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/theme/journal3/lib/lightgallery/css/lightgallery.min.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/theme/journal3/lib/lightgallery/css/lg-transitions.min.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/theme/journal3/lib/swiper/swiper.min.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/theme/journal3/stylesheet/style.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/javascript/jquery/magnific/magnific-popup.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
<link href="catalog/view/javascript/jquery/datetimepicker/bootstrap-datetimepicker.min.css?v=14218c54" type="text/css" rel="stylesheet" media="all" />
  <link href="https://invitaciones.bodas.net/invitaciones-de-boda/belair-invitacion-de-boda-conjunto-1514" rel="canonical" />
  <link href="https://invitaciones.bodas.net/image/catalog/favicon.png" rel="icon" />

				<link rel="alternate" hreflang="it" href="https://partecipazioni.matrimonio.com/partecipazioni-matrimonio/belair-partecipazione-matrimonio-set-de-3-1514" /><link rel="alternate" hreflang="es" href="https://invitaciones.bodas.net/invitaciones-de-boda/belair-invitacion-de-boda-conjunto-1514" /><link rel="alternate" hreflang="fr" href="https://faire-part.mariages.net/faire-part/belair-faire-part-mariage-3-ensemble-1514" /><link rel="alternate" hreflang="en" href="https://stationery.hitched.co.uk/wedding-invitations/belair-3-piece-wedding-invitation-1514" />			
<style>.blog-post .post-details .post-stats{white-space:nowrap;overflow-x:auto;overflow-y:hidden;color:rgba(105, 105, 115, 1);margin-top:15px;margin-bottom:35px}.blog-post .post-details .post-stats .p-category{flex-wrap:nowrap;display:inline-flex}.mobile .blog-post .post-details .post-stats{overflow-x:scroll}.blog-post .post-details .post-stats::-webkit-scrollbar{-webkit-appearance:none;height:1px;height:2px;width:2px}.blog-post .post-details .post-stats::-webkit-scrollbar-track{background-color:white;background-color:rgba(238, 238, 238, 1)}.blog-post .post-details .post-stats::-webkit-scrollbar-thumb{background-color:#999;background-color:rgba(239, 80, 66, 1)}.blog-post .post-details .post-stats .p-posted{display:inline-flex}.blog-post .post-details .post-stats .p-author{display:inline-flex}.blog-post .post-details .post-stats .p-date{display:inline-flex}.p-date-image{color:rgba(255, 255, 255, 1);font-weight:700;background:rgba(239, 80, 66, 1);margin:7px;border-radius:px}.blog-post .post-details .post-stats .p-comment{display:inline-flex}.blog-post .post-details .post-stats .p-view{display:inline-flex}.post-details{padding-bottom:20px}.post-content>p{margin-bottom:10px}.post-content{font-size:15px;column-count:initial;column-gap:50px;column-rule-style:none}.post-image{display:block;text-align:left;float:none}.post-image
img{box-shadow:0 5px 35px -5px rgba(0, 0, 0, 0.07)}.blog-post
.tags{margin-top:15px;justify-content:flex-start;font-size:13px;font-weight:700;justify-content:flex-start}.blog-post .tags a, .blog-post .tags-title{margin-right:8px;margin-bottom:8px}.blog-post .tags
b{display:none}.blog-post .tags
a{border-radius:10px;padding-right:8px;padding-left:8px;font-size:13px;color:rgba(230, 230, 230, 1);font-weight:400;text-decoration:none;background:rgba(247, 108, 111, 1)}.blog-post .tags a:hover{color:rgba(255,255,255,1);background:rgba(87,154,193,1)}.post-comments{margin-top:20px}.post-comment{margin-bottom:30px;padding-bottom:15px;border-width:0;border-bottom-width:1px;border-style:solid}.post-reply{margin-top:15px;margin-left:60px;padding-top:20px;border-width:0;border-top-width:1px;border-style:solid}.user-avatar{display:none;margin-right:15px;border-radius:50%}.module-blog_comments .side-image{display:none}.post-comment .user-name{font-size:18px;font-weight:700}.post-comment .user-data
div{font-size:12px}.post-comment .user-site::before{left:-1px}.blog-post .has-error{color:rgba(239, 80, 66, 1) !important}.blog-post .form-group .control-label{max-width:9999px;padding-bottom:2px;justify-content:flex-start}.blog-post .has-error .form-control{border-color:rgba(239, 80, 66, 1) !important}.blog-post .required .control-label::after, .blog-post .required .control-label + div::before, .blog-post .text-danger{color:rgba(143, 157, 166, 1)}.blog-post .form-group{margin-bottom:5px}.blog-post .required.has-error .control-label::after, .blog-post .required.has-error .control-label+div::before{color:rgba(239, 80, 66, 1) !important}.blog-post input.form-control{background:rgba(255, 255, 255, 1) !important;border-width:1px !important;border-style:solid !important;border-color:rgba(226, 226, 226, 1) !important;border-radius:3px !important}.blog-post input.form-control:focus, .blog-post input.form-control:active{border-color:rgba(87, 154, 193, 1) !important}.blog-post input.form-control:hover{box-shadow:0 5px 35px -5px rgba(0, 0, 0, 0.07)}.blog-post input.form-control:focus{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.1)}.blog-post textarea.form-control{background:rgba(255, 255, 255, 1) !important;border-width:1px !important;border-style:solid !important;border-color:rgba(226, 226, 226, 1) !important;border-radius:3px !important}.blog-post textarea.form-control:focus, .blog-post textarea.form-control:active{border-color:rgba(87, 154, 193, 1) !important}.blog-post textarea.form-control:hover{box-shadow:0 5px 35px -5px rgba(0, 0, 0, 0.07)}.blog-post textarea.form-control:focus{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.1)}.blog-post select.form-control{background:rgba(255, 255, 255, 1) !important;border-width:1px !important;border-style:solid !important;border-color:rgba(226, 226, 226, 1) !important;border-radius:3px !important;max-width:200px}.blog-post select.form-control:focus, .blog-post select.form-control:active{border-color:rgba(87, 154, 193, 1) !important}.blog-post select.form-control:hover{box-shadow:0 5px 35px -5px rgba(0, 0, 0, 0.07)}.blog-post select.form-control:focus{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.1)}.blog-post
.radio{width:100%}.blog-post
.checkbox{width:100%}.blog-post .input-group .input-group-btn .btn, .blog-post .input-group .input-group-btn .btn:visited{font-size:13px;color:rgba(255, 255, 255, 1);font-weight:700;letter-spacing:1px}.blog-post .input-group .input-group-btn .btn:hover{color:rgba(255, 255, 255, 1) !important;background:rgba(239, 80, 66, 1) !important}.blog-post .input-group .input-group-btn .btn:active, .blog-post .input-group .input-group-btn .btn:hover:active, .blog-post .input-group .input-group-btn .btn:focus:active{color:rgba(255, 255, 255, 1) !important;background:rgba(215, 70, 58, 1) !important;box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.1)}.blog-post .input-group .input-group-btn .btn:focus{color:rgba(255, 255, 255, 1) !important;background:rgba(215, 70, 58, 1);box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.1)}.blog-post .input-group .input-group-btn
.btn{background:rgba(247, 108, 111, 1);border-width:2px;padding:15px;padding-right:20px;padding-left:20px;border-radius:4px !important;min-width:35px;min-height:35px;margin-left:5px}.desktop .blog-post .input-group .input-group-btn .btn:hover{box-shadow:0 10px 40px rgba(0, 0, 0, 0.15)}.blog-post .input-group .input-group-btn .btn.btn.disabled::after{font-size:20px}.blog-post .product-option-file .btn i::before{content:'\ebd8' !important;font-family:icomoon !important}.reply-form .has-error{color:rgba(239, 80, 66, 1) !important}.reply-form .form-group .control-label{max-width:9999px;padding-bottom:2px;justify-content:flex-start}.reply-form .has-error .form-control{border-color:rgba(239, 80, 66, 1) !important}.reply-form .required .control-label::after, .reply-form .required .control-label + div::before, .reply-form .text-danger{col