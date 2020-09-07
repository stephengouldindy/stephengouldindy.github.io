/*
 * pageWorker.js - dynamic DOM elements controller
 */

/*
 *  Maintains basic visual cue for when event data are scrollable
 */ 
$('#infoModalContainer').on('scroll', function() {
    let PADDING = 5;
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - PADDING) {
            $("#infoModalContainer").css("border-bottom-color", "rgba(0,0,0,.25)");
            $("#infoModalContainer").css("border-bottom-width", "1px");

        }
        else {
          $("#infoModalContainer").css("border-bottom-color", "red");
          $("#infoModalContainer").css("border-bottom-width", "3px");
        } 
})

$('body').on('click', function (e) {
        if ($(e.target).data('toggle') !== 'popover'
        && $(e.target).parents('.popover.in').length === 0) { 
          $('[data-toggle="popover"]').popover('hide');
        }
    });


window.onclick = function(event) {
  if (!event.target.matches('#dropdownbtn') && !event.target.matches('#hamburger')) {
      if ($("#myDropdown").css("opacity") === 0.0) {
        return;
      }
    $("#myDropdown").css("opacity", 0.0);
    $("#myDropdown").css("visibility" , "hidden");
  }

  //TODO: Make popover hide when clicked outside
}

/*
 * addTicketPdfElement - Adds a PDFObject div and its containing carousel element to the document
 */
function addTicketPdfElement(id) {
    var p = document.getElementById("pdfCarousel-inner");
    var newElement = document.createElement('div');
    newElement.setAttribute('class', "carousel-item");
    newElement.setAttribute('id', id);
    p.appendChild(newElement);
}

/*
 * populatePdfManager - handles populating the paperwork management screen based on present PDFS
 */
function populatePdfManager(file, storageName) {
	//Creates a simple file list element
	var list = document.getElementById("fileList");
	var newRow = document.createElement('div');
	newRow.setAttribute('class', 'row');
	var newFileName = document.createElement('text');
	newFileName.innerHTML = file;
	newFileName.setAttribute("id", `${file}-text`);
	newRow.appendChild(newFileName);
	var newCheckbox = document.createElement('input');
	newCheckbox.setAttribute("type", "checkbox");
	newCheckbox.setAttribute("style", "margin: .25em; margin-bottom: 0px; height: 15px; width: 15px;");
	newRow.appendChild(newCheckbox);
	list.appendChild(newRow);
}

function addEmailRecipient(email) {
    //assumes email is formatted properly
    if (!curEmails.length) {
        $("#recipientList").html("");
    }
    let emailList = document.getElementById("recipientList");
    var newEmailElement = document.createElement("li");
    newEmailElement.innerHTML = email;
    emailList.appendChild(newEmailElement);
}


/*
 * Adds a generic alert with the @param issueText to the info modal. Can be deleted with its appended deleted button
 */
function addNoteAlert(issueText) {
    let noteAlert = document.createElement("div");
    noteAlert.setAttribute("class", "alert alert-info");
    //add a button which permanently deletes the alert
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-danger tiny-btn alert-delete");
    deleteButton.innerHTML = "Delete ";
    noteAlert.addEventListener("click", deleteNote);
    noteAlert.appendChild(deleteButton);

    noteAlert.innerHTML = noteAlert.innerHTML + "<br>" + issueText;
    $("#infoModalContainer").prepend(noteAlert); 
}


function addIssueAlert(issueText) {
    let warningAlert = document.createElement("div");
    warningAlert.setAttribute("class", "alert alert-danger")
    //add a button which resolves the alert
    var resolveButton = document.createElement("button");
    resolveButton.setAttribute("class", "btn btn-success tiny-btn alert-resolver");
    resolveButton.innerHTML = "Resolve Issue ";
    warningAlert.addEventListener("click", resolveIssue);
    warningAlert.appendChild(resolveButton);
    //add a button to permanently delete the alert
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-danger tiny-btn alert-delete");
    deleteButton.innerHTML = "Delete ";
    warningAlert.addEventListener("click", deleteNote);
    warningAlert.appendChild(deleteButton);

    warningAlert.innerHTML = warningAlert.innerHTML + "<br>" + issueText;
    $("#infoModalContainer").prepend(warningAlert); 
}
function addResolvedIssueAlert(issueText) {
    let resolvedAlert = document.createElement("div");
    resolvedAlert.setAttribute("class", "alert alert-success");
    // resolvedAlert.innerHTML = issueText;
    //add a button to permanently delete the alert
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-danger tiny-btn alert-delete");
    deleteButton.innerHTML = "Delete ";
    resolvedAlert.addEventListener("click", deleteNote);
    $(resolvedAlert).prepend($(deleteButton));
    resolvedAlert.innerHTML = resolvedAlert.innerHTML + "<br>" + issueText;
    $("#infoModalContainer").prepend(resolvedAlert); 
}


function deleteNote(event) {

    if(!event.target.matches(".alert-delete")) {
        return;
    }

    if (!confirm("Are you sure you would like to delete this alert? This is irreversible.")) {
        return;
    }
    let button = $(event.target).parent().prevObject[0];
    let spinner = document.createElement("span");
    spinner.setAttribute("class", "spinner-border spinner-border-sm");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-hidden", "true");
    button.appendChild(spinner);
    var eventRef = eventCollection.doc(curEvent.event.id);
    //grab issue text from the alert parent's html, ignoring its header
    let alertText = $(event.target).parent().html();
    let issue = alertText.split("<br>")[1];
    let alert = $(event.target).parent();

    //if the alert is green, then it is a resolved issue and we should update resolvedIssues, not issues

    if (alert.hasClass("alert-success")) {
        return eventRef.update({resolvedIssues: firebase.firestore.FieldValue.arrayRemove(issue)})
        .then(async function() {
            alert.parent()[0].removeChild(alert[0]);
        }).catch(function(err){
            alert("An error occured; failed to remove the alert. Check your connection.");
            console.log(err);
        });
    }
    else {
        return eventRef.update({issues: firebase.firestore.FieldValue.arrayRemove(issue)})
        .then(async function() {
            alert.parent()[0].removeChild(alert[0]);
        }).catch(function(err){
            alert("An error occured; failed to remove the alert. Check your connection.");
            console.log(err);
        });
    }

}



function resolveIssue(event) {
    if(!event.target.matches(".alert-resolver")) {
        return;
    }

    if (!confirm("Are you sure you would like to mark this issue as resolved? This is irreversible.")) {
        return;
    }
    let button = $(event.target).parent().prevObject[0];
    let spinner = document.createElement("span");
    spinner.setAttribute("class", "spinner-border spinner-border-sm");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-hidden", "true");
    button.appendChild(spinner);
    var eventRef = eventCollection.doc(curEvent.event.id);
    //grab issue text from the alert parent's html, ignoring its
    let alertText = $(event.target).parent().html();
    let issue = alertText.split("<br>")[1];
    return eventRef.update({issues: firebase.firestore.FieldValue.arrayRemove(issue)})
    .then(function() {
        //if the alert is not just being resolved, we want to leave it removed
        return eventRef.update({resolvedIssues: firebase.firestore.FieldValue.arrayUnion(`(Resolved by ${$("#currentUser").html()}) ${issue}`)})
    })
    .then(async function() {
        //grab the alert from the event in order to clean it up
        var alert = button.parentElement;  
        alert.removeChild(button);
        alert.setAttribute("class", "alert alert-success");
        alert.innerHTML = `(Resolved by ${$("#currentUser").html()}) ${issue}`;
    }).catch(function(err){
        alert("An error occured; failed to resolve issue. Check your connection.");
        console.log(err);
    });
}




$('#sendEmailCheckbox').change(function() {
    if(this.checked) {
        $("#emailModalContainer").slideDown(200);
    } else {
        $("#emailModalContainer").slideUp(200);
    }        
});



/*
 * Cleans up issue email recipients on modal close so they don't accumulate.
 */
$('#sendIssueEmailModal').on('hidden.bs.modal', function() {
    var p = document.getElementById("recipientList");
    var child = p.lastElementChild;  
        while (child) { 
            p.removeChild(child); 
            child = p.lastElementChild; 
        }
    curEmails = [];
    $("#recipientList").html("None specified.");
    $("#issueBodyArea").val("");
});

/*
 * Cleans up pdf viewers on modal close so they don't accumulate.
 */
$('#myModal').on('hidden.bs.modal', function() {
    var p = document.getElementById("pdfCarousel-inner");
        var child = p.lastElementChild;  
        while (child) { 
            p.removeChild(child); 
            child = p.lastElementChild; 
        } 
    let modalContainer = document.getElementById("infoModalContainer");
    var alerts = modalContainer.getElementsByClassName("alert");
    for (var i = alerts.length - 1; i >= 0; i--) {
        modalContainer.removeChild(alerts[i]);
    }

});
/*
 * Cleans up fileList on modal close so files don't accumulate.
 */
$('#managePaperworkModal').on('hidden.bs.modal', function() {
  var p = document.getElementById("fileList");
  var child = p.lastElementChild;  
        while (child) { 
            p.removeChild(child); 
            child = p.lastElementChild; 
        } 
});