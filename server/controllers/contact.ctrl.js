// var express = require('express');
// var emailSvc = require('../services/email.svc');

// var router = express.Router();

// router.get('/test', function(req, res) {
//     emailSvc.sendEmail('adlettow@gmail.com', 'no-reply@austinlettow.com', 'Testing Email', 'Hello World')
//     .then(function(success) {
//         console.log(success);
//         res.send('Email sent!');
//     }, function(err) {
//         console.log(err);
//         res.sendStatus(500);
//     });
// });

//router.post('/') here you would send an email to yourself, from the email address the person sends in, the eail content would be made up of the person's name and the message they typed in the box

// module.exports 