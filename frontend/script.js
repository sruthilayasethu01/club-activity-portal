// Fetch events from backend API
async function loadEvents() {
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = "<p>Loading events...</p>";

  try {
    const response = await fetch("/api/getEvents"); // we'll create this API next
    const events = await response.json();

    // Clear container
    eventsContainer.innerHTML = "";

    if (events.length === 0) {
      eventsContainer.innerHTML = "<p>No events found. Add one above!</p>";
      return;
    }

    // Render events
    events.forEach((event) => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <img src="${event.image || "https://via.placeholder.com/800x400"}" alt="${event.title}" />
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p>${event.description}</p>
      `;
      eventsContainer.appendChild(card);
    });
  } catch (err) {
    eventsContainer.innerHTML = `<p style="color:red;">Error loading events: ${err.message}</p>`;
  }
}

// On page load
window.addEventListener("DOMContentLoaded", loadEvents);
