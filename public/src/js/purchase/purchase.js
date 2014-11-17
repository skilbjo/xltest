$(document).ready(function() {
// jQuery Payment Library to help client side restrictions
	$('input.cc-number').payment('restrictNumeric');
	$('input.cc-cvc').payment('restrictNumeric');
	$('input.cc-number').payment('formatCardNumber');
	$('input.cc-cvc').payment('formatCardCVC');
	$('input.cc-exp').payment('formatCardExpiry');

// jQuery function that adds the error class
	$.fn.toggleInputError = function(err) {
		this.parentsUntil('.form-group').toggleClass('has-error', err);
		return this;
	};

// Validate info on the client side
	var stripeValidateForm = function() {
		var 
			valid
			, cardType = $.payment.cardType($('.cc-number').val())
			, ccValid = $.payment.validateCardNumber($('input.cc-number').val())
			, cvcValid = $.payment.validateCardCVC($('input.cc-cvc').val(), cardType)
			, ccExpiryValid = $.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal'));

			$('.cc-brand').text(cardType);

			switch (ccValid && cvcValid && ccExpiryValid) {
				case true:
					valid = true;
					$('.validation').removeClass('text-danger text-success');
					$('.validation').addClass('has-error text-success');
					break;

				default:
					valid = false;
					$('.cc-number').toggleInputError(!$.payment.validateCardNumber($('.cc-number').val()));
					$('.cc-exp').toggleInputError(!$.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal')));
					$('.cc-cvc').toggleInputError(!$.payment.validateCardCVC($('.cc-cvc').val(), cardType));
					$('.validation').addClass('has-error text-danger'); 
					break;
			}

		return valid;
	};

// Get Stripe Key
	Stripe.setPublishableKey('pk_test_Bs8ajQXtiMr40QWaR7BthKK4');
	 var stripeResponseHandler = function(status, response) {
		 var $form = $('#payment-form');
		 if (response.error) {
			 // Show the errors on the form
			 $form.find('.payment-errors').text(response.error.message);
			 $form.find('button').prop('disabled', false);
		 } else {
			 $form.append($('<input type="hidden" name="stripeToken" />').val(response.id));
			 $form.get(0).submit();
		 }
	 };

// Submit the form
	 jQuery(function($) {
		$('#payment-form').submit(function(e) {
			e.preventDefault();
				if (stripeValidateForm()) {
					var $form = $(this);
					// Disable the submit button to prevent repeated clicks
					$form.find('button').prop('disabled', true);
					Stripe.card.createToken({
						number: $('.cc-number').val()
						, cvc: $('.cc-cvc').val()
						, exp_month: $.trim($('.cc-exp').val().split('/')[0])
						, exp_year: $.trim($('.cc-exp').val().split('/')[1])
					}, stripeResponseHandler);
					return false;
				}
		});
	});

});