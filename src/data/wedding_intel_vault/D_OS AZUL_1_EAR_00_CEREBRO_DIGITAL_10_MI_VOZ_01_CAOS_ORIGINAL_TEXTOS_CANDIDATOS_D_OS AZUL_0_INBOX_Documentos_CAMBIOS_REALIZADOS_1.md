>
      <div class="layoutHeader__authNoLoggedArea app-header-auth-area">
        <a class="layoutHeader__vendorAuth" rel="nofollow" href="https://www.bodas.net/emp-Acceso.php">
          <i class="svgIcon svgIcon__briefcase layoutHeader__vendorAuthIcon">
            <svg viewBox="0 0 48 41">
              <path d="M44.3 27.917h.933V13.925c0-1.46-1.199-2.86-3.057-3.625H5.825c-1.859.766-3.058 2.164-3.058 3.625v13.992h14.866V24.39a1 1 0 011-1h10.734a1 1 0 011 1v3.527H44.3zm-2.133 2h-11.8v.51a1 1 0 01-1 1H18.633a1 1 0 01-1-1v-.51h-11.8v8.564h36.334v-8.564zM14.567 8.3v-.51c0-3.797 2.855-7.035 6.533-7.035h5.8c3.68 0 6.533 3.236 6.533 7.036V8.3h8.935a1 1 0 01.358.066c2.655 1.02 4.507 3.115 4.507 5.559v14.992a1 1 0 01-1 1h-2.066v9.564a1 1 0 01-1 1H4.833a1 1 0 01-1-1v-9.564H1.767a1 1 0 01-1-1V13.925c0-2.445 1.852-4.54 4.509-5.559a1 1 0 01.358-.066h8.933zm13.8 21.126V25.39h-8.734v4.036h8.734zm3.066-21.635c0-2.747-2.018-5.036-4.533-5.036h-5.8c-2.513 0-4.533 2.29-4.533 5.036V8.3h14.866v-.51z" fill-rule="nonzero">
              </path>
            </svg>
          </i>
          Área Empresas
        </a>
        <ul class="layoutNavMenuAuth">
          <li class="layoutNavMenuAuth__item">
            <a href="https://www.bodas.net/users-login.php?r=https%3A%2F%2Finvitaciones.bodas.net" rel="nofollow" class="layoutNavMenuAuth__anchor">
              Accede
            </a>
          </li>
          <li class="layoutNavMenuAuth__item">
            <a href="https://www.bodas.net/users-signup.php?r=https%3A%2F%2Finvitaciones.bodas.net" rel="nofollow" class="layoutNavMenuAuth__anchor">
              Regístrate
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  				<script>
					var CONSENT_ANALYTICS_GROUP = 'C0002';
					var CONSENT_PERSONALIZATION_GROUP = 'C0003';
					var CONSENT_TARGETED_ADVERTISING_GROUP = 'C0004';
					var CONSENT_SOCIAL_MEDIA_GROUP = 'C0005';
					var cookieConsentContent = '';

					var OptanonAlertBoxClosed = getCookie('OptanonAlertBoxClosed');
					if (Boolean(OptanonAlertBoxClosed)) {
						cookieConsentContent = queryStringToJSON(getCookie('OptanonConsent') || '');
					}

					function getCookie (name) {var b = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'); return b ? unescape(b.pop()) : null}
					function queryStringToJSON(queryString) {
						var pairs = queryString.split('&'); var result = {}; pairs.forEach(function(pair) { pair = pair.split('='); result[pair[0]] = decodeURIComponent(pair[1] || ''); });
						return JSON.parse(JSON.stringify(result));
					}
					
					function isCookieGroupAllowed(group) {
						var consentGroups = cookieConsentContent.groups;
						if (typeof(consentGroups) !== 'string') {
							return false
						}

						var consentFields = consentGroups.split(',');
						for (var x = 0; x < consentFields.length; x++) {
							if (consentFields[x].indexOf(group, 0) >= 0) {
								return consentFields[x].split(':')[1] === '1'
							}
						}
						return false
					}

					function userHasAcceptedTheCookies () {
						var body = document.getElementsByTagName('body')[0];
						var event = document.createEvent('HTMLEvents');
						cookieConsentContent = queryStringToJSON(getCookie('OptanonConsent') || '');

						if (isCookieGroupAllowed(CONSENT_ANALYTICS_GROUP) === true) {
							event.initEvent('analyticsCookiesHasBeenAccepted', true, false);
							body.dispatchEvent(event);
						}
						if (isCookieGroupAllowed(CONSENT_PERSONALIZATION_GROUP) === true) {
							event.initEvent('personalizationCookiesHasBeenAccepted', true, false);
							body.dispatchEvent(event);
						}
						if (isCookieGroupAllowed(CONSENT_TARGETED_ADVERTISING_GROUP) === true) {
							event.initEvent('targetedAdvertisingCookiesHasBeenAccepted', true, false);
							body.dispatchEvent(event);
						}
						if (isCookieGroupAllowed(CONSENT_SOCIAL_MEDIA_GROUP) === true) {
							event.initEvent('socialMediaAdvertisingCookiesHasBeenAccepted', true, false);
							body.dispatchEvent(event);
						}
					}

					function CMP() {
						var body = document.getElementsByTagName('body')[0];
						var event = document.createEvent('HTMLEvents');
						var callbackIAB = (tcData, success) => {
							if (success && (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete')) {
								window.__tcfapi('removeEventListener', 2, () => {
								}, callbackIAB);
								userHasAcceptedTheCookies();
							}
						}
						va