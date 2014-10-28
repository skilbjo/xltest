$(document).ready(function() {
	// format & restrict input options for payment fields
	$('input.cc-number').payment('restrictNumeric');
	$('input.cc-cvc').payment('restrictNumeric');
	$('input.cc-number').payment('formatCardNumber');
	$('input.cc-cvc').payment('formatCardCVC');

// Validate info on the client side
	var stripeValidateForm = function() {  // refactor valid into a switch statement
		var 
			cardType = $.payment.cardType($('.cc-number').val())
			, valid = ( ($.payment.validateCardNumber($('input.cc-number').val()) )  && ( $.payment.validateCardCVC($('input.cc-cvc').val(), cardType) )  && (true) );

			if (!valid) {
				$('.cc-number').toggleInputError(!$.payment.validateCardNumber($('.cc-number').val()));
				// $('.cc-exp').toggleInputError(!$.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal')));
				$('.cc-cvc').toggleInputError(!$.payment.validateCardCVC($('.cc-cvc').val(), cardType));
	/* fix */			$('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success'); // fix this
			} else if (valid) {
				$('.cc-brand').text(cardType);
				$('.validation').removeClass('text-danger text-success');
			}
		return valid;
	};

// jQuery function that adds the error class
	$.fn.toggleInputError = function(err) {
		this.parent('.form-group').toggleClass('has-error', err);
		return this;
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
			// if (stripeValidateForm()) {
				if (stripeValidateForm()) {
					var $form = $(this);
					// Disable the submit button to prevent repeated clicks
					$form.find('button').prop('disabled', true);
					Stripe.card.createToken($form, stripeResponseHandler);
					return false;
				}
			// }
		});
	});

});