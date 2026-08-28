,"apps":{"appVersion":null,"usersApp":{"isCurrentPlatform":false,"isAndroid":false,"isIOS":false,"proxy":{"isProxyBarsEnabled":false,"isShowNativeLoginEnabled":false,"areHappyMomentsEnabled":true,"isNativeShareAvailable":false,"isListingCounterFiltersEnabled":false}},"vendorsApp":{"isCurrentPlatform":false,"isAndroid":false,"isIOS":false,"proxy":{"isProxyBarsEnabled":false,"isIOSProxyBarsFullControlEnabled":false}},"isAppUsersNativeSignUpLayerEnabled":false}},"remarketing":{"facebook":{"isPixelEnabled":true,"isEnabled":true,"isLoaded":false,"tracker":"experiment"},"pinterest":{"isEnabled":true,"isLoaded":false}},"analytics":{"isEcommerceEnabled":true}}            
                            ,                                                             experiments:[]            
                                    };
</script>

<script>
    var userGlobals = {
                                            gp_anon_id: '2faa1ae2-b846-4000-82e6-08cd18663f24'            
                            ,                                                             vendor_id_empresa: '78903'            
                            ,                                                             vendor_uuid: '587e0718-0168-4bc7-9b54-bfbcc0c68a82'            
                                    };
</script>


<script defer src="https://www.bodas.net/builds/desktop/js/symfnw-ES171-1-20241219-010_www_m_/common.js"></script>


<script defer src="https://www.bodas.net/builds/desktop/js/symfnw-ES171-1-20241219-010_www_m_/WebBundleDesktopDresses.js"></script>

<script>
    (function (w) {
                w.desktopInMobile = "0";
    })(window);
</script>


    <div id="app-pusher-vendors-users-notification-alert" class="pusher-notification dnone"></div>
    <div id="app-chat-container" class="pusher-container"></div>
    <script>
                    window.pusher = {
              actorJson : '{\u0022id\u0022:78903,\u0022name\u0022:\u0022Productora EAR\u0022,\u0022avatar\u0022:\u0022https:\\/\\/cdn0.bodas.net\\/emp\\/fotos\\/7\\/8\\/9\\/0\\/3\\/edwin-agudelo-canta-a-novios_1_78903_v3.jpg\u0022,\u0022avatarSvg\u0022:null,\u0022type\u0022:\u0022vendor\u0022}',
              customOptions : {
                disableChat : false,
                disableUserVendorNotifications : false,
                isChatbotEnabled: true,
                openOnLoad: false,
                canInitConversation: true,
                isPersistentStorageEnabled: true,
                disableAppChat: false              }
            };
            </script>


    
    <script>var analyticsManager = (function() {var _storedAnalyticsEvents = [];function queueEvent(func) {_storedAnalyticsEvents.push(func);}function trackQueuedEvents() {while (_storedAnalyticsEvents.length > 0) {var queuedEvent = _storedAnalyticsEvents.shift();queuedEvent();}}return {queueEvent : queueEvent,trackQueuedEvents : trackQueuedEvents,}})();</script>
<script>
    var reduced = '/catalog/list';
    </script>


<script>
  var _comscore = _comscore || []

  var comscoreScript = function () {
    var s = document.createElement('script'), el = document.getElementsByTagName('script')[0]
    s.defer = true
    s.src = (document.location.protocol == 'https:' ? 'https://sb' : 'http://b') + '.scorecardresearch.com/cs/6156116/beacon.js'
    el.parentNode.insertBefore(s, el)
  }

    document.getElementsByTagName('body')[0].addEventListener('analyticsCookiesHasBeenAccepted', function () {
    comscoreScript()
  })
  document.getElementsByTagName('body')[0].addEventListener('IABTcDataReady', function () {
    _comscore.push({ c1: '2', c2: '6156116' })
  })
  document.getElementsByTagName('body')[0].addEventListener('nonIABCountryDataReady', function () {
      _comscore.push({ c1: '2', c2: '6156116' })
  })
    if (isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP) === true) {
    comscoreScript()
  }
</script>




    <script>
window.contextTraits = {};
</script>
<script>
    function trackExperimentViewed(experimentId, bucketingId, variantId, eventProperties) {
        window.analytics.track('Experiment Viewed', {
            ...eventProperties,
            experimentId,
            bucketingId,
            variantId
        })
    }
</script>
<script>
!function () {
    const ga4ClientIdPromise = new Promise(resolve => {
        gtag('get', 'G-QDLJBX8LD9', 'client_id', resolve)
    });
    const ga4SessionIdPromise = new Promise(resolve => {
        gtag('get', 'G-QDLJBX8LD9', 'session_id', resolve)
    });
    const ga4SessionNumberPromise = new Promise(resolve => {
        gtag('get', 'G-QDLJBX8LD9', 'session_number', resolve)
    });
    var segmentLoaded = false;
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t