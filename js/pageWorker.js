/*
 * pageWorker.js - dynamic DOM elements controller (don't work too hard!)
 */



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
function populatePdfManager() {

}