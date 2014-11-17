var 
  stripe          = require('stripe')(process.env.STRIPE_TEST_SECRET)
  , fs            = require('fs')
  , request       = require('request')
  , path          = require('path')
  , file          = process.env.FILE_PATH
  , streamWrite   = request(file).pipe(fs.createWriteStream('xltest.xlsx'))
  , streamRead    = fs.createReadStream(path.join(__dirname, 'xltest.xlsx'))
  , email         = require('emailjs')
  , server        = email.server.connect({ user: process.env.GMAIL_USER , password: process.env.GMAIL_PASS, host: 'smtp.gmail.com', ssl: true});

// GET, /purchase/history, index
exports.index = function(req, res, model) {
  model.purchase.findAll().success(function(purchases) {
    res.json(purchases);
  });
};

// GET, /purchase, new
exports.new = function(req, res) {
  res.render('purchase/purchase');
};

// POST, /puchase, create
exports.create = function(req, res, model) {
  stripe.charges.create({
    amount: 100
    , currency: 'usd'
    , card: req.body.stripeToken
    , description: 'xltest.io'
  }, function(err, charge) {
      if(err || !charge) {
        res.json(err); return;
      } else {
        saveTxn(charge);
      }
    }
  );

  var saveTxn = function(charge) {
    model.purchase
      .create({ 
        Amount: (charge.amount / 100)
        , StripeId: charge.id
        , CardId: charge.card.id
        , Network: charge.card.brand
        , CardType: charge.card.funding
        , UserName: req.body.name
        , UserEmail: req.body.email
      })
      .complete(function(err, purchase) {
        if(err || !purchase) {
          res.json(err); return;
        } else {
          res.json({ status: 
                      {message: 'Thanks for your purchase!, check ' + req.body.email + ' for your xltest!'}
                   , details: 
                      { transaction: purchase }
                  });
          sendEmail();
        }
      });
  };

  var sendEmail = function () {
    var message = {
      from: 'John <skilbjo@gmail.com>'
      , to: req.body.email
      , subject: 'Your XL TEST is inside - thanks for buying!'
      , text: 'Hi ' + req.body.name + ' , \n\n' +
              'Thanks for purchasing your XL TEST! Attached is your copy! \n\n' +
              'Need help? Send a tweet @skilbjo \n\n' +
              'Grading? Email me back your completed test!\n'
      , attachment: [
          {
            data: 
            '<html>' + 
              'Hi ' + req.body.name + ' , <br><br>' +
              'Thanks for purchasing your <b>XL TEST</b>! Attached is your copy! <br><br>' +
              'Need help? Send a tweet <a href="https://twitter.com/skilbjo">@skilbjo</a> <br><br>' +
              'Grading? Email me back your completed test! <br><br><br>' +
              'Thanks again for your interest in <b>XL TEST<b>! <br><br>' +
              ' - John' +
            '</html>'
            , alternative: true
          },
          { stream: streamRead
            , name: 'XLTEST.xlsx'
            , type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
      ]
    };

    streamRead.pause();

    // setTimeout(function() {
      server.send(message, function(err, response) { 
        console.log(err || message || response); 
      });
    // }, 3000);
  };

};

// GET, /purchase/:id, show
exports.show = function(req, res, model) {
  model.purchase
  .find({ where: { PurchaseId: req.params.id } })
  .complete(function(err, purchase) {
    if(err || !purchase) {
      res.json(err); return;
    } else {
      res.json(purchase);
    }
  });
}; 