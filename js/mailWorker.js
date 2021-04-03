/*
 * mailWorker.js -- handles sending emails, including shipment logs
 */


function testinUpdate() {

}


function sendEmail(subject, body, recipient) {
	return new Promise(function(resolve, reject) {
		Email.send({
		    SecureToken: "85efefc1-ef75-4ee2-81a6-2bdbb5b1baa2", 
		    To : recipient,
		    From : "sgi.shippingreceiving@gmail.com",
		    Subject : subject,
		    Body : body
		}).then(function(message) {
			console.log(message);
			if (message == "OK") {
				resolve(true);
			} else {
				resolve(false);
			}

		}
		).catch(function(err) {
			console.log(err);
			resolve(false);
		});
	});
}
