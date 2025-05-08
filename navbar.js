document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.innerHTML = `
      <nav style="background-color: #2c3e50; color: white; padding: 15px; text-align: center;">
        <a href="index.html" style="color: white; text-decoration: none; margin: 0 10px;">Home</a>
        <a href="quiz.html" style="color: white; text-decoration: none; margin: 0 10px;">Quiz</a>
        <a href="#" style="color: white; text-decoration: none; margin: 0 10px;">Leaderboard</a>
        <a href="#" style="color: white; text-decoration: none; margin: 0 10px;">Wallet</a>
      </nav>
    `;
  }
});
