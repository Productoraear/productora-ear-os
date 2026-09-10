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
                window.reducedUrl = '/catalog/item';
    
        
            window.layerRedirect = 'a%3A2%3A%7Bs%3A7%3A%22reduced%22%3Bs%3A13%3A%22%2Fcatalog%2Fitem%22%3Bs%3A10%3A%22ID_PROJECT%22%3Bi%3A1%3B%7D'
    
    
    window.isCustomDomainMode = false;

</script>

<div class="dnone">
                <script>
                gtag('event', 'page_view', {"CATALOG_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0,"send_to":"adwords"});
                
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
                      
                      parent.fbq('track', 'PageView', {"CATALOG_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'be5096be-73eb-44ad-8d55-200e61a17bc9'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0); 
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
                        parent.pintrk('track', 'custom', {"CATALOG_NAV":"1","LOGGED":"0","EMPRESA":"0","EMPRESA_CATEGORY":"0","send_to":"adwords"});
                        
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
    s.defer = true;
    var e = document.getElementsByTagName('script')[0];
    e.parentNode.insertBefore(s, e);
  })(window);
</script>

                <script type="application/ld+json">
              {"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Bodas","item":"https:\/\/www.bodas.net\/"},{"@type":"ListItem","position":2,"name":"Zapatos","item":"https:\/\/www.bodas.net\/zapatos"},{"@type":"ListItem","position":3,"name":"Zapatos Mimanera","item":"https:\/\/www.bodas.net\/zapatos\/mimanera--d1183"}]}            </script>
        </div>

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
    <symbol>
    <svg id="svg-_common-angleDown" viewBox="0 0 18 18"><path d="M16.9 5.6c-.2-.2-.5-.2-.7 0L9 12.8 1.8 5.6c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l7.5 7.5v.1c.1.1.3.1.4.1.1 0 .3 0 .4-.1v-.1l7.5-7.5c.2-.2.2-.5 0-.7z"/></svg>    </symbol>
</svg>
<script type="text/javascript"  src="/c-O80A/xtX/qkH/G2361fZl/EaaOt8fNLDVQictu/Hls2Ag/NEs/-bm0mYXYB"></script></body>
</html>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          PK     ! ß¤ÒlZ      [Content_Types].xml ¢(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ´”ËnÂ0E÷•ú‘·Ubè¢ª*‹>–-Ré{Vı’Ç¼ş¾QU‘
l"%3÷Ş3VÆƒÑÚšl	µw%ë=–“^i7+Ù×ä-d&á”0ŞAÉ6€l4¼½L60#µÃ’ÍS
Oœ£œƒXø *•V$z3„ü3à÷½Ş—Ş%p)Oµ^ “²×5}nH"dÙsÓXg•L„`´‰ê|éÔŸ”|—PrÛƒsğ?˜PWìtt4Q+ÈÆ"¦wa©‹¯|T\y¹°¤,NÛàôU¥%´úÚ-D/‘ÎÜš¢­X¡İÿ(¦¼<EãÛ)‘à ;çN„L?¯FñË¼¤¢Ü‰˜¸<Fkİ	‘h¡yöÏæØÚœŠ¤Îqôi£ã?ÆŞ¯l­Îià 1éÓ]›HÖgÏõm @ÈæÛûmø  ÿÿ PK     ! ‘·ï   N   _rels/.rels ¢(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ¬’ÁjÃ0@ïƒıƒÑ½QÚÁ£N/cĞÛÙ[ILÛØj×şı<ØØ]éaGËÒÓ“ĞzsœFuà”]ğ–UŠ½	Öù^Ã[û¼x •…¼¥1xÖpâ›æöfıÊ#I)Êƒ‹YŠÏ‘øˆ˜ÍÀå*Döå§i")ÏÔc$³£qU×÷˜~3 ™1ÕÖjH[{ª=E¾†ºÎ~
f?±—3-ÂŞ²]ÄTê“¸2j)õ,l0/%œ‘b¬
ğ¼Ñêz£¿§Å‰…,	¡	‰/û|f\ZşçŠæ?6ï!Y´_áoœ]Aó  ÿÿ PK     ! öÁ•¢  Ã     word/document.xmlì˜Ínã6Çïú„Î›èËŠ±ÎÂ±7‹ »@Ğm{§)ZbV"U’²ã=õUzé-§>‚ß¤OÒ}øc½Me-
´K"5?çÏR~ıæ1ÏÈ’k#”;ş¥ç.™Š…LÆÎßß^D1–Ê˜fJò±³æÆysıí7¯W£X±2çÒ@H3Zlì¤Ö#×5,å95—¹`Zµ°—Lå®Z,ãîJéØ<ß«î
­7Æ›R¹¤Æipì±-ÖtÆì¹,¥ÚòÇÃ?Òw¯Üèœ‚ş1*<5pÑ«#Pï,xuDêŸGúÊäç‘‚cÒğ<RxLŠÎ#-§üx«‚Kè\(S:qsª?•Å€jÅ\dÂ®éZòÓÕ–‡ñÉ„¡›«˜gaÜRÔØ)µ5ö[{t}TÛ7—ÖBw™m2kŠC5sWób¡¤IE±Íğü\t¦-dùÜ$–yÖ¾·*üéògåiV‡rìâ~ÿ<«=è{AÄÖ¢‹‡c¶ä°
wŸš½àúH Æ;ü–5—í29¢cj´œZäˆ]`ıuìKgö &¶qz%hãê¢-µ4¥f»Ğ‘ÈOsª¿Å­ó½ÉËáVe±£‰—Ñîvem…ŒXMBí'¹y™3SZ@µËÙè.‘JÓyAzXá¤R a¡à¥ºåU;jM°Æ8×p2š«x×úz£‚jz‹²×=ßªö‹­Ş`âÃéZGp
‹¿ƒ&ïí$œô‡Û¦_Ğ2³ØNƒ!¼\Ñï5^ts¹UÒ° †	ĞäG®c*)2Ò‰4{-.¾n>CÇ’fc'ˆÚ–)šïµ¹ÜİÕzt¯¿pæï÷b5²×ÓN¢Š0*­"Wbiîx–ÑW$SDs&æ\šÏ•!kJ~*9ôŠE2jĞ˜ÁVÄtÉœ‚¤”,Kn,0Ra¬Ò‚’BiÂ"Ğ«ù¢äú3•À6d¹y’¬Ä»˜ã¸üşşó¯è¤­]­Ãu¬¾×»y¼É¡úÁ`z…w ~ÖŸúÿœĞïIi¢ ÈâœºxšÚ<QÏˆWrÄ¥¡µş¹ ÈˆÇ®|ÆzÙAÿæ&
¼¨¨Ìà&º™M†şÿÊ*ó“J¨©²ª€(È©u-ˆå$)ákQ£PØÙG*Á Ç\$~H>|ÂeLl~“]TÜö"?¸B=öTê÷gşäj8}N¥ƒZõ–7É‘)(ƒ=­ĞÜp½äN[RsNàÃöL¬k4Ë6O¨Ï°Š‚È lJçzó‹D]cZá¦¢Ò‰¦n†[‚ªVØ2Æå Ph³sM5¢«TV•êXw¹&¦4D=T«ÃÀ@BÂ¯®Ã™½ßîA%u%hòƒeß¿ÂO0ˆ$Ü¢°‰X‘| H´
Îó~Ï¯7]‘¤°4ü¡W¥ÿ\Y«ò]wÆ{½)§1‡q‡^„¥ìŞcRÚêÑ«‡c*Cğª9VìÆSÅ(’ßËÀKØ-ëyW·õÑÂİıûrı   ÿÿ PK     ! Öd³Qô   1   word/_rels/document.xml.rels ¢(                                                                                                                                                                                                                                                                  ¬’ËjÃ0E÷…şƒ˜}-;}PBälJ!ÛÖı E?¨,	Íôá¿¯HIëĞ`ºğr®˜sÏ€6ÛÏÁŠwŒÔ{§ ÈrèŒ¯{×*x©¯îAkWkë*‘`[^^lĞjNKÔõD¢8RĞ1‡µ”d:4e> K/ƒæ4ÆVm^u‹r•çw2NP0Å®Vwõ5ˆjø¶ošŞàƒ7o:>S!?pÿŒÌé8JX[d“0KDçEVKŠĞ‹c2§P,ªÀ£Å©Àa«¿]²Ó.ş¶Æï°˜s¸YÒ¡ñ+½·Ÿè(!O>zù  ÿÿ PK     ! §%òÚ  Ë      word/theme/theme1.xmlìY[‹7~/ô?ˆyw|›ñ%Ä)öØn.»IÈ:)}ÔÚòŒbÍÈHònL	”ô©/…BZúĞ@ßúPJ-4ô¥?&Ğ¦?¢GÛ3²å¦I6Ê®a­Ëw>stt<séƒû	C'DHÊÓW½PñIÇ|BÓ¨ãİK-I…Ó	f<%oI¤÷Áå÷ß»„/ª˜$|*/â+5¿X.Ë1cyÏI
sS.¬ +¢òDàSĞ›°r­Ri”LS¥8µ#A‚nN§tL¼ËkõÿR%õÀ˜‰#­œ¬d
ØÉ¬ª¿äR†L Ì:¬4á§#r_yˆa©`¢ãUÌŸW¾|©¼bjlAnhşVr+É¬fäDt¼ôıÀot7ú€©]Ü 9h}€ÇcØiÆÅÖÙ¬…ş
[ eM‡î~³_¯Zø‚şú¾è…7 ¬éïà‡Ã0·a”5ƒ|Ğk÷ú¶~Êš|³ÒíûMo@1£él]	õp½ÛdÊÙ'¼øÃfmÏQåBteò©Úk	¾ÇÅ Æ¹XÑ©åœLñp!fôXPt@£oS.a¸R«+uø¯?¾iâ‹¤³¡±ÜÒ|:Wïhõ
gO<}øëÓ‡¿=ıì³§Z­½+w§QQîÅ÷_şıøSô×/ß½xô•/‹øç?~şü÷?şM½²h}ıóó_~öÍşğÈï
|\„hB$ºANÑmÀcñj£Ó¢D7$N±–q *¶Ğ7–˜a®Gl;Ş.\À÷,ÂG±X(ê ^xÈ9ëqáÜÓu½VÑ
‹4r/.EÜmŒO\k‡[^,æ÷Ô¥2Œ‰Eó—ãˆ¤D!=Çg„8Ä>¦Ô²ë!.ùT¡)êaê4Éˆ[Ñ”]¡	øeé"ş¶lsxõ8s©ï“	g3—JÂ,3~ˆ
'NÆ8aEäV±‹äÑRŒ-ƒKãh0!RºdnŠ¥E÷:¤·ÛÙ2±‘BÑ™y€9/"û|Æ8™;9Ó4.b¯Ê„(F·¸r’àö	Ñ}ğN÷ºû.%–»_~¶ï@rˆY×‘ Ü>K6ÅÄ¥¼++ÅvuFGoY¡}@Ã§xBºsÕ…çsËæ9ék1d•+Äe›kØUİO‰$È7ÇRi…ì‰ø>‡Ë­Ä³Äi‚Å>Í7fvÈàªKœñÊÆ3+•R¡­›ÄM™XûÛ«õVŒ­°Ò}é×¥°ü÷_ÎÈÜ{òÊ2Øÿ³mF˜Yä3ÂPe¸Ò-ˆXîÏEôq2b§ÜÔ>´¹Ê[EOBÓ—V@[µOğöj¨0}ûØ=›zÇ|“Jg_2Ù®oöá¶«š‹	}÷‹š>^¤·Ü#èyMs^Óüïkš}çù¼’9¯dÎ+·È[¨dòâÅ<Z?è1Z’½O}¦”±#µdä@š²GÂÙŸaĞtŒĞæ!Ó<†æj9	lÚHpõUñQŒç°LÕ¬É•êH¢9—P8™a§n=ÁÉ!Ÿd£Õêú¹&`•Cáµ‡2Me£fş o£Şô"ó uM@Ë¾
‰Âb6‰ºƒDs=øfggÂ¢í`ÑÒê÷²0_+¯Àå„°~(ø#7é‰öS&¿öî™{zŸ1ím×Ûkk®gãi‹D!Ül…0ŒáòØ>c_·s—Zô´)vi4[oÃ×:‰lå–Ú=t
g®€š1w¼)üd‚f2}Rg*Ì¢´ãÕÊĞ¯“YæBª>–q3SÙşªˆ@Œ&ëE7°4çV­5õßQríÊ»g9óUt2™NÉXíÉ»0—)qÎ¾!XwøHÅ“StÌâ6CÍª6à„Jµ±æ„ŠBpçVÜJW«£h½oÉ(fó¯n”b2Ïà¦½¡SØ‡aº½+»¿ÚÌq¤ôÆ·îË…ôD!iî¹@ô­éÎoï’/°Êó¾Å*KİÛ¹®½Îuûn‰7¿
ÔòÅ,jš±ƒZ>jS;Ã‚ °Ü&4÷İg}lG­¾ Öu¥éí¼ØæÇ÷ òûP­.˜’†*üj8\¿’Ì2]g—û
-íxŸT‚®Ö‚°Tiƒ’_÷+¥VĞ­—ºAP¯‚j¥ß«= £¨8©ÙÚCø±Ï–«7÷f|çí}².µ/ŒyRæ¦.aóö¾Z³ŞŞgu2éyQ°Ì'Ú°]o÷¥v½;,ùı^«Ô½R¿6ûÃ~´ÚÃ:1`¿[ıÆ UjTÃ°ä7*š~«]júµZ×ov[¿û`ekØùú{m^Ãëò?   ÿÿ PK     ! -V"*  ñ     word/settings.xml´VÛnã6}/Ğ0ô\G_¡®³Hœ¸É"î«úF‰”E„	’òeı÷)ÑršÅÂI‘›œ3sf8ÎèÃÇ=gƒ-QšŠzÄQ0 u!0­7‹àÏÇÕp´A5FLÔdˆ>^şüÓ‡]ª‰1 ¦@Që”‹ 2F¦a¨‹Šp¤/„$5€¥PØªMÈ‘zjä°\"CsÊ¨9„IMƒF,‚FÕiG1ä´PB‹ÒX“T”%-H÷ç-Ô9~[“Q4œÔÆyaƒ¨uE¥ölü­l Vdû£Cl9óz»8:ã¸;¡ğÑâœğ¬T¢ ZÃqæ¤uïxü‚èèû|wGtT`GnuùäuÉ‚iAö¯ã˜w!XòPü:é‘‡ö‰§oæ„@cƒ«W±$>¯¡µEUH«È2’×59ÒxŸ#ÍÎ©šz ¹Bª}“]Éğ"½ßÔB¡œA8P:¸ı‹ÎşBíŸ[’½“Û<—Ğ#¾
Á»TUÀCEAh(OQf Hµ$Œ¹S0‚Àã.İ(Ä¡Wx‰³Á¤D3(ÏŒ ´Ep°Y4oáê +R»ı7ô*“I‹R¨0Deàm)j£ózXü.Ìú’‚gÓY¸.Õ¯²¶ãE8¤âY[Llä¢çß™5pŞcäw	èĞŠbòh¯ 3FV|F¿’«j´¡ÀèNş?"øQ WğüŠæñ ÉŠ Ó@šŞÉ™»‰£rM•ê¾ÆP;ïæŒ–%Qà€B-®¡¼¨;—ç;‚0ÆwòÛhò(Ã›=BY>]c¿ëkøí~İOËÆ;Ö~ñEsTFËd¶¼i#µè9ÈíÕèj2ë¼tÜ<µğåW¶@¼µX"+Šk;"C«‘«§kZ{<'Ğ‡È)’5¹‡ÃĞ1¶‚TyÀ“§˜jyCJ·fk¤6=o§¡¾+…nòéÈe»Q¿)ÑÈİ)$ÛÂó*ñxÜYÒÚ<PîåºÉ3oUCç<šŞ*—§>=»ÔÀEºü€\A8]¢‡·YW0Leö²ÉIÙÖL¾‰£›ÊÄöšì0|I¹M¾I:,qXÒbnƒ
{2Ğî½,ñ²½‘—zÙØËÆ½lâe“^6õ²©•A/&
Zú”¯_Zy);‚ïzü…¨M‚®$7mÇ‡ò­ z°MÉæ	ÁÔÀª¤˜£½/ÉÔšwÚDcéZÌ*Ëçvôv6|fìJü?±ØITP(ÇìÀó~€üÒÎ¨†Ç.aÖ¡<ö«ÃâqŠEqoÇå¸N«é,'W-<q3Ê¸~ ÷ş…”×HÜaŞtÒš~›NoãåÍU<œ¯¢d8n“áõõr>œÏ’x4­&³húO÷Hı·úå¿   ÿÿ PK     ! ï’Wˆ  .r     word/styles.xml¼]sÛº†ï;ÓÿÀÑU{áÈŸr’9ÎÇ‰kOãŸÈi®!²P“„
’şè¯/ Rä%(.¸õ­¯} âÅ»ÀR”ôÛïÏY=rU™ŸŞí"Ç2ùıÙèçİåŞûQT”,OX*s~6záÅè÷OıËoO‹ò%åE¤yñ1‹ÏF‹²\~‹xÁ3V¼“Kë'çRe¬ÔwÕı8cê¡ZîÅ2[²RÌD*Ê—ñáşşdÔ`TŠœÏEÌ¿È¸Êx^Úø±â©&Ê¼Xˆe±¢=õ¡=I•,•ŒyQèƒÎÒš—1‘¯1Ç ”‰XÉBÎËwú`šY”?Ø··²t8Á`ógã}ÃëH—#g²æˆÄá„uÆI™,P”ÃÕ¸M,+Ù‚—Èq:Yã^23FYüñú>—ŠÍRMÒªGZ¸È‚Í_}üæŸ½ÉŸíãæFŸ´ásV¥eaîª[ÕÜmîÙ—2/‹èé#+b!îtu+™Ğ^ç…ég8+ÊóB°Ö'æFë3qQ:‰M‹Åõ“,=®¹0=Øz,eùıê1^ì}º=Ñå{?íC3Í=1µ7=7ãæÀêÿÎá._ß³/Y,l;l^rmóƒÉ¾¦Âd•Ã“«;?*3ø¬*eÓˆÔÿ×Ø1qí~¦uJÒÏòù7?ğdZê'ÎF¶-ıàÏë[%¤ÒiçlôÁ¶©œòL\‰$á¹óÂ|!şkÁóŸO6ÿyiSGó@,«\ß>:ØYÉ×ç˜/M"ÒÏæÌhòİ¤æÕ•Ø4nÃÿ³‚4J´Å/83Ù8:x°İG!MDám;³zuìöU¨†Şª¡ã·jèä­š¼UC§oÕĞû·jÈbşŸ‰<Ñ‰ß¾6¨»87¢9³¡9/¡9« 9' 9‰æxæ1šã™¦N)cß,t&û‘g¶wsw¯aÜİKBw÷
ÆİğÃ¸»ó{ww:ãîÎŞaÜİÉÏ­·ZÑµ¶Y^vÙ\Ê2—%Jş<œÆrÍ²%*Ï,z\‘$¦ÎlÍB<˜3{÷±&_ÏKSéErÍÅ}¥x1¸ã<ä©\òˆ%‰æ/+å‘9­øœ+ÇœrbÓAM%åU6#˜›KvOÆâyB<|+"IRXOh]?/ŒIÁ¤ÎX¬äğ®IF–¾‰bøXHô¹JSNÄúN3Å,kxm`1ÃK‹^XÌğÂÀÑŒjˆÑH54¢khDãVÏOªqkhDãÖĞˆÆ­¡·;Q¦6Å»»ƒşçî.RiŞTÜ©¸Ï™Ş _nšs¦Ñ-Sì^±å"2g¥Û±î1cÛù,“—èbM[“¨öõvŠ\è£y5|@·hTæZóˆìµælÍn±½M6´+šzfZÍÊVÓZR/ÓNYZÕÚáncåğ¶1À¥P™Ú±3ø»ÙÎ9)2ß¦—Ã;¶a·Õë¬DÚ½IĞËTÆ4iøêeÉ•.Ë“.ešÊ'Ğ§¥’õ\s-h%éeù¯ÙrÁ
ak¥-Dÿ¥~u9BtÃ–ƒè6e"§Ñíë^ÆDÑí ®în¾EwriÊL304ÀÏ²,eFÆlÎşíŸı¦ƒçºÎ_ˆöœèô…]‚E¦&É„ˆ¤·™"$k¨åı“¿Ì$S	íVñú
 ’§,[Ö›oé¼ø¤óÁnÈòşÅ”0ç…Óœ3}E5û7‡g§ï2"9™óGUÚS†vwj£épÃWö-ÜğUıÎå›
3åv7ü`·pT{‘²¢Şw=ƒyT‡»âQïğz­áÉTªy•Òà
H6‚+ ÙÊ´Êò‚òˆ-ğ€-úx	§ŒåœE³¼(‘‰aaTJX•F¥…‘
0ü¢6üÊ6üòšF´p`TóŒtù'zcÆQÍ3£šgF5Ï,Œj}‰ø|®7ÁtKŒƒ¤šs’n¡ÉK-¥bê…ù5å÷ŒàœfM»Urn>Í!óúºk¤9­œn¶k•È¿øŒ¬k†Ep.“¥©”D§°6‹„Ü¾DÌv›²˜/dšpåé‡?V×¥Óú¯›´½ïuFğ›¸_”Ñt±>îb&û;#W…ñVØîÛÆi²ú¨G[ØOD•­:
?g09êlgÎVğñîàÍŠ½yÒ3¶9Ù¹ÙnEöŒ„m¾ïi³ğVd×şÂÔCëD8íš?ëZÊ3ùN»fÑ:¸µÙ®‰´l›‚§]³hË*Ñy›éP~ñÇ÷3?ã"?c'?¥·¯üˆ.ƒıàÂ¬ ˜¤iÛ[_X rµİ¬öÊœV²>¥½õ^LÿÏ;]ëJ^ğ¨•sÔÿ=­,ãÇŞéÆèwüˆŞ	Èè•‰¼á¨”ä§ôÎM~Dï$åG ³\pÙ
Æã²ŒÉV’­ìüˆŞÛ?mTˆ@uÀNÁ@„RĞF…´Q!mT¸ÃÆãŒ
ãCŒ
)!F…´Q!mTˆ@"ĞF…´Q÷öŞğ £B
Ú¨6*D j÷‹Œ
ãqF…ñ!F…”£B
Ú¨6*D 
h£BÚ¨2*2*¤ 
h£BÚ¨õ§ğÂ
ãqF…ñ!F…”£B
Ú¨6*D 
h£BÚ¨2*2*¤ 
h£BÚ¨öM¹F…ñ8£Âø£BJˆQ!mTˆ@"ĞF…´Q!mTˆ@„RĞF…´Q!¢k~6oú®@?ÀŸõô^ÌŞÿ­«¦S?ÜO9»¨£ş¨U¯ü¬ş—é–ò!jıLŞ‘­7úAÄ,Ò¢ö¼}írí¥¨7+ÿ¸èşğ‹Kø}DÍÇìÛ£ ~Ü7œS9îšòn$(ò»fº	vÇ]Ù×ËàqWÒµ¾\]ü¡—#Ü•fœàOxW¶vÂáwåh'pWfvá wåc'ğ$2ÉùuôIÏqš¬¯ã„®éèNı„®i	µZ¥chŒ¾¢ù	}ÕóúÊè' ôôbğÂúQh…ı¨0©¡Í°R‡ÕOÀJ	ARL¸Ô,5D…I#VjHÀJœı„ ©&\jˆ
–¢Â¤†KVjHÀJ	X©.È^L¸Ô,5D…I7wX©!+5$`¥†„ ©&\jˆ
–¢Â¤U2ZjHÀJ	X©!!Hj€	—¢‚¥†¨.©íY”-©Q
;á¸M˜ˆ[@\rvª%':°ZrÕÔj¥9®ZrEóúªç'ô•ÑO@ééÅà…õ£Ğ
ûQaRãª¥6©Ãê'`¥ÆUK^©qÕR§Ô¸j©Sj\µä—W-µI«–Ú¤OÎ~BÔ¸j©Sj\µÔ)5®ZòK«–Ú¤ÆUKmRãª¥6©.È^L¸Ô¸j©Sj\µä—W-µI«–Ú¤ÆUKmRãª%¯Ô¸j©Sj\µÔ)5®ZòK«–Ú¤ÆUKmRãª¥6©qÕ’Wj\µÔ)5®Zê”W-İèAğíHÓŒ©2¢û*µ+V,J6ü{û~æŠ2}äID{¨ßPG9~Úúe(Ã¶?[§__ê13_î|\)©¿µÚ^'ë_p2Á¦'Qó[YÍÃ¶ÃÍÛµu‹66/t[qóµN¦.+İWğ¥Rl.—Jß4¯›ö|‹«íÊf
®^İêfÄê×mWgÏK3å;zm,Áò®Qª]ãëà‡&ìê¡îÏ,­OLß¸Îxj~K«îiòÌj”~ş‚§é«_-—ş—¦|^ÖÏìÛ/xõü¬şj:o¼²‰Úow¦¾Ûü¦™g¼ë/«o® ğŒùTä©NG¬eÀí-CÇzÓ»Õ­âÓÿ   ÿÿ PK     ! ï
)NN  ~     word/webSettings.xmlœÓ_kÂ0 ğ÷Á¾CÉ»¦Ê)VaÇ^Æ`ÛˆéÕ†%¹’‹«îÓïÚ©søb÷’ÿ÷ã.!óåÎÙäô¹S‘€×X¿ÉÅûÛj0	EåeÑC.ö@b¹¸½™7YëWˆ‘ORÂŠ§Ìé\T1Ö™”¤+pŠ†XƒçÍƒS‘§a#
Ûz ÑÕ*šµ±&îå8M§âÀ„k,K£áõÖ]¼`YDO•©é¨5×h†¢¨ˆëqöÇsÊø3º»€œÑ	Ë8äbu‡Ònäì/0éŒ/€©†]?cv0$G;¦èçLO)Îœÿ%sP‹ª—2>Ş«lcUT•¢ê\„~IMNÜŞµwätö´ñÔÚ²Ä¯ğÃ%Ü¶\ÛuCØuëm	bÁëhœù‚†û€Aí²²›—çGÈ?¿fñ  ÿÿ PK     ! ğ­Ã¤  „     word/fontTable.xmlÜ“Qo›0€ß'í? ¿7BÒ4*©Ö­‘&M{¨º½;ÆkØF>'$ÿ~gC²H(S©Ô=,ÄÜù>î>ğıÃAÕÑ^XFç$™P	ÍM!õ6'?^Ö7cº`µÑ"'GäaõñÃ}»,va½†¥â9©œk–q¼ŠÁÄ4Bc²4V1‡·v+fíšnTÃœÜÈZºcœR:'=Æ¾†bÊRrñÅğÚ…úØŠ‰FC%8ÑÚ×ĞZc‹Æ. pfUw<Å¤>c’l R’[¦t¦ï( °<¡a¥ê?€Ù8@: Ì¹8Œc,zFŒ•—YŒãÌÏY\pŞÖÌ 
WT£(éÉkìk™cƒê’(Æ55;ãÊ;R|ùu«e›IøÖ#|qQ û+ÎïÿÂRBÜ@VıQˆÚ¥f
+?³Zn¬‰†i"ÁÜÕ9ÁÖtFı,)ÍèÔ_Iì7òŠYÒm¤]¸dJÖÇSZ	Ğ%éxuŠï™•¾ë.r‹‰lhN2JÓ§õšt‘»£ÉnûHêŸ~w}dzPán“Ãç¼Ÿw&^¤}môlÓWŒ¤t&fèÃ›™2bw”?ÿÀÈíböOŒü¶`š]1ñˆ&üWá]dïşm|òÍÎ/MdŞšHÂÜ7q7ÒDJ¢or[¹«gÅŸÿô¬ôXı  ÿÿ PK     ! ê%M}o  å   docProps/core.xml ¢(                                                                                                                                                                                                                                                                  Œ’QOƒ0ÇßMü¤ïP`q™X¢fO.1qFã[mo[´MÛñí-0@âLx¸»ÿïş=®M—ç²ğN —"CQ"•Œ‹]†Ş6+<c‰`¤2TƒAËüö&¥*¡RÃ‹–
´å`<ç$LBU†öÖªcC÷P8B8q+uI¬Kõ+Bd8Ã9.ÁF,Á¡¯Gt±dt°TG]´Œb( a‚¬]š«­ò‹,¹­\E{q Ï†`UUA5kQ7„?ÖÏ¯í¯ú\4»¢€ò”ÑÄr[@â1t‘9~}µ]yH\L5+uşfDsÙê}­ÙöêJjf\ç$sC5WÖİaç;)8º Æ®İ¥n9°‡z<â¯ÔĞN¼yyÔCš^–ÛÌsKIºöÊûìñi³ByÆ±ºo¾‰Éİ<	ÃÏf²IÿhX^ø§ã}FSÇŞ [Îôaæ?   ÿÿ PK     ! –p s  Å   docProps/app.xml ¢(                                                                                                                                                                                                                                                                  œRËNÃ0¼#ñQîÔ)´€ª­j…8ğ’’ÂÙr6‰…c[¶[µÏ¦)!ˆ9íÌzÆ³Ãİ¾ÕÉ}PÖ,Óé$K4Ò–ÊÔËtS<\Ü¦IˆÂ”B[ƒËô€!½ãçgğæ­C†„,LX¦MŒnÁX¶"L¨m¨SYßŠHĞ×ÌV•’¸¶rÛ¢‰ì2Ë®î#šË7¦½ãbÿkZZÙåïÅÁ‘‡[§EDşÒ)5°€ÂF¡Õ"Ÿ= x5>Öğa}øM¬¯`Õ/d¤İñ«[Ò0Ü;§•‘¶ÊŸ•ô6Ø*&¯Ç¨I§6>?G¹õ*8İ0†ğ¤İ¬/(˜µ®9¥äRh\Ñà¼: °V¶uÂ*òûWØu·ˆ“ä79òCÅ&wBR„Ù|6wÔœX,)ÿa à‘~†×?iMå÷™¿nïı«äÓëIFßqcßÍ=<ş  ÿÿ PK-      ! ß¤ÒlZ                      [Content_Types].xmlPK-      ! ‘·ï   N               “  _rels/.relsPK-      ! öÁ•¢  Ã               ³  word/document.xmlPK-      ! Öd³Qô   1               „  word/_rels/document.xml.relsPK-      ! §%òÚ  Ë                º  word/theme/theme1.xmlPK-      ! -V"*  ñ               Ç  word/settings.xmlPK-      ! ï’Wˆ  .r                  word/styles.xmlPK-      ! ï
)NN  ~               Õ$  word/webSettings.xmlPK-      ! ğ­Ã¤  „               U&  word/fontTable.xmlPK-      ! ê%M}o  å               ›(  docProps/core.xmlPK-      ! –p s  Å               A+  docProps/app.xmlPK      Á  ê-                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      