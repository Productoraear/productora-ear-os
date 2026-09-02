<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xml:lang="en" lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <!-- MOTW-DISABLED saved from url=(0014)about:internet -->
    <title>Solo, Mute, and Gain in Multichannel Tracks and Paths</title>
    <link rel="StyleSheet" href="css/surround2.tracks.css" type="text/css" media="all" />
    <link rel="StyleSheet" href="../css/webworks.css" type="text/css" media="all" />
    <script type="text/javascript" language="JavaScript1.2" src="../wwhdata/common/context.js"></script>
    <script type="text/javascript" language="JavaScript1.2" src="../wwhdata/common/towwhdir.js"></script>
    <script type="text/javascript" language="JavaScript1.2" src="../wwhdata/common/wwhpagef.js"></script>
    <script type="text/javascript" language="JavaScript1.2" src="../scripts/jquery.js"></script>
    <script type="text/javascript" language="JavaScript1.2" src="../scripts/avid_jq_showhide.js"></script>
    <script type="text/javascript" language="JavaScript1.2">
      <!--
        var  WebWorksRootPath = "../";
      // -->
    </script>
    <script type="text/javascript" language="JavaScript1.2">
      <!--
        // Set reference to top level help frame
        //
        var  WWHFrame = WWHGetWWHFrame("../", true);
      // -->
    </script>
    <script type="text/javascript" language="JavaScript1.2" src="../scripts/expand.js"></script>
  </head>
  <body style="text-align: left; position:relative; margin-left:10px; margin-top:0%;" onLoad="WWHUpdate();" onUnload="WWHUnload();" onKeyDown="WWHHandleKeyDown((document.all||document.getElementById||document.layers)?event:null);" onKeyPress="WWHHandleKeyPress((document.all||document.getElementById||document.layers)?event:null);" onKeyUp="WWHHandleKeyUp((document.all||document.getElementById||document.layers)?event:null);">
    <div></div>
    <div class="WebWorks_Breadcrumbs" style="text-align: left;">
      <a class="WebWorks_Breadcrumb_Link" href="--Part10.65.1.html#1207600">Surround</a> : <a class="WebWorks_Breadcrumb_Link" href="surround2.tracks.67.1.html#1207600">Multichannel Tracks and Signal&nbsp;Routing</a> : <a class="WebWorks_Breadcrumb_Link" href="surround2.tracks.67.2.html#1207600">Multichannel Audio Tracks</a> : Solo, Mute, and Gain in Multichannel Tracks and Paths</div>
    <hr align="left" />
    <blockquote>
      <div class="h2-heading"><a name="1207600">Solo, Mute, and Gain in Multichannel Tracks and Paths</a></div>
      <div class="bp-bodyParagraph"><a name="1207556">Stereo and multichannel tracks consist of multiple audio signals, linked together. By default, multichannel tracks are linked and are controlled by a single channel fader, and solo and mute switches. </a></div>
      <div class="bp-bodyParagraph"><a name="1204365">For discrete control of signals, multichannel tracks can be converted into individual mono tracks. For discrete level and phase adjustment, you can insert and unlink a multi-mono Trim plug-in. Both of these techniques are explained below.</a></div>
      <div class="a-anchor"><a name="1204375">		</a></div>
      <table id="t_1204367" style="padding: 0em; margin: -8px; margin-top: -8px;">
        <tr style="vertical-align: top;">
          <td style="width: 0px;"></td>
          <td style="width: auto;">
            <div class="w-warning_outer" style="margin-left: -2.4000000000000003em;">
              <table border="0" cellspacing="0" cellpadding="0" summary="">
                <tr style="vertical-align: baseline;">
                  <td>
                    <div class="w-warning_inner" style="width: 3.2em; white-space: nowrap;">
                      <img src="../n-warning.gif" alt="*" border="0" width="24" height="16" />
                    </div>
                  </td>
                  <td width="100%">
                    <div class="w-warning_inner"><a name="1204374">Once converted to mono, multichannel tracks cannot be relinked into their original multichannel format. However, a multichannel track can be reassembled by dragging the corresponding number of mono files (with the appropriate file suffixes) into a multichannel track, although some automation data may be lost. As an alternative, record the submix of the mono tracks to disk on a multichannel track.</a></div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
      <div class="ph-procedureHead"><a name="1204376">To convert a multichannel track into discrete mono tracks:</a></div>
      <div class="pif-procedureItemFirst_outer" style="margin-left: 0pt;">
        <table border="0" cellspacing="0" cellpadding="0" summary="">
          <tr style="vertical-align: baseline;">
            <td>
              <div class="pif-procedureItemFirst_inner" style="width: 10.8pt; white-space: nowrap;">
                <span class="znumb-pi">1	</span>
              </div>
            </td>
            <td width="100%">
              <div class="pif-procedureItemFirst_inner"><a name="1207173">Select the multichannel track.</a></div>
            </td>
          </tr>
        </table>
      </div>
      <div class="pi-procedureItem_outer" style="margin-left: 0pt;">
        <table border="0" cellspacing="0" cellpadding="0" summary="">
          <tr style="vertical-align: baseline;">
            <td>
              <div class="pi-procedureItem_inner" style="width: 10.8pt; white-space: nowrap;">
                <span class="znumb-pi">2	</span>
              </div>
            </td>
            <td width="100%">
              <div class="pi-procedureItem_inner"><a name="1201433">Choose Track &gt; Split Into Mono. </a></div>
            </td>
          </tr>
        </table>
      </div>
      <div class="ph-procedureHead"><a name="1201434">To have discrete control of gain on individual channels of a multichannel track: </a></div>
      <div class="pif-procedureItemFirst_outer" style="margin-left: 0pt;">
        <table border="0" cellspacing="0" cellpadding="0" summary="">
          <tr style="vertical-align: baseline;">
            <td>
              <div class="pif-procedureItemFirst_inner" style="width: 10.8pt; white-space: nowrap;">
                <span class="znumb-pi">1	</span>
              </div>
            </td>
            <td width="100%">
              <div class="pif-procedureItemFirst_inner"><a name="1201435">Insert a multi-mono Trim plug-in on the multichannel track.</a></div>
            </td>
          </tr>
        </table>
      </div>
      <div class="pi-procedureItem_outer" style="margin-left: 0pt;">
        <table border="0" cellspacing="0" cellpadding="0" summary="">
          <tr style="vertical-align: baseline;">
            <td>
              <div class="pi-procedureItem_inner" style="width: 10.8pt; white-space: nowrap;">
                <span class="znumb-pi">2	</span>
              </div>
            </td>
            <td width="100%">
              <div class="pi-procedureItem_inner"><a name="1201436">Unlink the Trim plug-in by clicking the Link icon so that it is unlit. </a></div>
            </td>
          </tr>
        </table>
      </div>
      <div class="pi-procedureItem_outer" style="margin-left: 0pt;">
        <table border="0" cellspacing="0" cellpadding="0" summary="">
          <tr style="vertical-align: baseline;">
            <td>
              <div class="pi-procedureItem_inner" style="width: 10.8pt; white-space: nowrap;">
                <span class="znumb-pi">3	</span>
              </div>
            </td>
            <td width="100%">
              <div class="pi-procedureItem_inner"><a name="1203752">Use the Channel selector to display the controls for a channel, and adjust the gain. </a></div>
            </td>
          </tr>
        </table>
      </div>
      <div class="a-anchor"><a name="1201809">		</a></div>
      <table id="t_1201801" style="padding: 0em; margin: -8px; margin-top: -8px;">
        <tr style="vertical-align: top;">
          <td style="width: 0px;"></td>
          <td style="width: auto;">
            <div class="cr-crossReference_outer" style="margin-left: -2.4000000000000003em;">
              <table border="0" cellspacing="0" cellpadding="0" summary="">
                <tr style="vertical-align: baseline;">
                  <td>
                    <div class="cr-crossReference_inner" style="width: 3.2em; white-space: nowrap;">
                      <img src="../x-ref.gif" alt="*" border="0" width="24" height="20" />
                    </div>
                  </td>
                  <td width="100%">
                    <div class="cr-crossReference_inner"><a name="1201823">See </a><a href="javascript:WWHClickedPopup('Pro_Tools_Help', 'Pro%20Tools%20Reference\u002Fsurround2.tracks.67.12.html#1201595', '');">Linking and Unlinking Controls on Multi-Mono Plug-Ins</a> for more information. </div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
      <script type="text/javascript" language="JavaScript1.2">
        <!--
          // Clear related topics
          //
          WWHClearRelatedTopics();

          document.writeln(WWHRelatedTopicsInlineHTML());
        // -->
      </script>
    </blockquote>
    <script type="text/javascript" language="JavaScript1.2">
      <!--
        document.write(WWHRelatedTopicsDivTag() + WWHPopupDivTag() + WWHALinksDivTag());
      // -->
    </script>
  </body>
</html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   <?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xml:lang="en" lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <!-- MOTW-DISABLED saved from url=(0014)about:internet -->
    <title>Multichannel Auxiliary Inputs and Master&nbsp;Faders</title>
    <link rel="StyleSheet" href="css/surround2.tracks.css" type="text/css" media="all" />
    <link rel="StyleSheet" href="../css/webworks.css" type="text/css" media="all" />
    <script type="text/javascript" language="JavaScript1.2" src="../wwhdata/common/context.js"></script>
    <script type="text/javascript" language="JavaScript1.2" src="../wwhdata/common/towwhdir.js"></script>
    <script type="text/javascript" language="JavaScript1.2" src="../wwhdata/common/wwhpagef.js"></script>
    <script type="text/javascript" language="JavaScript1.2" src="../scripts/jquery.js"></script>
    <script type="text/javascript" language="JavaScript1.2" src="../scripts/avid_jq_showhide.js"></script>
    <script type="text/javascript" language="JavaScript1.2">
      <!--
        var  WebWorksRootPath = "../";
      // -->
    </script>
    <script type="text/javascript" language="JavaScript1.2">
      <!--
        // Set reference to top level help frame
        //
        var  WWHFrame = WWHGetWWHFrame("../", true);
      // -->
    </script>
    <script type="text/javascript" language="JavaScript1.2" src="../scripts/expand.js"></script>
  </head>
  <body style="text-align: left; position:relative; margin-left:10px; margin-top:0%;" onLoad="WWHUpdate();" onUnload="WWHUnload();" onKeyDown="WWHHandleKeyDown((document.all||document.getElementById||document.layers)?event:null);" onKeyPress="WWHHandleKeyPress((document.all||document.getElementById||document.layers)?event:null);" onKeyUp="WWHHandleKeyUp((document.all||document.getElementById||document.layers)?event:null);">
    <div></div>
    <div class="WebWorks_Breadcrumbs" style="text-align: left;">
      <a class="WebWorks_Breadcrumb_Link" href="--Part10.65.1.html#1201565">Surround</a> : <a class="WebWorks_Breadcrumb_Link" href="surround2.tracks.67.1.html#1201565">Multichannel Tracks and Signal&nbsp;Routing</a> : <a class="WebWorks_Breadcrumb_Link" href="surround2.tracks.67.6.html#1201565">Multichannel Signal Routing</a> : Multichannel Auxiliary Inputs and  Master&nbsp;Faders</div>
    <hr align="left" />
    <blockquote>
      <div class="h2-heading"><a name="1201565">Multichannel Auxiliary Inputs and  Master&nbsp;Faders</a></div>
      <div class="bp-bodyParagraph"><a name="1202052">A multichannel Auxiliary Input or Master Fader is used as a return for the multichannel bus. Sends are useful when you need to create an additional, independent mix simultaneously (perhaps of a distinct format), requiring dedicated fader, mute, solo, and automation controls.</a></div>
      <div class="bp-bodyParagraph"><a name="1205021">You can assign Master Faders to main and sub-paths. Main paths must match the format of the Master Fader, and only one Master Fader can be active and assigned to any single (active) main or sub-path. A Master Fader cannot be assigned to a sub-path if its associated main path is already assigned on another Master Fader. See </a><a href="javascript:WWHClickedPopup('Pro_Tools_Help', 'Pro%20Tools%20Reference\u002Fmix1.basic.61.10.html#1201504', '');">Master Fader Tracks and Signal Flow</a>. </div>
      <script type="text/javascript" language="JavaScript1.2">
        <!--
          // Clear related topics
          //
          WWHClearRelatedTopics();

          document.writeln(WWHRelatedTopicsInlineHTML());
        // -->
      </script>
    </blockquote>
    <script type="text/javascript" language="JavaScript1.2">
      <!--
        document.write(WWHRelatedTopicsDivTag() + WWHPopupDivTag() + WWHALinksDivTag());
      // -->
    </script>
  </body>
</html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    