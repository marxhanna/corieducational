document.getElementById("apply-action").addEventListener("click", function () {
  var selectedOption1 = document.querySelector('input[name="action0"]:checked');
  var selectedOption2 = document.querySelector('input[name="action1"]:checked');

  if (selectedOption1) {
    var value = selectedOption1.value;
    var text = selectedOption1.value;
    var isCorrect = selectedOption1.getAttribute("data-correct") === "true";

    // Define o texto no popup
    document.getElementById("popup-text").textContent = text;

    // Exibe o popup
    document.getElementById("popup").style.display = "flex";

    // Se a resposta estiver correta, mostra a questão 2 e o botão "Continuar"
    if (isCorrect && !selectedOption2) {
      document.getElementById("continue-button").style.display = "block";
      document.getElementById("continue-button").onclick = function () {
        document.getElementById("popup").style.display = "none";
        document.getElementById("question-2").style.display = "block";
        document.getElementById("actions-2").style.display = "block";
        disableQuestion1();
      };
    } else {
      document.getElementById("continue-button").style.display = "none";
    }
  } else if (selectedOption2) {
    var value2 = selectedOption2.value;
    var text2 = selectedOption2.value;

    // Define o texto no popup para a questão 2
    document.getElementById("popup-text").textContent = text2;

    // Exibe o popup
    document.getElementById("popup").style.display = "flex";

    // Oculta o botão "Continuar" para a questão 2
    document.getElementById("continue-button").style.display = "none";
  } else {
    alert("Por favor, selecione uma opção antes de aplicar a conduta.");
  }
});

function disableQuestion1() {
  var options1 = document.querySelectorAll('input[name="action0"]');
  options1.forEach(function (option) {
    option.disabled = true;
  });
}

// Fecha o popup ao clicar no botão "Continuar"
document
  .getElementById("continue-button")
  .addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
  });

// Fecha o popup ao clicar fora dele
document.getElementById("popup").addEventListener("click", function (event) {
  if (event.target === document.getElementById("popup")) {
    document.getElementById("popup").style.display = "none";
  }
});
