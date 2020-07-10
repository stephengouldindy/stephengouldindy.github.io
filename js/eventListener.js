$(document).ready(function() {
	setInterval(function() {
		pastEventListener()
	}, 60 * 1000); 
});
//mark events that are past their end time
function pastEventListener() {
	let now = new Date();
	let events = calendar.getEvents();
	events.forEach(function(event) {
		if (event.allDay) {
			console.log(event.start);
			if (event.start.getDate() >= now.getDate()) {
				console.log('after');
			}
			else if (event.start.getDate() < now.getDate()) {
				console.log("before");
				event.setProp("backgroundColor", "red");
			}
		} else {
			console.log(event.end);
			if (event.end >= now) {
				console.log('end after');
			}
			else if (event.end < now) {
				console.log("end before");
				event.setProp("backgroundColor", "red");
			}
		}
	});
	console.log(events);
}