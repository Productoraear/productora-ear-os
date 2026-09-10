GroupId: true, }; </script> <script> String.prototype.sprintf = function() { var args = arguments; var pos = 0; return this.replace(/\%s/g, function(match, number) { pos++; return typeof args[pos-1] != 'undefined' ? args[pos-1] : match ; }); }; function __ (string) { return string } function _s() { var msg = arguments[0]; return String.prototype.sprintf.apply(msg, Array.prototype.slice.call(arguments, 1)); } function _n (single, plural, value) { var string = ''; var value = parseInt(value); if (value === 1) { string = single.replace('%s', value); } else { string = plural.replace('%s', value); } return string; } function _ns (single, plural, value, value2) { var string = _n(single, plural, value); return _s(string, value2); } </script>
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
actorJson : '{\u0022id\u0022:78903,\u0022name\u0022:\u0022Productora EAR\u0022,\u0022avatar\u0022:\u0022https:\\/\\/cdn0.bodas.net\\/emp\\/fotos\\/7\\/8\\/9\\/0\\/3\\/edwin-agudelo-canta-a-novios_1_78903_v3.jpg\u0022,\u0022avatarSvg\u0022:null,\u0022type\u0022:\u0022vendor\u0022}',
customOptions : {
disableUserVen