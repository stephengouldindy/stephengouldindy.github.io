/*
 * eventWorker.js - primary event management script, handling FullCalendar events as well as their Firebase abstraction
 */

$(document).ready(function() {
	setInterval(function() {
		eventColorWorker(false)
	}, 60 * 1000); 
});
//mark events that are past their end time

/*
 *	Marks events with their proper colors. Only colors 
 */
function eventColorWorker(isLaunch) {
	let now = new Date();
	let events = calendar.getEvents();
	events.forEach(function(event) {

		//skip resolved events, but color them if this is the first time this has been run.
		if (event.extendedProps.resolved == true) {
			if (isLaunch) {
				event.setProp("backgroundColor", "green");
				event.setProp("borderColor", "white");
			}
			return;
		}
		if (event.allDay === true) {
			if (event.start.getDate() < now.getDate()) {
				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "red");
			}
		} else {
			//check for start == end case where end is set to null
			if (event.end === null) {
				if (event.start < now) {
					event.setProp("backgroundColor", "red");
					event.setProp("borderColor", "red");
				} 
			}
			else if (event.end < now) {
				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "red");
			}
		}
	});
}

function addCalendarEvent(change) {
	let data = change.doc.data();
	let day = data.date.split('/')[1];
            let month = data.date.split('/')[0] - 1;
            let year = data.date.split('/')[2];
            let dateObj = new Date(year, month, day);
            let bkgColor = data.isOutgoing ? '#082a40' : '#F24E1B';
            let borderColor = !data.isOutgoing ? '#082a40' : '#F24E1B';
            let shipTicketURL = data.shipTicketURL;
            let eventTextColor = 'white';
            let prefix = data.isOutgoing ? "O - " : "I - ";

            var newEvent;

            if (!data.allDay) {
                    let startHour = data.startTime.split(':')[0];
                    let startMinute = data.startTime.split(':')[1];
                    let endHour = data.endTime.split(':')[0];
                    let endMinute = data.endTime.split(':')[1];
                    let startDate = new Date(year, month, day, startHour, startMinute);
                    var endDate = new Date(year, month, day, endHour, endMinute);
                    
                    
                    newEvent = {
                          title: prefix + data.title,
                          vendorName: data.vendorName,
                          id: change.doc.id,
                          eventTextColor: eventTextColor,
                          start: startDate,
                          end: endDate,
                          allDay: data.allDay,
                          editable: false,
                          backgroundColor: bkgColor,
                          borderColor: borderColor,
                          displayEventEnd: true,
                          isOutgoing: data.isOutgoing,
                          customerName: data.customerName,
                          eventDate: data.date,
                          destination: data.destination,
                          eventStartTime: data.startTime,
                          eventEndTime: data.endTime,
                          comments: data.notes,
                          docId: change.doc.id,
                          shipTicketUrls: data.shipTicketUrls,
                          shipTicketRefs: data.shipTicketRefs,
                          shipTicketNames: data.shipTicketNames,
                          ////
                          creator: data.creator,
                          resolved: data.resolved
                    }; //newEvent
                } else {
                    let dateObj = new Date(year, month, day);
                    newEvent = {
                        title: prefix + data.title,
                        vendorName: data.vendorName,
                        id: change.doc.id,
                        start: dateObj,
                        eventTextColor: eventTextColor,
                        allDay: data.allDay,
                        editable: false,
                        backgroundColor: bkgColor,
                        borderColor: borderColor,
                        displayEventEnd: true,
                        isOutgoing: data.isOutgoing,
                        customerName: data.customerName,
                        eventDate: data.date,
                        destination: data.destination,
                        eventStartTime: data.startTime,
                        eventEndTime: data.endTime,
                        comments: data.notes,
                        docId: change.doc.id,
                        shipTicketUrls: data.shipTicketUrls,
                        shipTicketRefs: data.shipTicketRefs,
                        shipTicketNames: data.shipTicketNames,
                          ////
                        creator: data.creator,
                        resolved: data.resolved
                    }; //newEvent
                } //end else
                calendar.addEvent(newEvent);
            
} //addCalendarEvent



/*
 * Clean up events that are older than the prefered time
 */ 
function noCountryForOldEvents(timeLimit) {
  //current time limit is 1 month.

}