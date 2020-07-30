/*
 * eventWorker.js - primary event management script, handling FullCalendar events as well as their Firebase abstraction
 */

 $(document).ready(function() {
    $("#loadingSpinner").show();
   setInterval(function() {
      eventColorWorker(false)
  }, 60 * 1000); 
});
//mark events that are past their end time

/*
 *	Marks events with their proper colors. Only colors. Runs on applet launch, then once every minute.
 */
 function eventColorWorker(isInitial) {
   let now = new Date();
   let events = calendar.getEvents();
   events.forEach(function(event) {
		//skip resolved events, but color them if this is the first time they have been considered.
		if (event.extendedProps.resolved == true) {
			if (isInitial) {
				event.setProp("backgroundColor", "green");
				event.setProp("borderColor", "white");
			}
			return;
		}
		if (event.allDay === true) {
			if (event.start < now && event.start.getDate() <= now.getDate()) {

				event.setProp("backgroundColor", "red");
				event.setProp("borderColor", "red");
			}
		} else {
			//check for start == end case where end is set to null. FullCalendar quirk
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

                    //newEvent that has a start and end
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
                      resolved: data.resolved,
                      creator: data.creator,
                      history: data.history

                    }; 

              } else /* allDay new event */{
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
                    resolved: data.resolved,
                    creator: data.creator,
                    history: data.history
                }; //newEvent
                } //end else
                calendar.addEvent(newEvent);

} //addCalendarEvent

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
    console.log(fridays);
    return fridays;
}




/*
 * Clean up events that are older than the prefered time and email their data to relevant personnel.
 */ 
async function noCountryForOldEvents(maxNumDays) {
    console.log("looking for events to clean up");
    //Not inclusive--the calculated minimum date will not see any of its events marked for cleanup
    let dayDiff = 1000*60*60*24;
    let events = calendar.getEvents();
    let now = new Date();
    let minimumDate = new Date(now.getTime() - (maxNumDays * dayDiff));
    console.log(minimumDate, new Date(minimumDate));
    var marked = [];
    events.forEach(function(event) {
        if (event.allDay === true) {
            if (event.start < minimumDate) {
                marked.push(event);
            }
        } else {
            //check for start == end case where end is set to null. FullCalendar quirk
            if (event.end === null) {
                if (event.start < minimumDate) {
                    marked.push(event);
                } 
            }
            else if (event.end < minimumDate) {
                marked.push(event);
            }
        }
    });
    console.log("found", marked.length);
    var unresolvedList = [];
    var resolvedList = [];
    marked.forEach(function(event){
        let title = event.title;
        let date = event.extendedProps.eventDate;
        var creator = event.extendedProps.creator;
        if (creator == undefined) {
            creator = "N/A, event made during invalid version"
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
    // let supervisor = "sawdouglas7@gmail.com";
    if (unresolvedList.length) {
        unresolvedSent = await sendEmail("S&R Calendar - UNRESOLVED SHIPMENTS NEED ATTN", bodyString, ["sgi.shippingreceiving@gmail.com", supervisor]);
    }
    else if (resolvedList.length) {
        resolvedSent = await sendEmail(`${now.toDateString()} Shipment Log`, bodyString, "sgi.shippingreceiving@gmail.com");
    }
    if (unresolvedSent || resolvedSent) {
        //remove the events from the database
        marked.forEach(function(event) {
            let docRef = db.collection("events").doc(event.id);
            docRef.get().then(function(doc) {
                docRef.delete().then(function() {
                    console.log("Document deleted.");
                    //delete any paperwork
                    shipFiles = event.extendedProps.shipTicketRefs;
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
  }