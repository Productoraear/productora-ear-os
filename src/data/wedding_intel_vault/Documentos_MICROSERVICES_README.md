et globalPagePropertiesExcludedEventNames = {};
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


<script>
                window.reducedUrl = '/groups/user/discussion/list';
    
        
            window.layerRedirect = 'a%3A2%3A%7Bs%3A7%3A%22reduced%22%3Bs%3A28%3A%22%2Fgroups%2Fuser%2Fdiscussion%2Flist%22%3Bs%3A10%3A%22ID_PROJECT%22%3Bi%3A1%3B%7D'
    
    
    window.isCustomDomainMode = false;

</script>

<div class="dnone">
                <script>
                gtag('event', 'page_view', {"COMMUNITY_NAV":1,"LOGGED":0,"EMPRESA":1,"EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":1,"send_to":"adwords","user_id":"e78903"});
                
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
                      
                      parent.fbq('track', 'PageView', {"COMMUNITY_NAV":1,"LOGGED":0,"EMPRESA":1,"EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":1}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'e145e9da-ccb5-4d22-821b-317ea2a6ae89'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0); 
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
                        parent.pintrk('track', 'custom', {"COMMUNITY_NAV":"1","LOGGED":"0","EMPRESA":"1","EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":"1","send_to":"adwords"});
                        
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

    
    
    
                <script type="application/ld+json">
              {"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Bodas","item":"https:\/\/www.bodas.net\/"},{"@type":"ListItem","position":2,"name":"Comunidad","item":"https:\/\/comunidad.bodas.net\/"},{"@type":"ListItem","position":3,"name":"Marina","item":"https:\/\/comunidad.bodas.net\/marina--u7460640"}]}            </script>
        </div>

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
    <symbol>
    <svg id="svg-_common-comment" viewBox="0 0 34 31"><path d="M18.212 21.628h4.238c5.158 0 9.45-4.334 9.45-9.534 0-5.298-4.386-9.99-9.45-9.99h-11C6.386 2.104 2 6.796 2 12.094c0 5.19 4.234 9.44 9.485 9.443l2.065.17v4.174l4.662-4.253zm-6.81 1.905C5.129 23.533 0 18.387 0 12.094 0 5.721 5.25.104 11.45.104h11c6.2 0 11.45 5.617 11.45 11.99 0 6.3-5.183 11.534-11.45 11.534h-3.462l-7.438 6.785v-6.867l-.147-.013z" fill-rule="nonzero"/></svg><svg id="svg-_common-eye" viewBox="0 0 36 21"><path d="M18 .559c4.235 0 8.366 1.871 12.245 4.968a34.113 34.113 0 013.628 3.365l.43.469c.135.151.264.298.385.438l.274.324.262.324a1 1 0 01-.04 1.271l-.178.197-.36.378c-.122.124-.25.254-.387.388l-.43.414a32.907 32.907 0 01-3.632 2.972c-3.872 2.728-7.99 4.374-12.197 4.374-4.207 0-8.325-1.646-12.196-4.374a32.916 32.916 0 01-3.633-2.972l-.43-.414a27.553 27.553 0 01-