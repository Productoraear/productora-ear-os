Script = function () {
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
const pageProperties = {"nItems":9,"categoryId":"group_id:2,sector_id:11,province_id:3004","reduced":"\/vendors\/list\/sector\/province","gpAnonId":"2faa1ae2-b846-4000-82e6-08cd18663f24","loggedVendorUUID":"587e0718-0168-4bc7-9b54-bfbcc0c68a82","vendor_id":null,"category_group_id":2,"category_id":11,"region_adm1_id":null,"city_id":null,"region_id":3004,"product_tier":null,"vendor_visibility_tier":null,"isMasquerading":false,"platform":"desktop web","section":"\/vendors\/list\/sector\/province","build_product":"marketplace"};
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
payload.obj[namespace]['event_id'] = 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'a0c7e6ec-2461-4933-98b4-bd6f3c42bbed'
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
globalPageProperties = JSON.parse('["appVersion","frmInsert","gpAnonId","loggedUserUUID","loggedVendorUUID","platform","reduced","section","build_product","experimentVariants","vendor_id","category_group_id","category_id","region_adm1_id","city_id","region_id","product_tier","vendor_visibility_tier"]');
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
const experiments = (window.pageGlobals && window.pageGlobals.experiments) ? window.pageGlobals.experiment