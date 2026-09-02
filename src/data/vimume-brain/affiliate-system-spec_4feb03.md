ody')[0].addEventListener('nonIABCountryDataReady', function () {
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
const pageProperties = {"nItems":7,"categoryId":"group_id:2,sector_id:8,province_id:3035,town_id:829893","reduced":"\/vendors\/list\/sector\/town","gpAnonId":"2faa1ae2-b846-4000-82e6-08cd18663f24","vendor_id":null,"category_group_id":2,"category_id":8,"region_adm1_id":null,"city_id":829893,"region_id":3035,"product_tier":null,"vendor_visibility_tier":null,"isMasquerading":false,"platform":"desktop web","section":"\/vendors\/list\/sector\/town","build_product":"marketplace"};
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
console.warn('[ga4 segment patch] Analytics event does not co