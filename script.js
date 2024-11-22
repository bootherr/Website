document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginScreen = document.getElementById("login-screen");
  const dashboard = document.getElementById("dashboard");
  const usernameDisplay = document.getElementById("username-display");
  const timeDisplay = document.getElementById("time-display");
  const tabContent = document.getElementById("tab-content");

  // Handle Login
  loginButton.addEventListener("click", () => {
      const username = usernameInput.value;
      const password = passwordInput.value;

      if (username === "admin" && password === "password") {
          loginScreen.style.display = "none";
          dashboard.style.display = "flex";
          usernameDisplay.textContent = username;
          updateTime();
      } else {
          alert("Invalid username or password!");
      }
  });

  // Update Time
  function updateTime() {
      const now = new Date();
      timeDisplay.textContent = now.toLocaleTimeString();
      setTimeout(updateTime, 1000);
  }

  // Handle Tab Clicks
  document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
          const tabName = tab.dataset.tab;
          tabContent.textContent = `You are viewing the ${tabName} page.`;
      });
  });

  // Logout
  document.getElementById("logout-button").addEventListener("click", () => {
      dashboard.style.display = "none";
      loginScreen.style.display = "flex";
      usernameInput.value = "";
      passwordInput.value = "";
  });
});
