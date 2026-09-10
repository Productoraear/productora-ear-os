.insertBefore(n,i)
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
            </script> </div>


    
        <script type="text/javascript" src="https://cdn1.bodas.net/assets/js/newRelicRum.js?siteVersion=symfnw-ES171-1-20241219-010_www_m_" async></script>
    <script>
      window.addEventListener('newR