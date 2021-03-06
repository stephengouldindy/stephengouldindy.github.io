/*
 * @author Spencer Douglas dougla55@purdue.edu
 * buttons.js- contains all button event listeners not pertaining to login
 */


///////////////////////////////////////////////////////////////////////////////////////
// DROPDOWN MENU
$("#dropdownbtn").click(function() {
	if ($("#myDropdown").css("opacity") < 1.0) {

		$("#myDropdown").css("visibility" , "visible");
		$("#myDropdown").css("opacity" , 1.0);

	}
	else {
		$("#myDropdown").css("opacity", 0.0);
		$("#myDropdown").css("visibility" , "hidden");

	}
});

// END DROPDOWN MENU
///////////////////////////////////////////////d////////////////////////////////////////
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
 $("#clearNewPaperworkBtn").click(function() {
 	$("#newPaperworkFileArea").val("");
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

//////////////////////////////////////////////////////////////////////////////
////////////////////////// ISSUE REPORTING FOR EVENTS ///////////////////////
////////////////////////////////////////////////////////////////////////////
var curEmails = [];

function ValidateEmail(email) {
	if (email == undefined) {
		return false;
	}
	return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
}

/*
 * Clean up list and email array on click
 */
$("#clearRecipientsBtn").click(function() {
	curEmails = [];
	document.getElementById("recipientList").innerHTML = "None specified.";
}); // clearRecipientsBtn click

$("#newIssueRecipientBtn").click(function() {
	//add a new recipient to the list
	let newEmail = $("#newRecipientInput").val();
	if (!ValidateEmail(newEmail)) {
		alert("Invalid email; check your submitted email.");
		return;
	}
	else if (curEmails.includes(newEmail)) {
		alert("Recipient already selected.");
		return;
	}
	$("#newRecipientInput").val("")
	addEmailRecipient(newEmail);
	curEmails.push(newEmail);

}); // click newIssueRecipientBtn

/*
 * Sends email based on custom content.
 */


$("#recordNoteBtn").click(function() {
	$("#myModal").modal("hide");
	$("#issueBodyArea").html("");
	//if there is a creator, check the box and add it to the mailing list
	let currentUserEmail = firebase.auth().currentUser.email;
	if (ValidateEmail(curEvent.event.extendedProps.creator) && curEvent.event.extendedProps.creator != currentUserEmail) {
		$('#sendEmailCheckbox').prop('checked', true);
		$('#emailModalContainer').show();
		addEmailRecipient(curEvent.event.extendedProps.creator);
	}
	else {
		$('#sendEmailCheckbox').prop('checked', false);
		$('#emailModalContainer').hide();
	}
	$("#sendEmailTitle").html("&#128394; Recording Note");
	$("#alertSummaryHeader").html("Note");
	$("#issueBodyArea").attr("placeholder", "Note Summary");
	$("#sendIssueEmailBtn").html("Record Note");
	$("#sendIssueEmailModal").modal("show");
}); // reportIssueBtn


$("#reportIssueBtn").click(function() {
	$("#myModal").modal("hide");
	$("#issueBodyArea").html("");
	//if there is a creator, check the box and add it to the mailing list
	let currentUserEmail = firebase.auth().currentUser.email;
	if (ValidateEmail(curEvent.event.extendedProps.creator) && curEvent.event.extendedProps.creator != currentUserEmail) {
		$('#sendEmailCheckbox').prop('checked', true);
		$('#emailModalContainer').show();
		addEmailRecipient(curEvent.event.extendedProps.creator);
	}
	else {
		$('#sendEmailCheckbox').prop('checked', false);
		$('#emailModalContainer').hide();
	}
	$("#sendEmailTitle").html("&#9888;&#65039; Reporting Issue");
	$("#alertSummaryHeader").html("Issue");
	$("#issueBodyArea").attr("placeholder", "Issue Summary");
	$("#sendIssueEmailBtn").html("Report Issue");
	$("#sendIssueEmailModal").modal("show");
}); // reportIssueBtn

$("#sendIssueEmailBtn").click(async function() {
	$("#issueSpinner").show();
	$(this).attr("disabled", true);
	let shouldSendEmail = $("#sendEmailCheckbox").prop("checked");
	if (shouldSendEmail && !curEmails.length) {
		alert("No recipients selected. If you don't want to send a notification email to anyone, unselect the 'Send Email' checkbox.");
		return;
	}
	let now = new Date();
	if ($("#alertSummaryHeader").html() === "Issue") {
		let issue = `<b>${now.toDateString()} ${now.toLocaleTimeString()}</b> ${firebase.auth().currentUser.email} reported an issue: ${$("#issueBodyArea").val()}`;
		let success = await reportIssue(issue, curEvent, curEmails, shouldSendEmail)
		if (success) {
			$("#sendIssueEmailModal").modal("hide");
			if (shouldSendEmail) {
				alert("Recipient notified of issue.");
			}
		}
		$("#issueSpinner").hide();
		$(this).attr("disabled", false);
	}
	else if ($("#alertSummaryHeader").html() === "Note") {
		let note = `<b>${now.toDateString()} ${now.toLocaleTimeString()}</b> ${firebase.auth().currentUser.email} recorded a note: ${$("#issueBodyArea").val()}`;
		let success = await recordNote(note, curEvent, curEmails, shouldSendEmail);
		if (success) {
			$("#sendIssueEmailModal").modal("hide");
			if (shouldSendEmail) {
				alert("Recipient notified of note.");
			}
		}
		else {
			console.log(success);
		}
		$("#issueSpinner").hide();
		$(this).attr("disabled", false);
	}
	else {
		alert("Something went wrong. Please notify dougla55@purdue.edu.");
		$("#issueSpinner").hide();
		$(this).attr("disabled", false);
	}
}); // click sendEmailIssueBtn

async function reportIssue(issue, event, recipients, shouldSendEmail) {
	let result;
	var eventRef = eventCollection.doc(event.event.id);
	return eventRef.update({issues: firebase.firestore.FieldValue.arrayUnion(issue)})
	.then(async function() {
		//email the creator of the event to report that there is an issue
		var bodyString = `<html><h4>Issue Summary for Event '${event.event.title.substring(4)}' (${event.event.id}):</h4>${issue}<br><br><small><i>Contact the reporter directly ` +  
						  `if you have questions. ` +
						  `This is an auto-generated message from the SGI Shipping and Receiving application. ` + 
						  `Please do not reply to this message.</i></small></html>`;
		if (!shouldSendEmail) {
			return true;
		}
		result = await sendEmail("ATTN: Truck Issue Reported", bodyString, recipients);
		if (result == true) {
			return true;
		}
		else {
			alert("Email failed to send.");
		}
	}).catch(function(err){
		alert("An error occured; failed to report issue. Check your connection.");
		console.log(err);
		return false;
	});
	return result;
}

async function recordNote(note, event, recipients, shouldSendEmail) {
	let result;
	var eventRef = eventCollection.doc(event.event.id);
	return eventRef.update({specialNotes: firebase.firestore.FieldValue.arrayUnion(note)})
	.then(async function() {
		//email the creator of the event to report that there is an issue
		var bodyString = `<html><h4>Note Summary for Event '${event.event.title.substring(4)}' (${event.event.id}):</h4>${note}<br><br><small><i>Contact the reporter directly ` +  
						  `if you have questions. ` +
						  `This is an auto-generated message from the SGI Shipping and Receiving application. ` + 
						  `Please do not reply to this message.</i></small></html>`;
		if (!shouldSendEmail) {
			return true;
		}
		result = await sendEmail("ATTN: Truck Note Recorded", bodyString, recipients);
		if (result == true) {
			return true;
		}
		else {
			alert("Email failed to send.");
		}
	}).catch(function(err){
		alert("An error occured; failed to record note. Check your connection.");
		console.log(err);
		return false;
	});
	return result;
}

////----------------------------------!-------------------------------------///
//////////////////////////////////////////////////////////////////////////////
//////////////////////// END ALERT REPORTING FOR EVENTS /////////////////////
////////////////////////////////////////////////////////////////////////////
////---------------------------------!----------------------------------///


//////////////////////////////////////////////////////////////////////////////
////////////////////////////// RESOLVE EVENTS ///////////////////////////////
////////////////////////////////////////////////////////////////////////////


 $("#resolveShipmentBtn").click(function() {
 	$(this).attr("disabled", true);
 	$("#resolveSpinner").show();
 	if (curEvent.event.extendedProps.resolved) {
 		if(confirm("Event has already been resolved. If this was a mistake, confirm you would like to unresolve it. " +
 					"Note that if you associated any resolve notes originally, this action will not remove them for you.")) {
 			var eventRef = eventCollection.doc(curEvent.event.id);
 			var oldHistory = curEvent.event.extendedProps.history;
			if (oldHistory == undefined) {
				oldHistory = "";
			}
			let now = new Date();
			let newHistory = `<li>${$("#currentUser").html()} unresolved - ${now.toDateString()} ${now.toLocaleTimeString()}</li>` + oldHistory;
			return eventRef.update({resolved: false, history: newHistory})
			.then($("#myModal").modal("hide"));
 		}
 	}
	//curEvent is set on eventClick, representing our FullCalendar event object
	if (!confirm(`Please confirm you would like to mark truck from ${curEvent.event.title} for ${curEvent.event.extendedProps.customerName} as resolved.`)) {
		 $(this).attr("disabled", false);
 		$("#resolveSpinner").hide();
		return;
	}
	let response = prompt("If you would like to associate any relevant notes with the appointment, you may enter them below.");
	var notesWrapper = {}
	let now = new Date();
	if (response.trim().length > 0) {
		notesWrapper.notes = `Resolve Notes: ${response}\n${$("#modalComments").html()}`;
	}
	var changesWrapper = {};
	var oldHistory = curEvent.event.extendedProps.history;
	if (oldHistory == undefined) {
		oldHistory = "";
	}
	var resolveWrapper = {resolved: true, 
		history: `<li>${$("#currentUser").html()} marked resolved - ${now.toDateString()} ${now.toLocaleTimeString()}</li>` + oldHistory};
		let changes = Object.assign(changesWrapper, notesWrapper, resolveWrapper);

		var eventRef = eventCollection.doc(curEvent.event.id);
		console.log(changes);
		return eventRef.update(changes).then(function() {
			document.getElementById("resolveShipmentBtn").disabled = false;
			$("#resolveSpinner").hide();
			console.log("Document successfully updated!");
			// calendar.getEventById(curEvent.event.id).setProp("backgroundColor", "green");
			// calendar.getEventById(curEvent.event.id).setProp("borderColor", "white");
			// calendar.getEventById(curEvent.event.id).setExtendedProp("resolved", true);
			$("#myModal").modal("hide");
		})
		.catch(function(error) {
			document.getElementById("resolveShipmentBtn").disabled = false;
			$("#resolveSpinner").hide();
		    // The document probably doesn't exist.
		    console.error("Error updating document: ", error);
	});
}); // resolveShipmentBtn





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
	//let type = titleArr[1];
	//let title = titleArr[0];
	let vendorName = $("#modalVendor").html();
	let customerName = $("#modalCustomer").html();
	let destination = $("#modalDestination").html();
	let notes = $("#modalComments").html().replace(/<br>/g, "\r\n");

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

 	//ERROR CHECKING
 	let selectedDateComponents = ($("#editDatePicker").val()).split('-');
	let selectedDate = new Date(selectedDateComponents[0], selectedDateComponents[1] - 1, selectedDateComponents[2])
 	if (selectedDate.getDay() == 0 || selectedDate.getDay() == 6 ) {
 		alert ("You have selected a weekend for the new date. Try changing your selected date.");
 		return;
 	}

	//END ERROR CHECKING
	//determine which inputs have a change include and compile them into a changes object to be pushed to database
	$(this).attr("disabled", true);
	$("#updateSpinner").show();
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

	var wasRescheduled = false;
	var wasEdited = false;
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
			wasEdited = true;
		}
	}
	else {
		//was originally an incoming delivery
		if ($("#editoutgoingbtn").attr("class") == "btn btn-primary") {
			//change to incoming occurred
			isOutgoingChange.isOutgoing = true;
			wasEdited = true;
		}
	}
	//convert dates to the same format
	let newDateComponents = ($("#editDatePicker").val()).split('-');

	let newDate = `${newDateComponents[1]}/${newDateComponents[2]}/${newDateComponents[0]}`;
	if (newDate != $("#modalDate").html()) {
		dateChange.date = newDate;
		wasRescheduled = true;
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
		wasRescheduled = true;
	}
	if ($("#editStartTime").val() != origStart) {
		startTimeChange.startTime = $("#editStartTime").val();
		wasRescheduled = true;
	}
	if ($("#editEndTime").val() != origEnd) {
		endTimeChange.endTime = $("#editEndTime").val();
		wasRescheduled = true;
	}
	if ($("#editTitleBox").val() != "") {
		titleChange.title = $("#editTitleBox").val();
		wasEdited = true;
	}
	if ($("#editVendorBox").val() != "") {
		vendorChange.vendorName = $("#editVendorBox").val();
		wasEdited = true;
	}
	if ($("#editCustomerBox").val() != "") {
		customerChange.customerName = $("#editCustomerBox").val();
		wasEdited = true;
	}
	if ($("#editDestinationBox").val() != "") {
		destinationChange.destination = $("#editDestinationBox").val();
		wasEdited = true;
	}
	if ($("#editNotesArea").val() != "") {
		let result  = $("#editNotesArea").val().replace(/\n/g, "<br>");
		notesChange.notes = result;
		wasEdited = true;
	}
	let now = new Date();
	let nowStr = `${now.toDateString()}, ${now.toLocaleTimeString()}`;
	var newHistory = "";
	var oldHistory = curEvent.event.extendedProps.history;
	if (oldHistory == undefined) {
		oldHistory = "";
	}
	if (wasRescheduled) {
		newHistory += `<li>${$("#currentUser").html()} rescheduled - ${nowStr}</li>`;
	}
	if (wasEdited) {
		newHistory += `<li>${$("#currentUser").html()} edited - ${nowStr}</li>`;
	}
	let historyChange = { history: newHistory + oldHistory };
	//wrap any changes into simple object
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
		notesChange, 
		historyChange);
	console.log(changes);
	//update history accordingly (X edited, X rescheduled)

	if (Object.keys(changes).length > 0) {
		let eventId = $("#eventId").html();
		let curEventRef = eventCollection.doc(eventId);
		return curEventRef.update(changes)
		.then(function() {
			document.getElementById("confirmEditBtn").disabled = false;
			$("#updateSpinner").hide();
			console.log("Document successfully updated!");
    		//calendar eventWorker will handle the frontend changes.
    		$("#editModal").modal("hide");

    	})
		.catch(function(error) {
	    	// The document probably doesn't exist.
	    	document.getElementById("confirmEditBtn").disabled = false;
	    	$("#updateSpinner").hide();
	    	alert(`Error updating document: ${error}. Check your connection and try again.`);
	    });
	}


});
/*
 * Initialize paperwork manager modal
 */
 $("#managePaperworkBtn").click(function() {

 	if (curEvent.event.extendedProps.shipTicketNames != undefined) {
 		for (var i = 0; i < curEvent.event.extendedProps.shipTicketNames.length; i++) {
 			populatePdfManager(curEvent.event.extendedProps.shipTicketNames[i]);
 		}
 	} else {
 		alert("This appointment was created in an outdated version and does not support this functionality. " +
 			"If you need to edit paperwork, you'll have to recreate the event. New events will allow you to manage paperwork.");
 		return;
 	}
 	let suffixLen = 20;
 	$("#managePaperworkTitle").html(`Managing Paperwork for ${$("#modalTitle").html().substring(0, $("#modalTitle").html().length - suffixLen)}`);
 	$("#myModal").modal("hide");
 	$("#managePaperworkModal").modal("show");

 });

 $("#closeManagerBtn").click(function() {
 	for (var i = 0; i < curEvent.event.extendedProps.shipTicketUrls.length; i++) {
                            //If paperwork present, create a pdf container and associate it with the respective PDF url
                            addTicketPdfElement(`shipTicketPdfContainer${i}`);
                            PDFObject.embed(curEvent.event.extendedProps.shipTicketUrls[i], `#shipTicketPdfContainer${i}`);
	}
	if (curEvent.event.extendedProps.shipTicketUrls.length == 0){
                            $("#pdfInterface").hide();
                        }
                        else {
                            document.getElementById("pdfCarousel-inner").firstElementChild.setAttribute("class", "carousel-item active");
                            $("#pdfInterface").show();
                        }
 	$("#myModal").modal("show");
 });

 $("#paperworkUpdateBtn").click(async function() {
 	$("#paperworkSpinner").show();
 	document.getElementById("paperworkUpdateBtn").disabled = true;;
	//determine which boxes are unchecked
	var list = document.getElementById("fileList");
	var children = list.children;
	var removed = [];
	//grab initial files
	var origURLs = [...curEvent.event.extendedProps.shipTicketUrls];
	var origRefs = [...curEvent.event.extendedProps.shipTicketRefs];
	var origNames = [...curEvent.event.extendedProps.shipTicketNames];
	for (var i = children.length - 1; i >= 0; i--) {
		var child = children[i];
		if (child.lastElementChild.checked) {
			console.log(i);
	    	//add to list of files to remove
	    	removed.push(origRefs[i]);
	    	origURLs.splice(i, 1);
	    	origRefs.splice(i, 1);
	    	origNames.splice(i, 1);

	    }
	}
	//get new files
	let shipTicketFiles = document.getElementById('newPaperworkFileArea').files;
    //confirm all file types are ok before uploading any
    for (var i = 0; i < shipTicketFiles.length; i++) {
    	if (shipTicketFiles[i].type != "application/pdf") {
    		alert('Uploaded files must be saved as PDF.');
            //cancel upload

            $("#paperworkSpinner").hide();
            document.getElementById("paperworkUpdateBtn").disabled = false;
            return;
        }
    } 
    //upload any new files
    for (var i = 0; i < shipTicketFiles.length; i++) {
    	await uploadTaskPromise(shipTicketFiles[i]).then((response) => {
    		origURLs.push(response.downloadURL);
    		origRefs.push(response.ref);
    		origNames.push((response.name != undefined) ? response.name : response.ref);
    	});
    };



    let eventId = $("#eventId").html();
    let curEventRef = eventCollection.doc(eventId);

    let now = new Date();
    let nowStr = `${now.toDateString()}, ${now.toLocaleTimeString()}`;
    var oldHistory = curEvent.event.extendedProps.history;
    if (oldHistory == undefined) {
    	oldHistory = "";
    }

    var newHistory = "";
		//compile history changes
		if (shipTicketFiles.length > 0) {
			newHistory += `<li>${$("#currentUser").html()}  uploaded ${shipTicketFiles.length} new file(s) - ${nowStr}</li>`;
		}
		if (removed.length > 0) {
			newHistory += `<li>${$("#currentUser").html()}  removed ${removed.length} file(s) - ${nowStr}</li>`;
		}
		//update the document based on new/deleted files
		return curEventRef.update({shipTicketRefs: origRefs, shipTicketNames: origNames, shipTicketUrls: origURLs, 
			history: newHistory + oldHistory})
		.then(function() {
			console.log("Document successfully updated!");
    		//calendar eventWorker will handle the frontend changes.
    		removed.forEach((shipFile) => {
    			let shipRef = storageRef.child(shipFile);
    			shipRef.delete().then(function() {
              		// File deleted successfully
              		console.log("file deleted");
              	}).catch(function(error) {
              		alert(`Something went wrong: ${error}. Please try again.`);
              		return;
              	});
              });
    		$("#paperworkSpinner").hide();
    		$("#managePaperworkModal").modal("hide");
    		document.getElementById("paperworkUpdateBtn").disabled = false;
    		$("#clearNewPaperworkBtn").click();

    	})
		.catch(function(error) {
	    	// The document probably doesn't exist.
	    	$("#paperworkSpinner").hide();
    		document.getElementById("paperworkUpdateBtn").disabled = false;
	    	alert("Error updating document: ", error);
	    });
		//frontend snapshot handler will handle updating the calendar if we just update the database
	});


//delete file on click
$("#deleteShipmentBtn").click(function() {
	$(this).attr("disabled", true);

	if (confirm("Are you sure you wish to delete the event? This cannot be undone.")) {
		$("#cancelSpinner").show();
        //delete the db entry
        let docRef = eventCollection.doc($("#eventId").html());
        docRef.get().then(function(doc) {
        	docRef.delete().then(function() {
        		console.log("Document deleted.");
            //delete any paperwork
            shipFiles = doc.data().shipTicketRefs;
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
        //hide the modal
        document.getElementById("deleteShipmentBtn").disabled = false;
		$("#cancelSpinner").hide();
        $("#myModal").modal("hide");

    }).catch(function(error) {
    	$("#cancelSpinner").hide();
    	document.getElementById("deleteShipmentBtn").disabled = false;
    	alert(`Something went wrong: ${error}. Please contact dougla55@purdue.edu.`);
    	return;
    });
});
        

    } else {
    	document.getElementById("deleteShipmentBtn").disabled = false;
		$("#cancelSpinner").hide();
    } 
});




