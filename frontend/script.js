// Sample events data
const events = [
  {
    title: "Tech Meetup 2025",
    date: "March 15, 2025",
    description: "An engaging session on the latest in technology and innovation.",
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde16?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Cultural Fest",
    date: "April 2, 2025",
    description: "A vibrant celebration of music, dance, and creativity.",
    image: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Sports Day",
    date: "April 20, 2025",
    description: "Showcase your athletic skills and team spirit.",
    image: "https://images.unsplash.com/photo-1600172454529-1966b45a55e1?auto=format&fit=crop&w=800&q=80",
  },
];

// Inject events into the page
const eventsContainer = document.getElementById("events-container");

events.forEach((event) => {
  const card = document.createElement("div");
  card.className = "event-card";
  card.innerHTML = `
    <img src="${event.image}" alt="${event.title}" />
    <h3>${event.title}</h3>
    <p><strong>Date:</strong> ${event.date}</p>
    <p>${event.description}</p>
  `;
  eventsContainer.appendChild(card);
});
