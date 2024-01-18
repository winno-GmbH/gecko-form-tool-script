// Script Version
console.log("Elements v0.3.6");

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

    const validTypes = ["tel", "email", "text", "url", "number", "date", "time"];

    // TextField State Validation
    if (validTypes.includes(element.type)) {
      if (element.disabled) {
        element.closest(elClassName).classList.add("disabled");
      }

      element.addEventListener("focus", (event) => {
        element.closest(elClassName).classList.remove("error");
        element.closest(elClassName).classList.add("focused");
      });

      element.addEventListener("blur", (event) => {
        if (element.required && element.value.trim() === "") {
          element.closest(elClassName).classList.remove("filled");
          element.closest(elClassName).classList.add("error");
        } else {
          element.closest(elClassName).classList.remove("error");
          element.closest(elClassName).classList.add("filled");
        }
        if (!element.classList.contains("se")) {
          element.closest(elClassName).classList.remove("focused");
        } else {
          if (element.value.trim() !== "") {
            element.closest(elClassName).classList.remove("focused");
          }
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

    if (element.type === "text" && element.classList.contains("se")) {
      const optionsContainer = document.querySelector(".cmp--se-modal");

      const toggleOptions = function () {
        optionsContainer.style.display = optionsContainer.style.display === "flex" ? "none" : "flex";
        if (optionsContainer.style.display === "none") {
          element.blur();
        } else {
          element.closest(elClassName).classList.add("filled");
        }
      };

      element.addEventListener("click", toggleOptions);

      const options = document.querySelectorAll(".cmp--se-option");

      options.forEach(function (optionElement) {
        optionElement.addEventListener("click", function (event) {
          element.closest(elClassName).classList.add("filled");
          const dataValue = optionElement.getAttribute("data-value");

          if (dataValue) {
            element.value = dataValue;

            optionsContainer.style.display = "none";
          }
        });
      });

      element.addEventListener("blur", function (event) {
        if (element.value.trim() === "") {
          element.closest(elClassName).classList.remove("filled");
          element.closest(elClassName).classList.remove("error");
        }
      });

      document.addEventListener("click", function (e) {
        if (e.target !== element) {
          optionsContainer.style.display = "none";
          if (element.value.trim() === "") {
            element.closest(elClassName).classList.remove("focused");
          }
        }
      });
    }
  }
}
