oxSrc);
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
                              <a href="#products-67698902b5613-tab-1" data-toggle="tab">Más de esta serie</a>
                          </li>
                    </ul>
        <div class="tab-content">
                                    <div class="module-item module-item-1 tab-pane active" id="products-67698902b5613-tab-1">
                      <div class="swiper" data-items-per-row='{"c0":{"0":{"items":4,"spacing":24},"1024":{"items":3,"spacing":10},"760":{"items":1,"spacing":10}},"c1":{"0":{"items":4,"spacing":24},"760":{"items":1,"spacing":10}},"c2":{"0":{"items":1,"spacing":0}},"sc":{"0":{"items":1,"spacing":0}}}' data-options='{"speed":500,"autoplay":false,"pauseOnHover":true,"loop":false}'>
        <div class="swiper-container" >
          <div class="swiper-wrapper product-grid">
            
    <div class="product-layout swiper-slide has-extra-button">
    <div class="product-thumb">
            <div class="image">
                <a data-c-product_id="897" href="https://invitaciones.bodas.net/tarjetas-de-confirmacion/hearts-tarjeta-de-confirmacion-horizontal-897" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/3834133341a358165457bd3152e86b2b_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/3834133341a358165457bd3152e86b2b_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/3834133341a358165457bd3152e86b2b_0-600x480.png 2x"  width="300" height="240" alt="Hearts - Tarjeta de confirmación (horizontal)" title="Hearts - Tarjeta de confirmación (horizontal)" class="img-responsive img-first folie folie_gold"/>
            
                      </div>
        </a>

                  <div class="product-labels">
                          <span class="product-label product-label-303 product-label-default"><b>Brillo</b></span>
                      </div>
        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/tarjetas-de-confirmacion/hearts-tarjeta-de-confirmacion-horizontal-897">Hearts - Tarjeta de confirmación (horizontal)</a></div>   
                    
        <div class="description">..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
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
                      <button data-product_id="897" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="897"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('897', $(this).closest('.pr