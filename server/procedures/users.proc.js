var db = require('../config/db');

exports.readByEmail = function(email) {
    return db.row('GetUserByEmail', [email]);
}

exports.all = function() {
    return db.rows('GetUsers');
}

exports.read = function(id) {
    return db.row('GetUser', [id]);
}

exports.create = function(email, password, firstname, lastname, role) {
    return db.row('NewUser', [email, password, firstname, lastname, role]);
}

exports.update = function(id, firstname, lastname, email, role) {
    return db.empty('UpdateUser', [id, firstname, lastname, email, role]);
}

exports.destroy = function(id) {
    return db.empty('DeleteUser', [id]);
}