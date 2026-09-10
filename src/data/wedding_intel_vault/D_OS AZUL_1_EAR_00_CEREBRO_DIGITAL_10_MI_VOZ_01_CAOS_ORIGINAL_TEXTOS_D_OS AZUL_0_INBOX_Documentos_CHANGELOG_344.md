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
const pageProperties = {"dateAdded":"2018-05-15 07:00:00","categoryId":33,"nItems":10,"reduced":"\/articles\/item","gpAnonId":"2faa1ae2-b846-4000-82e6-08cd18663f24","loggedVendorUUID":"587e0718-0168-4bc7-9b54-bfbcc0c68a82","isMasquerading":false,"platform":"desktop web","section":"\/articles\/item","build_product":"content"};
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
payload.obj[namespace]['event_id'] = 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'fe14d2a1-9cea-40f3-a136-26ca9d4fc4fb'
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
gtag('event', 'page_view', {"ARTICLES_NAV":1,"LOGGED":0,"EMPRESA":1,"EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":1,"send_to":"adwords","user_id":"e78903"});
</script>              <script>
var facebookScript = function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.defer=1;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)};
var toExecuteAfterFbInit = function () {
var hasGlobals = parent.pageGlobals && parent.pageGlobals.common && parent.pageGlobals.common.remarketing && parent.pageGlobals.common.remarketing.facebook
var globalFacebook = hasGlobals ? parent.pageGlobals.common.remarketing.facebook : {};
var isLoaded = globalFacebook.isLoaded === true;
if (!isLoaded) {
parent.fbq('init', '1434721056835089', {}, {});
globalFacebook.isLoaded = true;
}
parent.fbq('track', 'PageView', {"ARTICLES_NAV":1,"LOGGED":0,"EMPRESA":1,"EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":1}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'fe14d2a1-9cea-40f3-a136-26ca9d4fc4fb'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0);
}
document.getElementsByTagName('body')[0].addEventListener('targetedAdvertisingCookiesHasBeenAccepted', function () {
facebookScript(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
toExecuteAfterFbInit ()
});
if (parent.isCookieGroupAllowed(parent.CONSENT_TARGETED_ADVERTISING_GROUP) === true) {
facebookScript(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
toExecuteAfterFbInit ()
}
</script>             <script>
var pinterestScript = function() {
!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(
Array.prototype.slice.call(arguments))};var
n=window.pintrk;n.queue=[],n.version='3.0';var
t=document.createElement('script');t.defer=1,t.src=e;var
r=document.getElementsByTagName('script')[0];r.parentNode.insertBefore(t,r)}}('https://s.pinimg.com/ct/core.js');
var hasGlobalsPinterest = parent.pageGlobals && parent.pageGlobals.common && parent.pageGlobals.common.remarketing && parent.pageGlobals.common.remarketing.pinterest;
var globalPinterest = hasGlobalsPinterest ? parent.pageGlobals.common.remarketing.pinterest : {};
var isLoaded = globalPinterest.isLoaded === true;
if (!isLoaded) {
parent.pintrk('load', 2613978159206);
globalPinterest.isLoaded = true;
}
var isTracked = globalPinterest.isTracked === true;
if (!isTracked) {
globalPinterest.isTracked = true;
parent.pintrk('page');
parent.pintrk('track', 'custom', {"ARTICLES_NAV":"1","LOGGED":"0","EMPRESA":"1","EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":"1","send_to":"adwords"});
}
}
/* Listener of the OneTrust callback when user accepts the cookies */
document.getElementsByTagName('body')[0].addEventListener('targetedAdvertisingCookiesHasBeenAccepted', function () {
pinterestScript();
});
/* Wrap of the Analytics script that checks the consent of the user and the default country configuration */
if (isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP) === true) {
pinterestScript();
}
</script>             <script>
var executeBingScript = function () {
return (function(w,d,t,r,u) {
var f,n,i;
w[u] = w[u]||[], f = function() {
var o = {ti: "355036992", enableAutoSpaTracking: true};
o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
},
n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function() {
var s = this.readyState;
s&&s !== "loaded"&&s !== "complete" || (f(), n.onload = n. onreadystatechange=null)
},
i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n,i)
}) (window, document, "script", "//bat.bing.com/bat.js", "uetq");
}
var pushBingScript = function () {
window.uetq = window.uetq || [];
window.uetq.push ('event', '', {});
}
document.getElementsByTagName('body')[0].addEventListener('targetedAdvertisingCookiesHasBeenAccepted', function () {
executeBingScript();
pushBingScript();
});
if (isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP) === true) {
executeBingScript();
pushBingScript();
}
</script>     </div>
<script type="text/javascript" src="https://cdn1.bodas.net/assets/js/newRelicRum.js?siteVersion=symfnw-ES171-1-20241219-010_www_m_" async></script>
<script>
window.addEventListener('newRelicScriptLoaded', function() {
document.getElementsByTagName('body')[0].addEventListener('analyticsCookiesHasBeenAccepted', function () {
newRelicScript("307408989");
});
if (isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP) === true) {
newRelicScript("307408989");
}
});
</script>
<script>
var skimlinks_settings = {
skimlinks_custom_rel: "skimlink"
}
var skimLinksScriptLoaded = false;
var skimLinksScript = function () {
if (skimLinksScriptLoaded) {
return;
}
var s = document.createElement('script'), el = document.getElementsByTagName('script')[0]
s.async = true
s.defer = true
s.onload = function () {
var skimLoaded = new Event("skimlinkLoaded");
document.dispatchEvent(skimLoaded);
}
s.src = "https://s.skimresources.com/js/2866X1684269.skimlinks.js"
el.parentNode.insertBefore(s, el)
skimLinksScriptLoaded = true
}
document.getElementsByTagName('body')[0].addEventListener('targetedAdvertisingCookiesHasBeenAccepted', function () {
skimLinksScript();
});
if (isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP) === true) {
skimLinksScript();
}
</script>
<script type="application/ld+json">
{"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Bodas","item":"https:\/\/www.bodas.net\/"},{"@type":"ListItem","position":2,"name":"Ideas boda","item":"https:\/\/www.bodas.net\/articulos"},{"@type":"ListItem","position":3,"name":"Luna de miel","item":"https:\/\/www.bodas.net\/articulos\/luna-de-miel--t7"},{"@type":"ListItem","position":4,"name":"Destinos para la luna de miel","item":"https:\/\/www.bodas.net\/articulos\/destinos-para-la-luna-de-miel--t33"}]}            </script>
<script type="application/ld+json">
[{"@context":"http:\/\/schema.org","@type":"Article","headline":"Los mejores destinos para una luna de miel con ni\u00f1os","description":"Muchas parejas con hijos deciden llevarlos con ellos a la luna de miel, convirtiendo esta en unas fant\u00e1sticas vacaciones familiares. \u00bfEs vuestro caso? Os mostramos algunos destinos perfectos para viajar con ellos. \u00a1Tomad buena nota!","datePublished":"2018-05-15T07:00:00+02:00","dateModified":"2024-09-20T07:00:00+02:00","mainEntityOfPage":{"@type":"WebPage","@id":"destinos-para-una-luna-de-miel-con-ninos"},"image":{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/article\/6769\/3_2\/1280\/jpg\/99676-shutterstock-627091562.webp","width":823,"height":548},"author":{"name":"Anna Llopis","url":"https:\/\/www.bodas.net\/articulos\/anna-llopis","@type":"Person"},"publisher":{"name":"www.bodas.net","logo":{"@type":"ImageObject","url":"https:\/\/cdn1.bodas.net\/assets\/img\/logos\/mails\/gen_logoHeader-es_ES.png","width":280,"height":60}}}]            </script>
<script type="text/javascript"  src="/c-O80A/xtX/qkH/G2361fZl/EaaOt8fNLDVQictu/Hls2Ag/NEs/-bm0mYXYB"></script></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          !function t(e,i,r){function s(u,n){if(!i[u]){if(!e[u]){var h="function"==typeof require&&require;if(!n&&h)return h(u,!0);if(o)return o(u,!0);var f=new Error("Cannot find module '"+u+"'");throw f.code="MODULE_NOT_FOUND",f}var p=i[u]={exports:{}};e[u][0].call(p.exports,(function(t){return s(e[u][1][t]||t)}),p,p.exports,t,e,i,r)}return i[u].exports}for(var o="function"==typeof require&&require,u=0;u<r.length;u++)s(r[u]);return s}({1:[function(t,e,i){"use strict";class r extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"pitch",defaultValue:0},{name:"semitone",defaultValue:0}]}constructor(){super(),this.soundTouch=new c,this.filter=new s(this.soundTouch),this.semitone=0,this.pitch=0,this.skipBuffers=128}calculatePitch(t,e){if(this.pitch!==t||this.semitone!==e){var i=Math.exp(.69314718056*parseInt(e)/12)+.05*parseFloat(t);this.soundTouch.pitch=i,this.pitch=t,this.semitone=e,0===this.pitch&&0===this.semitone&&(this.skipBuffers=128)}}process(t,e,i){if(!t)return!0;var r=t[0],s=e[0];if(!r[0])return!0;var o,u=r[0].length,n=r[0].length,h=s.length>1&&r.length>1;(this.calculatePitch(i.pitch[0],i.semitone[0]),0===this.pitch&&0===this.semitone)||(this.skipBuffers>0&&this.skipBuffers--,this.outputBuffer=(null===(o=this.outputBuffer)||void 0===o?void 0:o.length)===2*n?this.outputBuffer:new Float32Array(2*n),this.filter.push(r[0],r[1]||r[0]),this.filter.extract(this.outputBuffer,n));if(this.skipBuffers>0){if(h)for(var f=0;f<u;f++)s[0][f]=r[0][f],s[1][f]=r[1][f];else for(var p=0;p<u;p++)s[0][p]=r[0][p];return!0}if(h)for(var a=0;a<n;a++)s[0][a]=this.outputBuffer[2*a]||0,s[1][a]=this.outputBuffer[2*a+1]||0;else for(var c=0;c<n;c++)s[0][c]=this.outputBuffer[2*c]||0;return!0}}class s{constructor(t){this._pipe=t}push(t,e){for(var i=new Float32Array(2*t.length),r=0;r<t.length;r++)i[2*r]=t[r],i[2*r+1]=e[r];this._pipe.inputBuffer.putSamples(i,0,t.length)}extract(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:8192;this._pipe.inputBuffer.frameCount>=i&&this._pipe.process(),this._pipe.outputBuffer.receiveSamples(t,e)}clear(){this._pipe.process(),this._pipe.inputBuffer.rewind(),this._pipe.outputBuffer.rewind()}}function o(){this._vector=new Float32Array,this._position=0,this._frameCount=0}function u(t,e){for(var i in e){var r=e.__lookupGetter__(i),s=e.__lookupSetter__(i);r||s?(r&&t.__defineGetter__(i,r),s&&t.__defineSetter__(i,s)):t[i]=e[i]}return t}function n(t,e){return(t>e?t-e:e-t)>1e-10}function h(t){this._pipe=t}function f(t,e){h.call(this,e),this.sourceSound=t,this.historyBufferSize=22050,this._sourcePosition=0,this.outputBufferPosition=0,this._position=0}function p(t){t?(this.inputBuffer=new o,this.outputBuffer=new o):this.inputBuffer=this.outputBuffer=null}function a(t){p.call(this,t),this.slopeCount=0,this.prevSampleL=0,this.prevSampleR=0,this.rate=1}function c(){this.rateTransposer=new a(!1),this.tdStretch=new _(!1),this._inputBuffer=new o,this._intermediateBuffer=new o,this._outputBuffer=new o,this._rate=0,this.tempo=0,this.virtualPitch=1,this.virtualRate=1,this.virtualTempo=1,this._calculateEffectiveRateAndTempo()}function l(t){this.buffer=t}function _(t){p.call(this,t),this.bQuickSeek=!0,this.bMidBufferDirty=!1,this.pMidBuffer=null,this.overlapLength=0,this.bAutoSeqSetting=!0,this.bAutoSeekSetting=!0,this._tempo=1,this.setParameters(44100,B,m,d)}function v(t,e,i){this._st=new c,this._f=new f(new l(e),this._st,i),this._node=function(t,e,i){var r=i||1024,s=t.createScriptProcessor?t.createScriptProcessor(r,2,2):t.createJavascriptNode(r,2,2),o=new Float32Array(2*r);return s.onaudioprocess=function(t){var i=t.outputBuffer.getChannelData(0),u=t.outputBuffer.getChannelData(1),n=e.extract(o,r);0===n&&s.disconnect();for(var h=0;n>h;h++)i[h]=o[2*h],u[h]=o[2*h+1]},s}(t,this._f)}registerProcessor("audioworklet-pitch-hq-processor",r),o.prototype={get vector(){return this._vector},get position(){return this._position},get startIndex(){return 2*this._position},get frameCount(){return this._frameCount},get endIndex(){return 2*(this._position+this._frameCount)},clear:function(){this.receive(frameCount),this.rewind()},put:function(t){this._frameCount+=t},putSamples:function(t,e,i){var r=2*(e=e||0);i>=0||(i=(t.length-r)/2);var s=2*i;this.ensureCapacity(i+this._frameCount);var o=this.endIndex;this._vector.set(t.subarray(r,r+s),o),this._frameCount+=i},putBuffer:function(t,e,i){e=e||0,i>=0||(i=t.frameCount-e),this.putSamples(t.vector,t.position+e,i)},receive:function(t){(!(t>=0)||t>this._frameCount)&&(t=this._frameCount),this._frameCount-=t,this._position+=t},receiveSamples:function(t,e){var i=2*e,r=this.startIndex;t.set(this._vector.subarray(r,r+i)),this.receive(e)},extract:function(t,e,i){var r=this.startIndex+2*e,s=2*i;t.set(this._vector.subarray(r,r+s))},ensureCapacity:function(t){var e=2*t;if(this._vector.length<e){var i=new Float32Array(e);i.set(this._vector.subarray(this.startIndex,this.endIndex)),this._vector=i,this._position=0}else this.rewind()},ensureAdditionalCapacity:function(t){this.ensureCapacity(this.frameCount+t)},rewind:function(){this._position>0&&(this._vector.set(this._vector.subarray(this.startIndex,this.endIndex)),this._position=0)}},h.prototype={get pipe(){return this._pipe},get inputBuffer(){return this._pipe.inputBuffer},get outputBuffer(){return this._pipe.outputBuffer},fillOutputBuffer:function(t){for(;this.outputBuffer.frameCount<t;){var e=256-this.inputBuffer.frameCount;if(this.fillInputBuffer(e),this.inputBuffer.frameCount<16384)break;this._pipe.process()}},clear:function(){this._pipe.clear()}},u(f.prototype,h.prototype),u(f.prototype,{get position(){return this._position},set position(t){if(t>this._position)throw new RangeError("New position may not be greater than current position");var e=this.outputBufferPosition-(this._position-t);if(0>e)throw new RangeError("New position falls outside of history buffer");this.outputBufferPosition=e,this._position=t},get sourcePosition(){return this._sourcePosition},set sourcePosition(t){this.clear(),this._sourcePosition=t},fillInputBuffer:function(t){var e=new Float32Array(2*t),i=this.sourceSound.extract(e,t,this._sourcePosition);this._sourcePosition+=i,this.inputBuffer.putSamples(e,0,i)},extract:function(t,e){this.fillOutputBuffer(this.outputBufferPosition+e);var i=Math.min(e,this.outputBuffer.frameCount-this.outputBufferPosition);this.outputBuffer.extract(t,this.outputBufferPosition,i);var r=this.outputBufferPosition+i;return this.outputBufferPosition=Math.min(this.historyBufferSize,r),this.outputBuffer.receive(Math.max(r-this.historyBufferSize,0)),this._position+=i,i},handleSampleData:function(t){this.extract(t.data,4096)},clear:function(){h.prototype.clear.call(this),this.outputBufferPosition=0}}),p.prototype={get inputBuffer(){return this._inputBuffer},set inputBuffer(t){this._inputBuffer=t},get outputBuffer(){return this._outputBuffer},set outputBuffer(t){this._outputBuffer=t},clear:function(){this._inputBuffer.clear(),this._outputBuffer.clear()}},u(a.prototype,p.prototype),u(a.prototype,{set rate(t){this._rate=t},_reset:function(){this.slopeCount=0,this.prevSampleL=0,this.prevSampleR=0},clone:function(){var t=new a;return t.rate=this._rate,t},process:function(){var t=this._inputBuffer.frameCount;this._outputBuffer.ensureAdditionalCapacity(t/this._rate+1);var e=this._transpose(t);this._inputBuffer.receive(),this._outputBuffer.put(e)},_transpose:function(t){if(0==t)return 0;for(var e=this._inputBuffer.vector,i=this._inputBuffer.startIndex,r=this._outputBuffer.vector,s=this._outputBuffer.endIndex,o=0,u=0;this.slopeCount<1;)r[s+2*u]=(1-this.slopeCount)*this.prevSampleL+this.slopeCount*e[i],r[s+2*u+1]=(1-this.slopeCount)*this.prevSampleR+this.slopeCount*e[i+1],u++,this.slopeCount+=this._rate;if(this.slopeCount-=1,1!=t)t:for(;;){for(;this.slopeCount>1;)if(this.slopeCount-=1,++o>=t-1)break t;var n=i+2*o;r[s+2*u]=(1-this.slopeCount)*e[n]+this.slopeCount*e[n+2],r[s+2*u+1]=(1-this.slopeCount)*e[n+1]+this.slopeCount*e[n+3],u++,this.slopeCount+=this._rate}return this.prevSampleL=e[i+2*t-2],this.prevSampleR=e[i+2*t-1],u}}),u(c.prototype,{clear:function(){rateTransposer.clear(),tdStretch.clear()},clone:function(){var t=new c;return t.rate=rate,t.tempo=tempo,t},get rate(){return this._rate},set rate(t){this.virtualRate=t,this._calculateEffectiveRateAndTempo()},set rateChange(t){this.rate=1+.01*t},get tempo(){return this._tempo},set tempo(t){this.virtualTempo=t,this._calculateEffectiveRateAndTempo()},set tempoChange(t){this.tempo=1+.01*t},set pitch(t){this.virtualPitch=t,this._calculateEffectiveRateAndTempo()},set pitchOctaves(t){this.pitch=Math.exp(.69314718056*t),this._calculateEffectiveRateAndTempo()},set pitchSemitones(t){this.pitchOctaves=t/12},get inputBuffer(){return this._inputBuffer},get outputBuffer(){return this._outputBuffer},_calculateEffectiveRateAndTempo:function(){var t=this._tempo,e=this._rate;this._tempo=this.virtualTempo/this.virtualPitch,this._rate=this.virtualRate*this.virtualPitch,n(this._tempo,t)&&(