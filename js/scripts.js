
$(document).ready(function() {
	//update status tag
  $("#demo").html("prerelease v0.37 | Database Status: Add, View, Delete Events");
  //hide the event form on pageload
  $("#formcontainer").hide();
  //hide its child freight container
  $("#freightContainer").hide();
  //$("#pdfCarousel").hide();
  
});

/*
 * Flip swap incoming and outgoing buttons if the incoming is pressed and is not enabled
 */
$("#incomingbtn").click(function() {
	$("#incomingbtn").attr("class", function(i, origValue){
		//if button not selected, switch
		if (origValue === "btn btn-outline-primary") {
			//flip other button
			$("#outgoingbtn").attr("class", "btn btn-outline-warning");
			//toggle button states for good practice
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