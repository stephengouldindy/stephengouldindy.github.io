/*
 * auth.js - contains scripts for user management, including signups/signins on login page
 */
$(document).ready(function() {

  $("#calendarApplet").hide();
  $("#version").html("prerelease v0.95");
  //hide the event form on pageload
  $("#formcontainer").hide();

  //$("#pdfCarousel").hide();
  console.log(firebase.auth().currentUser);

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	console.log(user.email);
  	$("#loginApplet").fadeOut();
  	$("#signOutBtn").show();
  	$("#blueLogo").show();
  	$("footer").hide();
  	$("#calendarApplet").fadeIn();

    // ...
  } else {
    // User is signed out.
    $("#calendarApplet").fadeOut();
  	$("#signOutBtn").hide();
  	$("#blueLogo").fadeOut();
  	$("footer").show();
  	$("#loginApplet").fadeIn();

    // ...
  }
});
});
$("#signOutBtn").click(function() {
	console.log("clicked it");
	firebase.auth().signOut().then(function() {
	  console.log("logged out");
	  $("#formcontainer").hide();
	}).catch(function(error) {
	  // An error happened.
	});
});

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


//creates an account using the provided information and associate the display name with it
$("#createAccountBtn").click(async function() {

	let email = $("#newUserEmail").val();
	let password = $("#newUserPass").val();
	let displayName = $("#newUserName").val();

	await firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
	  // ...
	});
	var user = firebase.auth().currentUser;
	console.log(user);
	user.updateProfile({
  	displayName: displayName,
	}).then(function() {
  		// Update successful.
  		console.log("displayName associated");
  		console.log(user.displayName, user.email);
	}).catch(function(error) {
  		// An error happened.
  		console.log("displayName failed");
	});
});
$("#signInBtn").click(async function() {
	var email = $("#loginEmail").val();
	var password = $("#loginPass").val();
	console.log(`email: ${email} pass: ${password}`);
	var signInAttempt; 
	try {
		signInAttempt = await firebase.auth().signInWithEmailAndPassword(email, password);
		console.log(signInAttempt);
		if (signInAttempt.user) {
			
		}
	}
	catch(error) {
  		// Handle Errors here.
  		console.log('caught err');
  		var errorCode = error.code;
  		var errorMessage = error.message;
  		if (errorCode === 'auth/wrong-password') {
    		alert('Wrong password.');
  		} else {
    		alert(errorMessage);
  		}
	}
	
});
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
