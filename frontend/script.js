document.addEventListener("DOMContentLoaded", () => {
  const announcements = [
    "Welcome to the new semester! 🎉",
    "Tech Fest scheduled for September.",
    "Membership renewal open till next week."
  ];

  const list = document.getElementById("announcementList");
  announcements.forEach(msg => {
    let li = document.createElement("li");
    li.textContent = msg;
    list.appendChild(li);
  });
});
