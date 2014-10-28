var 
  stripe          = require('stripe')(process.env.STRIPE_TEST_SECRET)
  , path          = require('path')
  , filepath      = path.join(__dirname, '/../../public/assets/xltest/xltest.xlsx')
  , email         = require('emailjs')
  , server        = email.server.connect({ user: process.env.GMAIL_USER , password: process.env.GMAIL_PASS, host: 'smtp.gmail.com', ssl: true});

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
  stripe.charges.create({
    amount: 100
    , currency: "usd"
    , card: req.body.stripeToken
    , description: "xltest"
  }, function(err, charge) {
      if(err || !charge) {
        res.json(err); return;
      } else {
        saveTxn(charge);
      }
    }
  );

  var saveTxn = function(charge) {
    model.transaction
      .create({ 
        Amount: (charge.amount / 100)
        , StripeId: charge.id
        , CardId: charge.card.id
        , Network: charge.card.brand
        , CardType: charge.card.funding
        , UserName: req.body.name
        , UserEmail: req.body.email
      })
      .complete(function(err, transaction) {
        if(err || !transaction) {
          res.json(err); return;
        } else {
          res.json({ status: 
                      {message: 'Thanks for your purchase!, check ' + req.body.email + ' for your xltest!'}
                   , details: 
                      { transaction: transaction }
                  });
          sendEmail();
        }
      });
  };

  var sendEmail = function () {
    var message = {
      from: 'John <skilbjo@gmail.com>'
      , to: req.body.email
      , subject: 'Thanks for purchasing!'
      , text: 'Hi, Thanks for purchasing your XL Test! Attached is your copy!'
      , attachment: [
          { path: filepath
            , name: 'XL Test.xlsx'
            , type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
      ]
    };

    server.send(message, function(err, response) { console.log(err || message); });
  };

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