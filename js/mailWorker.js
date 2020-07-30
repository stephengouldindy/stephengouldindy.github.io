/*
 * mailWorker.js -- handles sending emails, including shipment logs
 */



function sendEmail(subject, body, recipient) {
	return new Promise(function(resolve, reject) {
		Email.send({
		    SecureToken: "1ce5a376-3e2b-4ec2-8d43-902c7a0c0bda", 
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
