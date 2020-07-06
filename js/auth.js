/*
 * auth.js - contains scripts for user management, including signups/signins on login page
 */
$(document).ready(function() {

  $("#calendarApplet").hide();
  $("#version").html("prerelease v0.97");
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
  	db.collection("events").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    console.log(changes);
    changes.forEach(change => {
        if (change.type === "removed") {
            //FIXME: find a better solution to this
            setTimeout(function() { location.reload(); }, 750);
        }
        else if (change.type === "added") {
            let data = change.doc.data();
            let day = data.date.split('/')[1];
            let month = data.date.split('/')[0] - 1;
            let year = data.date.split('/')[2];
            let dateObj = new Date(year, month, day);
            let bkgColor = data.isOutgoing ? '#5da4c2' : '#eb8944';
            let borderColor = !data.isOutgoing ? '#5da4c2' : '#eb8944';
            let shipTicketURL = data.shipTicketURL;
            let ladingURL = data.ladingURL;
            //TODO: 

            var newEvent;

            if (!data.allDay) {
                    let startHour = data.startTime.split(':')[0];
                    let startMinute = data.startTime.split(':')[1];
                    let endHour = data.endTime.split(':')[0];
                    let endMinute = data.endTime.split(':')[1];
                    let startDate = new Date(year, month, day, startHour, startMinute);
                    let endDate = new Date(year, month, day, endHour, endMinute);
                    
                    
                    newEvent = {
                          title: data.title,
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
                          ladingURL: ladingURL,
                          shipTicketURL: shipTicketURL

                    }; //newEvent
                } else {
                    let dateObj = new Date(year, month, day);
                    newEvent = {
                        title: data.title,
                        start: dateObj,
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
                        ladingURL: ladingURL,
                        shipTicketURL: shipTicketURL
                        
                    }; //newEvent
                } //end else
                calendar.addEvent(newEvent);
            
        } //end added type
        
        //TODO: HANDLE DELETE AND UPDATE
    });
  }); //END FIRESTORE EVENT CHANGE LISTENER
  	calendar.render();
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
	calendar.getEvents().forEach(event => event.remove());
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
