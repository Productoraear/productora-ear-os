([^;]+)");return o?unescape(o.pop()):null}function queryStringToJSON(e){var o=e.split("&"),t={};return o.forEach(function(e){e=e.split("="),t[e[0]]=decodeURIComponent(e[1]||"")}),JSON.parse(JSON.stringify(t))}function isCookieGroupAllowed(e){var o=cookieConsentContent.groups;if("string"!=typeof o){if(!isCountryCookiesActiveByDefault && e===CONSENT_ANALYTICS_GROUP && getCookie('hideCookieConsentLayer')==="1"){return true}return isCountryCookiesActiveByDefault;}for(var t=o.split(","),n=0;n<t.length;n++)if(t[n].indexOf(e,0)>=0)return"1"===t[n].split(":")[1];return!1}function userHasAcceptedTheCookies(){var e=document.getElementsByTagName("body")[0],o=document.createEvent("HTMLEvents");cookieConsentContent=queryStringToJSON(getCookie("OptanonConsent")||""),!0===isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP)&&(o.initEvent("analyticsCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o)),!0===isCookieGroupAllowed(CONSENT_PERSONALIZATION_GROUP)&&(o.initEvent("personalizationCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o)),!0===isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP)&&(o.initEvent("targetedAdvertisingCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o)),!0===isCookieGroupAllowed(CONSENT_SOCIAL_MEDIA_GROUP)&&(o.initEvent("socialMediaAdvertisingCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o))}</script>
    <script>
      document.getElementsByTagName('body')[0].addEventListener('oneTrustLoaded', function () {
        if (OneTrust.GetDomainData()?.ConsentModel?.Name === 'notice only') {
          const cookiePolicyLinkSelector = document.querySelectorAll('.ot-sdk-show-settings')
          cookiePolicyLinkSelector.forEach((selector) => {
            selector.style.display = 'none'
          })
        }
      })
    </script>
        <script>
        function CMP() {
            var body = document.getElementsByTagName('body')[0];
            var event = document.createEvent('HTMLEvents');
            var callbackIAB = (tcData, success) => {
                if (success && (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete')) {
                    window.__tcfapi('removeEventListener', 2, () => {
                    }, callbackIAB);
                    if ((typeof window.Optanon !== "undefined" &&
                      !window.Optanon.GetDomainData().IsIABEnabled) ||
                      (tcData.gdprApplies &&
                        typeof window.Optanon !== "undefined" &&
                        window.Optanon.GetDomainData().IsIABEnabled &&
                        getCookie('OptanonAlertBoxClosed'))) {
                      userHasAcceptedTheCookies();
                    }
                    if (isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP) !== true) {
                        event.initEvent('analyticsCookiesHasBeenDenied', true, false);
                        body.dispatchEvent(event);
                    }
                    if (isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP) !== true) {
                        event.initEvent('targetedAdvertisingCookiesHasBeenDenied', true, false);
                        body.dispatchEvent(event);
                    }
                    if (tcData.gdprApplies && typeof window.Optanon !== "undefined" && window.Optanon.GetDomainData().IsIABEnabled) {
                        event.initEvent('IABTcDataReady', true, false);
                        body.dispatchEvent(event);
                    } else {
                        event.initEvent('nonIABCountryDataReady', true, false);
                        body.dispatchEvent(event);
                    }
                }
            }
            var cnt = 0;
            var consentSetInterval = setInterval(function () {
                cnt += 1;
                if (cnt === 600) {
                    userHasAcceptedTheCookies();
                    clearInterval(consentSetInterval);
                }
                if (typeof window.Optanon !== "undefined" && !window.Optanon.GetDomainData().IsIABEnabled) {
                    clearInterval(consentSetInterval);
                    userHasAcceptedTheCookies();
                    event.initEvent('oneTrustLoaded', true, false);
                    body.dispatchEvent(event);
                    event.initEvent('nonIABCountryDataReady', true, false);
                    body.dispatchEvent(event);
                }
                if (typeof window.__tcfapi !== "undefined") {
                    event.initEvent('oneTrustLoaded', true, false);
                    body.dispatchEvent(event);
                    clearInterval(consentSetInterval);
                    window.__tcfapi('addEventListener', 2, callbackIAB);
                }
            });
        }
                function OptanonWrapper() {
          CMP();
        }
    </script>

<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
<script>
  var googletag = googletag || {}
  googletag.cmd = googletag.cmd || []

  const setNonPersonalizedAds = function () {
    googletag.pubads().setPrivacySettings({
      nonPersonalizedAds: true
    });
  }

  const enableGoogleAdsLazyLoad = function () {
    googletag.pubads().enableLazyLoad({
      // Fetch slots within 5 viewports.
      fetchMarginPercent: 40,
      // Render slots within 2 viewports.
      renderMarginPercent: 20,
      // Double the above values on mobile, where viewports are smaller
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
      var slot0 = googletag.defineSlot('/4879/Forums.n_ES/Desktop/main/rightrailtop', [[300,600],[300,250]], 'div-gpt-ad-1334158298810-0').setTargeting('forumtopic', ['Grupo Bodas.net']).addService(googletag.pubads());
var slot1 = googletag.defineSlot('/4879/Forums.n_ES/Desktop/main/rightrailmiddle', [[300,600],[300,250]], 'div-gpt-ad-1334158298810-1').setTargeting('forumtopic', ['Grupo Bodas.net']).addService(googletag.pubads());
var slot2 = googletag.defineSlot('/4879/Forums.n_ES/Desktop/main/rightrailbottom', [[300,600]], 'div-gpt-ad-1334158298810-2').setTargeting('forumtopic', ['Grupo Bodas.net']).addService(googletag.pubads());

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

</head>
<body>
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
        <a class="layoutSkipMain" href="#layoutMain">Ir al contenido principal</a>



<div class="layoutHeader">
            <div class="menu-top">
                                            </div>
    

    <div id="menu" class="menu app-menu">
        <div class="">
            <div class="menu-wrapper-align flex">
                <div class="app-ua-track-event layoutHeader__logoAnchor main-logo"  data-track-c='NavigationAuthed' data-track-a='a-click' data-track-l='d-desktop+o-header_logo' data-track-v='0' data-track-ni='0' >
                                        <a title="Bodas" href="https://www.bodas.net/">
                                                <img alt="Bodas" src="https://www.bodas.net/assets/img/logos/gen_logoHeader.svg" width="180" height="33">
                    </a>
                </div>

                <div class="layoutHeader__nav">
                    
                                            <div class="app-common-header-container" id="nav-main" role="navigation">
                            <ul class="nav-main">
            <li class="nav-main-item  ">
                                    <a href="https://www.bodas.net/organizador-bodas"
                class="nav-main-link app-header-tab  app-ua-track-event"
                 data-track-c='NavigationAuthed' data-track-a='a-click' data-track-l='d-desktop+s-header+o-vendors_promotions_list+dt-tools' data-track-v='0' data-track-ni='0'                 data-tab="miboda"
            >
                Mi boda            </a>
                            <div class="app-tabs-container-miboda">
                    
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
                    
<div class="layoutNav