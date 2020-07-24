/*
 * pageWorker.js - dynamic DOM elements controller
 */

//if 
$('#infoModalContainer').on('scroll', function() {
    console.log("scrolled");
    let PADDING = 5;
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - PADDING) {
            $("#infoModalContainer").css("border-bottom-color", "grey");
            $("#infoModalContainer").css("border-bottom-width", "1px");

        }
        else {
          $("#infoModalContainer").css("border-bottom-color", "red");
          $("#infoModalContainer").css("border-bottom-width", "3px");
        } 
})

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


/*
 * Cleans up pdf viewers on modal close so they don't accumulate.
 */
$('#myModal').on('hidden.bs.modal', function () {
  var p = document.getElementById("pdfCarousel-inner");
  var child = p.lastElementChild;  
        while (child) { 
            p.removeChild(child); 
            child = p.lastElementChild; 
        } 
});
/*
 * Cleans up fileList on modal close so files don't accumulate.
 */
$('#managePaperworkModal').on('hidden.bs.modal', function () {
  var p = document.getElementById("fileList");
  var child = p.lastElementChild;  
        while (child) { 
            p.removeChild(child); 
            child = p.lastElementChild; 
        } 
});