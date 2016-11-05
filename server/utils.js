var bcrypt = require('bcrypt');
var path = require('path');
const saltRounds = 12;

exports.encryptPassword = function(pw) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(pw, saltRounds, function(err, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

exports.checkPassword = function(pw, hash) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(pw, hash, function(err, matches) {
            if (err) {
                reject(err);
            } else {
                resolve(matches);
            }
        });
    });
}

exports.isAsset = function(urlPath) {
    var pieces = urlPath.split('/');
    // /api/chirps/1
    // ['', 'api', 'chirps', '1']
    if (pieces.length === 0) {
        return false;
    }
    var lastPiece = pieces[pieces.length - 1];
    if (urlPath.indexOf('/api') !== -1 || urlPath.indexOf('/?') !== -1) {
        // If the path contains /api or /?
        return true;
    } else if (lastPiece.indexOf('.') !== -1) {
        // If the last pieces of the url (the part after the last /) contains a dot, it must be a file
        return true;
    } else {
        return false;
    }
}