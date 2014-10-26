# Project Overview

A node.js web app that sells my Excel test I give candidates when interviewing to be on my team. Often I noticed that candidates would list "mastery of MS Excel" on their resumes, but when tested, they have at best an intermediate skillset. The Excel test would provide a check to anyone who wants to list expert level Excel skills.

## Technical Details

The project here is to test my `node.js` skills.

The stack:

#### Front end:
js: `jquery`

css: `bootstrap`

#### Server side:
framework: `express` with an MVC-type implementation
language: `node.js`


#### Database
object-relational mapper: `sequelize.js`

database: `postgres`

#### Integrations
Payments: Stripe

Transactional email: Mailgun

## Installation

	$ git clone https://github.com/skilbjo/xltest.git

	$ npm install

	$ postgres -D /usr/local/var/postgres --fork

	$ vim .env

Add in super secret configuration variables (API keys, database URL)

Add the Excel test in `/public/assets/xltest.xlsx`


## Let's begin!
Run the server locally with `node-foreman` (loads config vars from `.env`)

	nf start -x 8080 -e env/dev.env

Or, deploy

	$ git push heroku master

	$ heroku ps

	$ heroku logs -t

	$ heroku open

