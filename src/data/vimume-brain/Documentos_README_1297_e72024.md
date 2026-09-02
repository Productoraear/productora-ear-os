ONSENT_TARGETED_ADVERTISING_GROUP)&&(o.initEvent("targetedAdvertisingCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o)),!0===isCookieGroupAllowed(CONSENT_SOCIAL_MEDIA_GROUP)&&(o.initEvent("socialMediaAdvertisingCookiesHasBeenAccepted",!0,!1),e.dispatchEvent(o))}</script>
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
      window.__tcfapi('getTCD