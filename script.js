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
console.log("v0.1.11");

// Now you can use keyParam and formParam as needed
console.log("AccessKey: ", accessKey);
console.log("FormName: ", formName);

document.addEventListener("DOMContentLoaded", function () {
  // Form validation handler
  const form = document.querySelector("form[name='" + formName + "']");
  const formElements = form.elements;

  for (let i = 0; i < formElements.length; i++) {
    //console.log(formElements[i].tagName + " - " + formElements[i].type);
    const element = formElements[i];
    const elClassName = ".cmp--" + element.classList[0];

    if (element.tagName === "input") {
      //! TextField State Validation
      if (
        element.type === "tel" ||
        element.type === "email" ||
        element.type === "text" ||
        element.type === "url" ||
        element.type === "number"
      ) {
        element.addEventListener("focus", (event) => {
          console.log("CLASS focused = ", element.classList[0]);
          element.closest(elClassName).classList.remove("error");
          element.closest(elClassName).classList.add("focused");
        });

        element.addEventListener("blur", (event) => {
          console.log("CLASS blur = ", element.classList[0]);
          element.closest(elClassName).classList.remove("focused");
          if (element.required && element.value.trim() === "") {
            //element.focus();
            element.closest(elClassName).classList.add("error");
            return; // Stop submission if a required field is empty
          } else {
            element.closest(elClassName).classList.remove("error");
          }
        });

        element.addEventListener("input", (event) => {
          if (element.value.trim() === "") {
            element.closest(elClassName).classList.remove("filled");
          } else {
            element.closest(elClassName).classList.add("filled");
          }

          if (element.required && element.value.trim() === "") {
            element.closest(elClassName).classList.add("error");
            return; // Stop submission if a required field is empty
          } else {
            element.closest(elClassName).classList.remove("error");
          }
        });
      }
      if (element.type === "select-one") {
        element.addEventListener("change", (event) => {
          if (element.required && element.value.trim() === "") {
            element.closest(".cmp--se").classList.add("error");
            return;
          }
          element.closest(".cmp--se").classList.remove("error");
        });
        element.addEventListener("blur", (event) => {
          if (element.required && element.value.trim() === "") {
            element.closest(".cmp--se").classList.add("error");
            return;
          }
          element.closest(".cmp--se").classList.remove("error");
        });
      }
    }
  }

  // Form submit handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Form Submit");

    // Get all form elements
    const formElements = form.elements;

    // Create an object to store the form data
    const newFormData = [];

    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.tagName === "input") {
        // Check if the field is required and still empty
        if (
          element.type === "tel" ||
          element.type === "email" ||
          element.type === "text" ||
          element.type === "url" ||
          element.type === "number"
        ) {
          if (element.required && element.value.trim() === "") {
            element.closest(".cmp--tf").classList.add("Error");
            return; // Stop submission if a required field is empty
          }
        }

        // Update form data - sending all data from the form to backend point
        if (element.type !== "submit" && element.type !== "reset" && element.tagName !== "BUTTON") {
          console.log(element);
          console.log(element.closest("fieldset").closest("legend"));
          labelValue = element.closest("label")?.textContent;
          console.log(labelValue);

          let newElement = {
            label: element.dataset["name"] || element.name || labelValue,
            value: element.value,
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
      formData: { categories: [{ name: "Main Step", form: newFormData }] },
    };

    console.log("Form Submit + Data: " + JSON.stringify(requestData));

    var serverUrl = "http://68.183.68.73:5000/api/forms/submit";

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccessKey: accessKey, // Include the AccessKey in the Request header
      },
      body: JSON.stringify(requestData),
    };

    // form.innerHTML = "<div class='mainForm'><h2>Sending data...</h2></div>";

    const submitButton = document.querySelector("input[type='submit']");

    if (submitButton) {
      submitButton.value = submitButton.dataset["wait"];
    }

    // Make the fetch request
    fetch(serverUrl, requestOptions)
      .then((response) => {
        console.log("Response" + response);
        console.log(response.json());
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        // Handle the successful response data
        console.log("Data sent successfully:", data);
        //form.innerHTML = "<div class='mainForm'><h2>Data was sent successfully</h2></div>";
        submitButton.value = "Data was sent!";
        submitButton.disabled = true;
      })
      .catch((error) => {
        // Handle errors during the fetch request
        console.error("Error during sending data:", error.message);
      });
  });
});
