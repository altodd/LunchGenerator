// Range (Slider) Tooltip Indicator
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach(wrap => {
  const range = wrap.querySelector(".range");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble, repeat_char="$");
  });
  setBubble(range, bubble, repeat_char="$");
});

function setBubble(range, bubble, repeat_char=null) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  if (repeat_char == null) {
    bubble.innerHTML = val;  
  }
  else {
    bubble.innerHTML = repeat_char.repeat(val);
  }

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
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