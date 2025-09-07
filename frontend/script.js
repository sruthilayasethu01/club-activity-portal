// Fetch events from backend API
async function loadEvents() {
  const eventsContainer = document.getElementById("events-container") || document.getElementById("eventList");
  if (!eventsContainer) return; // Not on a page that shows events

  eventsContainer.innerHTML = "<p>Loading events...</p>";

  try {
    const response = await fetch("/api/getEvents");
    const events = await response.json();

    eventsContainer.innerHTML = "";

    if (events.length === 0) {
      eventsContainer.innerHTML = "<p>No events found. Add one above!</p>";
      return;
    }

    // Render events
    events.forEach((event) => {
      const item = document.createElement(eventsContainer.id === "events-container" ? "div" : "li");
      item.className = eventsContainer.id === "events-container" ? "event-card" : "";

      item.innerHTML =
        eventsContainer.id === "events-container"
          ? `
            <img src="${event.image || "https://via.placeholder.com/600x300?text=Event"}" alt="${event.title}" />
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p>${event.description}</p>
          `
          : `
            <strong>${event.title}</strong> - ${event.date}<br />
            <small>${event.description}</small>
          `;

      eventsContainer.appendChild(item);
    });
  } catch (err) {
    eventsContainer.innerHTML = `<p style="color:red;">Error loading events: ${err.message}</p>`;
  }
}

// Handle Add Event form (only on events.html)
const eventForm = document.getElementById("eventForm");
if (eventForm) {
  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const eventData = {
      title: document.getElementById("eventName").value,
      date: document.getElementById("eventDate").value,
      description: document.getElementById("eventDescription").value,
    };

    try {
      const response = await fetch("/api/uploadEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to add event");

      const result = await response.json();
      alert(result.message || "Event added successfully!");

      // Reload event list
      loadEvents();

      // Reset form
      eventForm.reset();
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}

// Run loader on page ready
window.addEventListener("DOMContentLoaded", loadEvents);
