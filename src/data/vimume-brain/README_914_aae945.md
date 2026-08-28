\/smiley_sad.png"},{"SIGLA":"&lt;3","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_heart.png"},{"SIGLA":"(:3)","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_catface.png"},{"SIGLA":":&dollar;","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_shame.png"},{"SIGLA":"_love_)","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_love.png"},{"SIGLA":"-_-?","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_ups.png"},{"SIGLA":"_diam_)","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_diamond.png"},{"SIGLA":"_cake_)","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_cake.png"},{"SIGLA":"_ring_)","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_ring.png"},{"SIGLA":"_flower_)","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_flower.png"},{"SIGLA":"_gift_)","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_gift.png"},{"SIGLA":"_star_)","SRC":"https:\/\/cdn1.bodas.net\/img\/smileys\/smiley_star.png"}]; globals.vendors = { haveLogoInGallery: false, }; globals.appleSignIn = { clientId: 'net.bodas.applesignin', returnUrl: 'https://www.bodas.net', }; /** * added for custom dimension support on legacy tracking functions */ globals.UniversalAnalyticsDimensions = {"CUSTOM_DIMENSION_REDUCED":5,"CUSTOM_DIMENSION_UID":6,"CUSTOM_DIMENSION_VENDOR_ID":15,"CUSTOM_DIMENSION_LISTING_ID":16,"CUSTOM_DIMENSION_FRM_INSERT":17,"CUSTOM_DIMENSION_HOTEL_ID":18,"CUSTOM_DIMENSION_LEAD_CATEGORY_ID":20,"CUSTOM_DIMENSION_LEAD_GROUP_ID":21,"CUSTOM_DIMENSION_DIRECTORY_SCORE_ID":24,"CUSTOM_DIMENSION_DIRECTORY_LISTING_DETAIL":26,"CUSTOM_DIMENSION_DIRECTORY_LISTING_ID":27,"CUSTOM_DIMENSION_DIRECTORY_STYLE":31,"CUSTOM_DIMENSION_PLATFORM":28,"CUSTOM_DIMENSION_SECTION":29,"CUSTOM_DIMENSION_FILTERS":30,"CUSTOM_DIMENSION_PARENT_LEAD_ID":32,"CUSTOM_DIMENSION_PARENT_VENDOR_ID":33,"CUSTOM_DIMENSION_SEGMENT_EXTRA_DATA":999}; globals.seo = { allowDeindexedMarketplaceSearchesWithoutGroupId: true, }; </script> <script> String.prototype.sprintf = function() { var args = arguments; var pos = 0; return this.replace(/\%s/g, function(match, number) { pos++; return typeof args[pos-1] != 'undefined' ? args[pos-1] : match ; }); }; function __ (string) { return string } function _s() { var msg = arguments[0]; return String.prototype.sprintf.apply(msg, Array.prototype.slice.call(arguments, 1)); } function _n (single, plural, value) { var string = ''; var value = parseInt(value); if (value === 1) { string = single.replace('%s', value); } else { string = plural.replace('%s', value); } return string; } function _ns (single, plural, value, value2) { var string = _n(single, plural, value); return _s(string, value2); } </script>
<script defer src="https://www.bodas.net/builds/desktop/js/symfnw-ES171-1-20241219-010_www_m_/WebBundleResponsiveArticles.js"></script>
<script>
if (typeof(window.userLayersToShow) === "undefined" || (typeof(window.userLayersToShow) !== "undefined" && typeof(window.userLayersToShow.name) === "undefined")) {
window.userLayersToShow = {
name:
"contest"
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
canInitConversation: true,
isPersistentStorageEnabled: true,
disableAppChat: false            }
};
</script>
<script>var analyticsManager = (function() {var _storedAnalyticsEvents = [];function queueEvent(func) {_storedAnalyticsEvents.push(func);}function trackQueuedEvents() {while (_storedAnalyticsEvents.length > 0) {var queuedEvent = _storedAnalyticsEvents.shift();queuedEvent();}}return {queueEvent : queueEvent,trackQueuedEvents : trackQueuedEvents,}})();</script><script>
var reduced = '/articles/category';
</script>
<script>
window.reducedUrl = '/articles/category';
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
const pageProperties = {"reduced":"\/articles\/category","gpAnonId":"2faa1ae2-b846-4000-82e6-08cd18663f24","isMasquerading":false,"platform":"desktop web","section":"\/articles\/category","build_product":"content"};
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
payload.obj[namespace]['event_id'] = 'pageview_' + window.userGlobals.gp_anon_id + '_' + '36b1cca5-d79b-486f-82ae-9a4f989232b2'
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
const field = globalPageProperties[key];
const isExcluded = globalPagePropertiesExcludedEventNames[field]?.includes(payload.obj.event) ?? false;
if (!payload.obj[namespace][field] && pageProperties[field] && !isExcluded) {
payload.obj[namespace][field] = pageProperties[field];
}
}
payload.obj['context']['traits'] = payload.obj['context']['traits'] || {};
for (const [key, value] of Object.entries(window.contextTraits)) {
payload.obj['context']['traits'][key] = value;
}
if (getCookieIsFunction) {
const cookies = {
'epik': '_epik',
'ttclid': 'ttclid',
'_ttp': '_ttp',
'gclid': 'gclid',
};
for (const [traitKey, cookieName] of Object.entries(cookies)) {
const value = getCookie(cookieName);
if (value) {
payload.obj['context']['traits'][traitKey] = value;
}
}
}
if (!payload.obj['userId']) {
payload.obj['userId'] = payload.obj[namespace]['loggedUserUUID']
}
if (payload.obj.type !== 'identify') {
payload.obj[namespace]['non_interaction'] = !!parseInt(payload.obj[namespace]['nonInteraction'])
}
// override context variables if exists in window.trackingContext is defined and updated
if (typeof window.trackingContext === 'object') {
const overrideObjectProperties = (object, newObjectValues) => {
for (const [key, value] of Object.entries(newObjectValues)) {
if (typeof value === 'object' && typeof object[key] === 'object') {
overrideObjectProperties(object[key], value);
} else {
object[key] = value;
}
}
return object;
};
payload.obj = overrideObjectProperties(payload.obj, window.trackingContext);
}
if (payload.obj.type !== 'identify') {
payload.obj[namespace] = standardizePropertyNames(payload.obj[namespace])
}
next(payload);
});
var integrationsConfig = {
All: analyticsGroupOpt,
'Segment.io': true,
'Google Analytics 4': analyticsGroupOpt,
'Facebook Conversions API (Actions)': targetedAdsOpt
};
window.analytics.load("ZG7KvyfJu5fe9wDQrYtqkcYfF1OzVmy0", { integrations: integrationsConfig });
window.analytics.page(null, pageProperties);
const experiments = (window.pageGlobals && window.pageGlobals.experiments) ? window.pageGlobals.experiments : {};
Object.keys(experiments).forEach(exp => {
trackExperimentViewed(
experiments[exp].experimentId,
window.userGlobals ? window.userGlobals[experiments[exp].bucketingType] : null,
experiments[exp].variantId
)
})
})();
};
var standardizePropertyNames = function (properties) {
let origKey, value
if (properties instanceof Array) {
for (origKey in properties) {
value = properties[origKey]
if (typeof value === 'object') {
value = standardizePropertyNames(value)
}
properties[origKey] = value
}
} else {
for (origKey in properties) {
if (properties.hasOwnProperty(origKey)) {
let snakeCaseKey = origKey
.trim()
.replace(/-/g, '_')
.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
.replace(/([a-z])([A-Z])/g, '$1_$2')
.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
.replace(/ /g, '_')
.toLowerCase()
.substring(0, 100)
if (isPropertyNameSnakeCase(origKey) && origKey !== snakeCaseKey) {
delete properties[origKey]
}
properties[snakeCaseKey] = properties[origKey]
}
}
}
return properties
};
var isPropertyNameSnakeCase = function (propertyName) {
const standardFormatRegex = /^[a-z0-9]+(_[a-z0-9]+)*$/;
return standardFormatRegex.test(propertyName);
};
document.getElementsByTagName('body')[0].addEventListener('analyticsCookiesHasBeenAccepted', function () {
segmentScript();
});
if (isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP) === true) {
segmentScript();
}
}();
</script>
<div class="dnone">
<script>
gtag('event', 'page_view', {"ARTICLES_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0,"send_to":"adwords"});
</script>              <script>
var facebookScript = function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.defer=1;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)};
var toExecuteAfterFbInit = function (