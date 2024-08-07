function togglePasswordVisibility() {
  const passwordField = document.getElementById("password");
  const toggleIcon = document.getElementById("togglePasswordIcon");
  const isPasswordVisible = passwordField.getAttribute("type") === "password";

  passwordField.setAttribute("type", isPasswordVisible ? "text" : "password");
  toggleIcon.classList.toggle("fa-eye", !isPasswordVisible);
  toggleIcon.classList.toggle("fa-eye-slash", isPasswordVisible);
}
