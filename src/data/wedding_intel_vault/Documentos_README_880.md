.")
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
      var slot0 = googletag.defineSlot('/4879/Galleries.n_ES/Desktop/complementos/native1', [[1,1]], 'div-gpt-ad-1334158298810-0').addService(googletag.pubads());
var slot1 = googletag.defineSlot('/4879/Galleries.n_ES/Desktop/complementos/native2', [[1,1]], 'div-gpt-ad-1334158298810-1').addService(googletag.pubads());

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
                                                    <a class="menu-top-access app-ua-track-event"  data-track-c='LoginTracking' data-track-a='a-click' data-track-l='d-desktop+s-header+o-catalog_list+dt-vendors_zone' data-track-v='0' data-track-ni='0'  rel="nofollow" href="https://www.bodas.net/emp-Acceso.php">
                    <i class="svgIcon app-svg-async svgIcon__briefcase "   data-svg="https://cdn1.bodas.net/assets/svg/optimized/vendors/briefcase.svg" data-svg-lazyload="1"></i>                    Área Empresas                </a>
                    </div>
    

    <div id="menu" class="menu app-menu">
        <div class="">
            <div class="menu-wrapper-align flex">
                <div class="app-ua-track-event layoutHeader__logoAnchor main-logo"  data-track-c='Navigation' data-track-a='a-click' data-track-l='d-desktop+o-header_logo' data-track-v='0' data-track-ni='0' >
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
                 data-track-c='Navigation' data-track-a='a-click' data-track-l='d-desktop+s-header+o-groups_discussion_item+dt-tools' data-track-v='0' data-track-ni='0'                 data-tab="miboda"
            >
                Mi boda            </a>
                            <div class="app-tabs-container-miboda">
                    
<div class="layoutNavMenuTab app-header-menu-itemDropdown">
    <div class="layoutNavMenuTab__layout">
        <div class="layoutNavMenuTab__header">
    <i class="svgIcon app-svg-async svgIcon__angleLeftBlood layou