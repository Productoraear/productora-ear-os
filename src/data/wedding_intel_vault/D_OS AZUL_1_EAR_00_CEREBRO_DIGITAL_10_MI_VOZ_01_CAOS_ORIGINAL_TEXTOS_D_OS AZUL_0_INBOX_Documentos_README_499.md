oduct-options input[type=\'hidden\'], #product .product-options input[type=\'radio\']:checked, #product .product-options input[type=\'checkbox\']:checked, #product .product-options select, #product .product-options textarea, ' +
      '#product select[name="recurring_id"]'
    ),
    dataType: 'json',
    beforeSend: function () {
      $('#button-cart').button('loading');
    },
    complete: function () {
      $('#button-cart').button('reset');
    },
    success: function (json) {

				dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
				dataLayer.push({
					event: "add_to_cart",
					ecommerce: json['gdata']
				});	
			
			
      $('.alert-dismissible, .text-danger').remove();
      $('.form-group').removeClass('has-error');

      if (json['error']) {
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
      }

      if (json['success']) {
        if ($('html').hasClass('popup-options')) {
          parent.$(".popup-options .popup-close").trigger('click');
        }

        if (json['notification']) {
          parent.show_notification(json['notification']);
        } else {
          parent.$('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
        }

        parent.$('#cart-total').html(json['total']);
        parent.$('#cart-items,.cart-badge').html(json['items_count']);

        if (json['items_count']) {
          parent.$('#cart-items,.cart-badge').removeClass('count-zero');
        } else {
          parent.$('#cart-items,.cart-badge').addClass('count-zero');
        }

        if (Journal['scrollToTop']) {
          parent.$('html, body').animate({ scrollTop: 0 }, 'slow');
        }

        parent.$('.cart-content ul').load('index.php?route=common/cart/info ul li');

        if (window.location.href.indexOf('quick_buy=true') !== -1) {
          parent.location.href = Journal['checkoutUrl'];
        }

        if ($btn.data('quick-buy') !== undefined) {
          location = Journal['checkoutUrl'];
        }

        if (parent.window['_QuickCheckout']) {
          parent.window['_QuickCheckout'].save();
        }

        if (json['redirect']) {
          parent.location.href = json['redirect'];
        }
	
				if (typeof fbq !== 'undefined') {
					let fprice = $('.product-price').html().replace('€','');
					fbq('track', 'AddToCart', {value: fprice, content_ids: ['1657'], content_category: "Invitations"});
				}
			
       parent.location.href = "/cart";
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      alert(thrownError + '\r\n' + xhr.statusText + '\r\n' + xhr.responseText);
    }
  });
});
//--></script>
<script type="text/javascript"><!--
$('.date').datetimepicker({
	pickTime: false
});

$('.datetime').datetimepicker({
	pickDate: true,
	pickTime: true
});

$('.time').datetimepicker({
	pickDate: false
});

$('button[id^=\'button-upload\']').on('click', function() {
	var node = this;

	$('#form-upload').remove();

	$('body').prepend('<form enctype="multipart/form-data" id="form-upload" style="display: none;"><input type="file" name="file" /></form>');

	$('#form-upload input[name=\'file\']').trigger('click');

	if (typeof timer != 'undefined') {
    	clearInterval(timer);
	}

	timer = setInterval(function() {
		if ($('#form-upload input[name=\'file\']').val() != '') {
			clearInterval(timer);

			$.ajax({
				url: 'index.php?route=tool/upload',
				type: 'post',
				dataType: 'json',
				data: new FormData($('#form-upload')[0]),
				cache: false,
				contentType: false,
				processData: false,
				beforeSend: function() {
					$(node).button('loading');
				},
				complete: function() {
					$(node).button('reset');
				},
				success: function(json) {
					$('.text-danger').remove();

					if (json['error']) {
						$(node).parent().find('input').after('<div class="text-danger">' + json['error'] + '</div>');
					}

					if (json['success']) {
						alert(json['success']);

						$(node).parent().find('input').val(json['code']);
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			});
		}
	}, 500);
});
//--></script>
<script type="text/javascript"><!--
$(function () {
  $('#review').delegate('.pagination a', 'click', function(e) {
    e.preventDefault();

    $('#review').fadeOut('slow');

    $('#review').load(this.href);

    $('#review').fadeIn('slow');
  });

  $('#review').load('index.php?route=product/product/review&product_id=1657');

  $('#button-review').on('click', function() {
    $.ajax({
      url: 'index.php?route=product/product/write&product_id=1657',
      type: 'post',
      dataType: 'json',
      data: $("#form-review").serialize(),
      beforeSend: function() {
        $('#button-review').button('loading');
      },
      complete: function() {
        $('#button-review').button('reset');
      },
      success: function(json) {
        $('.alert-success, .alert-danger').remove();

        if (json['error']) {
          $('#review').after('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> ' + json['error'] + '</div>');
        }

        if (json['success']) {
          $('#review').after('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + json['success'] + '</div>');

          $('input[name=\'name\']').val('');
          $('textarea[name=\'text\']').val('');
          $('input[name=\'rating\']:checked').prop('checked', false);
        }
      }
    });
  });
});


                $('.imageselect-select').click(function(){
                    $('.imageselect-options[data-option="' + $(this).data('option') + '"]').toggle();
                    $(this).parents('.stepper').toggleClass("active");
                });
                $('.imageselect-options > li').click(function(){
                    let option_id = $(this).parents('.imageselect-options').data('option');
                    $('#inputoption' + option_id).val($(this).val()).change(); 
                     
                    $('.imageselect-select[data-option="' + option_id + '"] > a').html($('#' + $(this).val() + '_text').html().trim());
                    $('.imageselect-options[data-option="' + $(this).parents('.imageselect-options').data('option') + '"]').hide();
                     $('.product-option-select .stepper').removeClass("active");
                });
                $(document).click(function(event) { 
                    var $target = $(event.target);
                    if(!$target.closest('.imageselect-options').length && !$target.closest('.imageselect-select').length && 
                    $('.imageselect-options').is(":visible")) {
                        $('.imageselect-options').hide();
                        $('.product-option-select .stepper').removeClass("active");
                    }        
                });
            
$(document).ready(function() {

              $('.swatch-color').click(function(){
                let src = $('.product-info .swiper-slide img:first').attr('src').replace(/_.*-/,'_' + $(this).data('id') + '-');
                let srcset = $('.product-info .swiper-slide img:first').attr('srcset').replace(/_.*-/,'_' + $(this).data('id') + '-');
                let datalargeimg = $('.product-info .swiper-slide img:first').attr('data-largeimg').replace(/_.*-/,'_' + $(this).data('id') + '-');
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
<script type="application/ld+json">{"@context":"http:\/\/schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"\/","name":"Inicio"}},{"@type":"ListItem","position":2,"item":{"@id":"https:\/\/invitaciones.bodas.net\/invitaciones-de-boda","name":"Invitaciones de boda"}},{"@type":"ListItem","position":3,"item":{"@id":"https:\/\/invitaciones.bodas.net\/invitaciones-de-boda\/fiore-invitacion-de-boda-vertical-1657","name":"Fiore - Invitaci\u00f3n de boda (vertical)"}}]}</script>
<script type="application/ld+json">{"@context":"http:\/\/schema.org\/","@type":"Product","name":"Fiore - Invitaci\u00f3n de boda (vertical)","image":"https:\/\/invitaciones.bodas.net\/image\/cache\/catalog\/product\/95cda3b9f5b0398a0999a2b1c8d8c474_0-1800x1440.png","description":"Vanguardista invitaci\u00f3n de boda en tama\u00f1o vertical donde resaltan dos hex\u00e1gonos brillantes que contienen el nombre de la pareja sobre dos conjuntos florales efecto acuarela en tonos rosas y verdes. Esta delicada invitaci\u00f3n est\u00e1 disponible, adem\u00e1s de en blanco, en tonos tan actuales como el azul navy","sku":"","mpn":"","offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.07","itemCondition":"http:\/\/schema.org\/NewCondition","availability":"http:\/\/schema.org\/InStock","seller":{"@type":"Organization","name":"Invitaciones Bodas.net"},"priceValidUntil":"2025-12-23","url":"https:\/\/invitaciones.bodas.net\/invitaciones-de-boda\/fiore-invitacion-de-boda-vertical-1657"},"brand":{"@type":"brand","name":"Herzkarten"}}</script>
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
							$('div[rel="19"] select[name="option[3457]"]').change(function() {	
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
                         