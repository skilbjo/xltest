$(document).ready(function() {
	$("#editForm").on('submit', function(e) {
		e.preventDefault();
		var data = $('#editForm').serialize();
		$.ajax({
			type: 'PUT',
			url: '/merchants/1',
			timeout: 3000,
			data: data,
			success: function() {
				$(location).attr('href', '/merchants/' + $( "#merchant_id").val() );
			},
			error: function(data) {
				console.log(data);
			}
		});
	});
});