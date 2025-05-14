document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById("back-button");

  backButton.addEventListener("click", async () => {
    const nickname = document.getElementById("register-nickname").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    if (!nickname || !email || !password) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "회원가입 실패");
      }

      alert("회원가입이 완료되었습니다!");
      window.location.href = "/pages/auth/login";
    } catch (err) {
      alert("에러: " + err.message);
    }
  });
});