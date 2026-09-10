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
                <a data-c-product_id="1666" href="https://invitaciones.bodas.net/menu-de-boda/fiore-minuta-dl-1666" class="product-img ">
          <div>
                          <img src="https://invitaciones.bodas.net/image/cache/catalog/product/d7540f1029759bfa1b332c4a1cdbbfef_0-300x240.png" srcset="https://invitaciones.bodas.net/image/cache/catalog/product/d7540f1029759bfa1b332c4a1cdbbfef_0-300x240.png 1x, https://invitaciones.bodas.net/image/cache/catalog/product/d7540f1029759bfa1b332c4a1cdbbfef_0-600x480.png 2x"  width="300" height="240" alt="Fiore - Minuta (DL)" title="Fiore - Minuta (DL)" class="img-responsive img-first folie folie_gold"/>
            
                      </div>
        </a>

                  <div class="product-labels">
                          <span class="product-label product-label-303 product-label-default"><b>Brillo</b></span>
                      </div>
        
              </div>

      <div class="caption">
        
                  <div class="name"><a href="https://invitaciones.bodas.net/menu-de-boda/fiore-minuta-dl-1666">Fiore - Minuta (DL)</a></div>   
                    
        <div class="description">..</div>

                  <div class="price">
                          <span class="price-normal">1.34€</span>
                                      <span class="price-tax">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a>1.11€</span>
                      </div>
                        <div class="pds" style="padding-top: 10px;">
          <div data-id="0" data-product_id="1666" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #ffffff;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="1" data-product_id="1666" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background-image: url('/image/kraft2.jpg');border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="2" data-product_id="1666" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #18243f;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="3" data-product_id="1666" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #f0f0e4;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="4" data-product_id="1666" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #f4dae0;border: 1px solid #D9D9D9;border-radius: 8px;"></div><div data-id="5" data-product_id="1666" class="swatch-icon" style="margin: 4px;display: inline-block;width: 16px;height: 16px;background: #808080;border: 1px solid #D9D9D9;border-radius: 8px;"></div> 
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
                      <button data-product_id="1666" class="btn btn-warning btn-block button btn-open-product">Ver detalle</button>
                           <!--BOF Product Series-->
			                        <div class="cart-group">
              <div class="stepper">
                              <input type="text" name="quantity" value="1" data-minimum="1" class="form-control"/>
               
                <input type="hidden" name="product_id" value="1666"/>
                <span>
                <i class="fa fa-angle-up"></i>
                <i class="fa fa-angle-down"></i>
              </span>
              </div>
              <a class="btn btn-cart"  onclick="cart.add('1666', $(this).closest('.product-thumb').find('.button-group input[name=\'quantity\']').val());" data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>"><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
            </div>
            
                        <div class="wish-group">
                            <a class="btn btn-wishlist"  data-toggle="tooltip" data-tooltip-class="mo