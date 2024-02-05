// Script Version
console.log("Elements v0.4.5");

// Inputs validation handler
const inputs = document.querySelectorAll("input, textarea");

const hideModals = (element) => {
  const modalOverlays = document.querySelectorAll(".el--modal-overlay");
  modalOverlays.forEach((item) => {
    item.style.display = "none";
  });

  const optionsSelects = document.querySelectorAll(".cmp--se-modal");

  optionsSelects.forEach((select) => {
    select.closest(".cmp--se").classList.remove("focused");
    select.style.display = "none";
  });
};

for (let i = 0; i < inputs.length; i++) {
  const element = inputs[i];
  const elClassName = ".cmp--" + element.classList[0];

  if (element.tagName === "INPUT") {
    // CheckBoxes State Validation
    if (element.type === "checkbox") {
      element.addEventListener("change", (event) => {
        hideModals();
        if (element.checked) {
          element.closest(elClassName).classList.add("checked");
        } else {
          element.closest(elClassName).classList.remove("checked");
        }
      });
    }

    // RadioButton State Validation
    if (element.type === "radio") {
      element.addEventListener("change", (event) => {
        hideModals();
        const radios = element.closest(elClassName + "-group").querySelectorAll(elClassName);

        radios.forEach(function (el) {
          el.classList.remove("selected");
        });

        element.closest(elClassName).classList.add("selected");
      });
    }

    const validTypes = ["tel", "email", "text", "url", "number", "date", "time"];

    // TextField State Validation
    if (validTypes.includes(element.type) && !element.classList.contains("se")) {
      if (element.disabled) {
        element.closest(elClassName).classList.add("disabled");
      }

      element.addEventListener("focus", (event) => {
        element.closest(elClassName).classList.remove("error");
        element.closest(elClassName).classList.add("focused");

        hideModals();
      });

      element.addEventListener("blur", (event) => {
        if (element.required && element.value.trim() === "") {
          element.closest(elClassName).classList.remove("filled");
          element.closest(elClassName).classList.add("error");
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
      const optionsContainer = element.parentElement.parentElement.querySelector(".cmp--se-modal");
      const options = optionsContainer.querySelectorAll(".cmp--se-option");
      const clearIcon = element.closest(elClassName).querySelector(".ico--clear");

      options.forEach(function (optionElement) {
        optionElement.addEventListener("click", function (event) {
          element.closest(elClassName).classList.add("filled");
          const dataValue = optionElement.getAttribute("data-value");

          if (dataValue) {
            element.value = dataValue;
            hideModals();

            clearIcon.classList.remove("hidden");
          }
        });
      });

      if (clearIcon) {
        clearIcon.addEventListener("click", function (event) {
          const input = element.closest(elClassName).querySelector("input");
          input.value = "";
          // clearIcon.style.display = "none";
          clearIcon.classList.add("hidden");

          const options = element.closest(elClassName).querySelectorAll(".cmp--se-option");

          options.forEach((option) => {
            // const optionText = option.textContent || option.innerText;

            option.style.display = "";
          });

          const noOptions = element.closest(elClassName).querySelector(".no-options");
          if (noOptions) {
            noOptions.style.display = "none";
          }

          options.forEach((option) => {
            option.style.display = "";
          });

          element.closest(elClassName).classList.remove("filled");
        });
      }

      element.addEventListener("focus", (event) => {
        hideModals();

        const modalOverlay = element.parentElement.parentElement.querySelector(".el--modal-overlay");
        if (modalOverlay) {
          modalOverlay.style.display = "block";
        }

        const optionsContainer = element.parentElement.parentElement.querySelector(".cmp--se-modal");
        if (optionsContainer) {
          optionsContainer.style.display = "flex";
        }

        element.closest(elClassName).classList.remove("error");
        element.closest(elClassName).classList.add("focused");
      });

      element.addEventListener("input", (event) => {
        const search = event.target.value.toUpperCase();
        const options = element.closest(elClassName).querySelectorAll(".cmp--se-option");
        const noOptions = document.querySelector(".no-options");

        let foundOptions = false;

        options.forEach((option) => {
          // const optionText = option.textContent || option.innerText;

          const optionText = option.dataset.value;
          // console.log(optionText);
          if (search !== "") {
            element.closest(elClassName).classList.add("filled");
          } else {
            element.closest(elClassName).classList.remove("filled");

            const clearIcon = element.closest(elClassName).querySelector(".ico--clear");
            // clearIcon.style.display = "none";
            clearIcon.classList.add("hidden");
          }
          if (optionText) {
            // Variant for start with "search value"
            if (optionText.toUpperCase().startsWith(search)) {
              option.style.display = "";
              foundOptions = true;
            } else {
              option.style.display = "none";
            }
          }
        });

        if (!foundOptions) {
          // Display the "No options found" message
          noOptions.style.display = "block";
        } else {
          noOptions.style.display = "none";
        }
      });
    }
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

document.addEventListener("click", function (e) {
  if (
    e.target.closest("div").classList.contains("container") ||
    e.target.closest("div").classList.contains("cmp--se-modal") ||
    e.target.closest("div").classList.contains("el--modal-overlay")
  ) {
    hideModals();
  }
});
