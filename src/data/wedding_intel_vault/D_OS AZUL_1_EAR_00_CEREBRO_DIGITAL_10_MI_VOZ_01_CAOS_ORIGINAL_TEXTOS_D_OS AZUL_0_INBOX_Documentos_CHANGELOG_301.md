tItem(cacheKey)) {
return;
}
body = JSON.stringify({
variantId,
analytics_id: bucketingId,
});
const requestOptions = {
method: "POST",
headers: myHeaders,
body,
redirect: "follow",
};
fetch(
`${host}/experiments/${experimentId}/${bucketingId}`,
requestOptions
).then((response) => {
if (response.ok) {
localStorage.setItem(cacheKey, Date.now());
}
});
});
})();
(function () {
const experiments = (window.pageGlobals && window.pageGlobals.experiments) ? window.pageGlobals.experiments : {};
const myHeaders = new Headers({
"Content-Type": "application/json",
});
let body;
Object.keys(experiments).forEach(exp => {
const shouldReportToFlipper = experiments[exp].shouldReportToFlipper;
if (shouldReportToFlipper === false) return;
const experimentId = experiments[exp].experimentId;
const variantId = experiments[exp].variantId;
const bucketingId = window.userGlobals ? window.userGlobals[experiments[exp].bucketingType] : null;
if (bucketingId === null) {
return
}
const cacheKey = `expCacheTBucket-${experimentId}-${bucketingId}-${variantId}`;
if (localStorage.getItem(cacheKey)) {
return;
}
body = JSON.stringify({
variantId: variantId,
bucketingId: bucketingId,
experimentId: experimentId,
});
const requestOptions = {
method: "POST",
headers: myHeaders,
body,
redirect: "follow",
};
fetch(
`/flipper/set-bucketing`,
requestOptions
).then((response) => {
if (response.ok) {
localStorage.setItem(cacheKey, Date.now());
}
});
});
})();
</script>
<div class="dnone">
<script>
gtag('event', 'page_view', {"VENUES_NAV":1,"VENDORS_1_NAV":1,"LOGGED":0,"EMPRESA":1,"EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":1,"send_to":"adwords","user_id":"e78903"});
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
parent.fbq('track', 'PageView', {"VENUES_NAV":1,"VENDORS_1_NAV":1,"LOGGED":0,"EMPRESA":1,"EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":1}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + '9aca6a0c-b609-4b35-80c6-a129ad9b94db'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0);
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
parent.pintrk('track', 'custom', {"VENUES_NAV":"1","VENDORS_1_NAV":"1","LOGGED":"0","EMPRESA":"1","EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":"1","send_to":"adwords"});
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
<script type="application/ld+json">
{"@cont