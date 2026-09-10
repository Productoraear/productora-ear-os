-
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

  $('#review').load('index.php?route=product/product/review&product_id=1513');

  $('#button-review').on('click', function() {
    $.ajax({
      url: 'index.php?route=product/product/write&product_id=1513',
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
<script type="application/ld+json">{"@context":"http:\/\/schema.org","@type":"WebSite","url":"https:\/\/invitaciones.bodas.net\/","name":"Invitaciones Bodas.net","description":"","potentialAction":{"@type":"SearchAction","target":"https:\/\/invitaciones.bodas.net\/index.php?route=product\/search&amp;search={search}","que