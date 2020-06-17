$(document).ready(function() {
  $("#demo").html("jQuery working");
  //hide the event form on pageload
  $("#formcontainer").hide();
});

/*
 * Flip swap incoming and outgoing buttons if the incoming is pressed and is not enabled
 */
$("#incomingbtn").click(function() {
	$("#incomingbtn").attr("class", function(i, origValue){
		//if button not selected, switch
		if (origValue === "btn btn-outline-primary") {
			//flip other button
			$("#outgoingbtn").attr("class", "btn btn-outline-primary");
			return "btn btn-primary";
		}
		else return "btn btn-primary";
	});
}); 

/*
 * Flip swap outgoing and incoming buttons if the outgoing is pressed and is not enabled
 */
$("#outgoingbtn").click(function() {
	$("#outgoingbtn").attr("class", function(i, origValue){
		if (origValue === "btn btn-outline-primary") {
			//flip other button
			$("#incomingbtn").attr("class", "btn btn-outline-primary");
			return "btn btn-primary";
		}
		else return "btn btn-primary";
	});
}); 
