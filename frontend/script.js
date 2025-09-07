// ================== LOAD EVENTS ==================
async function loadEvents() {
  const eventsContainer = document.getElementById("events-container") || document.getElementById("eventList");
  if (!eventsContainer) return;

  eventsContainer.innerHTML = "<p>Loading events...</p>";

  try {
    const response = await fetch("/api/getEvents");
    const events = await response.json();

    eventsContainer.innerHTML = "";

    if (events.length === 0) {
      eventsContainer.innerHTML = "<p>No events found. Add one above!</p>";
      return;
    }

    // Render as cards (for index.html) or list items (for events.html)
    if (eventsContainer.id === "events-container") {
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
    } else {
      events.forEach((event) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${event.title}</strong> - ${event.date}<br>${event.description}`;
        eventsContainer.appendChild(li);
      });
    }
  } catch (err) {
    eventsContainer.innerHTML = `<p style="color:red;">Error loading events: ${err.message}</p>`;
  }
}

// ================== SUBMIT NEW EVENT ==================
const eventForm = document.getElementById("eventForm");
if (eventForm) {
  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("eventName").value;
    const date = document.getElementById("eventDate").value;
    const description = document.getElementById("eventDescription").value;

    const messageBox = document.createElement("p");
    messageBox.style.marginTop = "10px";
    eventForm.appendChild(messageBox);

    try {
      const response = await fetch("/api/uploadEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: name, date, description }),
      });

      const result = await response.json();

      if (response.ok) {
        messageBox.style.color = "green";
        messageBox.textContent = "✅ Event added successfully!";
        eventForm.reset();
        loadEvents(); // refresh events dynamically
      } else {
        messageBox.style.color = "red";
        messageBox.textContent = "❌ Error: " + (result.error || "Something went wrong");
      }
    } catch (err) {
      messageBox.style.color = "red";
      messageBox.textContent = "❌ Error: " + err.message;
    }
  });
}

// ================== INIT ==================
window.addEventListener("DOMContentLoaded", loadEvents);
