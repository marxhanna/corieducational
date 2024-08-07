document.getElementById("menu").addEventListener("click", function () {
  document.getElementById("sidebar").classList.add("open"); // Add a class
  document.getElementById("overlay").style.display = "block";
});

document.getElementById("overlay").addEventListener("click", function () {
  document.getElementById("sidebar").classList.remove("open"); // Remove the class
  document.getElementById("overlay").style.display = "none";
});
