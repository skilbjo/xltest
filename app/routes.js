module.exports = function(app
	, model
	, controller
	) {

// Static Routes ==================
  app.route('/')
  	.get( controller.static_pages.index );

// Purchases ======================
  // RESTful API ==================
  app.route('/purchase')
    .get(function(req, res) { controller.purchase.new(req, res, model); })
   	.post(function(req, res) { controller.purchase.create(req, res, model); });

  app.route('/purchase/thanks/:id([0-9]+)')
    .get(function(req, res) { controller.purchase.thanks(req, res, model); });

};
