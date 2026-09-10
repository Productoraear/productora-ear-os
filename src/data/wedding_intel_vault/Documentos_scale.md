pinterest;
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
parent.pintrk('track', 'custom', {"GROOMS_NAV":"1","VENDORS_22_NAV":"1","LOGGED":"0","EMPRESA":"0","EMPRESA_CATEGORY":"0","send_to":"adwords"});
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
{"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Bodas","item":"https:\/\/www.bodas.net\/"}]}            </script>
<script type="application/ld+json">
[{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/74650\/3_2\/960\/jpg\/foto-16_1_74650-173080787039812.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/mc-moda-hombre--e74650","name":"MC Moda Hombre","image":"foto-16_1_74650-173080787039812.jpg","address":{"@type":"PostalAddress","streetAddress":"Stuart, 115","postalCode":"28300","addressLocality":"Aranjuez","addressRegion":"Madrid"},"aggregateRating":{"@type":"AggregateRating","reviewCount":9,"ratingValue":"5.0","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/06522\/3_2\/960\/png\/perfectos_1_106522.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/la-trajeria--e106522","name":"La Trajer\u00eda","image":"perfectos_1_106522.png","address":{"@type":"PostalAddress","streetAddress":"San Clemente, 3","postalCode":"38003","addressLocality":"Santa Cruz De Tenerife","addressRegion":"Santa Cruz de Tenerife"},"aggregateRating":{"@type":"AggregateRating","reviewCount":18,"ratingValue":"5.0","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/52258\/3_2\/960\/png\/crop_1596525226_isotipo_1_52258-1570073295.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/m3-chaque--e52258","name":"M3 Chaqu\u00e9","image":"dsc-8710-e1518344819230_1_52258.jpg","address":{"@type":"PostalAddress","streetAddress":"Jos\u00e9 Mar\u00eda Fern\u00e1ndez Lanseros, 7","postalCode":"28017","addressLocality":"Madrid","addressRegion":"Madrid"},"aggregateRating":{"@type":"AggregateRating","reviewCount":90,"ratingValue":"4.9","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/51480\/3_2\/960\/jpg\/logoavaguel_1_51480.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/avaguel--e51480","name":"Avaguel","image":"dscf3345_1_51480.jpg","address":{"@type":"PostalAddress","streetAddress":"Hospital, 8","postalCode":"28850","addressLocality":"Torrej\u00f3n De Ardoz","addressRegion":"Madrid"},"aggregateRating":{"@type":"AggregateRating","reviewCount":4,"ratingValue":"5.0","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/18982\/3_2\/960\/jpg\/logotipo.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/disfraces-gamar--e18982","name":"Disfraces Gamar","image":"arquera_1_18982.jpg","address":{"@type":"PostalAddress","streetAddress":"Av. Pablo Iglesias, 1 izq","postalCode":"33205","addressLocality":"Gij\u00f3n","addressRegion":"Asturias"}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/46290\/3_2\/960\/jpg\/ramonsanjurjo-026_1_46290-167395311563815.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/javier-canizares-jc--e46290","name":"Javier Ca\u00f1izares JC","image":"ramonsanjurjo-026_1_46290-167395311563815.jpg","address":{"@type":"PostalAddress","streetAddress":"Ventura, 1","postalCode":"18600","addressLocality":"Motril","addressRegion":"Granada"},"aggregateRating":{"@type":"AggregateRating","reviewCount":25,"ratingValue":"4.8","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/51473\/3_2\/960\/jpg\/20160119-125835_1_51473_v3.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/casa-loli--e51473","name":"Casa Loli","image":"20160119-125835_1_51473_v3.jpg","address":{"@type":"PostalAddress","streetAddress":"Fernando Col\u00f3n, 1","postalCode":"14002","addressLocality":"C\u00f3rdoba","addressRegion":"C\u00f3rdoba"},"aggregateRating":{"@type":"AggregateRating","reviewCount":10,"ratingValue":"4.7","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/80493\/3_2\/960\/png\/diseno-sin-titulo-17_1_80493-166481588366575.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/dnovios--e80493","name":"D'Novios","image":"diseno-sin-titulo-17_1_80493-166481588366575.png","address":{"@type":"PostalAddress","streetAddress":"Acera Recoletos, 16","postalCode":"47004","addressLocality":"Valladolid","addressRegion":"Valladolid"},"aggregateRating":{"@type":"AggregateRating","reviewCount":10,"ratingValue":"5.0","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/47047\/3_2\/960\/jpg\/2_1_147047-158046304117375.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/canizares-concept--e147047","name":"Ca\u00f1izares Concept","image":"2_1_147047-158046304117375.jpg","address":{"@type":"PostalAddress","streetAddress":"Sierpe Baja, 1","postalCode":"18001","addressLocality":"Granada","addressRegion":"Granada"},"aggregateRating":{"@type":"AggregateRating","reviewCount":66,"ratingValue":"4.9","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/42982\/3_2\/960\/jpg\/logosastreriabanus.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/sastreria-banus--e42982","name":"Sastrer\u00eda Ban\u00fas","image":"venta_1_42982.jpg","address":{"@type":"PostalAddress","streetAddress":"Ribera, s\/n local 106","postalCode":"29660","addressLocality":"Marbella","addressRegion":"M\u00e1laga"},"aggregateRating":{"@type":"AggregateRating","reviewCount":2,"ratingValue":"3.0","worstRating":0,"bestRating":5}},{"@context":"http:\/\/schema.org","@type":"LocalBusiness","logo":"https:\/\/cdn0.bodas.net\/vendor\/77482\/3_2\/960\/jpg\/ramonsanjurjo-026_1_77482-167395239738283.webp","url":"https:\/\/www.bodas.net\/alquiler-trajes\/javier-canizares-jc--e77482","name":"Javier Ca\u00f1izares JC","image":"ramonsanjurjo-026_1_77482-167395239738283.jpg","address":{"@type":"PostalAddress","streetAddress":"San Ant\u00f3n, 3","postalCode":"18