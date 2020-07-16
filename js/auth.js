/*
 * auth.js - contains scripts for user management, including signups/signins on login page
 */
$(document).ready(function() {
  let today = new Date();
  console.log(today);
  $("#calendarApplet").hide();

  $("#version").html("BETA v2.1");
  //hide the event form on pageload
  $("#formcontainer").hide();


  //$("#pdfCarousel").hide();

  firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    console.log(user, user.emailVerified);
    if (!user.emailVerified) {

      await firebase.auth().signOut().then(function() {
        console.log("logged out");
          
        }).catch(function(error) {
        // An error happened.
      });
      return;
    }
  	$("#loginApplet").fadeOut();
    $("#signOutBtn").show();
    $("#signOutBtn").css("display", "inline-block");
    $("#currentUser").html(user.displayName);
    $("#currentUser").show();
  	$("#blueLogo").show();
  	$("footer").hide();


  	db.collection("events").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    console.log(changes);
    changes.forEach(change => {
        let data = change.doc.data();
        if (change.type === "removed") {
            //FIXME: find a better solution to this
            let event = calendar.getEventById(change.doc.id);
            event.remove();
        }
        else if (change.type === "modified") {
          setTimeout(function() {location.reload();}, 300);
        }
        else if (change.type === "added") {
            let day = data.date.split('/')[1];
            let month = data.date.split('/')[0] - 1;
            let year = data.date.split('/')[2];
            let dateObj = new Date(year, month, day);
            let bkgColor = data.isOutgoing ? '#082a40' : '#F24E1B';
            let borderColor = !data.isOutgoing ? '#082a40' : '#F24E1B';
            let shipTicketURL = data.shipTicketURL;
            let ladingURL = data.ladingURL;
            let eventTextColor = 'white';
            let prefix = data.isOutgoing ? "O - " : "I - ";
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
                          title: prefix + data.title,
                          vendorName: data.vendorName,
                          id: change.doc.id,
                          eventTextColor: eventTextColor,
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
                          shipTicketUrls: data.shipTicketUrls,
                          creator: data.creator,
                          resolved: data.resolved
                    }; //newEvent
                } else {
                    let dateObj = new Date(year, month, day);
                    newEvent = {
                        title: prefix + data.title,
                        vendorName: data.vendorName,
                        id: change.doc.id,
                        start: dateObj,
                        eventTextColor: eventTextColor,
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
                        shipTicketUrls: data.shipTicketUrls,
                        creator: data.creator,
                        resolved: data.resolved
                    }; //newEvent
                } //end else
                calendar.addEvent(newEvent);
            
        } //end added type
        
        //TODO: HANDLE DELETE AND UPDATE
    });
    pastEventListener();
  }); //END FIRESTORE EVENT CHANGE LISTENER
  	

  $("#calendarApplet").fadeIn();
  calendar.render();

    // ...
  } else {
    // User is signed out.
    $("#calendarApplet").fadeOut();
    $("#currentUser").hide();
  	$("#signOutBtn").hide();
  	$("#blueLogo").fadeOut();
  	$("footer").fadeIn();
  	$("#loginApplet").fadeIn();

    // ...
  	}
  });
});
$("#signOutBtn").click(function() {
  if (confirm("Are you sure you would like to log out?")) {
  	calendar.getEvents().forEach(event => event.remove());
  	firebase.auth().signOut().then(function() {
  	  console.log("logged out");
  	  $("#formcontainer").hide();
  	}).catch(function(error) {
  	  // An error happened.
  	});
  }
});


//creates an account using the provided information and associate the display name with it
$("#createAccountBtn").click(async function() {
	
	let email = $("#newUserEmail").val();
  if (email.split("@")[1] != "stephengould.com") {
    alert("You must register with a Stephen Gould email.");
    return;
  }
	let password = $("#newUserPass").val();
	let displayName = $("#newUserName").val();

	await firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
      alert("Registration failed... " + error.message);
      return;
	  // ...
	});
	var user = firebase.auth().currentUser;
	user.updateProfile({
  	displayName: displayName,
	}).then(async function() {
  		// Update successful.
  		console.log("displayName associated");
  		console.log(user.displayName, user.email);
      user.sendEmailVerification().then(function() {
        // Email sent.
        //alert(`A confirmation email has been sent to ${user.email}. Check your email to log in.`);
        firebase.auth().signOut().then(function() {
        console.log("logged out");
        alert(`Account created. Check ${user.email} for a confirmation email in order to be able to log in.`);
          
        }).catch(function(error) {
        // An error happened.
        });
      }).catch(function(error) {
        // An error happened.
      });

	}).catch(function(error) {
  		// An error happened.
  		console.log("displayName failed");
      //delete user
	});
});


$("#signInBtn").click(async function() {
  var email = $("#loginEmail").val();
	var password = $("#loginPass").val();
	var signInAttempt; 
	try {
		signInAttempt = await firebase.auth().signInWithEmailAndPassword(email, password);

		if (signInAttempt.user) {
      if (signInAttempt.user.emailVerified === false) {
            alert(`Please check your email for a verification link to be able to view and manage appointments. If you need a new confirmation email, `
            + `you may request one in the 'Resend Verification' tab.` );
          }
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
$('#myModal').on('hidden.bs.modal', function () {
  var p = document.getElementById("pdfCarousel-inner");
  var child = p.lastElementChild;  
        while (child) { 
            p.removeChild(child); 
            child = p.lastElementChild; 
        } 
});
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
