/*
 * @author Spencer Douglas dougla55@purdue.edu
 * buttons.js- contains all button event listeners not pertaining to login
 */


///////////////////////////////////////////////////////////////////////////////////////
// DROPDOWN MENU
$("#dropdownbtn").click(function() {
	console.log($("#myDropdown").css("opacity"));
	if ($("#myDropdown").css("opacity") < 1.0) {

		$("#myDropdown").css("visibility" , "visible");
		$("#myDropdown").css("opacity" , 1.0);

	}
	else {
		$("#myDropdown").css("opacity", 0.0);
		$("#myDropdown").css("visibility" , "hidden");

	}
});

window.onclick = function(event) {

  if (!event.target.matches('#dropdownbtn') && !event.target.matches('#hamburger')) {
  		if ($("#myDropdown").css("opacity") === 0.0) {
  			return;
  		}
		$("#myDropdown").css("opacity", 0.0);
		$("#myDropdown").css("visibility" , "hidden");
  }
}
// END DROPDOWN MENU
///////////////////////////////////////////////////////////////////////////////////////
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

$("#clearFilesBtn").click(function() {
	$("#shipTicketFileArea").val("");
});

/*
 * Copy Original Values to Edit Fields
 */

$("#copyTitleBtn").click(function() {
$("#editTitleBox").val($("#editTitleBox").attr("placeholder"));
});

$("#copyVendorBtn").click(function() {
$("#editVendorBox").val($("#editVendorBox").attr("placeholder"));
});

$("#copyCustomerBtn").click(function() {
$("#editCustomerBox").val($("#editCustomerBox").attr("placeholder"));
});

$("#copyDestinationBtn").click(function() {
$("#editDestinationBox").val($("#editDestinationBox").attr("placeholder"));
});

$("#copyNotesBtn").click(function() {
$("#editNotesArea").val($("#editNotesArea").attr("placeholder"));
});

/*
 * Confirm exit of edit dialog and clear fields
 */

 $("#cancelEditBtn").click(function() {
 	if (!confirm("Are you sure you wish to erase your changes to this event?")) {
 		return;
 	}
 	else {
 		$("#editTitleBox").val("");
 		$("#editVendorBox").val("");
		$("#editCustomerBox").val("");
		$("#editDestinationBox").val("");
		$("#editNotesArea").val("");
		$("#editModal").modal("hide");

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

$("#clearTruckFormBtn").click(function() {
	$("#newTruckForm").trigger('reset');
	$("#outgoingbtn").click(); 
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
	let arrivalWindow =  $("#modalTime").html().split("-");
	let start = arrivalWindow[0];
	let end = arrivalWindow[1];
	let fullTitle = $("#modalTitle").html();
	let typeLen = 16;
	let spacerLen = 3;
	let type = fullTitle.substring(fullTitle.length - 1 - typeLen);
	let title = fullTitle.substring(0, fullTitle.length - 1 - typeLen - spacerLen);
	console.log(type + "|" + title + "|");
	//let type = titleArr[1];
	//let title = titleArr[0];
	let vendorName = $("#modalVendor").html();
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
	if (type === "INCOMING DELIVERY") {
		$("#editincomingbtn").click();
	}
	else if (type === "OUTGOING SHIPMENT") {
		$("#editoutgoingbtn").click();
	}
	$("#editDatePicker").val(dateResult);
	$("#editInfoTitle").html(`Editing ${title}`);
	$("#editTitleBox").attr("placeholder", title);
	$("#editVendorBox").attr("placeholder", vendorName);
	$("#editCustomerBox").attr("placeholder", customerName);
	$("#editDestinationBox").attr("placeholder", destination);
	$("#editNotesArea").attr("placeholder", notes);
	$("#myModal").modal("hide");
	$("#editTitleBox").val("");
    $("#editVendorBox").val("");
	$("#editCustomerBox").val("");
	$("#editDestinationBox").val("");
	$("#editNotesArea").val("");
	$("#editModal").modal("show");
});

/*
 * Wraps any changes detected and attempts to push them out
 */
$("#confirmEditBtn").click(function() {
	//determine which inputs have a change include and compile them into a changes object to be pushed to database
	
	var isOutgoingChange = {};
	var dateChange = {};
	var startTimeChange = {};
	var endTimeChange = {};
	var titleChange = {};
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
	let origOutgoingStatus = $("#modalTitle").html().substring($("#modalTitle").html().length - 1 - 16);
	

	//detect all changes for compilation
	if (origOutgoingStatus === "OUTGOING SHIPMENT") {
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
	if (newDate != $("#modalDate").html()) {
		dateChange.date = newDate;
	}
	//FIXME: is not thorough enough.
	if ($("#editStartTime").val() != "" && $("#editEndTime").val() != "") {
		isNowAllDay = false;
	}
	else {
		isNowAllDay = true;
	} 
	if (isNowAllDay != wasAllDay) {
			allDayChange.allDay = isNowAllDay;
	}
	if ($("#editStartTime").val() != origStart) {
		startTimeChange.startTime = $("#editStartTime").val();
	}
	if ($("#editEndTime").val() != origEnd) {
		endTimeChange.endTime = $("#editEndTime").val();
	}
	if ($("#editTitleBox").val() != "") {
		titleChange.title = $("#editTitleBox").val();
	}
	if ($("#editVendorBox").val() != "") {
		vendorChange.vendorName = $("#editVendorBox").val();
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
								titleChange,
								vendorChange,
								customerChange,
								destinationChange,
								notesChange);
	console.log(changes);
	if (Object.keys(changes).length > 0) {
		let eventId = $("#eventId").html();
		let curEventRef = db.collection("events").doc(eventId);
		return curEventRef.update(changes)
		.then(function() {
    		console.log("Document successfully updated!");
    		//calendar eventWorker will handle the frontend changes.
			$("#editModal").modal("hide");

		})
		.catch(function(error) {
	    	// The document probably doesn't exist.
	    	console.error("Error updating document: ", error);
		});
	}

});

$("#managePaperworkBtn").click(function() {
	alert("Man, wouldn't that be nice! Sorry; this hasn't been implemented yet. You'll have to delete your event and make a new one " +
	"if you need to make paperwork changes. I will implement this no later than July 24th. - Spencer");
})

//delete file on click
$("#deleteShipmentBtn").click(function() {
	if (confirm("Are you sure you wish to delete the event? This cannot be undone.")) {
        //delete the db entry
        let docRef = db.collection("events").doc($("#eventId").html());
        docRef.get().then(function(doc) {
        	docRef.delete().then(function() {
        		console.log("Document deleted.");
            //delete any paperwork
            shipFiles = doc.data().shipTicketRefs;
            shipFiles.forEach((shipFile) => {
            	let shipRef = storageRef.child(shipFile);
            	shipRef.delete().then(function() {
              // File deleted successfully
              console.log("file deleted");
          }).catch(function(error) {
          	alert(`Something went wrong: ${error}. Please try again.`);
          	return;
          });
      });
        //hide the modal
        $("#myModal").modal("hide");

    }).catch(function(error) {
    	alert(`Something went wrong: ${error}. Please try again.`);
    	return;
    });
});
        

    } 
});




