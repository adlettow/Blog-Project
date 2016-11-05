var express = require('express');
var passport = require('passport');
var procedures = require('../procedures/users.proc');
var auth = require('../middleware/auth.mw');
var util = require('../utils');

var router = express.Router();

// these are all api routes
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if (!user) { // login failure
            return res.status(401).send(info);
        }
        req.logIn(user, function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                return res.send(user);
            }
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.session.destroy(function() {
        req.logOut();
        res.sendStatus(204);
    });
});
// this is actually api/users/
router.route('/')
    .get(function(req, res) {
        procedures.all()
            .then(function(users) {
                res.send(users)
            }, function(err) {
                res.status(500).send(err);
            })
    })
    .post(function(req, res) {
        var u = req.body;
        console.log(u);
        util.encryptPassword(u.password)
        .then(function(password) {
            return procedures.create(u.email, password, u.firstname, u.lastname, u.role);
        }).then(function(id) {
            res.send(id);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

router.all('*', auth.isLoggedIn);

router.get('/me', function(req, res) {
    console.log(req.user);
    res.send(req.user);
});

router.route('/:id')
    .get(function(req, res) {
    procedures.read(req.params.id).then(function(user) {
        res.send(user);
    }, function(err) {
        res.status(500).send(err);
    });
})
    .put(function(req, res) {
    procedures.update(req.params.id, req.body.firstname, req.body.lastname, req.body.email, req.body.role)
    .then(function() {
            res.sendStatus(204);
        }, function(err) {
            console.log(err);
            res.status(500).send(err);
        });
})
    .delete(function(req, res, next) {
    if (req.user.id === Number(req.params.id)) { // If the user is trying to delete him/herself, say Unauthorized
        res.sendStatus(401);
    } else {
        next();
    }
    }, function(req, res){
        procedures.destroy(req.params.id)
        .then(function(){
            res.sendStatus(204);
        }, function(err){
            res.status(500);
        });
});

module.exports = router;





// var express = require('express');
// var passport = require('passport');
// var procedures = require('../procedures/users.proc');
// var auth = require('../middleware/auth.mw');
// var utils = require('../utils');

// var router = express.Router();

// //this is actually /api/users/login
// router.post('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//         if (err) {
//             console.log(err);
//             return res.sendStatus(500);
//         }
//         if (!user) { //login failure
//             return res.status(401).send(info);
//         }
//         req.login(user, function(err) {
//             if (err) {
//                 console.log(err);
//                 return res.sendStatus(500);
//             } else {
//                 return res.send(user);
//             }
//         });
//     })(req, res, next);
// });

// router.route('*')//everything after this point, we are ensuring the user is logged in.
//     .all(auth.isLoggedIn);

// router.get('/logout', function(req, res) {
//     req.session.destroy(function(){
//         req.logOut();
//         res.sendStatus(204);
//     });
// });

// router.route('/', auth.isAdmin)
//     .get(function(req, res) {
//         procedures.procGetUsers().then(function(users){
//             res.send(users);
//         }, function(err){
//             res.status(500).send(err);
//         });
//     })
//     .post(function(req, res) {
//         var u = req.body;
//         utils.encryptPassword(u.password)
//         .then(function(hash) {
//             return procedures.procInsertUser(u.email, hash, u.firstname, u.lastname, u.role);
//         }).then(function(id) {
//             res.status(201).send(id);
//         }).catch(function(err) {
//             console.log(err);
//             res.sendStatus(500);
//         })
//     });

// router.get('/me', function(req, res) {
//     res.send(req.user);
// });

// router.route('/:id', auth.isAdmin)
//     .get(function(req, res) {
//         procedures.procGetUser(req.params.id).then(function(user) {
//             res.send(user);
//         }, function(err){
//             res.status(500).send(err);
//         });
//     })
//     .put(function(req, res){
//         var u = req.body;

//         utils.encryptPassword(u.password)
//         .then(function(hash){
//             return procedures.procUpdateUser(req.params.id, u.firstname, u.lastname, u.email, hash, u.role);
//         }).then(function(){
//             console.log('users.ctrl.js/router.put/:id - user updated!');
//             res.sendStatus(204);
//         }, function(err){
//             console.log('users.ctrl.js/router.put/:id - The error is: ' + err);
//             res.status(500).send(err);
//         });
//     })
//     .delete('/:id', auth.isAdmin, function(req, res, next) {
//         if (req.user.id === Number(req.params.id)) { // If the user is trying to delete him/herself, say Unauthorized
//             res.sendStatus(401);
//         } else {
//             next();
//         }
//         }, function(req, res){
//             procedures.procDeleteUser(req.params.id)
//             .then(function(){
//                 console.log('users.ctrl.js/deleteuser: user deleted!');
//                 res.sendStatus(204);
//             }, function(err){
//                 console.log('users.ctrl.js/deleteuser: there is an error ' + err);
//                 res.status(500);
//             });
//     });

// module.exports = router;