pper.appendChild(element);
			}

			if (wrappers[k] === 'cart-content') {
				if (element) {
					element.classList.remove('j-dropdown');
					element.classList.remove('dropdown-menu');
				}
			}
		});

		var search = document.querySelector('#search');
		var cart = document.querySelector('#cart');

		if (search && (Journal['searchStyle'] === 'full')) {
			search.classList.remove('full-search');
			search.classList.add('mini-search');
		}

		if (cart && (Journal['cartStyle'] === 'full')) {
			cart.classList.remove('full-cart');
			cart.classList.add('mini-cart')
		}
	}

	function desktopHeader() {
		console.warn('desktop header!');

		Object.keys(wrappers).forEach(function (k) {
			var element = document.querySelector('#' + wrappers[k]);
			var wrapper = document.querySelector('.desktop-' + wrappers[k] + '-wrapper');

			if (wrappers[k] === 'cart-content') {
				if (element) {
					element.classList.add('j-dropdown');
					element.classList.add('dropdown-menu');
					document.querySelector('#cart').appendChild(element);
				}
			} else {
				if (element && wrapper) {
					wrapper.appendChild(element);
				}
			}
		});

		var search = document.querySelector('#search');
		var cart = document.querySelector('#cart');

		if (search && (Journal['searchStyle'] === 'full')) {
			search.classList.remove('mini-search');
			search.classList.add('full-search');
		}

		if (cart && (Journal['cartStyle'] === 'full')) {
			cart.classList.remove('mini-cart');
			cart.classList.add('full-cart');
		}

		documentClassList.remove('mobile-cart-content-container-open');
		documentClassList.remove('mobile-main-menu-container-open');
		documentClassList.remove('mobile-overlay');
	}

	function moveElements(classList) {
		if (classList.includes('mobile-header-active')) {
			mobileHeader();
			mobileMenu();
		} else if (classList.includes('mobile-menu-active')) {
			desktopHeader();
			mobileMenu();
		} else {
			desktopHeader();
			desktopMenu();
		}
	}

	var mqls = {
		phone: window.matchMedia('(max-width: 768px)'),
		tablet: window.matchMedia('(max-width: 1024px)'),
		menu: window.matchMedia('(max-width: ' + Journal['mobileMenuOn'] + 'px)')
	};

	mqr(mqls, function () {
		var oldClassList = extractClassList();

		if (Journal['isDesktop']) {
			if (mqls.phone.matches) {
				documentClassList.remove('desktop');
				documentClassList.remove('tablet');
				documentClassList.add('mobile');
				documentClassList.add('phone');
			} else if (mqls.tablet.matches) {
				documentClassList.remove('desktop');
				documentClassList.remove('phone');
				documentClassList.add('mobile');
				documentClassList.add('tablet');
			} else {
				documentClassList.remove('mobile');
				documentClassList.remove('phone');
				documentClassList.remove('tablet');
				documentClassList.add('desktop');
			}

			if (documentClassList.contains('phone') || (documentClassList.contains('tablet') && Journal['mobileHeaderOn'] === 'tablet')) {
				documentClassList.remove('desktop-header-active');
				documentClassList.add('mobile-header-active');
			} else {
				documentClassList.remove('mobile-header-active');
				documentClassList.add('desktop-header-active');
			}
		}

		if (documentClassList.contains('desktop-header-active') && mqls.menu.matches) {
			documentClassList.add('mobile-menu-active');
		} else {
			documentClassList.remove('mobile-menu-active');
		}

		var newClassList = extractClassList();

		if (oldClassList.join(' ') !== newClassList.join(' ')) {
			if (documentClassList.contains('safari') && !documentClassList.contains('ipad') && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
				window.fetch('index.php?route=journal3/journal3/device_detect', {
					method: 'POST',
					body: 'device=ipad',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function (data) {
					return data.json();
				}).then(function (data) {
					if (data.response.reload) {
						window.location.reload();
					}
				});
			}

			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', function () {
					moveElements(newClassList);
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
  <link href="https://invitaciones.bodas.net/tarjetas-de-agradecimiento/elegant-garden-tarjeta-de-agradecimiento-4482" rel="canonical" />
  <link href="https://invitaciones.bodas.net/image/catalog/favicon.png" rel="icon" />

				<link rel="alternate" hreflang="it" href="https://partecipazioni.matrimonio.com/biglietti-di-ringraziamento/elegant-garden-biglietto-di-ringraziamento-matrimonio-4482" /><link rel="alternate" hreflang="es" href="https://invitaciones.bodas.net/tarjetas-de-agradecimiento/elegant-garden-tarjeta-de-agradecimiento-4482" /><link rel="alternate" hreflang="fr" href="https://faire-part.mariages.net/cartes-de-remerciements/elegant-garden-carte-de-remerciements-mariage-petit-format-4482" /><link rel="alternate" hreflang="en" href="https://stationery.hitched.co.uk/thank-you-cards/elegant-garden-wedding-thank-you-card-4482" />	