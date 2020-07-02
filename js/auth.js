/*
 * auth.js - contains scripts for user management, including signups/signins
 */
$(document).ready(function() {
	var firebaseConfig = {
    apiKey: "AIzaSyBo4nl7Mdie9miskxI6zIC91fkqAjlZqn8",
    authDomain: "sgci-rds.firebaseapp.com",
    databaseURL: "https://sgci-rds.firebaseio.com",
    projectId: "sgci-rds",
    storageBucket: "sgci-rds.appspot.com",
    messagingSenderId: "184884483557",
    appId: "1:184884483557:web:6ccaf82fe8987830c3cb0c",
    measurementId: "G-WVCBC8FL46"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
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
			window.location.href = '/calendar.html';
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