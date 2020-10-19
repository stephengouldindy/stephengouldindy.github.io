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
 * Clean up events that are older than the prefered time and email their data to relevant personnel.
 */ 
async function noCountryForOldEvents(maxNumDays) {
    if (maxNumDays != 14) {
        return;
    }
    //Inclusive--the calculated minimum date will also see its events marked for cleanup
    initAllEvents();
    let dayDiff = 1000*60*60*24;
    let events = calendar.getEvents();
    let now = new Date();
    /////////////////////////////////
        //check if the event time is before a certain date to see if it should be there
    ///////////

    let minimumDate = new Date(now.getTime() - (maxNumDays * dayDiff));
    var marked = [];
    events.forEach(function(event) {
        if (event.allDay === true || event.end == undefined) {
            if (event.start < minimumDate || isSameDay(event.start, minimumDate)) {
                marked.push(event);
            }
        } else {
            if (event.end < minimumDate || isSameDay(event.end, minimumDate)) {
                marked.push(event);
            }
        }
    });
    console.log("found", marked.length);
    if (marked.length < 1) {
        return;
    }
    setTimeout(function() { alert('Cleaning up old shipments! Please close this alert & you will be alerted when you can resume using the calendar.'); }, 1);
    var unresolvedList = [];
    var resolvedList = [];
    marked.forEach(function(event) {
        event.remove();
    });
    marked.forEach(function(event) {
        let title = event.title;
        let date = event.extendedProps.eventDate;
        var creator = event.extendedProps.creator;
        if (creator == undefined) {
            creator = "N/A, event made during invalid version";
        }
        let carrier = event.extendedProps.vendorName;
        let customerName = event.extendedProps.customerName;
        let destination = event.extendedProps.destination;
        let notes = event.extendedProps.comments;
        let shipTicketUrls = event.extendedProps.shipTicketUrls;
        var shipTicketStr = "";
        shipTicketUrls.forEach(function(url) {
            shipTicketStr += `${url}, <br>`
        });
        if (shipTicketStr.length) {
            shipTicketStr = shipTicketStr.substring(0, shipTicketStr.length - 6); // trim the excess ', <br>'
        } else {
            shipTicketStr = "None.";
        }
        let entry = `<br>${date}: ${title}<br>Creator: ${creator}<br>Carrier: ${carrier}<br>Customer Name: ${customerName}<br>Destination: ${destination}<br>Notes: ${notes}<br>Document URLS: ${shipTicketStr}` +
                    "<br>---------------------------------------------------------------------------------------------------------------";
        if (event.extendedProps.resolved) {
            resolvedList.push(entry);
        } else {
            unresolvedList.push(entry);
        }
    });
    var bodyString = `<html><h2>UNRESOLVED SHIPMENTS (${unresolvedList.length})</h2><text>`
    unresolvedList.forEach(function(entry) {
        bodyString += entry;
    })
    bodyString +=  `<br></text><h2>RESOLVED SHIPMENTS (${resolvedList.length})</h2><text>`
    resolvedList.forEach(function(entry) {
       bodyString += entry;
    })
    bodyString += "</text></html>";
    var resolvedSent = false;
    var unresolvedSent = false;
    let supervisor = "bmbarnhart@stephengould.com";
    //let supervisor = "sawdouglas7@gmail.com";
    if (unresolvedList.length) {
        unresolvedSent = await sendEmail("S&R Calendar - UNRESOLVED SHIPMENTS NEED ATTN", bodyString, ["sgi.shippingreceiving@gmail.com", supervisor]);
    }
    else if (resolvedList.length) {
        resolvedSent = await sendEmail(`${now.toDateString()} Shipment Log`, bodyString, "sgi.shippingreceiving@gmail.com");
    }
    if (unresolvedSent || resolvedSent) {
        //remove the events from the database
        marked.forEach(function(event) {
            let docRef = eventCollection.doc(event.id);
            docRef.get().then(function(doc) {
                docRef.delete().then(function() {
                    console.log("Document deleted.");
                    //delete any paperwork
                    shipFiles = event.extendedProps.shipTicketRefs;
                    console.log(shipFiles);
                    shipFiles.forEach((shipFile) => {
                        let shipRef = storageRef.child(shipFile);
                        shipRef.delete().then(function() {
                            // File deleted successfully
                            console.log(`${shipFile} deleted`);
                        }).catch(function(error) {
                            alert(`Something went wrong: ${error}. Please try again.`);
                            return;
                        });
                    });
                });
            });
        });
    }
    setTimeout(function() { alert('Cleanup finished. You may resume your activity.'); }, 1);   
  }