score = _comscore || []

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
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.erro