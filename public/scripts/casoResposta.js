document.getElementById("showTips").addEventListener("click", function () {
  document.getElementById("tipsSection").style.display = "block";
  document.getElementById("responseSection").style.display = "none";
  this.classList.add("selected");
  document.getElementById("showResponse").classList.remove("selected");
});

document.getElementById("showResponse").addEventListener("click", function () {
  document.getElementById("tipsSection").style.display = "none";
  document.getElementById("responseSection").style.display = "block";
  this.classList.add("selected");
  document.getElementById("showTips").classList.remove("selected");
});

const nextTipButton = document.getElementById("nextTipButton");
let currentTipIndex = 0;
const tips = document.querySelectorAll(".tip-card");
const tipCounter = document.getElementById("tipCounter");

nextTipButton.addEventListener("click", function () {
  if (currentTipIndex < tips.length - 1) {
    currentTipIndex++;
    tips[currentTipIndex].style.display = "block";
    tipCounter.textContent = currentTipIndex + 1;
  }
});
