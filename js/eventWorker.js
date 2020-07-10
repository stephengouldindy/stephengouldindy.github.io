$(document).ready(function() {
	setInterval(function() {
		pastEventListener()
	}, 60 * 1000); 
});
//mark events that are past their end time
function initEvents() {
	console.log("do it");
	let now = new Date();
	let events = calendar.getEvents();
	events.forEach(function(event) {
		console.log("wha");
		console.log(event.extendedProps);
		if (event.extendedProps.resolved == true) {
			
			return;
		}
		if (event.allDay) {
			console.log(event.start);
			if (event.start.getDate() < now.getDate()) {
				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "red");
			}
		} else {
			console.log(event.end);
			if (event.end < now) {
				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "red");
			}
		}
	});
}
function pastEventListener() {
	let now = new Date();
	let events = calendar.getEvents();
	events.forEach(function(event) {
		if (event.extendedProps.resolved == true) {
			event.setProp("backgroundColor", "green");
			event.setProp("borderColor", "green");
			return;
		}
		if (event.allDay) {
			if (event.start.getDate() < now.getDate()) {
				console.log("before");
				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "red");
			}
		} else {
			if (event.end < now) {
				console.log("end before");
				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "red");
			}
		}
	});
}