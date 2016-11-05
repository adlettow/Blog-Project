var express = require('express');
var procedures = require('../procedures/posts.proc');
var auth = require('../middleware/auth.mw')

var router = express.Router();
router.route('/') // collection: /api/posts
    .get(function(req, res) {
        procedures.all()
            .then(function(success) {
                res.send(success);
            }, function(err) {
                res.status(500).send(err);
            });
    })
    .post(auth.isLoggedIn, function(req, res) {
        procedures.create(req.body.userid, req.body.categoryid, req.body.title, req.body.content)
            .then(function(id) {
                res.send(id);
            }, function(err) {
            res.status(500).send(err);
            });
    });

router.route('/user/:id')
    .get(function(req, res) {
        procedures.userPosts(req.params.id)
            .then(function(posts) {
                res.send(posts);
            }, function(err) {
                res.status(500).send(err);
            });
    });

router.route('/categories/:id')
    .get(function(req, res) {
        procedures.categoryPosts(req.params.id)
            .then(function(posts) {
                res.send(posts);
            }, function(err) {
                res.status(500).send(err);
            });
    });

router.route('/:id') // detail: /api/posts/:id
    .get(function(req, res) {
        procedures.read(req.params.id)
            .then(function(post) {
                res.send(post);
            }, function(err) {
                res.status(500).send(err);
            });
    })
    .put(auth.isLoggedIn, function(req, res) {
        procedures.update(req.params.id, req.body.title, req.body.content, req.body.categoryid)
            .then(function() {
                res.sendStatus(204);
            }, function(err) {
                console.log(err);
                res.status(500).send(err);
            });
    })
    .delete(auth.isLoggedIn, function(req, res) {
        procedures.destroy(req.params.id)
            .then(function() {
                res.sendStatus(204);
            }, function(err) {
                res.status(500).send(err);
            });
    });

module.exports = router;