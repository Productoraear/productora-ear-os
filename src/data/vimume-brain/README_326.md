consentSetInterval);
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
      var slot0 = googletag.defineSlot('/4879/Galleries.n_ES/Desktop/vestidos-fiesta/native1', [[1,1]], 'div-gpt-ad-1334158298810-0').addService(googletag.pubads());
var slot1 = googletag.defineSlot('/4879/Galleries.n_ES/Desktop/vestidos-fiesta/native2', [[1,1]], 'div-gpt-ad-1334158298810-1').addService(googletag.pubads());

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
    const analyticsGroupOpt = isCookieGrou