// Get the current script tag
var currentScript =
  document.currentScript ||
  (function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

// Extract the "src" attribute from the current script tag
var scriptSrc = currentScript.src;

// Use URLSearchParams to parse the query string
var urlParams = new URLSearchParams(scriptSrc.split("?")[1]);

// Access the 'key' and 'form' parameters
const accessKey = urlParams.get("key");
const formName = urlParams.get("form");

// Script Version
console.log("Form Submit v0.3.2");

var serverUrl = "https://gecko-form-be.winno.gmbh/api/forms/submit";
// var serverUrl = "http://localhost:5000/api/forms/submit/";

// Now you can use keyParam and formParam as needed
console.log("AccessKey: ", accessKey);
console.log("FormName: ", formName);

// document.addEventListener("DOMContentLoaded", function () {
// Form validation handler
const form = document.querySelector("form[name='" + formName + "']");

const customFormSubmitButton = form.querySelector("[form-type='form-submit']");

customFormSubmitButton.addEventListener("click", () => {
  form.querySelector("input[type='submit']").click();
});

const formElements = form.elements;

for (let i = 0; i < formElements.length; i++) {
  const element = formElements[i];
  const elClassName = ".cmp--" + element.classList[0];

  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    // RadioButton State Validation
    if (element.type === "radio") {
      element.addEventListener("change", (event) => {
        const radios = element.closest(elClassName + "-group").querySelectorAll(elClassName);

        radios.forEach(function (el) {
          el.classList.remove("selected");
        });

        element.closest(elClassName).classList.add("selected");
      });
    }

    // TextArea State Validation
    if (element.type === "textarea") {
      if (element.disabled) {
        element.closest(elClassName).classList.add("disabled");
      }

      element.addEventListener("focus", (event) => {
        element.closest(elClassName).classList.remove("error");
        element.closest(elClassName).classList.add("focused");
      });

      element.addEventListener("blur", (event) => {
        element.closest(elClassName).classList.remove("focused");

        if (element.required && element.value.trim() === "") {
          element.closest(elClassName).classList.remove("filled");
          element.closest(elClassName).classList.add("error");
        } else if (element.value.trim() === "") {
          element.closest(elClassName).classList.remove("filled");
          element.closest(elClassName).classList.remove("error");
        } else {
          element.closest(elClassName).classList.remove("error");
          element.closest(elClassName).classList.add("filled");
        }
      });
    }
  }
}

// Form submit handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // alert("Form Submit");

  // Get all form elements
  const formElements = form.elements;

  // Create an object to store the form data
  const newFormData = [];

  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];
    const elClassName = ".cmp--" + element.classList[0];

    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      // Check if the field is required and still empty
      if (
        element.type === "tel" ||
        element.type === "email" ||
        element.type === "text" ||
        element.type === "url" ||
        element.type === "number" ||
        element.type === "date" ||
        element.type === "time" ||
        element.type === "textarea"
      ) {
        if (element.required && element.value.trim() === "") {
          element.closest(elClassName).classList.add("error");
          return; // Stop submission if a required field is empty
        }
      }
      let labelValue;

      // Update form data - sending all data from the form to backend point
      if (element.type !== "submit" && element.type !== "reset" && element.tagName !== "BUTTON") {
        const field = element.nextElementSibling;
        if (field) {
          labelValue = field.lastElementChild?.textContent.trim();
        }

        let newElement = {
          label: element.dataset["name"] || element.name || labelValue,
          value: element.value.trim(),
          type: element.type,
          variable: element.dataset?.["variable"],
        };

        if (element.type === "radio") {
          if (element.checked) {
            newFormData.push(newElement);
          }
        } else if (element.type === "checkbox") {
          if (element.checked) {
            const label = element.dataset["name"] || element.name;
            if (!newFormData.find((item) => item.label === label)) {
              const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${element.name}"]`);

              // Iterate over the checkboxes and concatenate their values
              const checkboxValues = Array.from(checkboxes)
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value)
                .join(", ");

              newElement.value = checkboxValues;
              newFormData.push(newElement);
            }
          }
        } else {
          newFormData.push(newElement);
        }
      }
    }
  }

  const requestData = {
    formData: { categories: [{ name: "Form Data", form: newFormData }] },
  };

  console.log("Form Submit + Data: " + JSON.stringify(requestData));

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AccessKey: accessKey, // Include the AccessKey in the Request header
    },
    body: JSON.stringify(requestData),
  };

  const submitButton = document.querySelector("input[type='submit']");

  if (submitButton) {
    submitButton.value = submitButton.dataset["wait"] || "Sending data ...";
  }

  // Make the fetch request
  fetch(serverUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .then((data) => {
      // Handle the successful response data
      console.log("Data sent successfully:", data);
      submitButton.value = submitButton.dataset["success"] || "Data was sent!";
      submitButton.disabled = true;
    })
    .catch((error) => {
      // Handle errors during the fetch request
      console.error("Error during sending data:", error.message);
    });
});
// });
