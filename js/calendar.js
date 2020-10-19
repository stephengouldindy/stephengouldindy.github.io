
        var _DEBUG = false;
        var curMinute;
        var curHour;
        var curDay;
        var curMonth;
        var curYear;
        var calendar;

        document.addEventListener('DOMContentLoaded', function() {
            var calendarEl = document.getElementById('calendar');

            calendar = new FullCalendar.Calendar(calendarEl, {
                height: "auto",
                weekends: false,
                eventTextColor: 'white',
                nowIndicator: true,
                minTime: "06:00:00",
                maxTime: "16:30:00",
                plugins: [ 'dayGrid', 'timeGrid', 'interaction' ],
                defaultView: 'timeGridWeek',
                selectable: false,
                header: {
                    left: 'prev,next, today',
                    center: 'title',
                    right: 'timeGridDay, timeGridWeek, dayGridMonth'
                },
                //Date clicking handling 
                dateClick: function(info) {
                    curDay = info.date.getDate();
                    curMonth = info.date.getMonth() + 1;
                    curYear = info.date.getFullYear();
                    //display new shipment form
                    $("#formcontainer").slideDown(0); 

                    $("#dateAlert").html(`Selected Date: <b>${curMonth}/${curDay}/${curYear}</b>`);
                    //flash selection colour
                    let oldColor = info.dayEl.style.backgroundColor;
                    info.dayEl.style.backgroundColor = '#c7c7c7';
                    setTimeout(function() {info.dayEl.style.backgroundColor = oldColor;}, 100);
                    //window.scrollTo((document.getElementById('formcontainer').scrollTop));
                    document.getElementById('formcontainer').scrollIntoView({ behavior: "smooth", block: 'nearest'});

                    curDay = info.date.getDate();
                    curMonth = info.date.getMonth() + 1;
                    curYear = info.date.getFullYear();              
                }, //end dateClick
                eventClick: function(info) {
                    //populate event info modal with event data
                    var time = (info.event.allDay) ? "No window specified." : `${info.event.extendedProps.eventStartTime}-${info.event.extendedProps.eventEndTime}`;
                    var type = (info.event.extendedProps.isOutgoing) ? "OUTGOING SHIPMENT" : "INCOMING DELIVERY"
                    $("#modalVendor").html(`${info.event.title} - ${type}`);
                    $("#modalCustomer").html(` ${info.event.extendedProps.customerName}`);
                    $("#modalDate").html(` ${info.event.extendedProps.eventDate}`);
                    if (!info.event.allDay) {
                        $("#modalTime").html(` ${info.event.extendedProps.eventStartTime}-${info.event.extendedProps.eventEndTime}`);
                    }
                    else {
                        $("#modalTime").html(" No time specified.");
                    }
                    $("#modalDestination").html(` ${info.event.extendedProps.destination}`);
                    $("#modalComments").html(` ${info.event.extendedProps.comments}`);
                    $("#eventId").html(info.event.extendedProps.docId);

                    PDFObject.embed(info.event.extendedProps.shipTicketURL, "#shipTicketPdfContainer");
                    PDFObject.embed(info.event.extendedProps.ladingURL, "#ladingPdfContainer");
                    
                    $("#myModal").modal("show");
                    
                }
                
            });

            


            /*
            * Schedule truck: collect form data, wrap into event obj, and place it in the calendar and hide the form.
            */
            $("#submitTruckBtn").click(async function() {
                //unwrapping data...
                var startTime = $("#startTime").val();
                var endTime = $("#endTime").val();

                //FIXME DIFFERENTIATE BETWEEN INVALID AND ALL DAY EVENTS
                var allDay = (startTime === "");
                console.log("allDay:" + allDay);
                var startHour;
                var startMinute;
                var endHour;
                var endMinute;
                var isOutgoing = ($("#outgoingbtn").attr("class") === "btn btn-primary");
                var bkgColor = (isOutgoing ?  '#1a75ff' : '#F24E1B');
                if (!allDay) { 
                    startHour = startTime.split(":")[0];
                    startMinute = startTime.split(":")[1];
                    endHour = endTime.split(":")[0];
                    endMinute = endTime.split(":")[1];
                }
                var date = $("#dateAlert").text().split(":")[1];
                var customerName = $("#customerBox").val();
                var vendorName = $("#vendorBox").val();
                var destination = $("#destinationBox").val();
                var comments = $("#notesArea").val();
                if (_DEBUG) {
                    console.log(startTime);
                    console.log(endTime);
                    console.log(date);
                    console.log(customerName);
                    console.log(`vendorName: ${vendorName}`);
                    console.log(destination);
                }
                //insert new object into calendar as event 
                //TODO: change this to an event source method after we confirm the new event has been entered into the database
                let shipTicketFiles = document.getElementById('shipTicketFileArea').files;
                let ladingBillFile = document.getElementById('ladingBillFileArea').files[0];
                if (shipTicketFiles == undefined || ladingBillFile == undefined) {
                    alert("Please upload all necessary paperwork!");
                    return;
                }
                else if (ladingBillFile.type != "application/pdf") {
                    alert('Uploaded files must be saved as PDF.');
                    return;
                }
                //confirm all file types are ok before uploading any
                for (var i = 0; i < shipTicketFiles.length; i++) {
                    if (shipTicketFiles[i].type != "application/pdf") {
                        alert('Uploaded files must be saved as PDF.');
                    }
                } 
                var shipTicketUrls = [];
                var shipTicketRefs = [];

                for (var i = 0; i < shipTicketFiles.length; i++) {
                     uploadTaskPromise(shipTicketFiles[i]).then((response) => {
                        shipTicketUrls[i] = response.downloadURL;
                        shipTicketRefs[i] = response.ref;
                        console.log(`${i}: `, response.downloadURL, response.ref);
                    });
                } 
                setTimeout(function() {$("#formcontainer").slideUp(300)}, 100);
                //upload each of the ship ticket files and add their download urls to list
                let ladingBillUpload = await uploadTaskPromise(ladingBillFile);
                let ladingBillURL = ladingBillUpload.downloadURL;
                let ladingBillRef = ladingBillUpload.ref;

                console.log(`ladingBillURL: ${ladingBillURL}`);
                console.log(`ladingBillRef: ${ladingBillRef}`);
                console.log(``)
                db.collection("events").add({
                    allDay: allDay,
                    date: date,
                    customerName: customerName,
                    destination: destination,
                    isOutgoing: isOutgoing,
                    startTime: startTime,
                    endTime: endTime,
                    notes: comments,
                    title: vendorName,
                    shipTicketUrls: shipTicketUrls,
                    ladingURL: ladingBillURL,
                    shipTicketRefs: shipTicketRefs,
                    ladingBillRef: ladingBillRef
                }).then(function(docRef) {
                    console.log(`Document ${docRef.id} successfully written`);
                }).catch(function(error) {
                    alert("Error writing document: ", error);
                    $("#formcontainer").slideDown(300);
                });
                    
                async function uploadTaskPromise(file) {
                    return new Promise(function(resolve, reject) {
                        let fileName = uuidv4();
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
                                    resolve({downloadURL: downloadURL, ref: fileName});
                                })
                            });
                    }); 
                }
            



                //calendar.addEvent(newEvent);
                //hide form
                
                //scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
             }); //end submit truck button handling
        }); //end DOM content loaded event listener



      
  // // Your web app's Firebase configuration

  // // Initialize Firebase
  //   var firebaseConfig = {
  //   apiKey: "AIzaSyBo4nl7Mdie9miskxI6zIC91fkqAjlZqn8",
  //   authDomain: "sgci-rds.firebaseapp.com",
  //   databaseURL: "https://sgci-rds.firebaseio.com",
  //   projectId: "sgci-rds",
  //   storageBucket: "sgci-rds.appspot.com",
  //   messagingSenderId: "184884483557",
  //   appId: "1:184884483557:web:6ccaf82fe8987830c3cb0c",
  //   measurementId: "G-WVCBC8FL46"
  // };
  //   var TESTfirebaseConfig = {
  //   apiKey: "AIzaSyAQbpyy6atOm9Nw6wRokl6dhedyqPFSDg0",
  //   authDomain: "sgi-testbranch.firebaseapp.com",
  //   databaseURL: "https://sgi-testbranch.firebaseio.com",
  //   projectId: "sgi-testbranch",
  //   storageBucket: "sgi-testbranch.appspot.com",
  //   messagingSenderId: "61711519733",
  //   appId: "1:61711519733:web:dd9dd75680058d4002dabc",
  //   measurementId: "G-RRY0NKY921"
  // };
  // // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
  // var db = firebase.firestore();
  // var storageRef = firebase.storage().ref();
  /*
   * PRIMARY EVENT POPULATION LISTENER
   */
  