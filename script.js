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
console.log("v0.2.8");

var serverUrl = "https://gecko-form-be.winno.gmbh/api/forms/submit";
// var serverUrl = "http://localhost:5000/api/forms/submit/";

// Now you can use keyParam and formParam as needed
console.log("AccessKey: ", accessKey);
console.log("FormName: ", formName);

// document.addEventListener("DOMContentLoaded", function () {
// Form validation handler
const form = document.querySelector("form[name='" + formName + "']");
// console.log(form);
const formElements = form.elements;

for (let i = 0; i < formElements.length; i++) {
  // console.log(formElements[i].tagName + " - " + formElements[i].type);
  const element = formElements[i];
  const elClassName = ".cmp--" + element.classList[0];

  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    if (element.type === "radio") {
      // alert("RADIO");
      element.addEventListener("change", (event) => {
        // console.log(element.value);
        // console.log(elClassName);
        // console.log(element.closest(elClassName));
        // console.log(element.closest(elClassName).nextElementSibling);
        // console.log(element.nextElementSibling);
        // console.log(element.closest(elClassName + "-group"));
        // console.log(element.closest(elClassName + "-group").querySelectorAll(elClassName));
        const radios = element.closest(elClassName + "-group").querySelectorAll(elClassName);
        // console.log(radios);

        radios.forEach(function (el) {
          el.classList.remove("selected");
        });

        // console.log(element.closest(elClassName));
        // element.closest(elClassName).classList.remove("error");
        element.closest(elClassName).classList.add("selected");
      });

      element.addEventListener("click", (event) => {
        // console.log("Click", element.value);
        // console.log("Click Target", event.target.value);
        // element.closest(elClassName).classList.remove("selected");
      });
    }

    if (element.type === "checkbox") {
      alert("checkbox");
      element.addEventListener("change", (event) => {
        // console.log(element.value);
        // console.log(elClassName);
        // console.log(element.closest(elClassName));
        // console.log(element.closest(elClassName).nextElementSibling);
        // console.log(element.nextElementSibling);
        // console.log(element.closest(elClassName + "-group"));
        // console.log(element.closest(elClassName + "-group").querySelectorAll(elClassName));
        // const radios = element.closest(elClassName + "-group").querySelectorAll(elClassName);
        // console.log(radios);

        console.log(event.target);

        if (element.checked) {
          console.log("Checked");
        } else {
          console.log("UnChecked");
        }

        // radios.forEach(function (el) {
        //   el.classList.remove("selected");
        // });

        // console.log(element.closest(elClassName));
        // element.closest(elClassName).classList.remove("error");
        element.closest(elClassName).classList.add("selected");
      });
    }

    //! TextField State Validation
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
      if (element.disabled) {
        //alert("Disabled");
        element.closest(elClassName).classList.add("disabled");
      }
      // console.log(element.type);
      element.addEventListener("focus", (event) => {
        element.closest(elClassName).classList.remove("error");
        element.closest(elClassName).classList.add("focused");
      });

      element.addEventListener("blur", (event) => {
        element.closest(elClassName).classList.remove("focused");
        // console.log(element.value.trim());

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

      element.addEventListener("input", (event) => {
        // alert("1");
        if (element.value.trim() === "") {
          element.closest(elClassName).classList.remove("filled");
        } else {
          // element.closest(elClassName).style.color = "red";
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

    // if (element.type === "date" || element.type === "time") {
    //   element.addEventListener("blur", (event) => {
    //     //alert("Blur");
    //     if (element.value.trim() === "") {
    //       element.closest(elClassName).classList.remove("filled");
    //     } else {
    //       element.closest(elClassName).classList.add("filled");
    //     }

    //     if (element.required && element.value.trim() === "") {
    //       element.closest(elClassName).classList.add("error");
    //       return; // Stop submission if a required field is empty
    //     } else {
    //       element.closest(elClassName).classList.remove("error");
    //     }
    //   });
    // }

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
  // if (element.tagName === "TEXTAREA") {
  //   console.log(element.type);
  //   //alert("textArea");
  //   if (element.disabled) {
  //     element.closest(elClassName).classList.add("disabled");
  //   }
  // }
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
        // if (element.required && element.value.trim() === "") {
        //   element.closest(".cmp--tf").classList.add("Error");
        //   return; // Stop submission if a required field is empty
        // }

        if (element.required && element.value.trim() === "") {
          element.closest(elClassName).classList.add("error");
          return; // Stop submission if a required field is empty
        }
      }
      let labelValue;

      // Update form data - sending all data from the form to backend point
      if (element.type !== "submit" && element.type !== "reset" && element.tagName !== "BUTTON") {
        // console.log(element);
        // console.log(element.nextElementSibling);
        const field = element.nextElementSibling;
        if (field) {
          labelValue = field.lastElementChild?.textContent;
        }
        // console.log(labelValue);

        let newElement = {
          label: element.dataset["name"] || element.name || labelValue,
          value: element.value,
          type: element.type,
          variable: element.dataset?.["variable"],
        };

        // console.log(newElement);

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

  // var serverUrl = "https://gecko-form-be.winno.gmbh/api/forms/submit";
  // var serverUrl = "http://localhost:5000/api/forms/submit/";

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
      //console.log("Response" + response);
      //console.log(response.json());
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
// });
