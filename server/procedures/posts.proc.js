var db = require('../config/db');

exports.all = function() {
    return db.rows('GetPosts')
}

exports.userPosts = function(userid) {
    return db.rows('GetPostsByUser', [userid]);
}

exports.read = function(id) {
    return db.row('GetPost', [id]);
}

exports.create = function(userid, categoryid, title, content) {
    return db.row('NewPost', [userid, categoryid, title, content]);
}

exports.update = function(id, title, content, categoryid) {
    return db.empty('UpdatePost', [id, title, content, categoryid]);
}

exports.destroy = function(id) {
    return db.empty('DeletePost', [id]);
}

exports.categoryPosts = function(categoryid) {
    return db.rows('GetPostsByCategory', [categoryid]);
}