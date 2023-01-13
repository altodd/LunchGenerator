let map;

// Restaurant Category Filter Control
const filterOptions = [
    {text: "Mexican", value: "Tex-Mex", name: "filter", default: false},
    {text: "Seafood", value: "Seafood", name: "filter", default: false},
    {text: "Fast Food", value: "Fast Food", name: "filter", default: true},
    {text: "Chinese", value: "Chinese", name: "filter", default: false},
    {text: "Pizza", value: "Pizzeria", name: "filter", default: false},
    {text: "Wings", value: "Wings", name: "filter", default: false},
    {text: "Burgers", value: "Burgers", name: "filter", default: false},
]
const catFormProp = {action: "/destination", method: "post", id: "checks"}
/**
 * Creates a control that recenters the map on Chicago.
 */
function customCheckbox(label, value, name, checkDefault=false) {
    // Create the DIV to hold the control.
    const containerDiv = document.createElement("div");
    // Create Input
    const inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    let unique_id = "CC_"+label;
    inputCheckbox.id = unique_id;
    inputCheckbox.value = value;
    inputCheckbox.name = name;
    inputCheckbox.checked = checkDefault;
    
    // Create associated Label
    const labelObj = document.createElement("label");
    labelObj.setAttribute("for", unique_id);
    labelObj.textContent = label;
    labelObj.style = "padding-left: 8px; font-size: 1rem; color: white;";

    // Attach checkbox and label to container
    containerDiv.appendChild(inputCheckbox);
    containerDiv.appendChild(labelObj);
    containerDiv.style = "width: fit-content;"

    return containerDiv;
  }
/**
 * Creates a control that recenters the map on Chicago.
 */
function checkboxDropDown(map, title, formProps, optionList) {
    const controlForm = document.createElement("form");

    // Set CSS for the control.
    controlForm.action = formProps.action;
    controlForm.method = formProps.method;
    controlForm.id = formProps.id;
    controlForm.style = "background-color: rgba(0,0,0,0.7); border-radius: 5px; margin-left: 10px; padding: 8px;"
    // Create Header
    const headerObj = document.createElement("h4");
    headerObj.style = "font-size: 1rem; color: white; width: fit-content;";
    headerObj.textContent = title;
    controlForm.appendChild(headerObj);
    // Add Checkboxes
    for (const item of optionList) {
        checkboxFilter = customCheckbox(label=item.text, value=item.value, name=item.name, checkDefault=item.default)
        controlForm.appendChild(checkboxFilter);
    }
    // Add Location input
    const locationIn = document.createElement("input");
    locationIn.type="hidden";
    locationIn.id = "locations";
    locationIn.name = "locations";
    controlForm.appendChild(locationIn);
    // Add Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit"
    submitBtn.textContent = "Generate!"
    controlForm.appendChild(submitBtn);

    // Submitting form requires at least one marker location prior to submission
    controlForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (markers.length < 1) {
            alert('Please select at least one area to search');
            return;
        }
        controlForm.elements['locations'].value = JSON.stringify(markers);
        controlForm.submit();
    });
    return controlForm;
  }
