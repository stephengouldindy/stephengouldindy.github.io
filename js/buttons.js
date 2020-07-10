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
 	console.log($("#startTime").val());
 	console.log($("#endTime").val());
 	$("#startTime").val("");
 	$("#endTime").val("");
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
  alert("Function not yet implemented. Sorry, but you'll have to create a new event if you need to make changes.");
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

