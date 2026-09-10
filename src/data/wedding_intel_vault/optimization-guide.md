wClassList);
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
  <link href="https://invitaciones.bodas.net/invitaciones-de-boda/hand-in-hand-invitacion-de-boda-vertical-874" rel="canonical" />
  <link href="https://invitaciones.bodas.net/image/catalog/favicon.png" rel="icon" />

				<link rel="alternate" hreflang="it" href="https://partecipazioni.matrimonio.com/partecipazioni-matrimonio/hand-in-hand-partecipazione-matrimonio-a5-verticale-874" /><link rel="alternate" hreflang="es" href="https://invitaciones.bodas.net/invitaciones-de-boda/hand-in-hand-invitacion-de-boda-vertical-874" /><link rel="alternate" hreflang="fr" href="https://faire-part.mariages.net/faire-part/hand-in-hand-carte-d´invitation-au-mariage-verticale-874" /><link rel="alternate" hreflang="en" href="https://stationery.hitched.co.uk/wedding-inv