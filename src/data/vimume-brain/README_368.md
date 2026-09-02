,
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
 