var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

var fs = require('fs');

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'CoursManueApp',
    keys: ['authentification', 'foo']
}))

/* GET home page. */
app.get('/', function(req, res, next) {
    console.log(req.session);
  var auth = req.session.auth || false;
    if( auth ){
        res.send(fs.readFileSync(__dirname +"/views/app.html").toString());
    } else {
        res.send(fs.readFileSync(__dirname +"/views/login.html").toString());
    }
    res.end();
});

/* GET home page. */
app.post('/', function(req, res, next) {
    var auth = req.session.auth || false;
    if( auth ){
        if( req.body.files ){
            console.log('fichiers');
            res.end();
            return;
        }

        var d = new Date();
        var fileBkp = d.getFullYear()+"-" +d.getMonth()+"-"+d.getDate();
        var data = {
            "niveaux": JSON.parse(req.body.datas)
        };

        var fs = require('fs');
        try {
            fs.writeFileSync(__dirname + "/data/" +fileBkp +".json", JSON.stringify(data), 'utf8');
        } catch (err) {
            res.status(500);
            res.send("error, impossible d'écrire  le fichier de backup : " + err);
        }
        try {
            fs.writeFileSync(__dirname + "/data/cours.json", JSON.stringify(data), 'utf8');
        } catch (err) {
            res.status(500);
            res.send("error, impossible d'écrire  les données : " + err);
        }
        res.end();
    }
});

app.get('/datas.json', function(req, res) {
    res.send(JSON.parse(fs.readFileSync(__dirname + '/data/cours.json')));
});

////////////////////////////////////////////////////////////
// Authentification
app.post('/login', function( req, res ){
    if( req.body.identifiant == "manue" && req.body.motdepasse == "gizmocaca" ){
        req.session.auth = "Manue";
    }
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.end(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

var debug = require('debug')('my-application');
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
