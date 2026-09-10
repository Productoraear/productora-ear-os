lit("&"),t={};return o.forEach(function(e){e=e.split("="),t[e[0]]=decodeURIComponent(e[1]||"")}),JSON.parse(JSON.stringify(t))}function isCookieGroupAllowed(e){var o=cookieConsentContent.groups;if("string"!=typeof o){if(!isCountryCookiesActiveByDefault && e===CONSENT_ANALYTICS_GROUP && getCookie('hideCookieConsentLayer')==="1"){return true}return isCountryCookiesActiveByDefault;}for(var t=o.split(","),n=0;n<t.length;n++)if(t[n].indexOf(e,0)>=0)return"1"===t[n].split(":")[1];return!1}function userHasAcceptedTheCookies(){var e=document.getElementsByTagName("body")[0],o=document.createEvent("HTMLEvents");cookieConsentContent=queryStringToJSON(getCookie("OptanonConsent")||""),!0===isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP)&&(o.initEvent("analyticsCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o)),!0===isCookieGroupAllowed(CONSENT_PERSONALIZATION_GROUP)&&(o.initEvent("personalizationCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o)),!0===isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP)&&(o.initEvent("targetedAdvertisingCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o)),!0===isCookieGroupAllowed(CONSENT_SOCIAL_MEDIA_GROUP)&&(o.initEvent("socialMediaAdvertisingCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o))}</script>
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
    <div 