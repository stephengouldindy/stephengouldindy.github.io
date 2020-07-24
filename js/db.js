/*
 * db.js - intializes page based on firebase/firestore states; handles firestore communication
 */


$(document).ready(function() {
  let today = new Date();
  // $("#calendarApplet").hide();
  $("#version").html("BETA v2.6");
  //hide the event form on pageload
  $("#formcontainer").hide();


  firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    console.log("logged in");
    if (!user.emailVerified) {
      //TOOD: If user logs in without emailVerification, 
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
  	$("#blueLogo").fadeIn();
    $("#hamburger").fadeIn();
  	$("footer").hide();


  	db.collection("events").onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      console.log(changes);
      changes.forEach(change => {
          
          if (change.type === "removed") {
              let event = calendar.getEventById(change.doc.id);
              event.remove();
          }
          else if (change.type === "modified") {
            //replace event
            calendar.getEventById(change.doc.id).remove();
            addCalendarEvent(change);
          }
          else if (change.type === "added") {
              addCalendarEvent(change)
          } 
          
      });
      //set all event colors based on status
      eventColorWorker(true);
    }); //END FIRESTORE EVENT CHANGE LISTENER
  	

    $("#calendarApplet").fadeIn();
    calendar.render();

  } else {
    // User is signed out.
    $("#calendarApplet").fadeOut();
    $("#currentUser").html("");
    $("#currentUser").hide();
  	$("#signOutBtn").hide();
  	$("#blueLogo").fadeOut();
  	$("footer").fadeIn();
    $("#hamburger").fadeOut();
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
        firebase.auth().signOut().then(function() {
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
      alert("An error occurred.");
      //delete user
	});
});

$("#forgotPassword").click(function() {
  var emailAddress = prompt("Enter your email:");
  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
  alert(`Password reset email sent to ${emailAddress}.`)
}).catch(function(error) {
  // An error happened.
  alert(error);
});

})

/*
 * Attempts to sign the user in.
 */
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
	
}); // end signInBtn

/*
 * Attempts to resend confirmation email or log the user in if they are already verified
 */

$("#resendEmailBtn").click(async function() {

    var email = $("#resendEmailBox").val();
  var password = $("#resendEmailPass").val();
  console.log(`email: ${email} pass: ${password}`);
  var signInAttempt; 
  try {
    signInAttempt = await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log(signInAttempt);
    if (signInAttempt.user) {
      //sign-in success
      if (signInAttempt.user.emailVerified) {
        alert("Your account has already been verified. Logging you in...");
      }
      else {
        //user not verified
        signInAttempt.user.sendEmailVerification().then(function() {
            // Email sent.
            console.log("Email sent.")
            alert(`Email sent to ${signInAttempt.user.email}. Check your inbox and confirm your email to be able to log in.`);
        }).catch(function(error) {
          // An error happened.
          alert(`ERROR: ${error}`);
        });
      }

    }
  }
  catch(error) {
      // Handle Errors here.
      console.log('caught err');
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.code, error.message);
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
  }
      
}); //end resendEmailBtn


/*
 * Framework found on stackoverflow.
 * Uploads the given Javascript file object. 
 * @return SUCCESS - Resolved promise containing the reference in firebase and the download URL.
 * @return FAILURE - Rejected promise which causes the form to reopen.
 */
async function uploadTaskPromise(file) {
    return new Promise(function(resolve, reject) {
        //FIXME: Differentiate between the Firestore fire name and the name that appears in the
        //pdf viewer.
        let fileName = `${uuidv4()}.pdf`;
        let fileRef = storageRef.child(fileName);
        uploadTask = fileRef.put(file);
        uploadTask.on('state_changed',
            function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            function error(err) {
                alert('error', err);
                reject();
                $("#formcontainer").slideDown(300);
            },
            function complete() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    resolve({downloadURL: downloadURL, ref: fileName, name: file.name});
                })
            });
    }); 
}
/*
 * Found on stack overflow. Generates a (extremely likely to be) unique key. If it's not, it was the fate of God. Sorry about your lost file.
 */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
