var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var prerender = require('prerender-node');
var utils = require('./utils');
var api = require('./api');
var configurePassport = require('./config/passport');

var clientPath = path.join(__dirname, '../client');
var app = express();

prerender.set('prerenderToken', process.env.PRERENDER_TOKEN);
app.use(prerender);

app.use(express.static(clientPath));
app.use(cookieParser());
app.use(bodyParser.json());

configurePassport(app);

app.use('/api', api);
    
app.get('*', function(req, res, next) {
    if (utils.isAsset(req.url)) {
        return next();
    } else {
        res.sendFile(path.join(clientPath, 'index.html'));
    }
});

app.listen(process.env.PORT || 3000);
console.log('Server listening on port 3000');


