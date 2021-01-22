require('dotenv').config();
var express = require('express');
var router = express.Router();
var app = express();
var sequelize = require('./db');
app.use(express.json());

var user = require('./controllers/usercontroller');
var log = require('./controllers/logcontroller');

sequelize.sync();

app.use(require('./middleware/headers'));

app.use('/user', user);
app.use('/log', log);

app.listen(3000, function () {
	console.log('App is listening on port 3000');
});
