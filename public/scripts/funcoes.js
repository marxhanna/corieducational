let responseStorage = {
  Exame: [],
  Prescrição: [],
  Diagnóstico: [],
  Conduta: [],
};

function saveResponse(inputId, listId) {
  const inputElement = document.getElementById(inputId);
  const inputValue = inputElement.value.trim();

  if (inputValue === "") return;

  const responseType = getResponseType(inputId);
  responseStorage[responseType].push(inputValue);

  const responseList = document.getElementById(listId);
  const newResponseItem = document.createElement("li");
  newResponseItem.innerHTML = `${inputValue} <button class="delete-button" onclick="deleteResponse(this, '${responseType}')">x</button>`;

  responseList.appendChild(newResponseItem);
  inputElement.value = ""; // Clear input field
}

function addResponse(inputId, listId) {
  saveResponse(inputId, listId);
}

function deleteResponse(buttonElement, responseType) {
  const responseItem = buttonElement.parentElement;
  const responseText = responseItem.textContent.slice(0, -1).trim();

  responseStorage[responseType] = responseStorage[responseType].filter(
    (response) => response !== responseText
  );

  responseItem.remove();
}

function getResponseType(inputId) {
  if (inputId.includes("diagnosis")) return "Diagnóstico";
  if (inputId.includes("prescription")) return "Prescrição";
  if (inputId.includes("exam")) return "Exame";
  return "";
}
