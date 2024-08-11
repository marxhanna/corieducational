document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const pharmacologyItem = document.getElementById("pharmacology-item");
  const popupModal = document.getElementById("popup-modal");
  const yesButton = document.getElementById("yes-button");
  const noButton = document.getElementById("no-button");
  const doctorImage = document.getElementById("doctor-image");
  const popupContent = document.querySelector(".popup-content");

  pharmacologyItem.addEventListener("click", (event) => {
    event.stopPropagation(); // Evita que o clique no item feche o popup
    popupModal.style.display = "flex";
  });

  const closeModal = () => {
    popupModal.style.display = "none";
  };

  yesButton.addEventListener("click", () => {
    popupContent
      .querySelectorAll(
        "p, .consequencia, .button-container, #yes-button, #no-button"
      )
      .forEach((element) => {
        element.style.display = "none";
      });
    doctorImage.style.display = "block";
    setTimeout(closeModal, 1000);
  });

  noButton.addEventListener("click", closeModal);

  window.addEventListener("click", (event) => {
    if (event.target === popupModal) {
      closeModal();
    }
  });

  popupContent.addEventListener("click", (event) => {
    event.stopPropagation(); // Evita que o clique no conteúdo do popup feche o popup
  });
});
