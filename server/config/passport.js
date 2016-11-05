var express = require('express');
var passport = require('passport');
var session = require('express-session');
var MySQLStore = require('express-mysql-session') (session);
var LocalStrategy = require('passport-local').Strategy;
var userProc = require('../procedures/users.proc');
var pool = require('./db').pool;
var utils = require('../utils');

function configurePassport(app) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done) {
        userProc.readByEmail(email)
        .then(function(user) {
            if (!user) {
                return done(null, false, {message: 'Incorrect Login'});
            }
            utils.checkPassword(password, user.password)
            .then(function(matches) {
                if (matches) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect Login'})
                }
            })
        }, function(err) { 
            return done(err); 
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        userProc.read(id).then(function(user) {
            done(null, user);
        }, function(err) {
            done(err);
        });
    });

    var sessionStore = new MySQLStore({
        createDatabaseTable: true
    }, pool);

    app.use(session({
        secret: 'tJh6axupI16E',
        store: sessionStore,
        resave: false,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = configurePassport;