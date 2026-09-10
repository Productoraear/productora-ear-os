obj['userId'] = payload.obj[namespace]['loggedUserUUID']
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
                window.reducedUrl = '/catalog/list';
    
        
            window.layerRedirect = 'a%3A2%3A%7Bs%3A7%3A%22reduced%22%3Bs%3A13%3A%22%2Fcatalog%2Flist%22%3Bs%3A10%3A%22ID_PROJECT%22%3Bi%3A1%3B%7D'
    
    
    window.isCustomDomainMode = false;

</script>

<div class="dnone">
                <script>
                gtag('event', 'page_view', {"CATALOG_NAV":1,"LOGGED":0,"EMPRESA":1,"EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":1,"send_to":"adwords","user_id":"e78903"});
                
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
                      
                      parent.fbq('track', 'PageView', {"CATALOG_NAV":1,"LOGGED":0,"EMPRESA":1,"EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":1}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + '15650f97-8253-4fc0-a717-d7a03db6e1d3'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0); 
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
                        parent.pintrk('track', 'custom', {"CATALOG_NAV":"1","LOGGED":"0","EMPRESA":"1","EMPRESA_CATEGORY":"9","EMPRESA_CLIENT":"1","send_to":"adwords"});
                        
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
              {"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Bodas","item":"https:\/\/www.bodas.net\/"},{"@type":"ListItem","position":2,"name":"Zapatos","item":"https:\/\/www.bodas.net\/zapatos"}]}            </script>
        </div>

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
    <symbol>
    <svg id="svg-_common-angleDown" viewBox="0 0 18 18"><path d="M16.9 5.6c-.2-.2-.5-.2-.7 0L9 12.8 1.8 5.6c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l7.5 7.5v.1c.1.1.3.1.4.1.1 0 .3 0 .4-.1v-.1l7.5-7.5c.2-.2.2-.5 0-.7z"/></svg>    </symbol>
</svg>
<script type="text/javascript"  src="/c-O80A/xtX/qkH/G2361fZl/EaaOt8fNLDVQictu/Hls2Ag/NEs/-bm0mYXYB"></script></body>
</html>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         from sympy.polys.matrices.exceptions import DMNonInvertibleMatrixError
from sympy.polys.domains import EX

from .exceptions import MatrixError, NonSquareMatrixError, NonInvertibleMatrixError
from .utilities import _iszero


def _pinv_full_rank(M):
    """Subroutine for full row or column rank matrices.

    For full row rank matrices, inverse of ``A * A.H`` Exists.
    For full column rank matrices, inverse of ``A.H * A`` Exists.

    This routine can apply for both cases by checking the shape
    and have small decision.
    """

    if M.is_zero_matrix:
        return M.H

    if M.rows >= M.cols:
        return M.H.multiply(M).inv().multiply(M.H)
    else:
        return M.H.multiply(M.multiply(M.H).inv())

def _pinv_rank_decomposition(M):
    """Subroutine for rank decomposition

    With rank decompositions, `A` can be decomposed into two full-
    rank matrices, and each matrix can take pseudoinverse
    individually.
    """

    if M.is_zero_matrix:
        return M.H

    B, C = M.rank_decomposition()

    Bp = _pinv_full_rank(B)
    Cp = _pinv_full_rank(C)

    return Cp.multiply(Bp)

def _pinv_diagonalization(M):
    """Subroutine using diagonalization

    This routine can sometimes fail if SymPy's eigenvalue
    computation is not reliable.
    """

    if M.is_zero_matrix:
        return M.H

    A  = M
    AH = M.H

    try:
        if M.rows >= M.cols:
            P, D   = AH.multiply(A).diagonalize(normalize=True)
            D_pinv = D.applyfunc(lambda x: 0 if _iszero(x) else 1 / x)

            return P.multiply(D_pinv).multiply(P.H).multiply(AH)

        else:
            P, D   = A.multiply(AH).diagonalize(
                        normalize=True)
            D_pinv = D.applyfunc(lambda x: 0 if _iszero(x) else 1 / x)

            return AH.multiply(P).multiply(D_pinv).multiply(P.H)

    except MatrixError:
        raise NotImplementedError(
            'pinv for rank-deficient matrices where '
            'diagonalization of A.H*A fails is not supported yet.')

def _pinv(M, method='RD'):
    """Calculate the Moore-Penrose pseudoinverse of the matrix.

    The Moore-Penrose pseudoinverse exists and is unique for any matrix.
    If the matrix is invertible, the pseudoinverse is the same as the
    inverse.

    Parameters
    ==========

    method : String, optional
        Specifies the method for computing the pseudoinverse.

        If ``'RD'``, Rank-Decomposition will be used.

        If ``'ED'``, Diagonalization will be used.

    Examples
    ========

    Computing pseudoinverse by rank decomposition :

    >>> from sympy import Matrix
    >>> A = Matrix([[1, 2, 3], [4, 5, 6]])
    >>> A.pinv()
    Matrix([
    [-17/18,  4/9],
    [  -1/9,  1/9],
    [ 13/18, -2/9]])

    Computing pseudoinverse by diagonalization :

    >>> B = A.pinv(method='ED')
    >>> B.simplify()
    >>> B
    Matrix([
    [-17/18,  4/9],
    [  -1/9,  1/9],
    [ 13/18, -2/9]])

    See Also
    ========

    inv
    pinv_solve

    References
    ==========

    .. [1] https://en.wikipedia.org/wiki/Moore-Penrose_pseudoinverse

    """

    # Trivial case: pseudoinverse of all-zero matrix is its transpose.
    if M.is_zero_matrix:
        return M.H

    if method == 'RD':
        return _pinv_rank_decomposition(M)
    elif method == 'ED':
        return _pinv_diagonalization(M)
   