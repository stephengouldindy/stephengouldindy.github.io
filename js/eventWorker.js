/*
 * eventWorker.js - primary event management script, handling FullCalendar events as well as their Firebase abstraction
 */

 $(document).ready(function() {
    $("#loadingSpinner").show();
    //FIXME: REWORK THE TIMER WHICH WILL MARK EVENTS WHEN THEY ARE LATE
});

const isSameDay = (date1, date2) => {
    if (date1 == undefined || date2 == undefined) {
        return false;
    }
  return date1.getDate() == date2.getDate() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getFullYear() == date2.getFullYear()
}


//mark events that are past their end time

/*
 *	Marks events with their proper colors. Only colors. Runs on applet launch, then once every minute.
 */
function eventColorWorker() {
    let numIssues = 0;
    let now = new Date();
    let events = calendar.getEvents();
    events.forEach(function(event) {
        if (event.extendedProps.issues != undefined && event.extendedProps.issues.length > 0) {
            event.setProp("backgroundColor", "#FFCC00");
            event.setProp("borderColor", "white");
            event.setProp("textColor", "black");
            numIssues += event.extendedProps.issues.length;
            return;
        }
		//skip resolved events, but color them if this is the first time they have been considered.
		if (event.extendedProps.resolved == true) {
			event.setProp("backgroundColor", "green");
			event.setProp("borderColor", "white");
			return;
		}
		if (event.allDay === true) {
			if (event.start < now && !isSameDay(event.start, now)) {
				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "white");
			}
		} else {
			//check for start == end case where end is set to null. FullCalendar quirk
			if (event.end === null) {
				if (event.start < now) {
					event.setProp("backgroundColor", "red");
					event.setProp("borderColor", "white");
				} 
			}
			else if (event.end < now) {
				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "white");
			}
		}
        //if event has an issue marked

    });
    $("#issueCount").html(`&#9888;&#65039; Total Issues: ${numIssues}`)
}

function createCalendarEvent(doc) {
	let data = doc.data();
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
            //newEvent that has a start and end
            newEvent = {
                title: prefix + data.title,
                vendorName: data.vendorName,
                id: doc.id,
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
                docId: doc.id,
                shipTicketUrls: data.shipTicketUrls,
                shipTicketRefs: data.shipTicketRefs,
                shipTicketNames: data.shipTicketNames,
                resolved: data.resolved,
                creator: data.creator,
                history: data.history,
                issues: data.issues,
                resolvedIssues: data.resolvedIssues,
                specialNotes: data.specialNotes
            }; 

              } else /* allDay new event */{
                let dateObj = new Date(year, month, day);
                newEvent = {
                    title: prefix + data.title,
                    vendorName: data.vendorName,
                    id: doc.id,
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
                    docId: doc.id,
                    shipTicketUrls: data.shipTicketUrls,
                    shipTicketRefs: data.shipTicketRefs,
                    shipTicketNames: data.shipTicketNames,
                    resolved: data.resolved,
                    creator: data.creator,
                    history: data.history,
                    issues: data.issues,
                    resolvedIssues: data.resolvedIssues,
                    specialNotes: data.specialNotes
                }; //newEvent
                } //end else
        // return newEvent;
        calendar.addEvent(newEvent);

} //createCalendarEvent


function initAllEvents() {
    calendar.removeAllEvents();
    curSnapshot.forEach(function(doc) {
        createCalendarEvent(doc);
    });
    eventColorWorker();
    calendar.render();
    calendar.rerenderEvents();
}
function initCurrentCalendarViewEvents() {
    if (curSnapshot == undefined) {
        return;
    }
    curSnapshot.forEach(function(doc) {
        let start = calendar.view.currentStart;
        let end = calendar.view.currentEnd;
        let startDate = new Date(start);
        let endDate = new Date(end);
        let eventDate = new Date(doc.data().date);
        if (eventDate >= startDate && eventDate <= endDate) {
            createCalendarEvent(doc);
        }  
    });
    eventColorWorker();
    calendar.render();
    calendar.rerenderEvents();
}


/*
 * Helper function for noCountryForOldEvents()
 * @return array of the first and third fridays of the provided month, as well as the fifth, if there is one.
 */

function getFridays(year, month){
    // Convert date to moment (month 0-11)
    var myMonth = moment({year: year, month: month});
    var fridays = [];
    // Get first Friday of the first week of the month
    var firstFriday = myMonth.weekday(5);
    var nWeeks = 2;
    // Check if first Friday is in the given month
    if( firstFriday.month() != month ){
        firstFriday.add(1, 'weeks');
    }
    fridays.push(firstFriday.format("DD MMMM YYYY"));

    let thirdFriday = firstFriday.add(nWeeks, 'weeks');
    fridays.push(thirdFriday.format("DD MMMM YYYY"));
    //if there is a fifth friday in the month, go ahead and add it
    let fifthFriday = thirdFriday.add(nWeeks, 'weeks');
    if (fifthFriday.month() == month) {
        fridays.push(fifthFriday.format("DD MMMM YYYY"));
    }
    return fridays;
}



/*
 *
 * Clean up events that are older than the prefered time and email their data to relevant personnel.
 */ 
async function noCountryForOldEvents(maxNumDays) {
    if (maxNumDays != 14) {
        return;
    }

    calendar.removeAllEvents();
    //Want to query all events, then remove all those older than 14 days.
    //This will be done before adding any events to the calendar, so we can do this quickly
    db.collection("events").get().then(async (events) => {
        //calculate oldest date allowable (inclusive):
        //the calculated minimum date will also see its events marked for cleanup
        alert('Happy Friday! Cleanup on old trucks must occur. Please press OK and wait...');
        let dayDiff = 1000*60*60*24;
        let now = new Date();
        let minimumDate = new Date(now.getTime() - (maxNumDays * dayDiff));
        var results = {successes: 0, fails: 0, total: 0};
        let numEvents = events.size; // number of events in the collection
        var index = 0;
        console.log("size:", numEvents);
        events.forEach(async function(eventData) {
            let event = eventData.data();
            index++;
            if (new Date (event.date) <= minimumDate) {
                results.total++;
                eventData.ref.delete().then(() => {
                    results.successes++;
                }).catch(() => {
                    results.fails++;
                });

            }
            if (index == numEvents) {

            }


            // if (event.allDay === true || event.end == undefined) {
            //     if (event.start < minimumDate || isSameDay(event.start, minimumDate)) {
            //         console.log("that is 1")
            //         eventData.delete();
            //         removed++;
            //     }
            // } else {
            //     if (event.end < minimumDate || isSameDay(event.end, minimumDate)) {
            //         console.log("that is 2")
            //         eventData.delete();
            //         removed++;
            //     }
            // }
            
        })
        console.log(results.successes, results.fails, results.total, "that's them")
        await waitForRemoval(results);
        console.log("after");
        calendar.removeAllEvents();
        initCurrentCalendarViewEvents();
        // while (removed && successes + fails < removed) {
        //     console.log("we got", successes, fails, removed);
        // }
        if (results.total) {
            alert(`Cleanup of old events complete! Removed ${results.successes} of ${numEvents} trucks. You may resume your activity!`);
        }
        else {
            alert("Cleanup finished. No trucks needed removed. You may resume your activity!")
        }
    });



}

function waitForRemoval(results) {
  return new Promise(resolve => {
    function check() {
      if (results.successes + results.fails == results.total) {
        console.log('met');
        resolve();
      } else {
        window.setTimeout(check, 200); 
      }
    }
    check();
  });
}

async function run() {
  console.log('before');
  await waitForRemoval()
  console.log('after');
}
run();