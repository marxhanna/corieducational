(function () {
  document.addEventListener("DOMContentLoaded", function () {
    hideLoading(); // Esconde o loading ao carregar a página
  });

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      hideLoading(); // Esconde o loading se a página foi carregada do cache
    }
  });

  window.showLoading = function () {
    document.getElementById("loading-popup").style.display = "flex";
  };

  window.hideLoading = function () {
    document.getElementById("loading-popup").style.display = "none";
  };

  window.togglePasswordVisibility = function () {
    const passwordField = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePasswordIcon");
    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
    } else {
      passwordField.type = "password";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
    }
  };
})();
