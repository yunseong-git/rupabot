document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("register-button");
  const backBtn = document.getElementById("back-button");

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      window.location.href = "/pages/auth/register";
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/pages/auth/login";
    });
  }
});