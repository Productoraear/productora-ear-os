ice Per Item:</strong> " + quantity_per_items[$(this).val()]);
                                                            }).change();
        });
    //--></script>
                        <input id="product-id" type="hidden" name="product_id" value="705" />

                          
                  </div>
                </div>
                <div class="col-sm-6 price-col-6">
                <div class="price-wrapper">
                  <div class="price-group">
                                        <div class="product-price">3.71€</div>
                                      </div>
                                    <div class="product-tax-info">incl. IVA , excl. <a class="agree" data-info="8">gastos de envío</a></div>
                                    
                                  </div>
                </div>
              </div>            
              
              <a id="button-cart" style="display:none;" 
             data-loading-text="<span class='btn-text'>&nbsp;&nbsp; Comprar</span>" class="btn btn-cart" ><span class="btn-text">&nbsp;&nbsp; Comprar</span></a>
              
                              <div class="extra-group">
                                  <a class="btn btn-extra btn-extra-46 btn-1-extra"  data-quick-buy  data-loading-text="<span class='btn-text'>Buy Now</span>"><span class="btn-text">Buy Now</span></a>
                                  <a class="btn btn-extra btn-extra-93 btn-2-extra"   href="javascript:open_popup(22)"  data-product_id="705" data-loading-text="<span class='btn-text'>Question</span>"><span class="btn-text">Question</span></a>
                                </div>
                          </div>

           <div style="margin-top: 4px;padding-top: 8px;border: 0px;border-top-width: 1px;border-style: solid;border-color: rgba(226, 226, 226, 1);"><b>Descripción: </b><br><br><p><span style="font-family: Arial; font-size: 13px; white-space: pre-wrap;">Explosión floral en esta elegante invitación de boda con inserto de 15x10 centímetros aproximadamente. Exterior en azul intenso que contrasta con los motivos botánicos en fucsia y naranja. Interior con fondo blanco y motivo que destaca en el margen inferior derecho que se complementa con la tarjeta también en color azul intenso y tipografía blanca. Posibilidad de elegir el acabado del papel, disponible en blanco, perla, lino, estructurado o nature.</span><br></p></div><div class="product-attributes"><b>Dimensiones (ancho x alto):</b> 110x155 mm<br><b>Tiempo de producción:</b> Entre 5-6 días hábiles (aprox.) + tiempo de envío</div>          
                                                </div>
          </div>
                                                        </div>
                                          </div>
      </div>
                                          </div>
    </div>
</div>

			<script type="text/javascript">
				dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
				dataLayer.push({
					event: "view_item",
					ecommerce: {"currency":"EUR","value":3.71,"items":[{"price":3.71,"item_id":"705","item_name":"Blooming Botanical - Invitaci\u00f3n de boda con inserto","item_category":"Invitaciones de boda","item_category1":"Sets de Invitaci\u00f3n de boda","item_category2":"Blooming Botanical"}]}				});
				
			</script>		
			
<script type="text/javascript"><!--

              $('#sample-order').click(function(){
                if($(this).parents('.sample').length == 1){
                  $('#designer-order').click();
                }else{
                    $('.product-right').addClass('sample');
                    $('#pp_customize_design_btn').click();
                    $('#quantity-set').val($("#quantity-set option:first").val());
                }            
              });
              $('#pp_customize_design_btn').click(function(){
                $('.product-right').removeClass('sample');
              });
          

				var pocketfold = `Tarjeta plegable con inserto`;

				if(pocketfold != "false"){
					if(pocketfold != "Pocketfold B6"){
						$('div[rel="18"] .color-option').click(function(){
							
							var pocketsize = "q";
							if(pocketfold.toLowerCase().includes("b6")){
								pocketsize = "b6";
							}

							if(typeof $("option[value='" + $(this).attr('optval') + "']").attr('src') != "undefined" && $("option[value='" + $(this).attr('optval') + "']").attr('src') !== "NA"){
								return;
							}
	
							switch($(this).data("option-value-id")) {
								case 78:
									$('.product-image .swiper-slide-active').addClass('pocketfold schiefer'+pocketsize ).removeClass('weiss'+pocketsize+' champagner'+pocketsize+' kraft'+pocketsize+' hortensie'+pocketsize);							
									break;
								case 80:
									$('.product-image .swiper-slide-active').addClass('pocketfold weiss'+pocketsize).removeClass('schiefer'+pocketsize+' champagner'+pocketsize+' hortensie'+pocketsize+' kraft'+pocketsize);							
									break;
								case 81:
									$('.product-image .swiper-slide-active').addClass('pocketfold 