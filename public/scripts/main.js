
$(document).ready(function() {

	var currentDay = $('#day-title span').text().match(/\d/)[0];
	// add one to index for current day
	var days = [
		{
			Hotel: 'placeholder',
			Restaurants: ['1', '2', '3'],
			ThingsToDo: ['4', '5']
		},
		{
			Hotel: 'placeholder2',
			Restaurants: ['21', '22', '23'],
			ThingsToDo: ['24', '25']
		},
		{
			Hotel: 'placeholder3',
			Restaurants: ['321', '322', '323'],
			ThingsToDo: ['324', '325']
		}
	];

	function newListElement(text) {
		return '<div class="itinerary-item"><span class="title">' + text + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
	}

	function setDay(day, dayBtnNode) {
		// change header text
		$('#day-title span').text("Day " + day);
		// clear old list items
		$('.hotelList').empty();
		$('.restaurantList').empty();
		$('.thingsToDoList').empty();
		// set new list items
		var dayValues = days[day - 1];
		// check hotel is defined
		if (dayValues['Hotel']) {
			$('.hotelList').append($(newListElement(dayValues['Hotel'])));
		}
		dayValues['Restaurants'].forEach(function(restaurant) {
			$('.restaurantList').append($(newListElement(restaurant)));
		});
		dayValues['ThingsToDo'].forEach(function(thing) {
			$('.thingsToDoList').append($(newListElement(thing)));
		});
		if (!dayBtnNode) {
			return;
		}
		// update current day CSS class
		var oldCurrentDay = $('.current-day');
		oldCurrentDay.removeClass('current-day');
		dayBtnNode.addClass('current-day');
	}

	function addDay() {
		// find new day number
		var dayNum = Object.keys(days).length + 1;
		// add a new button
		var newBtn = $('<button class="btn btn-circle day-btn">' + dayNum + '</button>');
		newBtn.insertBefore('#plusBtn');
		// add new day object to days
		days.push({
			Hotel: 'placeholder' + dayNum,
			Restaurants: [dayNum],
			ThingsToDo: [dayNum]
		});
	}

	function removeDay() {
		// check that there is more than one day left
		if (days.length <= 1) return;
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
			setDay(text, newDay);
		}
	});

	// day removing button
	$('#removeDayBtn').on('click', function() {
		removeDay();
		updateDayButtons();
		// load day one's data
		setDay(1);
		// make day 1 active
		$($('.day-btn')[0]).addClass('current-day');
	});

	// add to itinerary buttons
	$('#addHotel').on('click', function() {
		// find the value
		var addButton = $(this);
		var value = addButton.prev().val();
		// add value to the correct day's array
		var currentDay = parseInt($('.current-day').text());
		days[currentDay - 1].Hotel = value;
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
		days[currentDay - 1].Restaurants.push(value);
		setDay(currentDay);
	});
	$('#addThingToDo').on('click', function() {
		// find the value
		var addButton = $(this);
		var value = addButton.prev().val();
		// add value to the correct day's array
		var currentDay = parseInt($('.current-day').text());
		days[currentDay - 1].ThingsToDo.push(value);
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
		days[currentDay - 1].Hotel = null;
		// remove the element from the itinerary
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
		restaurantArr.splice(restaurantArr.indexOf(value), 1);
		// remove the element from the itinerary
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
		thingsArr.splice(thingsArr.indexOf(value), 1);
		// remove the element from the itinerary
		setDay(currentDay);
	});


	// initialize the day
	setDay(currentDay);

});