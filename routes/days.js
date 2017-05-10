var Promise = require('bluebird');
var dayRouter = require('express').Router();

var db = require('../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

//this is /day


//test route
dayRouter.get('/', function(req, res, next) {
	res.send({data: 'You GOT all the days!'});
})

dayRouter.get('/:num/:attraction', function(req, res, next) {
	console.log('in the get route');
})

dayRouter.post('/:num/:attraction', function(req, res, next) {

})

dayRouter.delete('/:num/:attraction', function(req, res, next) {

})

dayRouter.put('/:num/:attraction', function(req, res, next) {



})

module.exports = dayRouter;