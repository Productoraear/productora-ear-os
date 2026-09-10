Play":true,"productPageStyleAdditionalImagesCarouselStylePauseOnHover":true,"productPageStyleAdditionalImagesCarouselStyleDelay":"3000","productPageStyleAdditionalImagesCarouselStyleLoop":false,"productPageStyleAdditionalImagesHeightAdjustment":"5","productPageStyleProductStockUpdate":false,"productPageStylePriceUpdate":true,"productPageStyleOptionsSelect":"none","infiniteScrollStatus":true,"infiniteScrollOffset":"8","infiniteScrollLoadPrev":"Cargar art\u00edculos anteriores","infiniteScrollLoadNext":"Otros productos","infiniteScrollLoading":"Loading...","infiniteScrollNoneLeft":"Has llegado al final de la lista.","checkoutUrl":"https:\/\/invitaciones.bodas.net\/index.php?route=checkout\/checkout","headerHeight":"","headerCompactHeight":"60","mobileMenuOn":"","searchStyleSearchAutoSuggestStatus":true,"searchStyleSearchAutoSuggestDescription":false,"searchStyleSearchAutoSuggestSubCategories":true,"headerMiniSearchDisplay":"page","stickyStatus":true,"stickyFullHomePadding":false,"stickyFullwidth":true,"stickyAt":"","stickyHeight":"40","headerTopBarHeight":"35","topBarStatus":false,"headerType":"compact","headerMobileHeight":"60","headerMobileStickyStatus":false,"headerMobileTopBarVisibility":false,"headerMobileTopBarHeight":"35","headerNotice":[{"m":361,"c":"f8504147"}],"columnsCount":0};</script>
<script>// forEach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

(function () {
	if (Journal['isPhone']) {
		return;
	}

	var wrappers = ['search', 'cart', 'cart-content', 'logo', 'language', 'currency'];
	var documentClassList = document.documentElement.classList;

	function extractClassList() {
		return ['desktop', 'tablet', 'phone', 'desktop-header-active', 'mobile-header-active', 'mobile-menu-active'].filter(function (cls) {
			return documentClassList.contains(cls);
		});
	}

	function mqr(mqls, listener) {
		Object.keys(mqls).forEach(function (k) {
			mqls[k].addListener(listener);
		});

		listener();
	}

	function mobileMenu() {
		console.warn('mobile menu!');

		var element = document.querySelector('#main-menu');
		var wrapper = document.querySelector('.mobile-main-menu-wrapper');

		if (element && wrapper) {
			wrapper.appendChild(element);
		}

		var main_menu = document.querySelector('.main-menu');

		if (main_menu) {
			main_menu.classList.add('accordion-menu');
		}

		document.querySelectorAll('.main-menu .dropdown-toggle').forEach(function (element) {
			element.classList.remove('dropdown-toggle');
			element.classList.add('collapse-toggle');
			element.removeAttribute('data-toggle');
		});

		document.querySelectorAll('.main-menu .dropdown-menu').forEach(function (element) {
			element.classList.remove('dropdown-menu');
			element.classList.remove('j-dropdown');
			element.classList.add('collapse');
		});
	}

	function desktopMenu() {
		console.warn('desktop menu!');

		var element = document.querySelector('#main-menu');
		var wrapper = document.querySelector('.desktop-main-menu-wrapper');

		if (element && wrapper) {
			wrapper.insertBefore(element, document.querySelector('#main-menu-2'));
		}

		var main_menu = document.querySelector('.main-menu');

		if (main_menu) {
			main_menu.classList.remove('accordion-menu');
		}

		document.querySelectorAll('.m