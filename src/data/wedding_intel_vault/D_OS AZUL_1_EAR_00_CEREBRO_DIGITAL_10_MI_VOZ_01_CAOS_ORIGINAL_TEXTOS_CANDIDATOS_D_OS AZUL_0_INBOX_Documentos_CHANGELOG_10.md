 $('.product-info .swiper-slide img:first').attr('data-largeimg').replace(/_.*-/,'_' + $(this).data('id') + '-');
                $('.product-info .swiper-slide img:first').attr('src',src);
                $('.product-info .swiper-slide img:first').attr('srcset',srcset);
                $('.product-info .swiper-slide img:first').attr('data-largeimg', datalargeimg);
                window.ppclient.fire('swatch-select', $(this).data('id'));
                $('.swatch-color').removeClass('active');
                $(this).addClass('active');
              });
            

            $( ".product-option-radio input:radio:first" ).click();
            let searchParams = new URLSearchParams(window.location.search);
            if(searchParams.has('color')){
              var swatchid = searchParams.get('color');
            }
          
	$('.thumbnails').magnificPopup({
		type:'image',
		delegate: 'a',
		gallery: {
			enabled:true
		}
	});
});

$(document).ready(function () {
  $('.review-links a').on('click', function () {
    var $review = $('#review');
    if ($review.length) {
      $('a[href="#' + $review.closest('.module-item').attr('id') + '"]').trigger('click');
      $('a[href="#' + $review.closest('.tab-pane').attr('id') + '"]').trigger('click');
      $('a[href="#' + $review.closest('.panel-collapse').attr('id') + '"]').trigger('click');
      $review.closest('.expand-block').find('.block-expand.btn').trigger('click');

      $([document.documentElement, document.body]).animate({
        scrollTop: $review.offset().top - 100
      }, 200);
    }
  });
});
//--></script>
<script type="application/ld+json">{"@context":"http:\/\/schema.org","@type":"WebSite","url":"https:\/\/invitaciones.bodas.net\/","name":"Invitaciones Bodas.net","description":"","potentialAction":{"@type":"SearchAction","target":"https:\/\/invitaciones.bodas.net\/index.php?route=product\/search&amp;search={search}","query-input":"required name=search"}}</script>
<script type="application/ld+json">{"@context":"http:\/\/schema.org","@type":"Organization","url":"https:\/\/invitaciones.bodas.net\/","logo":"https:\/\/invitaciones.bodas.net\/image\/cache\/placeholder-1000x1000.png"}</script>
<script type="application/ld+json">{"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"\/","name":"Inicio"}},{"@type":"ListItem","position":2,"item":{"@id":"https:\/\/invitaciones.bodas.net\/libro-de-firmas","name":"Libro de firmas"}},{"@type":"ListItem","position":3,"item":{"@id":"https:\/\/invitaciones.bodas.net\/libro-de-firmas\/aurora-libro-de-firmas-652","name":"Aurora - Libro de firmas"}}]}</script>
<script type="application/ld+json">{"@context":"http:\/\/schema.org\/","@type":"Product","name":"Aurora - Libro de firmas","image":"https:\/\/invitaciones.bodas.net\/image\/cache\/catalog\/product\/516b9be9fa271b74af2686766de7194e_0-1800x1440.png","description":"","sku":"","mpn":"","offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.54","itemCondition":"http:\/\/schema.org\/NewCondition","availability":"http:\/\/schema.org\/InStock","seller":{"@type":"Organization","name":"Invitaciones Bodas.net"},"priceValidUntil":"2025-12-23","url":"https:\/\/invitaciones.bodas.net\/libro-de-firmas\/aurora-libro-de-firmas-652"},"brand":{"@type":"brand","name":"Herzkarten"}}</script>
			<script type="text/javascript"><!--
				$('div[data-option-id="14"] input').click(function(){
					$('.option-price-label').html('&nbsp;- ' + $(this).siblings('img').data('original-title'));
				});
				$( document ).ready(function() {
					$('img[data-option-id="65" i]').click(function(){
						$('.product-left img.folie').removeClass("folie_rose");
						$('.product-left img.folie').removeClass("folie_silber");
						$('.product-left img.folie').addClass("folie_gold");
					});
					$('img[data-option-id="66" i]').click(function(){
						$('.product-left img.folie').removeClass("folie_rose");
						$('.product-left img.folie').addClass("folie_silber");
						$('.product-left img.folie').removeClass("folie_gold");
					});
					$('img[data-option-id="67" i]').click(function(){
						$('.product-left img.folie').addClass("folie_rose");
						$('.product-left img.folie').removeClass("folie_silber");
						$('.product-left img.folie').removeClass("folie_gold");
					});	
				});
					
			//--></script>
			

				<script type="text/javascript">	
					$(document).on("click", "input[src-colorbox]", function() {
						//for non-select options
						
						var newImg = $(this).attr('src');
						var newImgColorBox = $(this).attr('src-colorbox');
						
						if(newImg != 'NA')
						{
							//poiChangeImage(newImg, newImgColorBox);
						}
					return true;
					});                                  
					$(document).ready(function()
					{
						$("*[src-colorbox]").each(function(){
							$this = $(this);
							
							$src = $this.attr('src');
							if($src != 'NA')
							{
								$('<img/>')[0].src = $src; //preload image
							}
							
							$srcColorbox = $this.attr('src-colorbox');
							
							if($srcColorbox != 'NA')
							{
								$('<img/>')[0].src = $srcColorbox; //preload image
							}
						});
					});
																										$(document).ready(function(){
							$('div[rel="19"] select[name="option[3030]"]').change(function() {	
								//console.log($(this));						
								poiChangeSelect($(this));
							});
						});
															function poiChangeSelect(selectObj)
					{
						$selectedOption = selectObj.find("option:selected");
						var newImg = $selectedOption.attr('src');
						var newImgColorBox = $selectedOption.attr('src-colorbox');
						if(newImg != 'NA')
						{				
							poiChangeImage(newImg, newImgColorBox);
						}
						return true;
					}
					
					$poiImageToChange = [];
					function setImageToChange()
					{
						$poiImageToChange = $('#image, #zoom1 img, #ma-zoom1 img, #main-image, div.image a.colorbox-product img, div.image #wrap a img, .zoomPad > img, .product-info .image > img, .product-image img, #zoom_01, .thumbnail > img:first, #gallery_zoom');
					}
					setImageToChange();
					
					function poiChangeImage(newImageSrc, newImageColorBoxSrc)
					{
						if(typeof newImageSrc !== "undefined"){

							if($('img[src="' + newImageSrc.replace('860x670w', '120x120w') + '"]').length == 0 && $('img[src="' + newImageSrc.replace('860x670h', '120x120h') + '"]').length == 0){
								$('.main-image img').attr('srcSet', newImageSrc);
							}else{
							
								if($('.main-image img').attr('srcSet').includes($('.main-image img').attr('src'))) {
									var tmpimg = newImageSrc.replace('860x670w', '120x120w').replace('860x670h', '120x120w');
									if($('img[src="' + tmpimg + '"]').length > 0){
										$('img[src="' + tmpimg + '"]').click();
									}else{
										$('img[src="' + tmpimg.replace('120x120w', '120x120h') + '"]').click();
									}
								}else{
									$('.main-image img').attr('srcSet', newImageSrc);
								}
								
							}
							
							
							if(newImageColorBoxSrc != null)
							{
								//OC2 ColorBox
								if($('a.thumbnail:first').length > 0)
								{
									$('a.thumbnail:first').attr('href', newImageColorBoxSrc);
								}
							
								//ElevateZoom
								if($('.zoomWindow').length > 0)
								{
									$('.zoomWindow').css('background-image', 'url("' + newImageColorBoxSrc + '")');
								}
								
								//CloudZoom
								if($('.mousetrap').length > 0)
								{
									$('.mousetrap').on('mouseenter', this, function (event) {
										$('#cloud-zoom-big').css('background-image', 'url("' + newImageColorBoxSrc + '")');
									});
								}
								
								//ColorBox
								if($('.image .colorbox').length > 0)
								{
									$('.image .colorbox').attr('href', newImageColorBoxSrc);
								}
								
								//jQueryZoom
								if($('.zoomWrapperImage > img').length > 0)
								{
									$('.zoomWrapperImage > img').attr('src', newImageColorBoxSrc);
								}
								
								//Lightbox
								if($('a[rel="lightbox[thumb]"]').length > 0)
								{
									$('a[rel="lightbox[thumb]"]').attr('href', newImageColorBoxSrc);
								}
								
								//MagicZoom
								if($('.MagicZoomBigImageCont img').length > 0)
								{
									$('.MagicToolboxContainer img').attr('src', newImageSrc);
									$('.MagicZoomBigImageCont img').attr('src', newImageColorBoxSrc);
								}
								
								//zoomLens
								if($('.zoomLens img').length > 0)
								{
									$('.zoomLens > img').attr('src', newImageColorBoxSrc);
									$('#image').data('elevateZoom').swaptheimage(newImageColorBoxSrc, newImageColorBoxSrc); 
								}
								
								//zm-viewer 
								if($('.zm-viewer img').length > 1)
								{
									$($('.zm-viewer img')).attr('src', newImageColorBoxSrc);
								}
							
								//MagicZoomPlus
								if($('a.MagicZoomPlus').length > 0)
								{
									$('a.MagicZoomPlus').attr('href', newImageColorBoxSrc);
									$('.MagicThumb-expanded img').attr('src', newImageColorBoxSrc);
								}
								
								
								if($('.zoomImg').length > 1)
								{
									$($('.zoomImg')).attr('src', newImageColorBoxSrc);
								}
							}
						}
					}
					
					$('.option.option-image img').click(function(){
						setTimeout(function() {
							$('.option-image .radio input[type="radio"]:checked').trigger('click').trigger('change');
						}, 500);
					});
					
					$('.option.option-radio span').click(function(){
						setTimeout(function() {
							$('.option-radio .radio input[type="radio"]:checked').trigger('click').trigger('change');
						}, 500);
					});
					
					$('.option.option-select span').click(function(){
						setTimeout(function() {
							$('.option-select select').trigger('click').trigger('change');
						}, 500);
					});
				</script> 
			
 
                <script type="text/javascript"><!--	
                    function openEditor(sample = "false"){           
                        $.ajax({
                            url: 'index.php?route=checkout/cart/validate',
                            type: 'post',
                            data: $(
                            '#product .button-group-page input[type=\'text\'], #product .button-group-page input[type=\'hidden\'], #product .button-group-page input[type=\'radio\']:checked, #product .button-group-page input[type=\'checkbox\']:checked, #product .button-group-page select, #product .button-group-page textarea, ' +
                            '#product .product-options input[type=\'text\'], #product .product-options input[type=\'hidden\'], #product .product-options input[type=\'radio\']:checked, #product .product-options input[type=\'checkbox\']:checked, #product .product-options select, #product .product-options textarea, ' +
                            '#product select[name="recurring_id"]'
                            ),
                            dataType: 'json',
                            beforeSend: function () {
                                $('.editor_button').button('loading');
                            },
                            complete: function () {
                               
                            },
                            success: function (json) {
                                $('.alert-dismissible, .text-danger').remove();
                                $('.form-group').removeClass('has-error');
                               
                                if (json['error']) {
                                    $('.editor_button').button('reset');
                                    if (json['error']['option']) {
                                    for (i in json['error']['option']) {
                                        var element = $('#input-option' + i.replace('_', '-'));
            
                                        if (element.parent().hasClass('input-group')) {
                                        element.parent().after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
                                        } else {
                                        element.after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
                                        }
                                    }
                                    }
            
                                    if (json['error']['recurring']) {
                                    $('select[name=\'recurring_id\']').after('<div class="text-danger">' + json['error']['recurring'] + '</div>');
                                    }
            
                                    // Highlight any found errors
                                    $('.text-danger').parent().addClass('has-error');
            
                                    try {
                                    $('html, body').animate({ scrollTop: $('.form-group.has-error').offset().top - 50 }, 'slow');
                                    } catch (e) {
                                    }
                                }else{
                                    var swatch = 0;
                                    if(typeof $('.swatch-color.active').data('id') !== 'undefined'){
                                        swatch = $('.swatch-color.active').data('id');
                                    }
                                    
                                    $.ajax({
                                        url: 'index.php?route=tkww/editor/openEditor&swatch=' + swatch + '&sample=' + sample,
                                        xhrFields: {
                                            withCredentials: true
                                        },
                                        type: 'post',
                                        data: $(
                                                '#product .button-group-page input[type=\'text\'], #product .button-group-page input[type=\'hidden\'], #product .button-group-page input[type=\'radio\']:checked, #product .button-group-page input[type=\'checkbox\']:checked, #product .button-group-page select, #product .button-group-page textarea, ' +
                                                '#product .product-options input[type=\'text\'], #product .product-options input[type=\'hidden\'], #product .product-options input[type=\'radio\']:checked, #product .product-options input[type=\'checkbox\']:checked, #product .product-options select, #product .product-options textarea, ' +
                                                '#product select[name="recurring_id"]'
                                            ),
                                        dataType: 'json',
                                        async: true,
                                        beforeSend: function() {		
                                        },				
                                        success: function(json) {
                                            $('.editor_button').button('reset');
                                            if(typeof json.editor !== "undefined" && json.editor !== "false"){
                                                window.location.replace(json.editor);
                                            }else{
                                            console.log(json);
                                                $('.designer-resort').append('<div class="alert alert-danger" style="order: 2"> Error #3 </div>');  
                                            }        
                                        },
                                        error: function(err){   
                                            $('.designer-resort').append('<div class="alert alert-danger" style="order: 2"> Error #2 </div>');    
                                            console.log('Error : ');
                                            console.log(err);
                                        }	
                                    });	
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                $('.designer-resort').append('<div class="alert alert-danger" style="order: 2"> Error #1 </div>');
                            }
                        });
                    }
				//--></script> 
            

			<!--BOF Product Color Option-->
			<style>
			.product-color-options span
			{
				display:inline-block;
				width:12px;
				height:12px;
				margin-right:0px;
				border:2px solid #E7E7E7;
			}

			.image .product-color-options
			{
				display: none;
			}
			
			a.color-option {
				display:inline-block;
				width:15px;
				height:15px;
				margin: 3px;
				padding: 0;
				border:2px solid #E7E7E7;
				vertical-align: middle;
				cursor: pointer;
				box-sizing: content-box !important;
			}
			
			a.color-option.color-active, a.color-option:hover {
				margin: 0;
				padding: 3px;
			}
			
			.hidden {
				display: none !important;
			}
			
			/*Oval style*/
			a.color-option.pco-style-oval,
			.product-color-options span.pco-style-oval
			{
				border-radius: 9999px;
			}

			/*Double rectangle style*/
			a.color-option.pco-style-double-rectangle,
			.product-color-options span.pco-style-double-rectangle
			{
				border: 4px double #E7E7E7;
			}	

			/*Double oval style*/
			a.color-option.pco-style-double-oval,
			.product-color-options span.pco-style-double-oval
			{
				border-radius: 9999px;
				border: 4px double #E7E7E7;
			}		
			</style>
			<script type="text/javascript"><!--
			$("a.color-option").click(function(event)
			{
				$this = $(this);
				
				// highlight current color box
				$this.parent().find('a.color-option').removeClass('color-active');
				$this.addClass('color-active');
				
				$('#' + $this.attr('option-text-id')).html($this.attr('title'));
				
				// trigger selection event on hidden select
				$select = $this.parent().find('select');
				
				$select.val($this.attr('optval'));
				$select.trigger('change');
				
				//option redux
				if(typeof updatePx == 'function') {
					updatePx();
				}
				
				//option boost
				if(typeof obUpdate == 'function') {
					obUpdate($($this.parent().find('select option:selected')), useSwatch);
				}
				
				if(typeof myocLivePriceUpdate == 'function') {
					myocLivePriceUpdate();
				}
				
				event.preventDefault();
			});
			
			$("a.color-option").parent('.option').find('.hidden select').change(function()
			{
				$this = $(this);
				var optionValueId = $this.val();
				$colorOption = $('a#color-option-' + optionValueId);
				if(!$colorOption.hasClass('color-active'))
					$colorOption.trigger('click');
			});
			//--></script> 

               

				<script src="https://kundenservice.herzkarten.de/assets/chat/chat.min.js"></script>
								
					<script>
						$(function() {
							new ZammadChat({
								background: '#f76c6f',
								fontSize: '12px',
								show: false,
								chatId: 2							});
						});
					</script>

								
            
			<!--EOF Product Color Option-->  <div id="bottom" class="bottom top-row">
            <div class="grid-rows">
          <div class="grid-row grid-row-bottom-1">
                <div class="grid-cols">
                      <div class="grid-col grid-col-bottom-1-1">
              <div class="grid-items">
                                  <div class="grid-item grid-item-bottom-1-1-1">
                    <div class="module module-products module-products-310 module-products-grid carousel-mode">
  <div class="module-body">
                      <div class="tab-container">
        <ul class="nav nav-tabs">
                      <li class="tab-1 active">
                              <a href="#products-6769200e4032d-tab-1" data-toggle="tab">Más de esta serie</a>
                          </li>
                    </ul>
        <div class="tab-content">
                                    <div class="module-item module-item-1 tab-pane active" id="products-6769200e4032d-tab-1">
                      <div class="swiper" data-items-per-row='{"c0":{"0":{"items":4,"spacing":24},"1024":{"items":3,"spacing":10},"760":{"items":1,"spacing":10}},"c1":{"0":{"items":4,"spacing":24},"760":{"items":1,"spacing":10}},"c2":{"0":{"items":1,"spacing":0}},"sc":{"0":{"items":1,"spacing":0}}}' data-options='{"speed":500,"autoplay":false,"pauseOnHover":true,"loop":false}'>
        <div class="swiper-container" >
          <div class="swiper-wrapper product-grid">
            
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="645" href="https://invitaciones.bodas.net/tarjetas-de-agradecimiento/aurora-tarjeta-de-agradecimiento-con-foto-645" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/cd4769426262ae6ab2c48812b27eaf51_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/cd4769426262ae6ab2c48812b27eaf51_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/cd4769426262ae6ab2c48812b27eaf51_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Tarjeta de agradecimiento con foto" title="Aurora - Tarjeta de agradecimiento con foto" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/tarjetas-de-agradecimiento/aurora-tarjeta-de-agradecimiento-con-foto-645">Aurora - Tarjeta de agradecimiento con foto</a></div>   
                    
        <div class="description">Romántica tarjeta de agradecimiento de la colección Aurora. Formato plegable con foto interior, ideal para enviar a los asistentes a la boda un bonito..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="645" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="645" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="645" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="645" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="645"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('645', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishlist-tooltip" data-placement="top" title="Agregar a la Lista de Deseos"  onclick="wishlist.add('645')"><span class="btn-text">Agregar a la Lista de Deseos</span></a>
                                          <a class="btn btn-compare"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid compare-tooltip" data-placement="top" title="Comparar este Producto"  onclick="compare.add('645')"><span class="btn-text">Comparar este Producto</span></a>
                          </div>
                      </div>
        </div>
        
                  <div class="extra-group">
            <div>
                              <a class="btn btn-extra btn-extra-46"
                                     onclick="cart.add('645', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val(), true);"                                      data-loading-text="<span class='btn-text'>Buy Now</span>">
                  <span class="btn-text">Buy Now</span>
                </a>
                              <a class="btn btn-extra btn-extra-93"
                                                        href="javascript:open_popup(22)"  data-product_id="645" data-product_url="https://invitaciones.bodas.net/tarjetas-de-agradecimiento/aurora-tarjeta-de-agradecimiento-con-foto-645"                   data-loading-text="<span class='btn-text'>Question</span>">
                  <span class="btn-text">Question</span>
                </a>
                          </div>
          </div>
              </div>
    </div>
  </div>
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="656" href="https://invitaciones.bodas.net/marcasitios-de-boda/aurora-marcasitios-656" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/213500ecdf36dcc3db522cca21388633_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/213500ecdf36dcc3db522cca21388633_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/213500ecdf36dcc3db522cca21388633_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Marcasitios" title="Aurora - Marcasitios" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/marcasitios-de-boda/aurora-marcasitios-656">Aurora - Marcasitios</a></div>   
                    
        <div class="description">Marcasitios con el que decir a los invitados de tu boda dónde sentarse durante el banquete. Este diseño de la colección Aurora presenta una inspiració..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="656" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="656" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="656" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="656" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="656"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('656', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishlist-tooltip" data-placement="top" title="Agregar a la Lista de Deseos"  onclick="wishlist.add('656')"><span class="btn-text">Agregar a la Lista de Deseos</span></a>
                                          <a class="btn btn-compare"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid compare-tooltip" data-placement="top" title="Comparar este Producto"  onclick="compare.add('656')"><span class="btn-text">Comparar este Producto</span></a>
                          </div>
                      </div>
        </div>
        
                  <div class="extra-group">
            <div>
                              <a class="btn btn-extra btn-extra-46"
                                     onclick="cart.add('656', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val(), true);"                                      data-loading-text="<span class='btn-text'>Buy Now</span>">
                  <span class="btn-text">Buy Now</span>
                </a>
                              <a class="btn btn-extra btn-extra-93"
                                                        href="javascript:open_popup(22)"  data-product_id="656" data-product_url="https://invitaciones.bodas.net/marcasitios-de-boda/aurora-marcasitios-656"                   data-loading-text="<span class='btn-text'>Question</span>">
                  <span class="btn-text">Question</span>
                </a>
                          </div>
          </div>
              </div>
    </div>
  </div>
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="660" href="https://invitaciones.bodas.net/numeros-de-mesa/aurora-set-de-meseros-nr.-1-10-660" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/c303d7049e92b76a978bedb724973503_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/c303d7049e92b76a978bedb724973503_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/c303d7049e92b76a978bedb724973503_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Set de meseros Nr. 1 - 10" title="Aurora - Set de meseros Nr. 1 - 10" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/numeros-de-mesa/aurora-set-de-meseros-nr.-1-10-660">Aurora - Set de meseros Nr. 1 - 10</a></div>   
                    
        <div class="description">Delicado set de números de mesa decorados con un diseño floral pintado en tonos rosas, salmón y verdes y un elegante rombo blanco colocado encima del ..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="660" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="660" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="660" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="660" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="660"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('660', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishlist-tooltip" data-placement="top" title="Agregar a la Lista de Deseos"  onclick="wishlist.add('660')"><span class="btn-text">Agregar a la Lista de Deseos</span></a>
                                          <a class="btn btn-compare"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid compare-tooltip" data-placement="top" title="Comparar este Producto"  onclick="compare.add('660')"><span class="btn-text">Comparar este Producto</span></a>
                          </div>
                      </div>
        </div>
        
                  <div class="extra-group">
            <div>
                              <a class="btn btn-extra btn-extra-46"
                                     onclick="cart.add('660', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val(), true);"                                      data-loading-text="<span class='btn-text'>Buy Now</span>">
                  <span class="btn-text">Buy Now</span>
                </a>
                              <a class="btn btn-extra btn-extra-93"
                                                        href="javascript:open_popup(22)"  data-product_id="660" data-product_url="https://invitaciones.bodas.net/numeros-de-mesa/aurora-set-de-meseros-nr.-1-10-660"                   data-loading-text="<span class='btn-text'>Question</span>">
                  <span class="btn-text">Question</span>
                </a>
                          </div>
          </div>
              </div>
    </div>
  </div>
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="658" href="https://invitaciones.bodas.net/save-the-date/aurora-tarjeta-save-the-date-vertical-658" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/759670103c649b933c50489b8135f764_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/759670103c649b933c50489b8135f764_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/759670103c649b933c50489b8135f764_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Tarjeta Save the Date (vertical)" title="Aurora - Tarjeta Save the Date (vertical)" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/save-the-date/aurora-tarjeta-save-the-date-vertical-658">Aurora - Tarjeta Save the Date (vertical)</a></div>   
                    
        <div class="description">Romántico save the date para compartir con los invitados y seres queridos la noticia de la boda. Diseño floral en la parte superior de la tarjeta dond..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="658" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="658" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="658" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="658" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
							<div class="pds">
											<a title="Aurora - Tarjeta Save the Date (cuadrada)" href="https://invitaciones.bodas.net/save-the-date/aurora-tarjeta-save-the-date-cuadrada-659"
							master-image="https://invitaciones.bodas.net/image/cache/catalog/product/759670103c649b933c50489b8135f764_0-300x240.png"
							rel=""
							class=""
						>
							<img src="https://invitaciones.bodas.net/image/catalog/icons-formate/10-quadrat-2s.svg" alt="Aurora - Tarjeta Save the Date (cuadrada)" />
						</a>
									</div>
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="658"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('658', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishlist-tooltip" data-placement="top" title="Agregar a la Lista de Deseos"  onclick="wishlist.add('658')"><span class="btn-text">Agregar a la Lista de Deseos</span></a>
                                          <a class="btn btn-compare"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid compare-tooltip" data-placement="top" title="Comparar este Producto"  onclick="compare.add('658')"><span class="btn-text">Comparar este Producto</span></a>
                          </div>
                      </div>
        </div>
        
                  <div class="extra-group">
            <div>
                              <a class="btn btn-extra btn-extra-46"
                                     onclick="cart.add('658', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val(), true);"                                      data-loading-text="<span class='btn-text'>Buy Now</span>">
                  <span class="btn-text">Buy Now</span>
                </a>
                              <a class="btn btn-extra btn-extra-93"
                                                        href="javascript:open_popup(22)"  data-product_id="658" data-product_url="https://invitaciones.bodas.net/save-the-date/aurora-tarjeta-save-the-date-vertical-658"                   data-loading-text="<span class='btn-text'>Question</span>">
                  <span class="btn-text">Question</span>
                </a>
                          </div>
          </div>
              </div>
    </div>
  </div>
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="655" href="https://invitaciones.bodas.net/menu-de-boda/aurora-minuta-dl-655" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/6530c764fe7c6befda1679fe9f7a6578_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/6530c764fe7c6befda1679fe9f7a6578_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/6530c764fe7c6befda1679fe9f7a6578_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Minuta (DL)" title="Aurora - Minuta (DL)" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/menu-de-boda/aurora-minuta-dl-655">Aurora - Minuta (DL)</a></div>   
                    
        <div class="description">..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="655" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="655" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="655" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="655" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="655"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('655', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishlist-tooltip" data-placement="top" title="Agregar a la Lista de Deseos"  onclick="wishlist.add('655')"><span class="btn-text">Agregar a la Lista de Deseos</span></a>
                                          <a class="btn btn-compare"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid compare-tooltip" data-placement="top" title="Comparar este Producto"  onclick="compare.add('655')"><span class="btn-text">Comparar este Producto</span></a>
                          </div>
                      </div>
        </div>
        
                  <div class="extra-group">
            <div>
                              <a class="btn btn-extra btn-extra-46"
                                     onclick="cart.add('655', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val(), true);"                                      data-loading-text="<span class='btn-text'>Buy Now</span>">
                  <span class="btn-text">Buy Now</span>
                </a>
                              <a class="btn btn-extra btn-extra-93"
                                                        href="javascript:open_popup(22)"  data-product_id="655" data-product_url="https://invitaciones.bodas.net/menu-de-boda/aurora-minuta-dl-655"                   data-loading-text="<span class='btn-text'>Question</span>">
                  <span class="btn-text">Question</span>
                </a>
                          </div>
          </div>
              </div>
    </div>
  </div>
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="654" href="https://invitaciones.bodas.net/misal-de-bodas/aurora-misal-de-boda-654" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/2b090daed2aa4fc04c8f9e7ed7a0112e_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/2b090daed2aa4fc04c8f9e7ed7a0112e_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/2b090daed2aa4fc04c8f9e7ed7a0112e_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Misal de boda" title="Aurora - Misal de boda" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/misal-de-bodas/aurora-misal-de-boda-654">Aurora - Misal de boda</a></div>   
                    
        <div class="description">..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="654" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="654" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="654" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="654" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="654"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('654', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishlist-tooltip" data-placement="top" title="Agregar a la Lista de Deseos"  onclick="wishlist.add('654')"><span class="btn-text">Agregar a la Lista de Deseos</span></a>
                                          <a class="btn btn-compare"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid compare-tooltip" data-placement="top" title="Comparar este Producto"  onclick="compare.add('654')"><span class="btn-text">Comparar este Producto</span></a>
                          </div>
                      </div>
        </div>
        
                  <div class="extra-group">
            <div>
                              <a class="btn btn-extra btn-extra-46"
                                     onclick="cart.add('654', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val(), true);"                                      data-loading-text="<span class='btn-text'>Buy Now</span>">
                  <span class="btn-text">Buy Now</span>
                </a>
                              <a class="btn btn-extra btn-extra-93"
                                                        href="javascript:open_popup(22)"  data-product_id="654" data-product_url="https://invitaciones.bodas.net/misal-de-bodas/aurora-misal-de-boda-654"                   data-loading-text="<span class='btn-text'>Question</span>">
                  <span class="btn-text">Question</span>
                </a>
                          </div>
          </div>
              </div>
    </div>
  </div>
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="641" href="https://invitaciones.bodas.net/etiquetas-de-direccion/aurora-etiqueta-de-direccion-641" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/28ea2ac2e4d28b3a7623ef625dfdbf35_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/28ea2ac2e4d28b3a7623ef625dfdbf35_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/28ea2ac2e4d28b3a7623ef625dfdbf35_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Etiqueta de dirección" title="Aurora - Etiqueta de dirección" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/etiquetas-de-direccion/aurora-etiqueta-de-direccion-641">Aurora - Etiqueta de dirección</a></div>   
                    
        <div class="description">..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="641" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="641" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="641" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="641" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="641"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('641', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishlist-tooltip" data-placement="top" title="Agregar a la Lista de Deseos"  onclick="wishlist.add('641')"><span class="btn-text">Agregar a la Lista de Deseos</span></a>
                                          <a class="btn btn-compare"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid compare-tooltip" data-placement="top" title="Comparar este Producto"  onclick="compare.add('641')"><span class="btn-text">Comparar este Producto</span></a>
                          </div>
                      </div>
        </div>
        
                  <div class="extra-group">
            <div>
                              <a class="btn btn-extra btn-extra-46"
                                     onclick="cart.add('641', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val(), true);"                                      data-loading-text="<span class='btn-text'>Buy Now</span>">
                  <span class="btn-text">Buy Now</span>
                </a>
                              <a class="btn btn-extra btn-extra-93"
                                                        href="javascript:open_popup(22)"  data-product_id="641" data-product_url="https://invitaciones.bodas.net/etiquetas-de-direccion/aurora-etiqueta-de-direccion-641"                   data-loading-text="<span class='btn-text'>Question</span>">
                  <span class="btn-text">Question</span>
                </a>
                          </div>
          </div>
              </div>
    </div>
  </div>
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="643" href="https://invitaciones.bodas.net/tarjetas-de-confirmacion/aurora-tarjeta-de-confirmacion-horizontal-643" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/d7413cfde36832ba799be84a03345d6e_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/d7413cfde36832ba799be84a03345d6e_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/d7413cfde36832ba799be84a03345d6e_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Tarjeta de confirmación (horizontal)" title="Aurora - Tarjeta de confirmación (horizontal)" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/tarjetas-de-confirmacion/aurora-tarjeta-de-confirmacion-horizontal-643">Aurora - Tarjeta de confirmación (horizontal)</a></div>   
                    
        <div class="description">..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="643" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #f1eaea;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="643" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="643" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="3" data-product_id="643" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="643" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="643"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('643', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishlist-tooltip" data-placement="top" title="Agregar a la Lista de Deseos"  onclick="wishlist.add('643')"><span class="btn-text">Agregar a la Lista de Deseos</span></a>
                                          <a class="btn btn-compare"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid compare-tooltip" data-placement="top" title="Comparar este Producto"  onclick="compare.add('643')"><span class="btn-text">Comparar este Producto</span></a>
                          </div>
                      </div>
        </div>
        
                  <div class="extra-group">
            <div>
                              <a class="btn btn-extra btn-extra-46"
                                     onclick="cart.add('643', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val(), true);"                                      data-loading-text="<span class='btn-text'>Buy Now</span>">
                  <span class="btn-text">Buy Now</span>
                </a>
                              <a class="btn btn-extra btn-extra-93"
                                                        href="javascript:open_popup(22)"  data-product_id="643" data-product_url="https://invitaciones.bodas.net/tarjetas-de-confirmacion/aurora-tarjeta-de-confirmacion-horizontal-643"                   data-loading-text="<span class='btn-text'>Question</span>">
                  <span class="btn-text">Question</span>
                </a>
                          </div>
          </div>
              </div>
    </div>
  </div>
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="653" href="https://invitaciones.bodas.net/tarjeta-lista-de-boda/aurora-tarjeta-lista-de-boda-653" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/a8d9fa383cba3c02eab08d5b8254cbd9_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/a8d9fa383cba3c02eab08d5b8254cbd9_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/a8d9fa383cba3c02eab08d5b8254cbd9_0-600x480.png 2x"  width="300" height="240" alt="Aurora - Tarjeta lista de boda" title="Aurora - Tarjeta lista de boda" class="img-responsive img-first "/>
            
                      </div>
        </a>

        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/tarjeta-lista-de-boda/aurora-tarjeta-lista-de-boda-653">Aurora - Tarjeta lista de boda</a></div>   
                    
        <div class="description">..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="653" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ee7173;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="653" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #90a483;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="653" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
          </div>
                        <div class="rating no-rating rating-hover">
            <div class="rating-stars">
                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                                                <span class="fa fa-stack"><i class="fa fa-star-o fa-stack-2x"></i></span>
                                          </div>
          </div>
        
                <div class="buttons-wrapper">
          <div class="button-group">
                      <button data-product_id="653" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="653"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('653', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="module-products-310 module-products-grid wishli