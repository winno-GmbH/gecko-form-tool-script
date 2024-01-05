// Script Version
console.log("Elements v0.3.1");

document.addEventListener("DOMContentLoaded", function () {
  // Inputs validation handler
  const inputs = document.querySelectorAll("input");

  for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    const elClassName = ".cmp--" + element.classList[0];

    if (element.tagName === "INPUT") {
      // CheckBoxes State Validation
      if (element.type === "checkbox") {
        element.addEventListener("change", (event) => {
          if (element.checked) {
            element.closest(elClassName).classList.add("checked");
          } else {
            element.closest(elClassName).classList.remove("checked");
          }
        });
      }

      // TextField State Validation
      if (
        element.type === "tel" ||
        element.type === "email" ||
        element.type === "text" ||
        element.type === "url" ||
        element.type === "number" ||
        element.type === "date" ||
        element.type === "time"
      ) {
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
    }
  }
});
