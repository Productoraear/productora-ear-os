ay.prototype.slice.call(arguments, 1)); } function _n (single, plural, value) { var string = ''; var value = parseInt(value); if (value === 1) { string = single.replace('%s', value); } else { string = plural.replace('%s', value); } return string; } function _ns (single, plural, value, value2) { var string = _n(single, plural, value); return _s(string, value2); } </script>
<script defer src="https://www.bodas.net/builds/desktop/js/symfnw-ES171-1-20241219-010_www_m_/WebBundleResponsiveMarketplaceStorefront.js"></script>
<script>
if (typeof(window.userLayersToShow) === "undefined" || (typeof(window.userLayersToShow) !== "undefined" && typeof(window.userLayersToShow.name) === "undefined")) {
window.userLayersToShow = {
name:
null
}
}
</script>
<div id="app-chat-container" class="pusher-container pusher-mobile   "></div>
<script>
window.pusher = {
actorJson : '{\u0022id\u0022:null,\u0022name\u0022:\u0022An\\u00f3nimo\u0022,\u0022avatar\u0022:\u0022https:\\/\\/cdn1.bodas.net\\/assets\\/img\\/user\\/150x150\\/user-nodefined-150.jpg\u0022,\u0022avatarSvg\u0022:null,\u0022type\u0022:\u0022anonymous\u0022}',
customOptions : {
disableUserVendorNotifications : false,
disableChat : false,
isMobile : true,
isAppAndroid : false,
isAppNativeApiEnabled : false,
isAppIos : false,
isAppBarsEnabled : false,
isAppReferrerEnabled : false,
forceMinimizeChat : false,
chatNeedsSpecialClass : false,
appShowCloseButton : false,
fixedBar : false,
isChatbotEnabled: true,
openOnLoad: false,
canInitConversation: false,
isPersistentStorageEnabled: true,
disableAppChat: false            }
};
</script>
<script>var analyticsManager = (function() {var _storedAnalyticsEvents = [];function queueEvent(func) {_storedAnalyticsEvents.push(func);}function trackQueuedEvents() {while (_storedAnalyticsEvents.length > 0) {var queuedEvent = _storedAnalyticsEvents.shift();queuedEvent();}}return {queueEvent : queueEvent,trackQueuedEvents : trackQueuedEvents,}})();</script><script>
var reduced = '/vendors/item/profile';
</script>
<script>
window.reducedUrl = '/vendors/item/profile';
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
const pageProperties = {"categoryId":"group_id:2,sector_id:33,province_id:3052,town_id:836675","vendorId":79338,"vendorListingId":82679,"reduced":"\/vendors\/item\/profile","gpAnonId":"2faa1ae2-b846-4000-82e6-08cd18663f24","vendor_id":79338,"category_group_i