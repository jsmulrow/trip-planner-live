$(document).ready(function() {

    // initialize new google maps LatLng object
    var myLatlng = new google.maps.LatLng(40.705786,-74.007672);
    // set the map options hash
    var mapOptions = {
    	center: myLatlng,
    	zoom: 13,
    	mapTypeId: google.maps.MapTypeId.ROADMAP,
    	styles: styleArr
    };
    // get the maps div's HTML obj
    var map_canvas_obj = document.getElementById("map-canvas");
    // initialize a new Google Map with the options
    var map = new google.maps.Map(map_canvas_obj, mapOptions);
    // Add the marker to the map
    var marker = new google.maps.Marker({
    	position: myLatlng,
    	title:"Hello World!"
    });
    
    // makes marker with the given location
    function drawLocation (location, opts) {
    	if (typeof opts !== 'object') {
    		opts = {};
    	}
    	opts.position = new google.maps.LatLng(location[0], location[1]);
    	opts.map = map;
    	var marker = new google.maps.Marker(opts);
    	// return marker so it can be accessed later
    	return marker;
    }

    // places all markers in passed array on the passed map
    function setAllMap(markers, map){
    	for(var i = 0; i < markers.length; i++){
    		markers[i].setMap(map);
    	}
    }

    // styles for the google map
    var styleArr = [
        {
        	"featureType": "landscape",
        	"stylers": [
        	{
        		"saturation": -100
        	},
        	{
        		"lightness": 60
        	}
        	]
        },
        {
        	"featureType": "road.local",
        	"stylers": [
        	{
        		"saturation": -100
        	},
        	{
        		"lightness": 40
        	},
        	{
        		"visibility": "on"
        	}
        	]
        },
        {
        	"featureType": "transit",
        	"stylers": [
        	{
        		"saturation": -100
        	},
        	{
        		"visibility": "simplified"
        	}
        	]
        },
        {
        	"featureType": "administrative.province",
        	"stylers": [
        	{
        		"visibility": "off"
        	}
        	]
        },
        {
        	"featureType": "water",
        	"stylers": [
        	{
        		"visibility": "on"
        	},
        	{
        		"lightness": 30
        	}
        	]
        },
        {
        	"featureType": "road.highway",
        	"elementType": "geometry.fill",
        	"stylers": [
        	{
        		"color": "#ef8c25"
        	},
        	{
        		"lightness": 40
        	}
        	]
        },
        {
        	"featureType": "road.highway",
        	"elementType": "geometry.stroke",
        	"stylers": [
        	{
        		"visibility": "off"
        	}
        	]
        },
        {
        	"featureType": "poi.park",
        	"elementType": "geometry.fill",
        	"stylers": [
        	{
        		"color": "#b6c54c"
        	},
        	{
        		"lightness": 40
        	},
        	{
        		"saturation": -40
        	}
        	]
        },
        {}
    ];

	var currentDay = $('#day-title span').text().match(/\d/)[0];
	// add one to index for current day

	// client side storage for each day's itinerary
	var days = [
		{
			Hotel: {name: "", marker: null},
			Restaurants: [],
			ThingsToDo: []		
		},
		{
			Hotel: {name: "", marker: null},
			Restaurants: [],
			ThingsToDo: []		
		},
		{
			Hotel: {name: "", marker: null},
			Restaurants: [],
			ThingsToDo: []		
		}
	];

	// returns html itinerary list item with the passed text
	function newListElement(text) {
		return '<div class="itinerary-item"><span class="title">' + text + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
	}

	// updates the itinerary list for the current day
	//   optionally takes button node to change which button is active
	//   and/or a boolean for switching the current day
	function setDay(day, dayBtnNode, changeDay) {
		// change header text
		$('#day-title span').text("Day " + day);
		// clear old list items
		$('.hotelList').empty();
		$('.restaurantList').empty();
		$('.thingsToDoList').empty();
		// set new list items
		var dayValues = days[day - 1];

		// check hotel is defined
		if (dayValues['Hotel'].name) {
			$('.hotelList').append($(newListElement(dayValues['Hotel']['name'])));
		}
		dayValues['Restaurants'].forEach(function(restaurant) {
			$('.restaurantList').append($(newListElement(restaurant.name)));
		});
		dayValues['ThingsToDo'].forEach(function(thing) {
			$('.thingsToDoList').append($(newListElement(thing.name)));
		});

		// if given the new day's button, update it's class
		if (dayBtnNode) {
			// update current day CSS class
			var oldCurrentDay = $('.current-day');
			// remove old current class
			oldCurrentDay.removeClass('current-day');
			// add new one
			dayBtnNode.addClass('current-day');
		}

		// if switching days, update the itinerary list for the new day
		if(changeDay){
			// remove markers from the old day, if there is one
			if (oldCurrentDay) {
				clearAllDays(dayMarkers(parseInt(oldCurrentDay.text())));
			}
			// set markers for the new day
			setAllMap(dayMarkers(day), map);
		}

		// set the map's bounds
		var markerArr = dayMarkers(day);

		// if there are markers
		if (markerArr.length) {
			// set bounds for those markers
			setBounds(markerArr);
		} else {
			// otherwise, display a fresh map
			map = new google.maps.Map(map_canvas_obj, mapOptions);
		}
	}

	// runs setMap(null) on each passed marker (ie removes each marker from map)
    function clearAllDays(markers){
    	setAllMap(markers, null);
    }

    // returns a concatenated array of the passed day's hotel, restaurant, and thing markers
    function dayMarkers(day) {
	    var i = day - 1;
	    // find all markers
	    var hotelMarker = days[i].Hotel.marker;
	    var restMarkers = days[i].Restaurants.map(function(restaurant) {
	        return restaurant.marker;
	    });
	    var thingMarkers = days[i].ThingsToDo.map(function(thing) {
	        return thing.marker;
	    });
	    // check if hotel marker is falsy to prevent returning array with only null inside
	    if (hotelMarker) return thingMarkers.concat(restMarkers, hotelMarker);
	    return thingMarkers.concat(restMarkers);
	}

	// loops through passed markers and sets the map's bounds
	function setBounds(markers) {
		// make new bounds object
		var bounds = new google.maps.LatLngBounds();
		// update bounds for each marker
		for (var i = 0; i < markers.length; i++) {
			bounds.extend(markers[i].position);
		}
		// fit the map to the bounds
		map.fitBounds(bounds);
	}

	function addDay() {
		// find new day number
		var dayNum = Object.keys(days).length + 1;
		// add a new button
		var newBtn = $('<button class="btn btn-circle day-btn">' + dayNum + '</button>');
		newBtn.insertBefore('#plusBtn');
		// add new day object to days
		days.push({
			Hotel: {name: '', marker: null},
			Restaurants: [],
			ThingsToDo: []		
		});
	}

	function removeDay() {
		// check that there is more than one day left
		if (days.length <= 1) return;

		var oldCurrentDay = $('.current-day');
		clearAllDays(dayMarkers(parseInt(oldCurrentDay.text())));

		// select current day
		var day = $('.current-day');
		// update the days array
		days.splice(parseInt(day.text()) - 1, 1);
		// delete the button
		$('.current-day').remove();
	}

	function updateDayButtons() {
		// select all day buttons
		$('.day-btn').each(function(index) {
			if ($(this).text() === '+') return;
			$(this).text(index + 1);
		});
		// update their shown day number
	}

	// day switching buttons
	$('.day-buttons').on('click', 'button', function() {
		var newDay = $(this);
		var text = newDay.text();
		if (text === '+') {
			// add a new day
			addDay();
		} else {
			// set the day
			setDay(parseInt(text), newDay, true);
		}
	});

	// day removing button
	$('#removeDayBtn').on('click', function() {
		removeDay();
		updateDayButtons();

		// find old day
		var oldDay = parseInt($('#removeDayBtn').prev().text().match(/\d/)[0]);
		if (oldDay === 1) {
			oldDay++;
		}

		// load previous day's data
		setDay(oldDay - 1, null, true);
		// make previous day active
		$($('.day-btn')[oldDay - 2]).addClass('current-day');
	});

	// add to itinerary buttons
	$('#addHotel').on('click', function() {
		// find the value
		var addButton = $(this);
		var value = addButton.prev().val();
		// add value to the correct day's array
		var currentDay = parseInt($('.current-day').text());

		// search data for matching hotel
		var match = all_hotels.filter(function(hotel){
			return hotel.name === value;
		});

		// extract location array from match's place attribute
		var hotelLocation = match[0]['place'][0]['location'];

		var hotelObj = days[currentDay - 1].Hotel = {name: value, marker: drawLocation(hotelLocation,{icon: '/images/lodging_0star.png'})};
		setDay(currentDay);
	});
	$('#addRestaurant').on('click', function() {
		// find current day
		var currentDay = parseInt($('.current-day').text());
		// make sure the array does not have 3 elements
		if (days[currentDay - 1].Restaurants.length >= 3) return;
		// find the value
		var addButton = $(this);
		var value = addButton.prev().val();
		// add value to the correct day's array

		// search data for matching restaurant
		var match = all_restaurants.filter(function(restaurant){
			return restaurant.name === value;
		});

		// extract location array from match's place attribute
		var restaurantLocation = match[0]['place'][0]['location'];	
		days[currentDay - 1].Restaurants.push({name: value, marker: drawLocation(restaurantLocation, {icon: '/images/restaurant.png'})});
		
		var markers = days[currentDay - 1].Restaurants.map(function(restObj){
			return restObj.marker;
		});
		setDay(currentDay);
	});
	$('#addThingToDo').on('click', function() {
		// find the value
		var addButton = $(this);
		var value = addButton.prev().val();
		// add value to the correct day's array
		var currentDay = parseInt($('.current-day').text());

		// search data for matching thing to do
		var match = all_things_to_do.filter(function(thing){
			return thing.name === value;
		});

		// extract location array from match's place attribute
		var thingToDoLocation = match[0]['place'][0]['location'];		
		days[currentDay - 1].ThingsToDo.push({name: value, marker: drawLocation(thingToDoLocation, {icon: '/images/star-3.png'})});
		
		var markers = days[currentDay - 1].ThingsToDo.map(function(thingObj){
			return thingObj.marker;
		});

		setDay(currentDay);
	});

	// remove from itinerary buttons
	$('.hotelItinerary').on('click', 'button', function() {
		// find the value
		var removeButton = $(this);
		var value = removeButton.prev().text();
		// find the current day
		var currentDay = parseInt($('.current-day').text());
		// remove this value from that day's hotels
		days[currentDay - 1].Hotel = {name: ''};
		// remove the element from the itinerary
		days[currentDay - 1].Hotel.marker.setMap(null);

		setDay(currentDay);
	});
	$('.restaurantItinerary').on('click', 'button', function() {
		// find the value
		var removeButton = $(this);
		var value = removeButton.prev().text();
		// find the current day
		var currentDay = parseInt($('.current-day').text());
		// remove this value from that day's restaurants
		var restaurantArr = days[currentDay - 1].Restaurants;

		var index = 0;
		restaurantArr.forEach(function(restObj, i){
			if(restObj.name === value) index = i;
		});

		// remove the element from the itinerary
		restaurantArr[index].marker.setMap(null);
		restaurantArr.splice(index, 1);

		setDay(currentDay);
	});
	$('.thingsToDoItinerary').on('click', 'button', function() {
		// find the value
		var removeButton = $(this);
		var value = removeButton.prev().text();
		// find the current day
		var currentDay = parseInt($('.current-day').text());
		// remove this value from that day's things to do
		var thingsArr = days[currentDay - 1].ThingsToDo;

		var index = 0;
		thingsArr.forEach(function(thingObj, i){
			if(thingObj.name === value) index = i;
		});
		
		// remove the element from the itinerary
		thingsArr[index].marker.setMap(null);
		thingsArr.splice(index, 1);

		setDay(currentDay);
	});

	// initialize the day
	setDay(currentDay);
});