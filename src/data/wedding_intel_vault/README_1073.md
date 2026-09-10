ded) {
                        parent.fbq('init', '1434721056835089', {}, {}); 
                        globalFacebook.isLoaded = true;
                      }
                      
                      parent.fbq('track', 'PageView', {"HONEY_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'dd099c60-37f9-466c-acb5-5fdded48461b'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0); 
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
                        parent.pintrk('track', 'custom', {"HONEY_NAV":"1","LOGGED":"0","EMPRESA":"0","EMPRESA_CATEGORY":"0","send_to":"adwords"});
                        
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
            </script> </div>


    
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
    