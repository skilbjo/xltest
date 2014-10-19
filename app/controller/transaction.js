var stripe   = require('stripe')(process.env.STRIPE_TEST_SECRET);

// GET, /transactions, index
exports.index = function(req, res, model) {
  model.transaction.findAll().success(function(transactions) {
    res.json(transactions);
  });
};

// GET, /transactions/new, new
exports.new = function(req, res) {
  res.render('transaction/new');
};

// POST, /transactions, create
exports.create = function(req, res, model) {
  //  || req.param('id'); // this is correct 

  stripe.charges.create({
    amount: 100
    , currency: "usd"
    , card: req.body.stripeToken
    , description: "txn"
  }, function(err, charge) {
      if(err || !charge) {
        res.json(err); return;
      } else {
        console.log(charge);
        model.transaction
          .create({ 
            Amount: (charge.amount / 100)
            , MerchantId: 1
            , StripeId: charge.id
            , CardId: charge.card.id
            , Network: charge.card.brand
            , CardType: charge.card.funding
          })
          .complete(function(err, transaction) {
            if(err || !transaction) {
              res.json(err); return;
            } else {
              res.json(transaction);
            }
          });
      }
    }
  );
};

// GET, /merchants/:id, show
exports.show = function(req, res, model) {
  model.transaction
  .find({ where: { TransactionId: req.params.id } })
  .complete(function(err, transaction) {
    if(err || !transaction) {
      res.json(err); return;
    } else {
      res.json(transaction);
    }
  });
};  


// // GET, /transactions/:id/edit
// exports.edit = function(req, res, model) {
//   model.merchant
//   .find({ where: { MerchantId: req.params.id } })
//   .complete(function(err, merchant) {
//     if(err || !merchant) {
//       res.json(err); return;
//     } else {
//       console.log(merchant.Name);
//       res.render('merchant/edit', { 
//         merchantId: merchant.MerchantId,
//         merchantName: merchant.Name
//       });
//     }
//   });
// };

// // PUT, /transactions/:id, update
// exports.update = function(req, res, model) {
//   model.merchant
//   .find({ where: { MerchantId: req.body.merchant_id } })
//   .complete(function(err, merchant) {
//     if(err || !merchant) {
//       res.json(err); return;
//     } else {
//       merchant.set('Name', req.body.merchant_name);
//       merchant.save();
//       res.json(merchant);
//     }
//   });
// };

// // DELETE, /transactions/:id, destroy
// exports.destroy = function (req, res, model) {
//   model.merchant
//   .destroy({ MerchantId: req.params.id } )
//   .success(function() {
//       res.json({ message: 'Deleted' });
//   });
// };


// HTTP;  PATH;           METHOD;       DESCRIPTION
// GET    /users          index         list all users
// GET    /users/new      new           form to create new users
// POST   /users          create        process the new user form submission
// GET    /users/:id      show          show a user's profile
// GET    /users/:id/edit edit          form to edit user's profile
// PUT    /users/:id      update        process the user edit form submission
// DELETE /users/:id      destroy       deletes a user with :id