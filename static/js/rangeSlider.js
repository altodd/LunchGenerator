// Range (Slider) Tooltip Indicator
var handle = $( "#custom-handle" );
$( "#price-slider" ).slider({
  value:2,
  min: 1,
  max: 4,
  step: 1,
  orientation: "horizontal",
  range: "min",
  create: function() {
    // handle.text( $( this ).slider( "value" ) );
    setSliderHandle($( this ).slider( "value" ), handle, repeat_char="$");
  },
  slide: function( event, ui ) {
    setSliderHandle(ui.value, handle, repeat_char="$");
  }
});

function setSliderHandle(val, handle, repeat_char=null) {
  if (repeat_char == null) {
    handle.text( val );  
  }
  else {
    handle.text( repeat_char.repeat(val) );
  }
}

// Dual-Handle Slider
$("#slider-range").slider({
  min: 1,
  max: 24,
  step: 1,
  range: true,
  disabled: true,
  values: [10, 18],
  create: function(){
    updateTimeSlider();
  },
  slide: function(event, ui) {
    updateTimeSlider();
  }
});

function updateTimeSlider() {
  var value1 = $("#slider-range").slider("values", 0);
  var value2 = $("#slider-range").slider("values", 1);
  $("#slider-range").find(".ui-slider-handle:first")[0].textContent=value1+":00";
  $("#slider-range").find(".ui-slider-handle:last")[0].textContent=value2+":00";
  $("#timeSliderRange").val(value1+","+value2)
}

$("#CurrentlyOpen").change(function() {
  $("#slider-range").slider( "option", "disabled", $("#CurrentlyOpen").is(":checked") ); 
});

// Sidebar Toggling
$("#sidebar-toggler").click(function() {
  $("#sidebar-container").toggleClass("mw-0");
  $("#checks").toggleClass("d-none");
  $("#mapGenBtn").toggleClass("d-none");
  $("#map-container").toggleClass("col-10 col-12");
});