ed(CONSENT_ANALYTICS_GROUP) === true) {
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
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=