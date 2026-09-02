emarketing.pinterest : {};
                    var isLoaded = globalPinterest.isLoaded === true;
                    
                    if (!isLoaded) {
                        parent.pintrk('load', 2613978159206);
                        globalPinterest.isLoaded = true;
                    }
                    
                      var isTracked = globalPinterest.isTracked === true;
                      if (!isTracked) {
                        globalPinterest.isTracked = true;
                        parent.pintrk('page');
                        parent.pintrk('track', 'custom', {"GROOMS_NAV":"1","LOGGED":"0","EMPRESA":"0","EMPRESA_CATEGORY":"0","send_to":"adwords"});
                        
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
                      var o = {