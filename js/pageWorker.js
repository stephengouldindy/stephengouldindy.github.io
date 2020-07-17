/*
 * pageWorker.js - dynamic DOM elements controller (don't work too hard!)
 */



/*
 * addTicketPdfElement - Adds a PDFObject and its containing carousel element to the document
 */
function addTicketPdfElement(id) {
    var p = document.getElementById("pdfCarousel-inner");
    var newElement = document.createElement('div');
    newElement.setAttribute('class', "carousel-item");
    newElement.setAttribute('id', id);
    p.appendChild(newElement);

}