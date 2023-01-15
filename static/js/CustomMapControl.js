let map;

const chicago = { lat: 41.85, lng: -87.65 };

/**
 * Creates a control that recenters the map on Chicago.
 */
 function createGenerateBtn(map) {
  const controlButton = document.createElement('button');

  // Set CSS for the control.
  controlButton.style.backgroundColor = 'var(--dark-color)';
  controlButton.style.border = '2px solid var(--dark-color)';
  controlButton.style.borderRadius = '0px';
  controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlButton.style.color = 'var(--gray-color)';
  controlButton.style.cursor = 'pointer';
  controlButton.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlButton.style.fontSize = '16px';
  controlButton.style.lineHeight = '38px';
  controlButton.style.margin = '8px';
  controlButton.style.padding = '0 15px';
  controlButton.style.textAlign = 'center';
  controlButton.classList.add('d-none');

  controlButton.innerHTML = 'Generate! <i class="fa-solid fa-shuffle ml-2"></i>';
  controlButton.title = 'Click to generate a random restaurant';
  controlButton.type = 'button';
  controlButton.id = 'mapGenBtn';

  // Setup the click event listeners: simply set the map to Chicago.
  controlButton.addEventListener('click', () => {
    const form = document.getElementById("checks");
    if (markers.length < 1) {
        alert('Please select at least one area to search');
        return;
    }
    form.elements['locations'].value = JSON.stringify(markers);
    form.submit();
  });

  return controlButton;
}
