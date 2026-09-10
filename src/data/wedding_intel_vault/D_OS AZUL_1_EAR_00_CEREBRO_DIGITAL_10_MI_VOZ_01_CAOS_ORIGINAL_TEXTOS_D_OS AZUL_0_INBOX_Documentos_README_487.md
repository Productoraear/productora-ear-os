100"></circle> <text transform="translate(100,130)" y="0"> <tspan font-size="90" class="" fill="rgba(0,0,0,0.3)" text-anchor="middle">' + userData.username.charAt(0).toLocaleUpperCase() + '</tspan> </text> </svg>');
								}

								if(userData != ""){
									if($(".layoutHeader__authArea.app-header-auth-area").html().replace(/(\r\n|\n|\r|\s)/gm, "") != user_html.replace(/(\r\n|\n|\r|\s)/gm, "")){
										$(".layoutHeader__authArea.app-header-auth-area").html(user_html);
									}
									$('.dropdown.stationary').show();
								}else{
									if($(".layoutHeader__authArea.app-header-auth-area").html() != login_html){				
										$(".layoutHeader__authArea.app-header-auth-area").html(login_html);
									}
								}
							}
						});	

					}				

				</script>
                <div class="layoutHeader">
    <span class="layoutHeader__hamburger app-header-menu-toggle">
      <i class="svgIcon svgIcon__list-menu ">
        <svg viewBox="0 0 18 20">
          <path d="M14.17 15.42a.5.5 0 01.09.992l-.09.008H1a.5.5 0 01-.09-.992L1 15.42h13.17zm2.927-5.76a.5.5 0 01.09.991l-.09.008H1a.5.5 0 01-.09-.991L1 9.659h16.097zm0-5.66a.5.5 0 01.09.992l-.09.008H1a.5.5 0 01-.09-.992L1 4h16.097z" fill-rule="nonzero">
          </path>
        </svg>
      </i>
    </span>
    <a class="layoutHeader__logoAnchor" href="https://www.bodas.net/">
      <img src="img/gen_logoHeader_es.svg" alt="Bodas" width="180" height="33">
    </a>
    <nav class="layoutHeader__nav app-header-nav">
      <ul class="layoutNavMenu app-header-list">
        <li class="layoutNavMenu__header">
          <i class="svgIcon svgIcon__close layoutNavMenu__itemClose app-header-menu-toggle">
            <svg viewBox="0 0 26 26">
              <path d="M12.983 10.862L23.405.439l2.122 2.122-10.423 10.422 10.423 10.422-2.122 2.122-10.422-10.423L2.561 25.527.439 23.405l10.423-10.422L.439 2.561 2.561.439l10.422 10.423z" fill-rule="nonzero">
              </path>
            </svg>
          </i>
        </li>
        <li class="layoutNavMenu__item app-header-menu-item-openSection ">
          <a href="https://www.bodas.net/organizador-bodas" cla