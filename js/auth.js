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


$("#createAccountBtn").click(function() {
	console.log("click");
	let email = $("#newUserEmail").val();
	let password = $("#newUserPass").val();
	console.log(email,password);

	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
	  // ...
	});
});