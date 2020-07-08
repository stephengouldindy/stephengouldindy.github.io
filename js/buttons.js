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

/*
 * Clear delivery window time boxes
 */

 $("#clearTimeBtn").click(function() {
 	console.log($("#startTime").val());
 	console.log($("#endTime").val());
 	$("#startTime").val("");
 	$("#endTime").val("");
 });
$("#editInfoBtn").click(function() {
  alert("Function not yet implemented. Sorry, but you'll have to create a new event if you need to make changes.");
});
//delete file on click
            $("#deleteShipmentBtn").click(function() {
                if (confirm("Are you sure you wish to delete the event? This cannot be undone.")) {
                    let billFile; 
                    let billRef;
                    let docRef = db.collection("events").doc($("#eventId").html());
                    docRef.get().then(function(doc) {
                        
                        

                        docRef.delete().then(function() {
                        console.log("Document deleted.");
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