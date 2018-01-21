
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load records route
var records = require('./routes/records');
var app = express();

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/records', records.list);
app.get('/records/add', records.add);
app.post('/records/add', records.save);
app.get('/records/delete/:id', records.delete_record);
app.get('/records/edit/:id', records.edit);
app.post('/records/edit/:id',records.save_edit);


app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
