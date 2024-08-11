document.getElementById("apply-action").addEventListener("click", function () {
  var selectedOptions = [];
  for (var i = 0; i < 6; i++) {
    var selectedOption = document.querySelector(
      `input[name="action${i}"]:checked`
    );
    if (selectedOption) {
      selectedOptions.push({
        value: selectedOption.value,
        text: selectedOption.value,
        isCorrect: selectedOption.getAttribute("data-correct") === "false",
        index: i,
      });
    }
  }

  if (selectedOptions.length > 0) {
    var lastSelected = selectedOptions[selectedOptions.length - 1];
    document.getElementById("popup-text").textContent = lastSelected.text;
    document.getElementById("popup").style.display = "flex";

    if (lastSelected.isCorrect && selectedOptions.length < 6) {
      document.getElementById("continue-button").style.display = "block";
      document.getElementById("continue-button").onclick = function () {
        document.getElementById("popup").style.display = "none";
        var nextQuestionIndex = lastSelected.index + 1;
        document.getElementById(
          `question-${nextQuestionIndex + 1}`
        ).style.display = "block";
        document.getElementById(
          `actions-${nextQuestionIndex + 1}`
        ).style.display = "block";
        disableQuestion(lastSelected.index);
      };
    } else {
      document.getElementById("continue-button").style.display = "none";
    }
  } else {
    alert("Por favor, selecione uma opção antes de aplicar a conduta.");
  }
});

function disableQuestion(index) {
  var options = document.querySelectorAll(`input[name="action${index}"]`);
  options.forEach(function (option) {
    option.disabled = true;
  });
}

document
  .getElementById("continue-button")
  .addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
  });

document.getElementById("popup").addEventListener("click", function (event) {
  if (event.target === document.getElementById("popup")) {
    document.getElementById("popup").style.display = "none";
  }
});
