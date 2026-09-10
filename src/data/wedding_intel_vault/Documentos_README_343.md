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
                      
                      parent.fbq('track', 'PageView', {"CATALOG_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + 'db2fcd27-014e-4d9e-a3b4-964133d5a0fa'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0); 
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           PK     ! 2‘oWf  ¥   [Content_Types].xml ¢(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ´”ËjÃ0E÷…şƒÑ¶ØJº(¥ÄÉ¢ehúŠ4NDõB£¼ş¾ã81¥$14ÉÆ ÏÜ{Ï1ƒÑÚšl	µw%ë=–“^i7+Ù×ä-d&á”0ŞAÉ6€l4¼½L60#µÃ’ÍS
Oœ£œƒXø *•V$:ÆB~‹ğû^ïKï¸”§Úƒ/P‰…IÙëš~7$²ì¹i¬³J&B0ZŠDu¾têOJ¾K(H¹íÁ¹xGŒL¨+Çvººš¨dcÓ»°ÔÅW>*®¼\XR§mpúªÒZ}í¢—€HwnMÑV¬ĞnÏ”Ã-ì")/ÒZwB`ÚÀË4¾İñ	®°sîDXÁôój¿Ì;A*Êˆ©Ëc´Ö‰Ö 4ßşÙ[›S‘Ô9> ­•ø±÷{£Vç4p€˜ôéW×&’õÙóA½’¨Ù|»d‡?   ÿÿ PK     ! ‘·ï   N   _rels/.rels ¢(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ¬’ÁjÃ0@ïƒıƒÑ½QÚÁ£N/cĞÛÙ[ILÛØj×şı<ØØ]éaGËÒÓ“ĞzsœFuà”]ğ–UŠ½	Öù^Ã[û¼x •…¼¥1xÖpâ›æöfıÊ#I)Êƒ‹YŠÏ‘øˆ˜ÍÀå*Döå§i")ÏÔc$³£qU×÷˜~3 ™1ÕÖjH[{ª=E¾†ºÎ~
f?±—3-ÂŞ²]ÄTê“¸2j)õ,l0/%œ‘b¬
ğ¼Ñêz£¿§Å‰…,	¡	‰/û|f\ZşçŠæ?6ï!Y´_áoœ]Aó  ÿÿ PK     ! ì)#  ^a     word/document.xmlä]K“Û6¾oÕşÖœ‹ïÇT<)ŠïTÙ‰ÊÉæ!1b’`@J3ãÛş”sğ!•[®úcÛ’’æ$Ïƒ%û0’H¢	~ìşºÑhÀß}]ÚŠŠ†ñêõ‰ñJ?Ñh•ñœUó×'ÿı9ıÖ?Ñš–T9)xE_ŸÜĞæäû³ÿë»«ÓœgË’V­"ªæôªÎ^Ÿ,Ú¶>LšlAKÒ¼*Y&xÃ/ÛW/'üò’etrÅE>1uC—ßjÁ3Ú4p¿ˆT+Òœôâ²k5i¹ WĞÚ“lADK¯·2Œ½…8“`âßd Ğ4î‹²öåN°W÷Ù	‚^İ“ä&é‡s“dŞ—ä&Éº/É?LÒ=u*ï+8¯i'/¹(I?Å|RñaY‚kÒ²V°ödêî †°êÃ=‚V	¥•ï-Á›”<§…•Røë“¥¨NûößnÚc×O»öıÇ¦-Ôn·&ôº-švh+T°ëšÇ=±HÔ&‚€#¯š«7ìP*N.!«Ï°*‹áº«ÚP4µ¢¶¸{[*İïß]Yt=ÿ¼DCWx›(bÓB¥·ï9ô¤ŞŞø hvÀ5Ég`ŞàfTÑY2ü^Æ$ÛZ7ÊaŠf5ÈéŞ
Êa[`E¼Û™ùr/¦5ô?°ù¬&oóÅ~â†w4Á¶¤%ÒlŒ%ÒıĞÙˆ»)wğ®ç_fTo_Ö[iìË¤oéõ
=dõÆ¹KÍ—uæ§©uËìô|^qA.
è˜šÖ¢É7€AéğC~¥×ò8¾kùêä"´ßàgçìÓšr
nZS7pŒäDÿÖâQ¯ÿGO!Ìß¿>Ñõ8öâ©¾94Œé%Yíı3³CØñ <Ó……Öğ‚e¬%B#Ú²ÒÀó2<µß–T«…ÎS<İĞ¬å>ÖP' w’sT-^D´œ5Ÿ‹õï€2üB	¬„k+¶¢Å7m4l“1Rh‚f¼fÜ–U’ú2¶ş«‚6-)
’“îF¤¡ó¥€‹PúpÇîJtô\­İÀ×jÅªÎÑWZøÛrıIk­àvØ¬Ï³İ¢E×Ä›î1y.ÖŸH=ÉŠ%§ßMü+äßú—™ø–çšös¿Ìz&ä;í>.&òoÔLºŞâQìoÑ?¾øÏ4Ç'?ß}#3¤ğ
ŞØ6e›—«‚‘n;¾‘úÓÂ¨Z–İV¬
¸tE ŠÒOä3Ã¹ó|8fà±É¦Á# ("— T m…v6¥‚™mM“X÷_J¯ÄLâóå˜µg?
6§(R+ˆdÁÈ+E
Ó
ìüñòTˆèF2bÅ3V2IMJÀ¤AìLíğ(I®k*˜tZ¹l€tƒèª#îœ‚Eeà}”€2ÍÈJÏÿú¨(&ˆÖ@â´Q!!GOtÏ>Rµú—ÓôáWÑ;CC”fUdà%LŒétê¤ÏÍ>'/çsî‰ØFè½XPø´˜Ü

s4 Å•ÅUáÖó´Ñ2pë%“AŞúSÓ²Œ+ÅyQä¹–7ªæ!‡d>ºCJ £‚ƒ'³ş£¢‚kï:ß®‚šá[I¨»ÑØì ÔÀSÓ&¬¾;Æí0ë£ ‹³œ 6œØ8J¤zÍÁlBM³õ'âëºàB5"t]'Œõ(ıúˆ¼XÊ°ºlO-,´=ğdôîí š	Ôˆf¤„TTÉ\Ó‰âø(qés]¦lA*•5¸}LûÁP~ÃMJ&†íº_¡Ï‹»¼¨Ì©XšØNd‡ÖQjÔúÅÅ²¤˜òÉà¢ ò.HõQ•ºu;pË;Î( â¹ 7–1	lAºÂüº2 7^˜†/•q}Ú8;åb"ú‘ æÄì’
IÑ9Šî+1§V`Œ>d=:ıü‡`9DNrit[UPs§Vh$ãwn v˜—FÁı7­µx@ÅîÌtš¤A8*Ïöh …dË”+¬jÙJ¦«×Wv«ÀcGŞÔ²ÒQöóXŞyZ„
¦ıÂš¥Ú ×Œ}×4‚ã´¸~ô¿’h`:¿i×´0QÑ#=lWw™”·CˆˆæU’–
œ(ï R23cj%^è¾<Oëıwgƒ`àQí¼Ê—@ÔL)¢6ã(œšúè¿ıè”ôf7Ú&Ô|¾cÑÔ‹GŸÛ? ¬‚4í{Zå<æ32§SAÉ)¹={ÛŠlæo´9B&ë[Ã8SÅİ(rÃøùë|½öl†õA˜'éÒ”`‰—˜ XÉĞi¿ÁŠ%‘­[£ä>IŞã…õR«<r½©?®,Ê£©W,ÓŞ€IÃ»IÚ[@õùo5õr"ÃO}sô“¶á´ÉÊe|a_Ç¶ XXsA~…1±
B¶:õbáÔÇ@5Ç,7Pú;">P½ÌÔá{F6%JóN¦Ÿ8–5úèÁytªšÉšË>èzOq üÇN5²òˆIãdT%€áÀI#y7çÛ)«2™B´ê‚´DÎ™#u˜©˜¥é˜–cŒ¿ğPÌvÍ²¾N(Ñº›†éWiŠw ›	^r	›’!Ú R–n¥RE¤¬ÉúÏ\Ö1ı~a»çÓØğF¶±ÙácÜ€IN&p$]J‡X÷Q‰£l[-\[w„¡ÃL®uècÎíÇ‹_©Lz*¥Ë$r¼À;=¹NO˜4¢E\´Xâó–ˆ9×fù¨Te¹‰{æè‹V ¯={G1^§›Š•ÁÁş2"›*g4âÀH¦Îègˆ‚ê–b©¡ û”aêFQ2úÒÇ·A°4Y›u
¥¡{¡‘DÇ©H÷ÜYaè3ÈlÈ «h•¥S3HFx>P?,)2÷°Êİ¬ÈØc-ŠúV¤/euO¼fcú¨[9qàzÇ£Ë=DEŞ£SÑ±wĞaVÒ\mÆƒèÉ6ı`ìVv `@GUA2ŠÒŠå”g«•LË
CİOÆ_v(á2gİ\æ.{§ü¼‚XR	œÈ¢À~©¡ÈLìM·(W)ÆÖuÃtœ9>]ŠYC×ÊÕZeNy—XÿŞ•ªè“z®•NGŸ²< o@gnÕÔ[¦îx^ä9/EĞOëæßÓ¡ª!ú™6à¹xÅÔ†şNj‚¯1d”‰Èt"Ú
­-%•`ºm9zd>'y `8Ç+EÉvj@ÉÈL#5âtô‰ƒyO‘¤ûüÿfK}İ¾—D‘cF£‚èy¬m—¤`8rIqAå	¹ÔO§QtŒ6÷¹Ò;Å[\=ÖouÓhàGõ³};p’tôÕr×­²‹ıæQl#ŠıĞ{)Ã|Ú A&Ø™UZÿ1‡{“Ãí—øì±;cÛ‰Œj¾é!À€´ê%íkí~!WÚqÉJ<'L§£€p:ù(MMjhĞ·ã*†R2;+1íĞıôåAğDë¿J1Ô°ë‹v)p³/Üar œ©Ø1ú|ÁãÛİ¹\¹9¬Û|GnŸ£6©©I8ş9‚ƒtkÆÛ~Kºne«Ä,ó®Ü\Éú|_7<ôY•ÃZÿ}Q ¯ãı/ŒI‘‘*£*Øxa¹V:*lÇàîÄQ1Œu0#¥XI’zÎq*Ô¦zUŞùw‚“3½ˆNC¡j…ŠéF`ya4úÉ¹ƒàêâÍMá×¶ÀéN’©€eq¨‡Ï¿NèsÏøfK*r İœÔ¸©Œ»­;:_ÿœÜhÍ`˜Ö-Ø¤»¥¸KÊ°u)Î]ŞŞŠôÄìÚå²ÊI·ªs“w¸³ûhV Dß`qTÆD ù—7tX÷áM¼İõÈpûzãHv:£¤¼Q<ÅõI
ïÆUS3Œ÷ ïÏH•khÖÎ6hïœ•÷ÿôN]¡²‚ët•¾%ÇŠxÁ;‚[^ÃqÛèzÀæ¸áé8°;½àmËËíé‚^îœ]€SxÇ\ouzÉ™íÏù²•?{ımàh¾—v×ÈÃ9ÏŞ††S°ŠÎX›-°@H6š(¿v»íN¶ÿ1ÂÙÿ  ÿÿ PK     ! ³¾‹  ¶   word/_rels/document.xml.rels ¢(                                                                                                                                                                                                                                                                  ¬“ÍjÃ0„ï…¾ƒØ{-;mC	‘s)\[÷d{ıCõc¤MZ¿}EJ‡Óƒ3bg¾…Õzó­; ó½5²$†¦²uoZÅöá˜'ij©¬A#zØä÷wë7T’ÂïúÁ³b¼€hXqî«µô‰Ğ„—Æ:-)H×òAVŸ²E¾HÓ%wÓÈ¯2Ù®àvõ#°bğ?Ù¶iú
_mµ×hèF÷H6ó!SºIÀÉIBğÛ‹¨4*œõ\}³Şìu‰.l|!8[sË˜fñp”¿f6Çğ“¡±†
Yª	ÇÙšƒxŠ	ñ…åûŸ“œ˜'~õÛò   ÿÿ PK     ! §%òÚ  Ë      word/theme/theme1.xmlìY[‹7~/ô?ˆyw|›ñ%Ä)öØn.»IÈ:)}ÔÚòŒbÍÈHònL	”ô©/…BZúĞ@ßúPJ-4ô¥?&Ğ¦?¢GÛ3²å¦I6Ê®a­Ëw>stt<séƒû	C'DHÊÓW½PñIÇ|BÓ¨ãİK-I…Ó	f<%oI¤÷Áå÷ß»„/ª˜$|*/â+5¿X.Ë1cyÏI
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
-íxŸT‚®Ö‚°Tiƒ’_÷+¥VĞ­—ºAP¯‚j¥ß«= £¨8©ÙÚCø±Ï–«7÷f|çí}².µ/ŒyRæ¦.aóö¾Z³ŞŞgu2éyQ°Ì'Ú°]o÷¥v½;,ùı^«Ô½R¿6ûÃ~´ÚÃ:1`¿[ıÆ UjTÃ°ä7*š~«]júµZ×ov[¿û`ekØùú{m^Ãëò?   ÿÿ PK     ! –•g#4       word/settings.xml´VÛnã6}/Ğ0ô\G[­®³XÛq“EÜ-V)
ô’(‹/IÙñ.úïR¢å4ÁÂI‘›œ3sf8ÎèÃÇGF;,|î…7À<áÛ¹÷çız8õJ#^ *8{¬¼W?ÿôaŸ(¬5¨©Pp•°|îUZ×‰ï«¼Â©Qc`)$C¶rë3$šz˜V#M2B‰>øQL¼FÌ½Fò¤£2’K¡D©I"Ê’ä¸ûsò¿­ÉJäÃ\[¾Äb\U¤V½•ÀÊ‘ì~tˆ£Nogw/dq´8'<cPK‘c¥à‚uŞ;?#:ú¾ ßİ-˜‡]F¿ zF0Éñãë8¦‡–§<¤xÏäÈCúÄ†“·sB 
]T¯b‰\^}c‹4ª:V‘aÄ¯*>ÒXŸ#EÏ©šº#™D²}“]É°<¹İr!QF!(ÜşÀFg~!‰æÏ.ñ£•›<xWĞ#¾	Áûd‡ ‚+½&Úƒ}egîEQìùFÊU”©F(UcJmÊ)FÜXl%bĞ;œÄÚ¸DÕ÷(Kµ¨›Ë`ÚÂÕ¡®0·/üoè];—y…$Ê5–irğ¶\KA^!~z	}JÂ3ê,l×êWiÛÁ‚#©yÒÕ6¢À&òF’óïĞXï¡òEG:¶$¾7W’êÅk>%ßğ'^|n”&ÀhOş?"øQ WğüŠèşPã5Fº4½“3{kJê‘RÈ[^@í¼›3R–X‚µ¸ò"Rìmo0*`P¾“ßFá¿@ŞğèÊòa!´ì¦¯á·ûŒ_ÿ´|aÜÊ-¾
¡ªÁju¹ZX‹í‘O—áb2{	émü#7KÌ@üCº•)Ğk-–ˆe’ ÁÆŒLßhdòaA¸Ã3}	Ÿ"i“9p8lÅ¥kH•l ,)ˆªW¸´kºArÛóvòE)t“ÏG.Ó°üMŠ¦nÑ½Du[xN%;KÂõaN®š,uV:é	ÔğâËNÚ<õéÙ'.Ò>à;dÂêb5¼N»‚¡25—7¨®ÛšÉ¶áÜ£d[éĞ\³†]_Vv“m£‹,µ˜İ Üœ´»E/‹œìDoäd£^6v²q/‹,îe'›ôb,¡¥?@ùº¥‘—‚R±ÇÅM?µIPªñªíøP^¢t#@v	~„y‚3`TM
†àã"¢‰1ï´):ˆF?Ñ5˜Q®Ÿ2˜QÜ=Xÿ‰±-ñÿÄb&QN ÓËúòK8%
{³Fé°_-“Bä·f|[yG‹ËuÔvŠ0¶3JÛ~ ÷ş—¤pÑaÎ4nM¿³é*˜Í¦Ãe°ˆ‡ãëÕr8‹“ál5ºE‹åõh<ı§{¤îÛıê_   ÿÿ PK     ! 3²ğ  Ì`     word/numbering.xmlìœİn³6ÇÏ'í¢H;lÁÆˆŞöUš4S§išôv@ˆÓ ò% I»ÃİÔ.k·0Û|ä‚0MÎ“Ò`ûÏóÛüšĞ|ûş£K3?Æè^XäÅ+?z{ÿõº¸³Ç£,w£•Ä{²lüıñçŸ¾í'Ñ6\²”wq(›ìïa¼Éód¢i™·a¡›İ‡¾—ÆY¼Îï½8ÔâõÚ÷˜¶Ó•†u¤Ëß’4öX–q™íÜl\ÊyıÔV©»çƒ… Ñ¼›æìã ”ELÍÑì¦ ÄbÔ”2”¥¨&¢j‘AB<ª†’9L©Å¦„›JÖ0%£©dSjL§°9Áã„E¼q§¡›ó—é›ºéû6¹ãÂ‰›ûK?ğóO®©ÓJÆõ£÷ñQµBh¬”,-ŒW,0V•Jü0Ş¦Ñ¤W¡OŠñå¡Á‚~—å—s4ö‘Y^Mûä®>½mÈ¢\fMKYÀóGÙÆOêİ!ªÆ7•È®+»0¨úíÔs©]ÚÚæE‚}Â/kEäİŠHïQM!QèÂé5«HB>ƒ”š£ä¢›O%€Ôc=o•†]jhŞau¿ç²ªtŠªÿXÔs<æH`µU’ÀF‡8ˆáGZÙ*_mÔäªib¬›»7«PdjÍZî3<ÊwòöµEõko“ƒšÿ5µ—Ãöº¤£ U.Îã#ûZ0?6nÂwİĞ›¼¼Eqê._j#¾ZF²â'Ÿtâ eò¼¨õHìWãGhî2ËS×ËÿØ†£“W/|sÔãj“”q¾KÅÉ‚æ¦ëœ¥O)sßE¡eâ:“Ë7ØvœùX-á6ÈıßÙ¯Ÿ	«úÈ³8[ôÊÃ$¨ÚÛ$d¶°‹–`'|~¨®%c©;½8h.ÂúäŠy~è–Ò|ä+¿ÍTm¿ ûúüo^u6`ë¼8ü™Ê€x&ÊcÕ‡_ƒ§c’Ä¼pÖEwíĞÑD„NÑÊ_lÜèMB²A«ŞR]“?7‡šæP›¹å6Xì™·ÿşù÷
Ş!]æds‡»ı$-‹8Ê31©2Ïç+ïÇg¸Œ9tÊçËÉ	?ÊEÙÖ.ŸE¬ÙßUluª¥n{ò°PÉùœcÀõOfçL1®1S0ªÓÓ–MÙ¬<WŒ[Ø%W±kÛvE³²]r»æ5ìòğ»ìÊfe»æ-ìÒkØ%Fç¾'›•íÒ[Øµ®a×Ô;wBÙ¬l×º…]û*v­Î­J6+Ûµoa×¹†]J:·*ÙÜÃ®vBMB¥©ĞxRQİÁÄp
{êH5³‘>5ç2şÓò´ U	^€T¢	
j¸]@*@*@*@*@ª["•¸S)#¢Ô°föSaO©¬'sêÌìYµº<-H…Jò¦MÀTÀTÃíSSSSSİ’©ÄÖ­ÌT†a!Ã™›…=u¦š;¡h6­³V—§©¨r=€©€©úÍ`*`*`*`*`*`ª«1•ØËÔ™ÊBŠ).ì©3Y,lËÂÏuÖêò´1Q®00U¿™LLLLLLu5¦‹[™©š:¸¼ş¦r°IÈ•Lv\6¦‚ç©€©DŸ[¬\`*`*`*`*`*`ª«1•˜íêLe:3ãÙ¶
{êL¥OJ‘Õï¿şà£?@*Ñç




êjH%Ê¯TT&<©Ë¶g†Ùómª²0•h¦¦n˜
˜
˜
˜
˜ê–L%ò¡ÎTÏOÃFåãP§šQ‚³çãTÊå ¤¤ê7S © © © © © ©T*’(}•øĞÉj+¿ATt¨áHfã„ºªPåÇtšÔiˆÊ¯c8å[«m¢ãËš•6MqOihRËÔl;—%åç„$åÓøMI„u½@¹VE9.(ÊgÑÎ‡šˆ\L­VMùÎÛMùYì¹&¦&Åœt:
$ß4¼ )ßŒlTİDB¶+›¤CSÂx£è:5µôMùı­4Vï6"izYSşÿi¥Y‹?ÿ  ÿÿ PK     ! ?×_  s     word/styles.xml¼[sÛºÇß;ÓïÀÑSûàÈW9ÉçŒãÄµ§qOä4Ï	Y¨IBI_úé€”y	Šnıbë¶?€øã¿Äò"ıöûs–F\Bæg£ƒwû£ˆç±LD~6úyw¹÷~%Ë–ÊœŸ^x1úıÓ_ÿòÛÓÇ¢|Iyi@^|Ìâ³Ñ¢,—Çã"^ğŒïä’çúÍ¹T+õSu?Î˜z¨–{±Ì–¬3‘Šòe|¸¿?5Õ‡"çsó/2®2—6~¬xª‰2/bY¬hO}hOR%K%c^z£³´æeLäkÌÁ1 e"V²óòŞ˜¦G¥Ãöí£,İ Np€C ˜ÄüÇxß0Æ:ÒåˆÇ™¬9"q8aq ER&åp5®cËJ¶`ÅÂ%r\§NÖ¸—ÌŒQ¼¾Ï¥b³T“´ê‘.²`óWo¿ùgògûºÙ„Ñ'í…DÆ_øœUiY˜§êV5O›göß¥ÌË"zúÈŠXˆ;İAİJ&tƒWçy!FúÎŠò¼¬õÍ…yĞúN\”ÎËŸE"FcÓbñ_ıæ#KÏF‡‡«W.L¶^KY~¿z{_§nOôKùŞOûÒLsÏFLíMÏMà¸Ù°ú¿³¹Ë×ÏlÃKÛ›—\Ûü`²o ©0YåğäÃêÉÊ>«JÙ4bõÿ5vF\»_ç‚i’ô»|şMÆ<™–ú³‘mK¿øóúV	©tÚ9}°mê§<W"Ixî|0_ˆ„ÿZğügÁ“Íë^ÚÔÑ¼Ë*×N'v¤Eòõ9æK“ˆô»93š|7©ùt%6Ûğÿ¬`mñÎL6^#l÷QˆCQ8[ÛÎ¬^m»ıª¡£·jèø­:y«†&oÕĞé[5ôş­²˜ÿgC"Otâ·Ÿ‡Í ê.ÇhÇlhÇKhÇ*hÇ	hg¢£9yŒæx¦)‚SÊØ7É~ä™íİÜİûˆ0îî]Bw÷ Œ»;á‡qwç÷0îîtÆİ½Ã¸»“5[/µ¢km³¼ì²¹”e.K•üy8åšeKTÙéqE²‘˜:³5;âÁ´˜Ùç»gˆ5iøş¼4•^$çÑ\ÜWŠƒ;ÎóGÊ%X’h!Pñ²R	™ÓŠÏ¹âyÌ)'6ÔT‚Q^e3‚¹¹d÷d,'ÄÃ·"’$…õ„ÖõóÂ˜DLêŒÅJïšddùá›(†•DŸ«4åD¬ï4SÌ²†×3¼4°˜á•Å/Í¨†¨¡TC#°†F4nõü¤·†F4nhÜÚğq»ejS¼»ê8èìî"•æ¤Âà~LÅ}Îô`øî¦9fİ2Åî[."sTºën3¶Ï2y‰î(öikÕºŞN‘½Õ"¯†èÊ\k‘½Ö<"ƒ­yÃ-v£—ÉfvESÏL«YÙjZKêeÚ)K«zA;Üm¬>Ã6¸ª ³A;–`7ËY#'EæÛôrxÇ6¬á¶z•H»× 	z™Êø&_½,¹ÒeÙÃ`Ò¥LSùÄ:â´T²k®å­$½,ÿ5[.X!l­´…è¿«_]İ°åàºM™Èitûº—1‘Ft+ˆ«»›oÑ\š2Óğ³,K™‘1›#ûÅg§éà¹.‚ó¢­=':<da‚`'S“dBDÒËL‘’}¨åı“¿Ì$S	íVñú
 ’§,[Ö‹oé¼ø¤óÁjÈòşÅ”0Ç…¨LuGsÕìß<ê¾ËˆäÈĞUi?Ú¥®¦Ã_&lá†/¬šz÷`æ/ÁÆná†oìjc/RVÂ{
5˜Gµ¹+õö/şL¥šW)İ ®€d#¸’¡L«,/(·Øò7Øò¨·—pÊXÁ!9Ëû‡	™F¥„…QÉ`aTX© Ã¯Ğq`Ã/Óq`Ã¯Õ©aDK F5ÏHwÿDgyÕ<³0ªyfaTóÌÂ¨æÙÑ—ˆÏçzL·‹qTsÎAÒíhò’gK©˜z!B~Mù=#8@ZÓn•œ›[Cd^_ÄM€4Ç¨SÂÅv£ùŸ‘uÍ°(ûEpD”¥©”DÇÖ6;¹}íÚ®