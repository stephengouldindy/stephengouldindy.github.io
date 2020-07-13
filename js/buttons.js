$("#incomingbtn").click(function() {
	$("#incomingbtn").attr("class", function(i, origValue){
		//if button not selected, switch
		if (origValue === "btn btn-outline-primary") {
			//flip other button
			$("#outgoingbtn").attr("class", "btn btn-outline-warning");
			$("#submitTruckBtn").html("Schedule Incoming Delivery");
			return "btn btn-warning";
		}
		else return "btn btn-warning";
	});
}); 

/*
 * Flip swap outgoing and incoming buttons if the outgoing is pressed and is not enabled
 */

 $("#outgoingbtn").click(function() {
 	$("#outgoingbtn").attr("class", function(i, origValue){

 		if (origValue === "btn btn-outline-warning") {
			//flip other button
			$("#incomingbtn").attr("class", "btn btn-outline-primary");
			$("#submitTruckBtn").html("Schedule Outgoing Shipment");
			return "btn btn-primary";
		}
		else return "btn btn-primary";
	});
 }); 

 $("#editincomingbtn").click(function() {
 	$("#editincomingbtn").attr("class", function(i, origValue){
		//if button not selected, switch
		if (origValue === "btn btn-outline-primary") {
			//flip other button
			$("#editoutgoingbtn").attr("class", "btn btn-outline-warning");
			return "btn btn-warning";
		}
		else return "btn btn-warning";
	});
 }); 

/*
 * Flip swap outgoing and incoming buttons if the outgoing is pressed and is not enabled
 */

 $("#editoutgoingbtn").click(function() {
 	$("#editoutgoingbtn").attr("class", function(i, origValue){

 		if (origValue === "btn btn-outline-warning") {
			//flip other button
			$("#editincomingbtn").attr("class", "btn btn-outline-primary");
			return "btn btn-primary";
		}
		else return "btn btn-primary";
	});
 }); 

 $("#arrowContainerBtn").click(function() {
 	if($("#formcontainer").css("display") === "none") {
 		$("#formcontainer").slideDown(300);

 		$("#formArrow").css("transform", "rotate(-90deg)");
 	}
 	else {

 		$("#formArrow").css("transform", "rotate(90deg)");
 		$("#formcontainer").slideUp(300);
 	}
 });

/*
 * Clear delivery window time boxes
 */

 $("#clearTimeBtn").click(function() {
 	$("#startTime").val("");
 	$("#endTime").val("");
 });
 $("#clearEditTimeBtn").click(function() {

 	$("#editStartTime").val("");
 	$("#editEndTime").val("");
 });

 $("#resolveShipmentBtn").click(function() {
	//curEvent is set on eventClick, representing our FullCalendar event object
	if (!confirm(`Please confirm you would like to mark truck from ${curEvent.event.title} for ${curEvent.event.extendedProps.customerName} as resolved.`)) {
		return;
	}
	var eventRef = db.collection("events").doc($("#eventId").html());
	return eventRef.update({
		resolved: true
	}).then(function() {
		console.log("Document successfully updated!");
		calendar.getEventById(curEvent.event.id).setProp("backgroundColor", "green");
		calendar.getEventById(curEvent.event.id).setProp("borderColor", "green");
		calendar.getEventById(curEvent.event.id).setExtendedProp("resolved", true);
		$("#myModal").modal("hide");
	})
	.catch(function(error) {
	    // The document probably doesn't exist.
	    console.error("Error updating document: ", error);
	});
});

 $("#editInfoBtn").click(function() {
  	// alert("Function not yet implemented. Sorry, but you'll have to create a new event if you need to make changes.");
  	//TODO: UPDATE THE BUTTON BASED ON WHICH IS SELECTED 
  	let dateStr = $("#modalDate").html();
  	let date = new Date(dateStr);
  	console.log(date);
	let arrivalWindow =  $("#modalTime").html().split("-");
	let start = arrivalWindow[0];
	let end = arrivalWindow[1];
	let title = $("#modalVendor").html().split(" - ");
	let vendorName = title[1];
	let type = title[0];
	let customerName = $("#modalCustomer").html();
	let destination = $("#modalDestination").html();
	let notes = $("#modalComments").html();

  	//set time to either empty or its value
	if (end != undefined) {
		$("#editStartTime").val(start);
		$("#editEndTime").val(end);
	}
	else {
		$("#editStartTime").val("");
		$("#editEndTime").val("");
	}
	//adjust date components with leading zeroes if necessary
	let dateMonth = `${date.getMonth() + 1}`;
	if (dateMonth.length == 1) {
		dateMonth = '0' + dateMonth;
	}
	let dateDay = `${date.getDate()}`;
	if (dateDay.length == 1) {
		dateDay = '0' + dateDay;
	}
	let dateResult = `${date.getFullYear()}-${dateMonth}-${dateDay}`;

	//flip buttons if the shipment is outgoing
	if (type === "I") {
		$("#editincomingbtn").click();
	}
	else if (type === "O") {
		$("#editoutgoingbtn").click();
	}
	$("#editDatePicker").val(dateResult);
	$("#editInfoTitle").html(`Editing ${title[1]} Appointment for Customer: ${customerName}`);
	$("#editVendorBox").attr("placeholder", title[1]);
	$("#editCustomerBox").attr("placeholder", customerName);
	$("#editDestinationBox").attr("placeholder", destination);
	$("#editNotesArea").attr("placeholder", notes);
	$("#myModal").modal("hide");
	$("#editModal").modal("show");
});


$("#confirmEditBtn").click(function() {
	//determine which inputs have a change include and compile them into a changes object to be pushed to database
	
	var isOutgoingChange = {};
	var dateChange = {};
	var startTimeChange = {};
	var endTimeChange = {};
	var vendorChange = {};
	var customerChange = {};
	var destinationChange = {};
	var notesChange = {};
	var allDayChange = {};
	let isNowAllDay;
	let wasAllDay;

	let arrivalWindow =  $("#modalTime").html().split("-");
	let origStart;
	let origEnd;
	console.log(arrivalWindow.length);
	if (arrivalWindow.length == 1) {
		origStart = "";
		origEnd = "";
		wasAllDay = true;
	}
	else {
		origStart = arrivalWindow[0];
		origEnd = arrivalWindow[1];
		wasAllDay = false;
	}	
	let origOutgoingStatus = $("#modalVendor").html().split(" - ")[0];
	

	//detect all changes for compilation
	console.log(origOutgoingStatus, ($("#editoutgoingbtn").attr("class")));
	if (origOutgoingStatus === "O") {
		//was originally an outgoing shipment
		if ($("#editoutgoingbtn").attr("class") != "btn btn-primary") {
			//change to incoming occurred
			isOutgoingChange.isOutgoing = false;
		}
	}
	else {
		//was originally an incoming delivery
		if ($("#editoutgoingbtn").attr("class") == "btn btn-primary") {
			//change to incoming occurred
			isOutgoingChange.isOutgoing = true;
		}
	}
	//convert dates to the same format
	let newDateComponents = ($("#editDatePicker").val()).split('-');

	let newDate = `${newDateComponents[1]}/${newDateComponents[2]}/${newDateComponents[0]}`;
	console.log(newDate + ":" + $("#modalDate").html());
	if (newDate != $("#modalDate").html()) {
		dateChange.date = newDate;
	}

	if ($("#editStartTime").val() != "" && $("#editEndTime").val() != "") {
		isNowAllDay = false;
	}
	else {
		isNowAllDay = true;
	} 
	console.log (isNowAllDay, wasAllDay);
	if (isNowAllDay != wasAllDay) {
			allDayChange.allDay = isNowAllDay;
	}
	if ($("#editStartTime").val() != origStart) {
		startTimeChange.startTime = $("#editStartTime").val();
	}
	if ($("#editEndTime").val() != origEnd) {
		endTimeChange.endTime = $("#editEndTime").val();
	}
	if ($("#editVendorBox").val() != "") {
		vendorChange.title = $("#editVendorBox").val();
	}
	if ($("#editCustomerBox").val() != "") {
		customerChange.customerName = $("#editCustomerBox").val();
	}
	if ($("#editDestinationBox").val() != "") {
		destinationChange.destination = $("#editDestinationBox").val();
	}
	if ($("#editNotesArea").val() != "") {
		notesChange.notes = $("#editNotesArea").val();
	}

	//wrap any changes into 
	var changeWrapper = {};
	var changes = Object.assign(changeWrapper, 
								isOutgoingChange, 
								dateChange,
								startTimeChange,
								endTimeChange,
								allDayChange,
								vendorChange,
								customerChange,
								destinationChange,
								notesChange);
	
	console.log(changes);
	console.log(Object.keys(changes).length);
	if (Object.keys(changes).length > 0) {
		let eventId = $("#eventId").html();
		let curEventRef = db.collection("events").doc(eventId);
		return curEventRef.update(changes)
		.then(function() {
    		console.log("Document successfully updated!");
    		//FIXME: MAKE A BETTER SYSTEM FOR THIS
    		location.reload();
    		//var newEvent = calendar.getEventById(eventId);
			//Object.assign(newEvent, changes);
			//calendar.rerenderEvents();
			//calendar.render();
			//$("#editModal").modal("hide");

		})
		.catch(function(error) {
	    	// The document probably doesn't exist.
	    	console.error("Error updating document: ", error);
		});
	}




});

$("cancelEditBtn").click(function() {
	if (confirm("Are you sure you wish to erase your changes to the appointment?")) {
		$("#editModal").modal("hide");
	}
});


//delete file on click
$("#deleteShipmentBtn").click(function() {
	if (confirm("Are you sure you wish to delete the event? This cannot be undone.")) {
		let billFile; 
		let billRef;
        //delete the db entry
        let docRef = db.collection("events").doc($("#eventId").html());
        docRef.get().then(function(doc) {
        	docRef.delete().then(function() {
        		console.log("Document deleted.");
            //delete any ship tickets
            shipFiles = doc.data().shipTicketRefs;
            shipFiles.forEach((shipFile) => {
            	let shipRef = storageRef.child(shipFile);
            	shipRef.delete().then(function() {
              // File deleted successfully
              console.log("ship deleted");
          }).catch(function(error) {
          	alert(`Something went wrong: ${error}. Please try again.`);
          	return;
          });
      });
            //delete the bill file if any
            billFile = doc.data().ladingBillRef; 
            //check if a bill is associated
            if (billFile != "") {
            	billRef = storageRef.child(billFile);
            	billRef.delete().then(function() {
                    // File deleted successfully
                    console.log("bill deleted");
                }).catch(function(error) {
                	alert(`Something went wrong: ${error}. Please try again.`);
                	return;
                });
            }
        //hide the modal
        $("#myModal").modal("hide");

    }).catch(function(error) {
    	alert(`Something went wrong: ${error}. Please try again.`);
    	return;
    });
});
        

    } 
});

