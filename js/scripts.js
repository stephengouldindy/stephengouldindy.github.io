$(document).ready(function() {
	//update status tag
  $("#demo").html("prerelease v0.18 | Database Status: NONEXISTENT");
  //hide the event form on pageload
  $("#formcontainer").hide();
  //hide its child freight container
  $("#freightContainer").hide();
});

/*
 * Flip swap incoming and outgoing buttons if the incoming is pressed and is not enabled
 */
$("#incomingbtn").click(function() {
	$("#incomingbtn").attr("class", function(i, origValue){
		//if button not selected, switch
		if (origValue === "btn btn-outline-primary") {
			//flip other button
			$("#outgoingbtn").attr("class", "btn btn-outline-danger");
			//toggle button states for good practice
			return "btn btn-danger";
		}
		else return "btn btn-danger";
	});
}); 

/*
 * Flip swap outgoing and incoming buttons if the outgoing is pressed and is not enabled
 */

$("#outgoingbtn").click(function() {
	$("#outgoingbtn").attr("class", function(i, origValue){
		if (origValue === "btn btn-outline-danger") {
			//flip other button
			$("#incomingbtn").attr("class", "btn btn-outline-primary");
			return "btn btn-primary";
		}
		else return "btn btn-primary";
	});
}); 

/*
 * Clear delivery window time boxes
 */

 $("#clearTimeBtn").click(function() {
 	$("#startTime").val("");
 	$("#endTime").val("");
 });




/*
 * Show/Hide freight form, and update button accordingly
 */
 $("#freightManageBtn").click(function() {
 	//show the form if hidden; hide if shown
 	if ($("#freightManageBtn").html() === "Manage Freight") {
 		$("#freightManageBtn").html("Hide Freight Menu");
 		$("#freightContainer").slideDown(300);

 	}
 	else {
 		$("#freightManageBtn").html("Manage Freight");
 		$("#freightContainer").slideUp(300);
 	}
 	
 	//update the button with the proper label
 });



/*
 * Schedule truck: collect form data, wrap into event obj, and place it in the calendar and hide the form.
 
  $("#submitTruckBtn").click(function() {
  	//unwrapping data...
 	let startTime = $("#startTime").val();
 	let endTime = $("#endTime").val();
 	let date = $("#dateAlert").html();
 	let customerName = $("#customerBox").val();
	let vendorName = $("#vendorBox").val();
 	let destination = $("#destinationBox").val();
 	console.log(startTime);
 	console.log(endTime);
 	console.log(date);
 	console.log(customerName);
 	console.log(vendorName);
 	console.log(destination);

 	//packing data into object
	var newEvent = {
              title: vendorName,
              start: startTime,
              end: endTime,
              allDay: false,
              editable: true

    };
 	//insert new object into calendar as event 
	calendar.addEvent({
	              title: "TestEvent",
	              start: new Date(2020,5,18, 13,30,0),
	              end: new Date(2020,5,18,16,30,0),
	              allDay: false
	    	})


 	//hide form

 	//scroll to top
 });
 */