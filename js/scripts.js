$(document).ready(function() {
  $("#demo").html("jQuery working");
  $("#panel1").slideUp(300).slideDown(1000);
  $("#panel2").click(function() {
  	$("#panel2").hide();

  }); 
});
