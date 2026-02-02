document.addEventListener("DOMContentLoaded", () => {
  const keyboardLayout = [
    [
      "`",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "Backspace",
    ],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    [
      "CapsLock",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      ";",
      "'",
      "Enter",
    ],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Control", "Alt", " ", "Alt", "Control"],
  ];

  const keyboardContainer = document.getElementById("keyboard-visualizer");

  /* Render keyboard */
  keyboardLayout.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "kb-row";

    row.forEach((key) => {
      const keyDiv = document.createElement("div");
      keyDiv.className = "kb-key";
      keyDiv.dataset.key = key;

      keyDiv.textContent = key === " " ? "SPACE" : key;

      if (["Backspace", "Enter", "Shift", "Tab"].includes(key)) {
        keyDiv.classList.add("wide");
      }

      if (key === " ") {
        keyDiv.classList.add("space");
      }

      rowDiv.appendChild(keyDiv);
    });

    keyboardContainer.appendChild(rowDiv);
  });

  /* Highlight key on press */
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    const keyEl = document.querySelector(`.kb-key[data-key="${key}"]`);

    if (keyEl) {
      keyEl.classList.add("active");
    }
  });

  /* Remove highlight on release */
  document.addEventListener("keyup", (e) => {
    const key = e.key;
    const keyEl = document.querySelector(`.kb-key[data-key="${key}"]`);

    if (keyEl) {
      keyEl.classList.remove("active");
    }
  });
});
