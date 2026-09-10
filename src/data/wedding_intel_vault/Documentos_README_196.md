://www.bodas.net/builds/desktop/js/symfnw-ES171-1-20241219-010_www_m_/common.js"></script>


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
    var reduced = '/catalog/item';
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
    !function(){v