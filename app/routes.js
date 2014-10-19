module.exports = function(app
	, model
	, controller
	) {

// static routes ===================
  app.route('/')
  	.get( controller.static_pages.index )
  	.post(function(req, res) { res.json({ message: 'Sorry, no post path to /'}); });

// TRANSACTIONS ======================
  // RESTful API ==================
  app.route('/transactions')
    .get(function(req, res) { controller.transaction.index(req, res, model); })
   	.post(function(req, res) { controller.transaction.create(req, res, model); });

   app.route('/transactions/:id([0-9]+)')
   	.get(function(req, res) { controller.transaction.show(req, res, model); })
   	.put(function(req, res) { res.json({ message: 'Sorry, no update path'}); })
   	.delete(function(req, res) { controller.transaction.destroy(req, res, model); });

  app.route('/transactions/new')
  	.get(function(req, res) { controller.transaction.new(req, res); });

   app.route('/transactions/:id([0-9]+)/edit')
   	.get(function(req, res) { res.json({ message: 'Sorry, no edit path.'}); });

};
