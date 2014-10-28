$(document).ready(function() {
	$('[data-number]').payment('restrictNumeric');
	$('input.cc-number').payment('formatCardNumber');
	// $('input.cc-exp').payment('formatCardExpiry');
	$('input.cc-cvc').payment('formatCardCVC');

// Validate info on the client side
	var stripeValidateForm = function() {
		var valid = function() {
			if ($.payment.validateCardNumber($('input.cc-num').val())) {
				return true;
			} else {
				return false;
			}
		};

		alert(valid());

		if (!valid()) {
			return false;
		}

		// var cardType = $.payment.cardType($('.cc-number').val());
		// $('.cc-number').toggleInputError(!$.payment.validateCardNumber($('.cc-number').val()));
		// $('.cc-exp').toggleInputError(!$.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal')));
		// $('.cc-cvc').toggleInputError(!$.payment.validateCardCVC($('.cc-cvc').val(), cardType));
		// // $('.cc-brand').text(cardType);
		// $('.validation').removeClass('text-danger text-success');
		// $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');
	};

// jQuery function that adds the error class
	// $.fn.toggleInputError = function(err) {
	// 	this.parent('.form-group').toggleClass('has-error', err);
	// 	return this;
	// };

// Get Stripe Key
	Stripe.setPublishableKey('pk_test_Bs8ajQXtiMr40QWaR7BthKK4');
	 var stripeResponseHandler = function(status, response) {
		 var $form = $('#payment-form');
		 if (response.error) {
			 // Show the errors on the form
			 $form.find('.payment-errors').text(response.error.message);
			 $form.find('button').prop('disabled', false);
		 } else {
			 var token = response.id;
			 // Insert the token into the form so it gets submitted to the server
			 $form.append($('<input type="hidden" name="stripeToken" />').val(token));
			 // and re-submit
			 $form.get(0).submit();
		 }
	 };

// Submit the form
	 jQuery(function($) {
		$('#payment-form').submit(function(e) {
			e.preventDefault();
			// if (stripeValidateForm()) {
				stripeValidateForm();
				var $form = $(this);
				// Disable the submit button to prevent repeated clicks
				$form.find('button').prop('disabled', true);
				Stripe.card.createToken($form, stripeResponseHandler);
				// Prevent the form from submitting with the default action
				return false;
			// }
		});
	});






});