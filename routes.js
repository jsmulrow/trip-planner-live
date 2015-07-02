var router = require('express').Router();

var models = require('./models');
var Hotel = models.Hotel,
	Restaurant = models.Restaurant,
	ThingToDo = models.ThingToDo;

router.get('/', function (req, res, next) {
	Hotel.find({}, function(err, hotels) {
		Restaurant.find({}, function(err, restaurants) {
			ThingToDo.find({}, function(err, thingsToDo) {
				res.render('index', {
					all_hotels: hotels,
					all_restaurants: restaurants,
					all_things_to_do: thingsToDo
				});
			});
		});
	});
});

module.exports = router;