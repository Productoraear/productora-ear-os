mium","vendor_visibility_tier":"Premium","vendor_completion_status":0.65000000000000002220446049250313080847263336181640625,"bvc_plus":0,"isMasquerading":false,"platform":"desktop web","section":"\/vendors\/item\/profile","build_product":"marketplace"};
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
payload.obj[namespace]['event_id'] = 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'fe3291cc-5b7d-4785-b1da-be64ad54e7ab'
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
gtag('event', 'page_view', {"VENDORS_NAV":1,"VENDORS_7_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0,"send_to":"adwords"});
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
parent.fbq('track', 'PageView', {"VENDORS_NAV":1,"VENDORS_7_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'fe3291cc-5b7d-4785-b1da-be64ad54e7ab'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0);
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
parent.pintrk('track', 'custom', {"VENDORS_NAV":"1","VENDORS_7_NAV":"1","LOGGED":"0","EMPRESA":"0","EMPRESA_CATEGORY":"0","send_to":"adwords"});
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
<script type='text/javascript'>
(function(w) {
function setAttributes() {
w._sva.setVisitorTraits({
user_id: '',
employee_id: '',
vendor_id: '',
vendor_tier_tk: '0',
vendor_tier_ww: '0',
market_code: '',
category_code_tk: '',
category_code_ww: '',
experiments: '3c2f31aa-7488-4711-a760-ae994ef480ca,52ddca90-9455-4def-9e17-439869b65fea,75c49d3a-938b-4896-bc69-e1dd5fe94e19,7b6577de-2b3a-46fc-8f20-162f250b511a,b62017cd-0f98-4a68-8f9c-ff170051df5f,b9fdcb28-2031-4af5-b3c9-1059471d1eb5,ba5ff33f-e398-4543-8b7e-a098a526de3f,bc2c4122-fadd-4762-95f4-ffe8feab787a,bd61024e-a0e4-4d50-86af-f63b0b3beeaf,ca55dd78-2d83-4a5a-8ea9-d01989d1a6c9,d35cf1ff-f04f-4064-b708-8e0fd4052be1,e07523e5-5365-4ff0-b5d7-19e2f6e3115b,edf5cea7-b553-4ce2-b00b-e2329217f66e,f09dbae0-c609-46ac-90e5-838cef0c710d'
});
}
if (w._sva) {
setAttributes();
} else {
w.addEventListener("SurvicateReady", setAttributes);
}
var s = document.createElement('script');
s.src = 'https://survey.survicate.com/workspaces/478cb2dcb7cb43968ed84643ad169c41/web_surveys.js';
s.defer = true;
var e = document.getElementsByTagName('script')[0];
e.parentNode.insertBefore(s, e);
})(window);
</script>
<script type="application/ld+json">
{"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Bodas","item":"https:\/\/www.bodas.net\/"},{"@type":"ListItem","position":2,"name":"Detalles de bodas","item":"https:\/\/www.bodas.net\/bodas\/proveedores\/detalles-de-bodas"},{"@type":"ListItem","position":3,"name":"Las Palmas","item":"https:\/\/www.bodas.net\/bodas\/proveedores\/detalles-de-bodas\/las-palmas"},{"@type":"ListItem","position":4,"name":"Vecindario","item":"https:\/\/www.bodas.net\/bodas\/proveedores\/detalles-de-bodas\/las-palmas\/vecindario"}]}            </script>
<script type="application/ld+json">
[{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/jpg\/1000047952_1_237038-170720737544376.webp","url":"https:\/\/www.bodas.net\/detalles-de-bodas\/foto-iris-gran-canaria--e237038","name":"Foto Iris Gran Canaria","address":{"@type":"PostalAddress","postalCode":"35110","addressLocality":"Vecindario","addressRegion":"Las Palmas","streetAddress":"Marianela, 8"},"geo":{"@type":"GeoCoordinates","latitude":27.8549000000000006593836587853729724884033203125,"longitude":-15.4380000000000006110667527536861598491668701171875},"image":[{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/jpg\/1000047952_1_237038-170720737544376.webp","width":960,"height":640},{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/jpg\/1000048032_1_237038-170720739613625.webp","width":960,"height":640},{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/jpg\/1000047949_1_237038-170720738096256.webp","width":960,"height":640},{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/jpg\/1000047943_1_237038-170720738660895.webp","width":960,"height":640},{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/jpg\/1000047948_1_237038-170720739284075.webp","width":960,"height":640},{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/png\/1000048570_1_237038-170868735399268.webp","width":960,"height":640},{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/jpg\/1000048564_1_237038-170868739862599.webp","width":960,"height":640},{"@type":"ImageObject","url":"https:\/\/cdn0.bodas.net\/vendor\/37038\/3_2\/960\/jpg\/1000048552_1_237038-170868742384586.webp","width":960,"height":640}]}]            </script>
<script type="text/javascript"  src="/c-O80A/xtX/qkH/G2361fZl/EaaOt8fNLDVQictu/Hls2Ag/NEs/-bm0mYXYB"></script></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      # ⚖️ VIMUME: ESTRATEGIA JURÍDICA Y TERRITORIAL
## Guía de Decisión para Figura Legal Óptima

> *Versión: 1.0 — Feb 2026*
> *Presupuesto disponible: €1.000*
> *Ubicación: Toledo (CLM) / posibilidad Madrid*
> *Contacto universitario: URJC - Incubadora Móstoles*

---

## 1. VEREDICTO EJECUTIVO (TL;DR)

```
╔══════════════════════════════════════════════════════════════╗
║                                                            