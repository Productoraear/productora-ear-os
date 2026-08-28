le the above values on mobile, where viewports are smaller
// and users tend to scroll faster.
mobileScaling: 2.0
})
}
const refreshAdsSlots = function () {
const slots = googletag.pubads().getSlots()
console.log('[GPT] refreshing slots '+ slots.length)
slots.forEach((slot) => {
if (slot.getHtml() === '') {
googletag.pubads().refresh([slot])
}
})
}
const refreshAdSlot = function (googleAdsObject, slots, domId) {
slots.forEach((slot) => {
var slotDomSlotId = slot.getSlotId().getDomId()
if (slot.getHtml() === '' && domId === slotDomSlotId ) {
googleAdsObject.pubads().refresh([slot])
}
})
}
const showAds = function () {
if (typeof window.gptLoaded !== 'undefined') {
console.log('[GPT] Ads already loaded.');
return;
}
enableGoogleAdsLazyLoad();
googletag.enableServices();
// We need this timeout because sometimes on first landing when we enable the ads an execute the refresh
// with lazy load enabled the slots are not loaded yet in googletag object
setTimeout(function (){
refreshAdsSlots()
}, 1)
window.gptLoaded = true
}
const programmaticShowAds = () => {
const targetedAdvertising = isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP)
const nonPersonalizedAds =  !targetedAdvertising
console.info('[GPT] Targeted Advertising: '+targetedAdvertising)
console.info('[GPT] Non-personalized ADS: '+nonPersonalizedAds)
if (targetedAdvertising) {
showAds()
}
}
const programmaticAds = function () {
if (typeof window.__tcfapi !== 'undefined') {
console.info("[GPT] __tcfapi ON.")
window.__tcfapi('getTCData', 2, (tcData, success) => {
if (!success) {
return
}
if (!tcData.gdprApplies) {
showAds()
return
}
programmaticShowAds()
})
} else if(typeof window._uspapi !== 'undefined') {
console.info("[GPT] _uspapi ON.")
window.__uspapi('getUSPData', 1 , (uspData, success) => {
if (!success) {
return
}
if (!tcData.gpcEnabled) {
showAds()
return
}
programmaticShowAds()
})
} else {
// IN US ads are loaded but without personalized ads
}
}
const nonIABCountriesAds = function () {
showAds()
}
document.addEventListener('DOMContentLoaded', function () {
document.getElementsByTagName('body')[0].addEventListener('IABTcDataReady', function () {
console.log('[GPT] Event: IABTcDataReady loaded before googletag push')
window.gptCmpIABDataReadyEventAlreadyLoaded = true
})
document.getElementsByTagName('body')[0].addEventListener('nonIABCountryDataReady', function () {
console.log('[GPT] Event: nonIABCountryDataReady loaded before googletag push')
window.gptCmpNonIABCountryDataReadyEventAlreadyLoaded = true
})
});
googletag.cmd.push(function () {
var slot0 = googletag.defineSlot('/4879/Ideas.n_ES/Desktop/main/topleaderboard', [[728,90],[970,90],[1280,90]], 'div-gpt-ad-1334158298810-0').setTargeting('articleid', ['8204']).setTargeting('ideastopic', ['Los invitados de la boda']).addService(googletag.pubads());
var slot1 = googletag.defineSlot('/4879/Ideas.n_ES/Desktop/main/rightrailtop', [[300,600],[300,250],[1,1]], 'div-gpt-ad-1334158298810-1').setTargeting('articleid', ['8204']).setTargeting('ideastopic', ['Los invitados de la boda']).addService(googletag.pubads());
var slot2 = googletag.defineSlot('/4879/Ideas.n_ES/Desktop/main/rightrailmiddle', [[300,600],[300,250],[1,1]], 'div-gpt-ad-1334158298810-2').setTargeting('articleid', ['8204']).setTargeting('ideastopic', ['Los invitados de la boda']).addService(googletag.pubads());
var slot3 = googletag.defineSlot('/4879/Ideas.n_ES/Desktop/main/rightrailbottom', [[300,600],[300,250],[1,1]], 'div-gpt-ad-1334158298810-3').setTargeting('articleid', ['8204']).setTargeting('ideastopic', ['Los invitados de la boda']).addService(googletag.pubads());
googletag.pubads().addEventListener('slotRequested', function (event) {
console.log('[GPT]', event.slot.getSlotElementId(), 'fetched')
})
googletag.pubads().addEventListener('slotOnload', function (event) {
console.log('[GPT]', event.slot.getSlotElementId(), 'rendered')
})
googletag.pubads().disableInitialLoad()
document.getElementsByTagName('body')[0].addEventListener('IABTcDataReady', function () {
console.log('[GPT] Event: IABTcDataReady')
programmaticAds()
})
document.getElementsByTagName('body')[0].addEventListener('nonIABCountryDataReady', function () {
console.log('[GPT] Event: nonIABCountryDataReady')
nonIABCountriesAds()
})
googletag.enableServices();
if (window.gptCmpIABDataReadyEventAlreadyLoaded) {
programmaticAds()
} else if (window.gptCmpNonIABCountryDataReadyEventAlreadyLoaded) {
nonIABCountriesAds()
}
/* We fire a global event when DFP library has been loaded */
setTimeout(function () {
if (typeof window.app !== 'undefined' && typeof window.app.event !== 'undefined') {
window.app.event.emit('DFP::Loaded', googletag)
}
}, 0)
})
</script>
</head><body>
<script>
var gtagScript = function() { var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.defer = true;
s.src = "https://www.googletagmanager.com/gtag/js?id=G-QDLJBX8LD9";
el.parentNode.insertBefore(s, el);}
window.dataLayer = window.dataLayer || [];
const analyticsGroupOpt = isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP) === true;
const targetedAdsOpt = isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP) === true;
const personalizationOpt = isCookieGroupAllowed(CONSENT_PERSONALIZATION_GROUP) === true;
window['gtag_enable_tcf_support'] = true;
document.getElementsByTagName('body')[0].addEventListener('oneTrustLoaded', function () {
gtagScript();
});
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', {
'analytics_storage': analyticsGroupOpt ? 'granted' : 'denied',
'ad_storage': targetedAdsOpt ? 'granted' : 'denied',
'ad_user_data': targetedAdsOpt ? 'granted' : 'denied',
'ad_user_personalization': targetedAdsOpt ? 'granted' : 'denied',
'functionality_storage': targetedAdsOpt ? 'granted' : 'denied',
'personalization_storage': personalizationOpt ? 'granted' : 'denied',
'security_storage': 'granted'
});
gtag('set', 'ads_data_redaction', !analyticsGroupOpt);
gtag('set', 'allow_ad_personalization_signals', analyticsGroupOpt);
gtag('set', 'allow_google_signals', analyticsGroupOpt);
gtag('set', 'allow_interest_groups', analyticsGroupOpt);
gtag('config', 'G-QDLJBX8LD9', { groups: 'analytics', 'send_page_view': false });
gtag('config', 'AW-1021727564', { groups: 'adwords' });
</script>

<div id="app-apps-download-banner" class="branch-banner-placeholder branchBannerPlaceholder"></div>

<a class="layoutSkipMain" href="#layoutMain">Ir al contenido principal</a>
<header class="layoutHeader">
<span class="layoutHeader__hamburger app-header-menu-toggle">
<i class="svgIcon app-svg-async svgIcon__list-menu "   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/list-menu.svg" data-svg-lazyload="1"></i></span>
<a class="layoutHeader__logoAnchor app-analytics-event-click"
href="https://www.bodas.net/">
<img src="https://www.bodas.net/assets/img/logos/gen_logoHeader.svg"   alt="Bodas"  width="180" height="33"   >
</a>
<nav class="layoutHeader__nav app-header-nav">
<ul class="layoutNavMenu app-header-list">
<li class="layoutNavMenu__header">
<i class="svgIcon app-svg-async svgIcon__close layoutNavMenu__itemClose app-header-menu-toggle"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/close.svg" data-svg-lazyload="1"></i>        </li>
<li class="layoutNavMenu__item app-header-menu-item-openSection layoutNavMenu__item--my_wedding ">
<a href="https://www.bodas.net/organizador-bodas"
class="layoutNavMenu__anchor app-header-menu-itemAnchor app-analytics-track-event-click "
data-tracking-section="header" data-tracking-category="Navigation" data-tracking-category-authed="1"
data-tracking-dt="tools"                >
Mi boda                </a>
<i class="svgIcon app-svg-async svgIcon__angleRightBlood layoutNavMenu__anchorArrow"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/angleRightBlood.svg" data-svg-lazyload="1"></i>
<div class="layoutNavMenuTab app-header-menu-itemDropdown">
<div class="layoutNavMenuTab__layout">
<div class="layoutNavMenuTab__header">
<i class="svgIcon app-svg-async svgIcon__angleLeftBlood layoutNavMenuTab__icon app-header-menu-item-closeSection"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/angleLeftBlood.svg" data-svg-lazyload="1"></i>    <a class="layoutNavMenuTab__title" href="https://www.bodas.net/organizador-bodas">
Mi boda    </a>
<i class="svgIcon app-svg-async svgIcon__close layoutNavMenuTab__iconClose app-header-menu-toggle"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/close.svg" data-svg-lazyload="1"></i></div>
<div class="layoutNavMenuTabMyWedding">
<div class="layoutNavMenuTabMyWeddingList">
<a class="layoutNavMenuTabMyWedding__title" href="https://www.bodas.net/organizador-bodas">
Mi organizador de boda        </a>
<ul class="layoutNavMenuTabMyWeddingList__content ">
<li class="layoutNavMenuTabMyWeddingList__item layoutNavMenuTabMyWeddingList__item--viewAll">
<a href="https://www.bodas.net/organizador-bodas">Ver todo</a>
</li>
<li class="layoutNavMenuTabMyWeddingList__item "
>
<a href="https://www.bodas.net/agenda-tareas-boda">
<i class="svgIcon app-svg-async svgIcon__checklist layoutNavMenuTabMyWeddingList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/tools/categories/checklist.svg" data-svg-lazyload="1"></i>                        Agenda                    </a>
</li>
<li class="layoutNavMenuTabMyWeddingList__item "
>
<a href="https://www.bodas.net/lista-invitados-boda">
<i class="svgIcon app-svg-async svgIcon__guests layoutNavMenuTabMyWeddingList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/tools/categories/guests.svg" data-svg-lazyload="1"></i>                        Invitados                    </a>
</li>
<li class="layoutNavMenuTabMyWeddingList__item "
>
<a href="https://www.bodas.net/organizador-mesas-boda">
<i class="svgIcon app-svg-async svgIcon__tables layoutNavMenuTabMyWeddingList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/tools/categories/tables.svg" data-svg-lazyload="1"></i>                        Mesas                    </a>
</li>
<li class="layoutNavMenuTabMyWeddingList__item "
>
<a href="https://www.bodas.net/presupuestador-boda">
<i class="svgIcon app-svg-async svgIcon__budget layoutNavMenuTabMyWeddingList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/tools/categories/budget.svg" data-svg-lazyload="1"></i>                        Presupuestador                    </a>
</li>
<li class="layoutNavMenuTabMyWeddingList__item "
>
<a href="https://www.bodas.net/mis-proveedores-boda">
<i class="svgIcon app-svg-async svgIcon__vendors layoutNavMenuTabMyWeddingList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/tools/categories/vendors.svg" data-svg-lazyload="1"></i>                        Proveedores                    </a>
</li>
<li class="layoutNavMenuTabMyWeddingList__item "
>
<a href="https://www.bodas.net/mis-vestidos-novia">
<i class="svgIcon app-svg-async svgIcon__dresses layoutNavMenuTabMyWeddingList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/tools/categories/dresses.svg" data-svg-lazyload="1"></i>                        Vestidos                    </a>
</li>
<li class="layoutNavMenuTabMyWeddingList__item "
>
<a href="https://www.bodas.net/website/index.php?actionReferrer=8">
<i class="svgIcon app-svg-async svgIcon__website layoutNavMenuTabMyWeddingList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/tools/categories/website.svg" data-svg-lazyload="1"></i>                        Web de boda                    </a>
</li>
<li class="layoutNavMenuTabMyWeddingList__item app-analytics-track-event-click"
data-tracking-category="Navigation"
data-tracking-section="header_venues"
data-tracking-dt="contest"
>
<a href="https://www.bodas.net/sorteo">
<i class="svgIcon app-svg-async svgIcon__contest layoutNavMenuTabMyWeddingList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/tools/categories/contest.svg" data-svg-lazyload="1"></i>                        Sorteo                    </a>
</li>
</ul>
</div>
<div class="layoutNavMenuTabMyWeddingBanners">
<div class="layoutNavMenuBannerBox app-header-menu-banner app-link "
data-href="https://www.bodas.net/app-bodas"
>
<div class="layoutNavMenuBannerBox__content">
<p class="layoutNavMenuBannerBox__title">Descárgate la app</p>
<span class="layoutNavMenuBannerBox__subtitle">Organiza tu boda donde y cuando quieras</span>
</div>
<img data-src="https://www.bodas.net/assets/img/logos/square-icon.svg"  class="lazyload layoutNavMenuBannerBox__icon" alt="Icono de app"  width="60" height="60"  >
</div>
<div class="layoutNavMenuBannerBox app-header-menu-banner app-link "
data-href="https://www.bodas.net/album-boda-wedshoots"
>
<div class="layoutNavMenuBannerBox__content">
<a class="layoutNavMenuBannerBox__title" href="https://www.bodas.net/album-boda-wedshoots">Wedshoots</a>
<span class="layoutNavMenuBannerBox__subtitle">Todas las fotos de tus invitados recopiladas en un álbum</span>
</div>
<img data-src="https://www.bodas.net/assets/img/wedshoots/ico_wedshoots.svg"  class="lazyload layoutNavMenuBannerBox__icon" alt="Icono de Wedshoots"  width="60" height="60"  >
</div>
</div>
</div>    </div>
</div>
</li>
<li class="layoutNavMenu__item app-header-menu-item-openSection layoutNavMenu__item--venues ">
<a href="https://www.bodas.net/bodas/banquetes"
class="layoutNavMenu__anchor app-header-menu-itemAnchor app-analytics-track-event-click "
data-tracking-section="header" data-tracking-category="Navigation" data-tracking-category-authed="1"
data-tracking-dt="venues"                >
Lugares para Boda                </a>
<i class="svgIcon app-svg-async svgIcon__angleRightBlood layoutNavMenu__anchorArrow"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/angleRightBlood.svg" data-svg-lazyload="1"></i>
<div class="layoutNavMenuTab app-header-menu-itemDropdown">
<div class="layoutNavMenuTab__layout">
<div class="layoutNavMenuTab__header">
<i class="svgIcon app-svg-async svgIcon__angleLeftBlood layoutNavMenuTab__icon app-header-menu-item-closeSection"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/angleLeftBlood.svg" data-svg-lazyload="1"></i>    <a class="layoutNavMenuTab__title" href="https://www.bodas.net/bodas/banquetes">
Lugares para Boda    </a>
<i class="svgIcon app-svg-async svgIcon__close layoutNavMenuTab__iconClose app-header-menu-toggle"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/close.svg" data-svg-lazyload="1"></i></div>
<div class="layoutNavMenuTabVenues">
<div class="layoutNavMenuTabVenues__categories">
<div class="layoutNavMenuTabVenuesList">
<a class="layoutNavMenuTabVenues__title"
href="https://www.bodas.net/bodas/banquetes">
Lugares para Boda            </a>
<ul class="layoutNavMenuTabVenuesList__content">
<li class="layoutNavMenuTabVenuesList__item layoutNavMenuTabVenuesList__item--viewAll">
<a href="https://www.bodas.net/bodas/banquetes">Ver todo</a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/fincas">
Fincas                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/masias">
Masías                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/hoteles">
Hoteles                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/restaurantes">
Restaurantes                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/salones-de-boda">
Salones de Boda                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/castillos">
Castillos                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/cortijos">
Cortijos                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/haciendas">
Haciendas                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/bodegas">
Bodegas                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/espacios-singulares">
Espacios Singulares                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item">
<a href="https://www.bodas.net/bodas/banquetes/bodas-en-la-playa">
Bodas en la playa                        </a>
</li>
<li class="layoutNavMenuTabVenuesList__item layoutNavMenuTabVenuesList__item--highlight">
<a href="https://www.bodas.net/promociones/banquetes">
Promociones                        </a>
</li>
</ul>
</div>
</div>
<div class="layoutNavMenuTabVenuesBanners">
<div class="layoutNavMenuBannerBox app-header-menu-banner app-link app-analytics-track-event-click"
data-href="https://www.bodas.net/destination-wedding"
data-tracking-section=header_venues                      data-tracking-category=Navigation                      data-tracking-dt=destination_weddings         >
<div class="layoutNavMenuBannerBox__content">
<p class="layoutNavMenuBannerBox__title">Destination Weddings</p>
<span class="layoutNavMenuBannerBox__subtitle">Cásate en el país que siempre has soñado.</span>
</div>
<img class="svgIcon svgIcon__plane_destination layoutNavMenuBannerBox__icon lazyload" data-src="https://cdn1.bodas.net/assets/svg/original/illustration/plane_destination.svg"  alt="illustration plane destination" width="56" height="56" >    </div>
<div class="layoutNavMenuBannerBox app-header-menu-banner app-link app-analytics-track-event-click"
data-href="https://www.bodas.net/sorteo"
data-tracking-section=header_venues                      data-tracking-category=Navigation                      data-tracking-dt=contest         >
<div class="layoutNavMenuBannerBox__content">
<p class="layoutNavMenuBannerBox__title">Gana 5.000&euro;</p>
<span class="layoutNavMenuBannerBox__subtitle">Participa en la 146ª edición del sorteo de Bodas.net</span>
</div>
<img class="svgIcon svgIcon__stars layoutNavMenuBannerBox__icon lazyload" data-src="https://cdn1.bodas.net/assets/svg/original/illustration/stars.svg"  alt="illustration stars" width="56" height="56" >    </div>
</div>
</div>
</div>
</div>
</li>
<li class="layoutNavMenu__item app-header-menu-item-openSection layoutNavMenu__item--vendors ">
<a href="https://www.bodas.net/bodas/proveedores"
class="layoutNavMenu__anchor app-header-menu-itemAnchor app-analytics-track-event-click "
data-tracking-section="header" data-tracking-category="Navigation" data-tracking-category-authed="1"
data-tracking-dt="vendors"                >
Proveedores                </a>
<i class="svgIcon app-svg-async svgIcon__angleRightBlood layoutNavMenu__anchorArrow"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/angleRightBlood.svg" data-svg-lazyload="1"></i>
<div class="layoutNavMenuTab app-header-menu-itemDropdown">
<div class="layoutNavMenuTab__layout">
<div class="layoutNavMenuTab__header">
<i class="svgIcon app-svg-async svgIcon__angleLeftBlood layoutNavMenuTab__icon app-header-menu-item-closeSection"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/angleLeftBlood.svg" data-svg-lazyload="1"></i>    <a class="layoutNavMenuTab__title" href="https://www.bodas.net/bodas/proveedores">
Proveedores    </a>
<i class="svgIcon app-svg-async svgIcon__close layoutNavMenuTab__iconClose app-header-menu-toggle"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/_common/close.svg" data-svg-lazyload="1"></i></div>
<div class="layoutNavMenuTabVendors">
<div class="layoutNavMenuTabVendors__content">
<div class="layoutNavMenuTabVendorsList">
<a class="layoutNavMenuTabVendors__title" href="https://www.bodas.net/bodas/proveedores">
Empieza a contratar tus proveedores            </a>
<ul class="layoutNavMenuTabVendorsList__content">
<li class="layoutNavMenuTabVendorsList__item layoutNavMenuTabVendorsList__item--viewAll">
<a href="https://www.bodas.net/bodas/proveedores">Ver todo</a>
</li>
<li class="layoutNavMenuTabVendorsList__item">
<i class="svgIcon app-svg-async svgIcon__categPhoto layoutNavMenuTabVendorsList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/vendors/categories/categPhoto.svg" data-svg-lazyload="1"></i>                        <a href="https://www.bodas.net/bodas/proveedores/fotografos">
Fotógrafos                        </a>
</li>
<li class="layoutNavMenuTabVendorsList__item">
<i class="svgIcon app-svg-async svgIcon__categVideo layoutNavMenuTabVendorsList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/vendors/categories/categVideo.svg" data-svg-lazyload="1"></i>                        <a href="https://www.bodas.net/bodas/proveedores/video">
Vídeo                        </a>
</li>
<li class="layoutNavMenuTabVendorsList__item">
<i class="svgIcon app-svg-async svgIcon__categMusic layoutNavMenuTabVendorsList__itemIcon"   data-svg="https://cdn1.bodas.net/assets/svg/optimized/vendors/categories/categMusic.svg" data-svg-lazyload="1"></i>                        <a href="https://www.bodas.net/bodas/proveedores/musica">
Música                        </a>
</li>
<li class="layoutNavMenuTabVendorsList__item">
<i class="svgIcon app-svg-async svgIcon__categCatering layoutNavMenuTabVendorsList__itemIcon"   dat