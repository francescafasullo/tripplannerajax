var Promise = require('bluebird');
var dayRouter = require('express').Router();

var db = require('../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

//this is /api/day


//test route
dayRouter.get('/', function(req, res, next) {
	Day.findAll({
		include: [{all: true, nested: true}]
		//loads everything
		//include includes the day, hotel
		//we want to use nesting because hotel has a place
		//nesting allows us to access all the place columns
	})
	.then(function(days) {
		res.send(days);
	})
})

dayRouter.post('/', function(req, res, next) {
	Day.create({
		//need to access number from front-end
		
	})
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