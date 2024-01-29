// Script Version
console.log("Elements v0.4.1");

// Inputs validation handler
const inputs = document.querySelectorAll("input");

const hideModals = (element) => {
  const modalOverlays = document.querySelectorAll(".el--modal-overlay");
  modalOverlays.forEach((item) => {
    item.style.display = "none";
  });

  const optionsSelects = document.querySelectorAll(".cmp--se-modal");

  optionsSelects.forEach((select) => {
    // console.log("SELECT", select);
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
        // console.log("Focus");
        element.closest(elClassName).classList.remove("error");
        element.closest(elClassName).classList.add("focused");

        hideModals();
      });

      element.addEventListener("blur", (event) => {
        // console.log("Blur");

        if (element.required && element.value.trim() === "") {
          element.closest(elClassName).classList.remove("filled");
          element.closest(elClassName).classList.add("error");
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
      // const optionsContainer = document.querySelector(".cmp--se-modal");

      const optionsContainer = element.parentElement.parentElement.querySelector(".cmp--se-modal");
      const options = optionsContainer.querySelectorAll(".cmp--se-option");

      options.forEach(function (optionElement) {
        optionElement.addEventListener("click", function (event) {
          element.closest(elClassName).classList.add("filled");
          const dataValue = optionElement.getAttribute("data-value");

          if (dataValue) {
            element.value = dataValue;
            hideModals();
          }
        });
      });

      const toggleOptions = function () {
        // optionsContainer.style.display = optionsContainer.style.display === "flex" ? "none" : "flex";

        if (optionsContainer.style.display === "flex") {
          // if (element.value.trim() === "") {
          //   element.closest(elClassName).classList.remove("filled");
          //   console.log(element.closest(elClassName));
          // }
          // element.blur();
          // optionsContainer.style.display = "none";
          console.log("Выключаем");
          element.closest(elClassName).classList.remove("focused");
          if (element.value.trim() === "") {
            element.closest(elClassName).classList.remove("filled");
          }
        } else {
          // optionsContainer.style.display = "flex";
          console.log("Включаем");
          element.closest(elClassName).classList.add("focused");
        }
      };

      element.addEventListener("focus", (event) => {
        // console.log("Select Focus", element);
        hideModals();

        // console.log(element);

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
    }
  }

  if (element.tagName === "TEXTAREA") {
    // TextArea State Validation
    if (element.type === "textarea") {
      if (element.disabled) {
        element.closest(elClassName).classList.add("disabled");
      }
      element.addEventListener("focus", (event) => {
        alert("AAA");
        hideModals();
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

document.addEventListener("click", function (e) {
  // console.log("Closest Div", e.target.closest("div"));

  // console.log("TARGET", e.target);
  // console.log("Closest Input", e.target.closest("input"));

  // if (e.target.closest("div").classList.contains("cm--se-modal") || e.target.closest("div").classList.contains("lyt")) {
  if (
    e.target.closest("div").classList.contains("container") ||
    e.target.closest("div").classList.contains("cmp--se-modal") ||
    e.target.closest("div").classList.contains("cd--form") ||
    e.target.closest("div").classList.contains("el--modal-overlay") ||
    e.target.closest("div").classList.contains("lyt--form") ||
    e.target.closest("div").classList.contains("lyt--form-row") ||
    e.target.closest("div").classList.contains("cmp--form-item")
  ) {
    hideModals();
  }
});
