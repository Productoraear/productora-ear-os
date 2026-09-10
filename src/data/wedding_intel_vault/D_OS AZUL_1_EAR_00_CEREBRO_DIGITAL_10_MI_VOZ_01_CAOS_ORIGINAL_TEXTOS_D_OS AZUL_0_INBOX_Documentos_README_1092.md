erimentViewed(
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
                window.reducedUrl = '/groups/item/photos/list';
    
        
            window.layerRedirect = 'a%3A2%3A%7Bs%3A7%3A%22reduced%22%3Bs%3A24%3A%22%2Fgroups%2Fitem%2Fphotos%2Flist%22%3Bs%3A10%3A%22ID_PROJECT%22%3Bi%3A1%3B%7D'
    
    
    window.isCustomDomainMode = false;

</script>

<div class="dnone">
                <script>
                gtag('event', 'page_view', {"COMMUNITY_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0,"send_to":"adwords"});
                
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
                      
                      parent.fbq('track', 'PageView', {"COMMUNITY_NAV":1,"LOGGED":0,"EMPRESA":0,"EMPRESA_CATEGORY":0}, {eventID: 'pageview_' + window.userGlobals.gp_anon_id + '_' + '197a2b13-ff70-4343-9e33-f6b22288bfca'}); parent.fbq('dataProcessingOptions', ['LDU'], 0, 0); 
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
                        parent.pintrk('track', 'custom', {"COMMUNITY_NAV":"1","LOGGED":"0","EMPRESA":"0","EMPRESA_CATEGORY":"0","send_to":"adwords"});
                        
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
              {"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Bodas","item":"https:\/\/www.bodas.net\/"},{"@type":"ListItem","position":2,"name":"Comunidad","item":"https:\/\/comunidad.bodas.net\/"},{"@type":"ListItem","position":3,"name":"Grupo Manualidades","item":"https:\/\/comunidad.bodas.net\/grupos\/grupo-manualidades-para-bodas"}]}            </script>
        </div>

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
    <symbol>
    <svg id="svg-_common-heart" viewBox="0 0 34 30"><path d="M26.232.086C30.653.716 34 4.68 34 9.858c0 1.41-.371 2.884-1.073 4.412-1.35 2.937-3.878 6.013-7.247 9.134a68.921 68.921 0 01-5.582 4.625c-.665.496-1.284.941-1.84 1.328-.335.233-.577.396-.71.483a1 1 0 01-1.097 0c-.132-.087-.374-.25-.71-.483a67.429 67.429 0 01-1.84-1.328 68.921 68.921 0 01-5.58-4.625c-3.37-3.121-5.898-6.197-7.248-9.134C.371 12.742 0 11.268 0 9.858 0 4.681 3.347.716 7.768.086 11.6-.46 15.091 1.616 17 5.778 18.91 1.617 22.4-.46 26.232.086z" fill-rule="nonzero"/></svg><svg id="svg-_common-angleDown" viewBox="0 0 18 18"><path d="M16.9 5.6c-.2-.2-.5-.2-.7 0L9 12.8 1.8 5.6c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l7.5 7.5v.1c.1.1.3.1.4.1.1 0 .3 0 .4-.1v-.1l7.5-7.5c.2-.2.2-.5 0-.7z"/></svg>    </symbol>
</svg>
<script type="text/javascript"  src="/AL9AJ4/1NAGmf/eM3si/qc3v6/B7/5Sp1pGp6XpcJ1w/AhYufSc/CRUS/DX4UNhwB"></script></body>
</html>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        II*     ş                            "                    *             €       :      J      R         (       1    Z  2    v  =       R       ¼ ü  Š  »ƒ    †  I† Ğ
    i‡    ($ s‡ H  ^%          ¦1  òj  («  ¨í  L9  6@  €B  }6  €ü
 '  €ü
 '  Adobe Photoshop CS Windows  2011:11:03 19:19:44 <?xpacket begin='ï»¿' id='W5M0MpCehiHzreSzNTczkc9d'?>
<x:xmpmeta xmlns:x='adobe:ns:meta/' x:xmptk='XMP toolkit 3.0-28, framework 1.6'>
<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:iX='http://ns.adobe.com/iX/1.0/'>

 <rdf:Description rdf:about='uuid:4fc43a76-0672-11e1-9a38-f4ba3cf709a0'
  xmlns:exif='http://ns.adobe.com/exif/1.0/'>
  <exif:ColorSpace>1</exif:ColorSpace>
  <exif:PixelXDimension>512</exif:PixelXDimension>
  <exif:PixelYDimension>512</exif:PixelYDimension>
 </rdf:Description>

 <rdf:Description rdf:about='uuid:4fc43a76-0672-11e1-9a38-f4ba3cf709a0'
  xmlns:pdf='http://ns.adobe.com/pdf/1.3/'>
 </rdf:Description>

 <rdf:Description rdf:about='uuid:4fc43a76-0672-11e1-9a38-f4ba3cf709a0'
  xmlns:photoshop='http://ns.adobe.com/photoshop/1.0/'>
  <photoshop:History></photoshop:History>
 </rdf:Description>

 <rdf:Description rdf:about='uuid:4fc43a76-0672-11e1-9a38-f4ba3cf709a0'
  xmlns:tiff='http://ns.adobe.com/tiff/1.0/'>
  <tiff:XResolution>720000/10000</tiff:XResolution>
  <tiff:YResolution>720000/10000</tiff:YResolution>
  <tiff:ResolutionUnit>2</tiff:ResolutionUnit>
 </rdf:Description>

 <rdf:Description rdf:about='uuid:4fc43a76-0672-11e1-9a38-f4ba3cf709a0'
  xmlns:xap='http://ns.adobe.com/xap/1.0/'>
  <xap:CreateDate>2011-11-03T19:19:44-05:00</xap:CreateDate>
  <xap:ModifyDate>2011-11-03T19:19:44-05:00</xap:ModifyDate>
  <xap:MetadataDate>2011-11-03T19:19:44-05:00</xap:MetadataDate>
  <xap:CreatorTool>Adobe Photoshop CS Windows</xap:CreatorTool>
 </rdf:Description>

 <rdf:Description rdf:about='uuid:4fc43a76-0672-11e1-9a38-f4ba3cf709a0'
  xmlns:stRef='http://ns.adobe.com/xap/1.0/sType/ResourceRef#'
  xmlns:xapMM='http://ns.adobe.com/xap/1.0/mm/'>
  <xapMM:DerivedFrom rdf:parseType='Resource'>
   <stRef:instanceID>uuid:49bd7b54-00d2-11e1-8480-89dc9552fc47</stRef:instanceID>
   <stRef:documentID>adobe:docid:photoshop:cc791e4f-00cf-11e1-8480-89dc9552fc47</stRef:documentID>
  </xapMM:DerivedFrom>
  <xapMM:DocumentID>adobe:docid:photoshop:4fc43a75-0672-11e1-9a38-f4ba3cf709a0</xapMM:DocumentID>
 </rdf:Description>

 <rdf:Description rdf:about='uuid:4fc43a76-0672-11e1-9a38-f4ba3cf709a0'
  xmlns:dc='http://purl.org/dc/elements/1.1/'>
  <dc:format>image/tiff</dc:format>
 </rdf:Description>

</rdf:RDF>
</x:xmpmeta>
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                       
<?xpacket end='w'?>    8BIM         8BIM%     Fò‰&¸VÚ°œ¡°§w8BIMí      H     H    8BIM&               ?€  8BIMî     Transparency 8BIM         T r a n s p a r e n c y  8BIMï       ÿÿ       d 8BIM         8BIM        x8BIM        8BIMó     	         8BIM
       8BIM'     
        8BIMõ     H /ff  lff       /ff  ¡™š       2    Z         5    -        8BIMø     p  ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿè    ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿè    ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿè    ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿè  8BIM        8BIM       8BIM          @  @    8BIM         8BIM    5                                                                                                     null      boundsObjc         Rct1       Top long        Leftlong        Btomlong       Rghtlong      slicesVlLs   Objc        slice      sliceIDlong       groupIDlong       originenum   ESliceOrigin   autoGenerated    Typeenum   
ESliceType    Img    boundsObjc         Rct1       Top long        Leftlong        Btomlong       Rghtlong      urlTEXT         nullTEXT         MsgeTEXT        altTagTEXT        cellTextIsHTMLbool   cellTextTEXT        	horzAlignenum   ESliceHorzAlign   default   	vertAlignenum   ESliceVertAlign   default   bgColorTypeenum   ESliceBGColorType    None   	topOutsetlong       
leftOutsetlong       bottomOutsetlong       rightOutsetlong     8BIM(        ?ğ      8BIM        8BIM    ´             à ,   ˜  ÿØÿà JFIF  H H  ÿí Adobe_CM ÿî Adobe d€   ÿÛ „ 			
ÿÀ     " ÿİ  
ÿÄ?          	
         	
 3 !1AQa"q2‘¡±B#$RÁb34r‚ÑC%’Sğáñcs5¢²ƒ&D“TdEÂ£t6ÒUâeò³„ÃÓuãóF'”¤…´•ÄÔäô¥µÅÕåõVfv†–¦¶ÆÖæö7GWgw‡—§·Ç×ç÷ 5 !1AQaq"2‘¡±B#ÁRÑğ3$bár‚’CScs4ñ%¢²ƒ&5ÂÒD“T£dEU6teâò³„ÃÓuãóF”¤…´•ÄÔäô¥µÅÕåõVfv†–¦¶ÆÖæö'7GWgw‡—§·ÇÿÚ   ? õT’I%)$’IJI1M»Å%2QÜ¤ ’™¨’0˜ò’™’a¡H™IJRP©¤¥$£¹I%)$’IJI$’SÿĞõT’I%)4¤¢’™SÉL’•%$’‚’”’}<RÑ%,’}â’–H™J
I)Jj	É””¼§PSIJI$’SÿÑõTÒEÃºJ^BcÊd’R’I?IJĞ&I$”¤“ÁKjJY$ûR‚’–”üüS$’”’~tL’—jy
)$¦IÓ4'IOÿÒõT”\™%.yL’C””¿â™$’R”€„€„é)I$’JRI$’–!EM1ÒSü¦H$¥'	’ILÒPRo	)ÿÓõU%4¤¥'Éû|ÒRÉÇ)“µ%2I$’R’I$”¤’I%)$’IL)'w)’Rå2~Á2Jd N¡%HIOÿÔõBBtÄÊJY?dÉÇt”²v¦HhRS4’I%)$’IJI$’R’I$”Äò™$’Rı‚då2J^
p!0*I)ÿÕõB`©¤’˜$&RIJ)'å2Jddê	ÁñIL’I$”¤’I%)DÉà™%)8ü‰“Ÿ”²I'RĞT€N’JÿÖõU)$’˜$¦¢L¤¥“óñL’JRIùçïM	)Iä¦I%/%2I$¥$>IO‚JWÉ$’”’p{)$¥š$’Sÿ×õT’I%,¢¦’Jcµ2‘áE%)$à&IKÊR<$’—‘à””É$¥$’r!%,œ·Á2šJ`¦’I)I$’JÿĞõT’I%)$’IJMµ:I)J
i $¥¢‰åM1’–¤àœN’˜TÓ@N’–Ú¤’JRI$’”’I$§ÿÙ8BIM!     S       A d o b e   P h o t o s h o p    A d o b e   P h o t o s h o p   C S      HLino  mntrRGB XYZ Î  	  1  acspMSFT    IEC sRGB              öÖ     Ó-HP                                                 cprt  P   3desc  „   lwtpt  ğ   bkpt     rXYZ     gXYZ  ,   bXYZ  @   dmnd  T   pdmdd  Ä   ˆvued  L   †view  Ô   $lumi  ø   meas     $tech  0   rTRC  <  gTRC  <  bTRC  <  text    Copyright (c) 1998 Hewlett-Packard Company  desc       sRGB IEC61966-2.1           sRGB IEC61966-2.1                                                  XYZ       óQ    ÌXYZ                 XYZ       o¢  8õ  XYZ       b™  ·…  ÚXYZ       $   „  ¶Ïdesc       IEC http://www.iec.ch           IEC http://www.iec.ch                                              desc       .IEC 61966-2.1 Default RGB colour space - sRGB           .IEC 61966-2.1 Default RGB colour space - sRGB                      desc       ,Reference Viewing Condition in IEC61966-2.1           ,Reference Viewing Condition in IEC61966-2.1                          view     ¤ş _. Ï íÌ  \   XYZ      L	V P   Wçmeas                            sig     CRT curv           
     # ( - 2 7 ; @ E J O T Y ^ c h m r w |  † ‹  • š Ÿ ¤ © ® ² · ¼ Á Æ Ë Ğ Õ Û à å ë ğ ö û%+28>ELRY`gnu|ƒ‹’š¡©±¹ÁÉÑÙáéòú&/8AKT]gqz„˜¢¬¶ÁËÕàëõ !-8COZfr~Š–¢®ºÇÓàìù -;HUcq~Œš¨¶ÄÓáğş+:IXgw†–¦µÅÕåö'7HYj{Œ¯ÀÑãõ+=Oat†™¬¿Òåø2FZn‚–ª¾Òçû		%	:	O	d	y		¤	º	Ï	å	û

'
=
T
j

˜
®
Å
Ü
ó"9Qi€˜°Èáù*C\u§ÀÙó&@Zt©ÃŞø.Id›¶Òî	%A^z–³Ïì	&Ca~›¹×õ1OmŒªÉè&Ed„£Ãã#Ccƒ¤Åå'Ij‹­Îğ4Vx›½à&Il²ÖúAe‰®Ò÷@eŠ¯Õú Ek‘·İ*QwÅì;cŠ²Ú*R{£ÌõGp™Ãì@j”¾é>i”¿ê  A l ˜ Ä ğ!!H!u!¡!Î!û"'"U"‚"¯"İ#
#8#f#”#Â#ğ$$M$|$«$Ú%	%8%h%—%Ç%÷&'&W&‡&·&è''I'z'«'Ü((?(q(¢(Ô))8)k))Ğ**5*h*›*Ï++6+i++Ñ,,9,n,¢,×--A-v-«-á..L.‚.·.î/$/Z/‘/Ç/ş050l0¤0Û11J1‚1º1ò2*2c2›2Ô33F33¸3ñ4+4e44Ø55M5‡5Â5ı676r6®6é7$7`7œ7×88P8Œ8È99B99¼9ù:6:t:²:ï;-;k;ª;è<'<e<¤<ã="=a=¡=à> >`> >à?!?a?¢?â@#@d@¦@çA)AjA¬AîB0BrBµB÷C:C}CÀDDGDŠDÎEEUEšEŞF"FgF«FğG5G{GÀHHKH‘H×IIcI©IğJ7J}JÄKKSKšKâL*LrLºMMJM“MÜN%NnN·O OIO“OİP'PqP»QQPQ›QæR1R|RÇSS_SªSöTBTTÛU(UuUÂVV\V©V÷WDW’WàX/X}XËYYiY¸ZZVZ¦Zõ[E[•[å\5\†\Ö]']x]É^^l^½__a_³``W`ª`üaOa¢aõbIbœbğcCc—cëd@d”dée=e’eçf=f’fèg=g“géh?h–hìiCišiñjHjŸj÷kOk§kÿlWl¯mm`m¹nnknÄooxoÑp+p†pàq:q•qğrKr¦ss]s¸ttptÌu(u…uáv>v›vøwVw³xxnxÌy*y‰yçzFz¥{{c{Â|!||á}A}¡~~b~Â#„å€G€¨
kÍ‚0‚’‚ôƒWƒº„„€„ã…G…«††r†×‡;‡ŸˆˆiˆÎ‰3‰™‰şŠdŠÊ‹0‹–‹üŒcŒÊ1˜ÿfÎ6nÖ‘?‘¨’’z’ã“M“¶” ”Š”ô•_•É–4–Ÿ—
—u—à˜L˜¸™$™™üšhšÕ›B›¯œœ‰œ÷dÒ@®ŸŸ‹Ÿú i Ø¡G¡¶¢&¢–££v£æ¤V¤Ç¥8¥©¦¦‹¦ı§n§à¨R¨Ä©7©©ªª««u«é¬\¬Ğ­D­¸®-®¡¯¯‹° °u°ê±`±Ö²K²Â³8³®´%´œµµŠ¶¶y¶ğ·h·à¸Y¸Ñ¹J¹Âº;ºµ».»§¼!¼›½½¾
¾„¾ÿ¿z¿õÀpÀìÁgÁãÂ_ÂÛÃXÃÔÄQÄÎÅKÅÈÆFÆÃÇAÇ¿È=È¼É:É¹Ê8Ê·Ë6Ë¶Ì5ÌµÍ5ÍµÎ6Î¶Ï7Ï¸Ğ9ĞºÑ<Ñ¾Ò?ÒÁÓDÓÆÔIÔËÕNÕÑÖUÖØ×\×àØdØèÙlÙñÚvÚûÛ€ÜÜŠİİ–ŞŞ¢ß)ß¯à6à½áDáÌâSâÛãcãëäsäüå„ææ–çç©è2è¼éFéĞê[êåëpëûì†ííœî(î´ï@ïÌğXğåñrñÿòŒóó§ô4ôÂõPõŞömöû÷Šøø¨ù8ùÇúWúçûwüü˜ı)ıºşKşÜÿmÿÿ€  P8$„BaP¸d6ˆDbQ8¤V-ŒFcQ¸äv=HdR9$–M'”JeR¹d¶]/˜LfS9¤Öm7œNgS¹äö}? PhT:%G¤RiTºe6O¨TjU:¥V­W¬VkUºåv½_°XlV;%–Íg´ZmV»e¶İo¸\nW;¥ÖícŞA"ûàÀQ‚°@©Ã×õiâZMlcUñ|]òY<¦W-—ÌfsY¼æw=Ÿ¡ ô@0¦”(†Ô"š±®	ì_òÀÔôÜ=›¶|wp]Ïî#ûAÇäry\¾g7ÏètzYàGT:ìÒı´Ès¼x@Ó‡Ï•òßô7Œ¾³;ÜÍ}|_]?§×í÷ü~_¿ç÷üÊ00@ƒí \€Phœ8§ñç	d,?0ÉNuÃ‡[ÿÄEÄ‘,MÅƒl ¯x`ÔÄ@ˆ ,l¨‘ô[Ç…°ÿ¬a¬j¶MœS#ÉL•%É’l'¡Q\Er,#"ÃñX	-€‚Ä¼,ÆH+1‚­ ³IúsÍ‡8é7%”äXŸ“©ù,?ñ\Ì‚JÎ,ñ(PAĞ”-¯OME¯. ‡U$ut©÷Æà(#M‚$µ<L‰5•LÅjŠó%mTVMã âxV„ì~Côp/[‚õDu
r»eCØ…aØ–-Œ†QÎ°Ù€8g°XZ0}k‡ëøPéĞA\Íqœ¬ƒ"ıÚBÔ!‘—iŞJ¡È²)»{›ƒUô4Wé’{`³ø½ öÇãùN2ª`âï{°ø©ésWO•ã˜î=ä|§DÌÍ!G;Àà;”ƒ—€B¹ˆlæh3›ƒV}ŸH7'¡%Ÿ’ş„NÜwë_¹ò›L
ši&ê~–¨RgQU«•.´AºéÛ?¹±\W–Û(Ğ4í[]Y×š)Êin‘—¹™Gìoœ›ÉÈrï‡%,}Öuœ#_69ÃñOÅ¤Öh‚Q€lZ\¨fó@AÍ„2t …!’´ym5§Tp‘iTv5QºpaÛ†.Ù.LÚ¡?¨ş	ï‡(Í‡GN„ÍeŞhÀ9ú 7éƒ“4úâuFÿXñÎô=ÏÄl¿)˜Äšf–{áõG÷şåùĞ’”†S€ıÁ_ü
ÎÀ:lÔ8ËÑ®K)L§²&©Ï0Ú‚Cd9APàùFhÌb­€ä&@*! VBÂ A: ”Êƒ¨8C¸=ÂĞò,a€¯…g1³  AØŠ‡B0ÃĞH£—™{JYs0Œ=GdIƒF&‹Æ#â|CÆ*ßÇsÜhîúEØ½ãa3IMÇB ¨BTi	ühÜÍrÊˆ$µîˆì1áh{0Hm•Ìr[˜à¡¦ˆAä@HYEas
ù+— ‚LnAÃ:²L™BN–bA³üÄÁ"®f*:e@èn#HZJÔäœÑÓ´ŒRÎZKYm-Êâ„ÍOŠ%®úftÆÖ7P¯ÉâNf	!Ã3ÇKIp&MPš$&À“Ñ¹H…fß(äsŒ4‹ÉÌ.Ü"F3Œ¸APäÂÌñnFb“)Ò„U˜ºŸBåâ†€ËG‹—‚PZAÉËW ]U
Ñ`íÁ€1)
Ío‰8!Ä-tY™e © ]¢0G…
Lc‘¶+Es
z\)cÈy£‰Ú%Æ©À\ÁÒmiºQ×èÊ!V¢&¼;_u©U.¦TÚœE#½ÕLT;ÒõÇğØ«C\ßş/k ¼g²È»0Hq6€’@¢9•ÄŠ5k€Ôœa¬4áœ3cùwLĞÙP„”, ~¶6*TQÆ½‰Ñ˜):¡Ä8kÍO²VNÊYYpäB5™î´D§8JbEˆÃBÒğëiÃ˜ÔµCMöDVí€ÖÌ@{liéh¢¢Ş
8!‡•ÁFH×ëŒé€†¸¨ëœ7CmÑq<bŒF+e®ÅÙ»WmÃÂ`ÅwÃ n¼AÁé½8Rš•ãWB GŞÑøôé-9m‘)}Ä³“`…¡ŠÁ˜0 j’$µ¿d	0@%@áØ;„üa´)Ã
;~ì@¦¸WîaÜ=‡ñO¤ JÀÀım‚½¸›eQYÄ¡Ø&1€–8ÌKÅx®êf#š¡0&¦==K+¨•¢Ó‡På>…Ğ¹{…±H@p'€`nyL2°Ê~T²élOÜ¼"ñ°ïÄ92f\Ì~àğ‘ÍBP!æĞ‰ˆÊ¤[÷Â‘ˆº¦)…$F-“²Hˆ@ŸÂ}Ì-ìTUèQS!DÏ3D³¢³\ bL8°`<ì1µ*•[iÑk‚Ã.ÌúRj]LfZğQIùBÿ
ã=n#FÙ‡àø3õÀÎÃe©y¯ÁèšØBtlP4¦K‚:±Ã„õ†PÆ2v€ÈVrX­[«ªèƒà±iÊu&ÍHtuíMO¹÷FéİEi3X0J	²Ø Rd‚­V’+=•¢ĞYµ¡
 ïƒÜÅA3Bi
!‚ß	®; Ä"û÷‚Š7
º+QØ PûÇÃüˆá!iVÒ®Åu˜_åAwE
Éºù‡1æ\Ì¢¸ãV®3"nÏ»ò¿ÃŞ¼b†®‡üÃÆ
³},	^œ%öß&.IY¶PÌ-PÔx«&f—¿„8VìAc† âÀ¹†çi{41ÄÁ¢4(4î]ÏºwR\ºW[?BWUer»V6]÷‚LQxQ@¯:AQ5Ù@7OĞÔ|€3\¶´ñ;åÄİ­*i›ke0ÆC?¡¤Ì0Xûn®a¤azÑƒæ»·±ö^ÏÚM¬ÔhNËÂ4HBnXße‰ãX=|Pğ3>@ËÃ|¡¢·"ŒDf
Ù8ÍnAKõÅ‘
ğ¨"¸L? 9â‚B»ÛöYĞG?¬7iÑl-~çµş_Ïú{VŠÍœ[t·Äküm ÒîÒ¶ñ"Jh<ïA*©D3G¸ßafÀŞ‹F(Ì KêØA4ˆüâÜWŒŠj4ÉoëğQ-ÔfænóÀÊğ`)-åfˆÏ
A@0tæªåâˆS E FwA2æàk.b£v†Ê ÔoAÆ£¢LÍŒHò®Ä
À°5Ì$-¨Œüaá@j°U°ÍìA Dg `èå@¾.|.Êì®ŠpğM§â‚`‹ŒÀ^çA6w­3$t}¤ô Î¨¤"(-zFïp	ÌJÀYàZ2EÌçA.™&™É¡EqH©­¶Ï ‘ ’QÃ$ÜÄ¡ˆĞ|'ç"ü p08«Ên¤2gPÙnØù˜k®(d¦†ÎKÀ°F2EP†bÀ«A°ñKñ±(ÅÁ¡!Ñ
.ÅP×Ñ«àö‚a‹2ÀÍA"ŒG£$H¦«  Ìõ¡„* (ƒ\­p8€U `W‚îoíÀÁ`éR!ò #I¦Khlt "Jc„¬6¾Cr<‘‡ Fü.„ŠÜüaY%aU‚†ÕM EZÍ¬9¸ãàúj4Ü‚ˆ¡`Ã'àÆò„,hNÏ„ÏVò˜ÄT6Ä¦ÚÊBefV!Şg§Pù’#+r¸2Í2 $Ìa€c,`e  ÖqÑàíÀ}’³‰¤6À‹. -U£$b±’ôA·/¡µbtójà¥0à¨†ÃÃmâËÚáoAÈ(¦Ş€TèAJã€K	$›éÀÜA4!+C.d€†À{5 |¼@ÜÂwA+
 u+³m6âİ4ÆÓxì	à ó„L¤ŠM¡ÌÃNC!R	À‘Ô3R& ‡šÀÀìM.ÂîVf{' ö“ÀH7-ÂnİÀM“xÀo3ƒ:ˆÁ}=á{ â¹Á¼¢xEiDÙ Îø ô¸4c,…C„U â½AS-¨¸3ƒ\ò <á ¶ˆÌ
¥pNCÕ=á|± êÌ297AD"¼qÈm0@>
ˆ
 ¬]@„iØ†ÑÂ ÌÜŠÀ¡vïA"Â¡ÄñÔ2Ç–:ÀñH ô®`ÚZO~.ÄŠu$¦0sj&W `TkÔ”Læ3åÍ®´¼t¸'„¦€Á€ˆ¯L2Ä"WŠFRÒvc‹GÃF”K>Ò`àS„à€ÉĞf FşÃkà5
“g®¹DUQb‰%!€45$2ÍJ@W&¢&B$uª.¨ìW”>.% ”JFğ²
è€°ã8²‡A,î÷A"bJdf ƒáJÄtb3ÄtË,P
‘„sH%"FÒô€ÍNÀâƒ<‚ÊèAC?€ñG„ÒµÃlLÇ"—àH ğHS4!§¸´ óaXª+V¥ëQ•á^"dqÍ­ ÷ ‡	DQÒJ!ìäˆËà¥ÁNÓ˜æŠÔBÚS(Lòá:â ŒLÒŒ2Œ60ğ`àè{¤%ÄVYRbüa
Â4 8åf )P¤uXâFS,F­&¯ ”ÿƒ8H¦ÿEô@Î¦dê.Lô€¹h`ºÅ ±A†	+â(VeP ô)^ja|Ãu^V±k"2Je a“4Ò ÃÀsR	Eb¢2H¤t{ÓBGÒxV>-6t.t–ib•X3eg>» »UÍv%ä¦”Q+@ÒQÕÊ3N€x/vjĞÆ+IâNÚÇ&—,Í,ó´3Ğ>U
ı`âÌ7n"ĞR¥$@I(@Ş-~€zÕEIo"8l¸mÍÀŞ!>å¶<N×%kW}QS¦YMŒhÒ	@—AÀ¹2Å!q"^…r˜áŒïA!!•°¶\*Å r!{a@µUm48èVúáJw`÷®#¤Íf)³B6”8äŠVwÈv6³gG¢VlfR„aÏàœ	èL9Šâ$a úb°+óLÚÍ]NÀäé`f˜&ä"oñ<Hu!p{ÅÍa7„3m:w3 	3
@¦¾µö<WŞ&Åf}‹áƒG%aXV"¼LÃ]
ï`—˜3Ì{Ë¾@ÁSáî"U,%8éÁ* £Š ¥lÃ5I$Õ`AM@‡¹w¢BqÕr6êit²3ÔÖB—qôà8‚ÈLÔhÊp@·s%•_¢dÎVšŠ¦†ÁWvP¡„E1²S%¥{a ƒ‘ …Bhdâ‚¥,mÁg’aerÁ8fİTTâ+d¦QÒÍ?€ø”X‚2çPGW1áÌ"HtƒDQÌF¢áB9GŠ£e~O°„`ü{†ş{7ğ$F—\ õp×ìÃB,ÃZÕ©]Â¸Jg"ô XL	5!yyˆ(ÙJ>SœÁx`ó› îˆ×IYÅçÄjŠ‚–B,7F¡yê¬dı<‚1”5Na—6960^¦)( ’¾Jz	 ¤©[eQ‡øèL§¸Š”ÍMC)~$íUfÜ‡¸Båzª°pz@Ìä ˆÏ¶h:PÜ‘ğºX—Ò)Lr0g`Ù5 zÉéš¢ªB8‘ ¦{Š“œz…Å”MâtXu~*j°UáB½APÃx”*¤W¢!7«!=.¹9·Ñ`ÚÄ¥2S%L€,ò ;RTÉÒ,aˆL„Ú„Ã]¢ƒ6H¦+£d&G¸{ŒÃ*Ê¢¦İ2H”dtoæÿ¢9º ör dc Vp¡Y`Äb‚	r<M­à¹y
Öì¤®ÂGDxám@ÈW–¯¨{Xş… 5ÖeB3Ø+ÆzC¡ÔĞ¡VWpÈaĞWš^(zlÚ²a;Jøè9,*x6äÚí,Ô&ÉÃ\qÄnQÀS%!»$¹•€…ãêÎYxM9vMEfoät>AòGF*ÅÇ½2[äY¥›"NÕ]  Ï¬AŒ¢¨ùÅsÑ~
‹fÂÂb·ç~¥Íœ;[Áog“£ÄÖ¡ êÀÑSÍ¦¥j"Á9X¼¦‚ŸlOÍ·¸ãp$ìoçš„»GPVdu»´ ƒ oğët Şna–B R	= oY`Ìä@`œL+ìÃzPt!6™7Áœ ör¿¦®jbÎ«ŒaÓa´¡l†bŸ±ÀgÁR`u©c•¤b{D ¦Àl¼9„umaZÎÜ˜ElF¤À 
U–«ë®­2,‘ìRyqaÁ6O™éÊ=î„Wà¶¡|Ö+D"ˆÅ&3½›AwËÂ•åÀ™£ İ©…QŸ¡_Â)h=x ™' ı8½|"ÔH®ZÄ õ9QÔ}uR
vI<İ&ïğùiü–öoø¸'Íc`ñ{ØÇ×j
\Éx³½ãÒ(„ÌS6"ÒgÌ‚,Šë!§€Ù&aeÚĞöµìÛ8 ¾,f+iì -É:"¹ô‰¦”ûİ*}—¸a3`ñü0w†SÁ,Å¶bâH­ÀûV¦á}ß$î¶ÅÂ#İâÄB(V8ñaG[V'J{'àÂp¯á^&ŒH;×æ¨â€YT®úZ¯}§RL6P%ëå>xæS-
õSãÊoæ+•¨œËÍlşën¢áä·eç§äH¥y!PJV"q+÷2Ù Í,ÜŒKƒ,Hµ¨F >¥ìíÎeŒè]‹káÉaƒEÉØÔ&éEov–~Ğd'PÅ×@Ü¸g¢pLÅ!?X¹úê46YQq²]ïÿ(ÌÆ—u@ãí|Ş2§ÙUÛê‚/—Ñ"XS(	J×å*pÆ*aÑÏKš«Jl„ÛƒdÔ}÷ì#duSàÁ)ÓŸWø,<„Ü„Û7cÖC6Ãmg;ĞêÏWò6Å qÕ ÷a¸3øGªÃóç¼U %HmlNw§#ŒƒŠGUÀÕ©p?±ı«²†Ğ²ºÁ YY÷÷CboôMªà V 	ƒAá˜T(	" ÁLB]‹ŠQ’ Z8GÀĞ¹I%“Iå™T®Y-—Kæ”Îi5›Mç™Ô¥ó=|º(…eT¦£)\4—Ò˜ô~Óß³¸XÆ¨2<UÏDÚÑ: ×À5+Zü³?¶—©¶ØjXÛÖk“ÚÉu»]ï›Õîù}¿_ğ	…ÃaäÀŒP #¦²	ĞvLËq™Kÿ8ÿugİJ-)¥I;5ÇÖ­õ,° k¹@ph mÅDÑo½øM–\
ã ³\W/™Íçsó/î“ûXúyuŞNŞÓ±İb°<ö¿®âó8^~—AûË ÿ8_è9}Î…ÑgÀ×ºr||!à/Àâá‡N¬Ağ„#	Bp¤+BğÄ*®†àjTÃå`%LX°î™üqÅg-¥bPÑ¡Üö Î8®Ä \z¢a BÈaóz‡d’> ÄJÉàO)Jr¤«+J«9ø|KgÂ‚sšs¦dÌfA…31YÆq.g±ï7ïdRƒ+¯è&3Nã@Ã=`ÜúÇ2»7íÒ(Pâq­E³•GQô…#IRt¥+K,mxCMEµ:\ 3tºòê¨'@ãUÅİZ]Ph2@µ Öá‚,.‹òzTˆ×¿õ-‹cXöE.÷=Õ:€s¼~ÑE	«kŠié µ—o	„mÂHN®%’±Û'Òo‰÷`˜ó<×5ãy^w¥ë{^÷ˆ;}¥=úU8 TÙ_	¬S.™@Kád±×‡A>"¸ \!ââ&)Šøà càSäĞ&K“dùBíÀSd
w™ù_feé©›fŞrm9à47gã{ô+‹9I”¥§’x™ša–1éãË©º>««júÆ³­d Öº;(İ!³ÚVö›a¶£Å*"C jná<F	h®>Ó¿oüÓƒKIØlğæÆ˜fgß}‹|€¹ 2„£À¤±©ÜZseùÏG?Bsòı'KÓtıGR™> ¸ï×"Ïb-‚ )Õ!tR÷ Ü­‰Û÷şƒe3²Ìpãò¾ĞXY.J“>/‡aŞO«ëzşÇ³+Îº²<ûãİ€{ÚGß{_GÓõ0–[:ƒXk±©œ½pî:_Árwÿg×ÿ?ø `5cŒp@pnôÈœ_`vÀø!`”&%$¤…h0ÙÈÛG¨yÁHAa#oì€, 2-aP·p´>xIa”3†d÷ˆp5ÖğK	XCXbCC
É¹	È'Â,KÈ–"Dø¡b’Pp¨Z‹@ÑC*lqÃî)ÅøÁc8G'6FpÜªƒˆsu‘7FøáI¸æƒ˜EÇqdĞ˜K*69Gù c H$?Hq dP6R6GHø¦{†,“‚Kf/…ì“’vOAG&¥{@á|0¿¿'åT«•Ü17,DÈ‰–‚rKqÉ+eÔ»ˆ†½ÊœHºñ^ºµ¡bc¡2DT&+²ògLù É¢éj±¨7
ù°+¦£Ø+³ÇÇË4g5ìˆ
ÎyĞ@²^s'²p>ÓŞåÑË  ¨TOqT§Ğ„ÓOú ¤f£lƒmØ…®7hPÜÎT *åS¬(KÎêÎFb™¯G,h3ğÜ
¡TZËXdRq/éP¾jc‘lÌ'kİa÷AĞ/SpÀhÕ;§”õ =1Ö‹„°”Bb Q†şq”úÀ| Ôğ„*9TRq1Í(”j(kYá<iõc„¼ÖpS ü–bÖğy@zƒeÏÍ3!‚-ëĞ¶—Œì$Ø¶ÚÁ²nà˜Š[)Í "²Xû!dKkm­*Áb–SZÒ²TfÊÅ‚v+x; Úp"‰_àï¥Bü_`ék©JÛ<™Ê|%»®x>êBz%eÑkZ/ŸÀº'kÇQË0K;º}ËĞâ6p &.Ğ›1¡#Äëoxoã$©°Y^qcHZÙ‹«Ö_Qq åó¦àH@Aõûğ¡Q’‡
.p¸øB®‘À7è½Õ¼˜5¿QÃ=Sõ!‰‰3I9ìK'UµˆFËŠw.æ1­jçyœ^&¼âü`K`mìñ`ìqm²ïB?Û´&¶+¬K"÷¤ôëG¢XEÀË'0K”A5rVWÁ'’„²Ò‡ŒVqÜEˆ¬B6†ÍaÇY•|ôJäÄ6k ç7«±c‰±ì`ğxÔ±›F`ªÏ‚¦…P£°<kü]¡ªMä°ŒtPHÀã3hı!4Or
c
Øÿ¥µR(åYLH
*°(
º”+ƒPè˜Œ‹9SØæF³?ÄÒ8œÒ:õ@æƒA$”Aè>-éÑ„`îf¬uZ.ÅĞĞÚƒ>ÌMHºœNšV5÷Îùëa ®‚ú9†ûsnx¾ŠQMEÀ¢Bà:uâ¡òüË·%4A#Z#Fİ†Da\-zâØEpq‚ş»Á›£‡oBÀl('·ÁûD-^`wQÓ‹«f–Œ¾@2…ç#gtc[W‚ñbU„ÏtFrñ3wæœÖ EØ=Ã`i|ôY0t­§‰zW ø"tp‹“3OÀrDrÑŒYi\[f±!3øÜÌœÛ¯›r|rˆ%Ú\Aƒ®Ğë–@p³ÁíáÜ8®î‚´gwqš¡yI¬Şg9ÊïD(<¢ÂSrõÿâ_!¯ûPhöÃ¹Ğ¨8×«$êG@¼ÀÜŒ… ¦½"2€=¹uúƒ’ÎZüAzñ 7ıŞáœ¯Å{ríY«G€{áä=ôpˆvZ=ÚÅA­‰”è¶¶a6]OltÖˆõâBV®Ùî>×Ûu	do}ñ»±CÅw6­äp	½#´:!ˆ‚pQj ä~*: un^#W
¶œ7î?ø–°€ã;ü	‹‚"8Á(šWöË<†hf*ØI$j¹
ê¹,9î›” A,Ó-,@