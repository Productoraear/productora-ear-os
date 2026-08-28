lse,"isAndroid":false,"isIOS":false,"proxy":{"isProxyBarsEnabled":false,"isIOSProxyBarsFullControlEnabled":false}},"isAppUsersNativeSignUpLayerEnabled":false}},"remarketing":{"facebook":{"isPixelEnabled":true,"isEnabled":true,"isLoaded":false,"tracker":"experiment"},"pinterest":{"isEnabled":true,"isLoaded":false}},"analytics":{"isEcommerceEnabled":true}}            
                            ,                                                             experiments:[]            
                                    };
</script>

<script>
    var userGlobals = {
                                            gp_anon_id: '2faa1ae2-b846-4000-82e6-08cd18663f24'            
                                    };
</script>


<script defer src="https://www.bodas.net/builds/desktop/js/symfnw-ES171-1-20241219-010_www_m_/common.js"></script>


<script defer src="https://www.bodas.net/builds/desktop/js/symfnw-ES171-1-20241219-010_www_m_/WebBundleDesktopRealWeddings.js"></script>

<script>
    (function (w) {
                w.desktopInMobile = "0";
    })(window);
</script>


    <div id="app-pusher-vendors-users-notification-alert" class="pusher-notification dnone"></div>
    <div id="app-chat-container" class="pusher-container"></div>
    <script>
                    window.pusher = {
              actorJson : '{\u0022id\u0022:null,\u0022name\u0022:\u0022An\\u00f3nimo\u0022,\u0022avatar\u0022:\u0022https:\\/\\/cdn1.bodas.net\\/assets\\/img\\/user\\/150x150\\/user-nodefined-150.jpg\u0022,\u0022avatarSvg\u0022:null,\u0022type\u0022:\u0022anonymous\u0022}',
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
    var reduced = '/real_weddings/home';
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
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="ZG7KvyfJu5fe9wDQrYtqkcYfF1OzVmy0";;analytics.SNIPPET_VERSION="4.15.3";
    }}();

        
    var segmentScript = function () {
        if (segmentLoaded) {
            return;
        }
        if (window.analytics && window.analytics.initialized === true) {
            return;
        }

        segmentLoaded = true;
        (async () => {
          let ga4ClientId, ga4SessionId, ga4SessionNumber = null;
          [ga4ClientId, ga4SessionId, ga4SessionNumber] = await Promise.all([ga4ClientIdPromise, ga4SessionIdPromise, ga4SessionNumberPromise]);
            const pageProperties = {"nItems":2,"reduced":"\/real_weddings\/home","gpAnonId":"2faa1ae2-b846-4000-82e6-08cd18663f24","isMasquerading":false,"platform":"desktop web","section":"\/real_weddings\/home","build_product":"content"};
            const analyticsGroupOpt = isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP) === true;
            const targetedAdsOpt = isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP) === true;
            const socialMediaOpt = isCookieGroupAllowed(CONSENT_SOCIAL_MEDIA_GROUP) === true;
            const saleOfDataOpt = analyticsGroupOpt && targetedAdsOpt && socialMediaOpt

            // Adding Segment middleware
            analytics.addSourceMiddleware(function (middlewareIntermediate) {
                var payload = middlewareIntermediate.payload,
                    next = middlewareIntermediate.next,
                    namespace;
                if (payload.obj.type === 'identify') {
                    namespace = 'traits'
                } else {
                    namespace = 'properties'
                }
                if (!payload.obj[namespace]) {
                    console.warn('[ga4 segment patch] Analytics event does not contain namespace property: ' + namespace);
                    next(payload);
                    return
                }
                payload.obj[namespace].ga_session_id = ga4SessionId;
                payload.obj[namespace].ga_session_number = ga4SessionNumber;
                payload.obj[namespace].ga_client_id = ga4ClientId;
                payload.obj[namespace].ga4_session_id = ga4SessionId;
                payload.obj[namespace].ga4_session_number = ga4SessionNumber;
                payload.obj[namespace].ga4_client_id = ga4ClientId;

                                    payload.obj.context.data_processing_options = !targetedAdsOpt;
                
                if (payload.obj.type === 'page') {
                  payload.obj[namespace]['event_id'] = 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'de303659-69d1-4106-919b-a11a6840f2d8'
                }

                if (!payload.obj[namespace].loggedUserUUID && window.userGlobals?.user_uuid) {
                  payload.obj[namespace].loggedUserUUID = window.userGlobals.user_uuid
                }

                const getCookieIsFunction = typeof getCookie === 'function';
                const tkwwOpCookie = getCookieIsFunction ? getCookie('tkww_op') : null;
                if (!payload.obj.context.tkww_op && tkwwOpCookie) {
                  payload.obj.context.tkww_op = tkwwOpCookie;
                }

                                const globalExtraPropertiesForSegmentTracking = typeof window.globalExtraPropertiesForSegmentTracking === 'object'
                ? window.globalExtraPropertiesForSegmentTracking : {};
                for (const key in globalExtraPropertiesForSegmentTracking) {
                    if (globalExtraPropertiesForSegmentTracking.hasOwnProperty(key) && !payload.obj[namespace][key]) {
                      payload.obj[namespace][key] = globalExtraPropertiesForSegmentTracking[key];
                    }
                }

                                let globalPageProperties = [];
                let globalPagePropertiesExcludedEventNames = {};
                try {
                  globalPageProperties = JSON.parse('["appVersion","frmInsert","gpAnonId","loggedUserUUID","loggedVendorUUID","platform","reduced","section","build_product","experimentVariants"]');
                  globalPagePropertiesExcludedEventNames = JSON.parse('[]');
                } catch(e) {
                  console.error(`Segment init error: ${e.message}`);
                }

                for (const key in globalPageProperties) {
                    const field = globalPageProperties[key