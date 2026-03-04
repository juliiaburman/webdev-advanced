// FETCH FOR app.get
// Retrieves the venue data from the server, converts it into JSON, and displays as cards on the homepage
function fetchVenues() {
  const container = document.getElementById("listofvenues");
  container.innerHTML = ""; // clear existing cards

  fetch("/api/venues")
    .then((response) => response.json())
    .then((data) => {
      console.log("---------> DATA:", data);

      data.forEach((element) => {
        // Create a new card div
        const card = document.createElement("div");

        // Add innerHTML with delete button having data-id
        card.innerHTML = `
          <div class="venue-card">
            <div class="venue-image">
              <img src="${element.image_url}" alt="Cafe placeholder image" />
            </div>
            <div class="venue-name">
              <h3>${element.name}</h3>
            </div>
            <div class="venue-district">${element.district}</div>
            <div class="venue-type">${element.category}</div>
            <div class="venuecard-buttons">
              <a href="/editvenue.html?id=${element.id}">
                <button class="edit-button">Edit</button>
              </a>
              <button class="delete-button" data-id="${element.id}">Delete</button>
            </div>
          </div>
        `;

        // Append the card to the container
        container.appendChild(card);

        // Add delete functionality for this card
        const deleteBtn = card.querySelector(".delete-button");
        deleteBtn.addEventListener("click", async () => {
          const id = deleteBtn.dataset.id; // get the venue ID
          if (confirm("Are you sure you want to delete this venue?")) {
            try {
              const response = await fetch(`/api/venues/${id}`, {
                method: "DELETE",
              });

              if (response.ok) {
                alert("Venue deleted successfully");
                fetchVenues(); // refresh the list after deletion
              } else {
                alert("Failed to delete venue");
              }
            } catch (err) {
              console.error("Error deleting venue:", err);
            }
          }
        });
      });
    })
    .catch((err) => {
      console.error("Error fetching venues:", err);
    });
}

// Call fetchVenues on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchVenues();
});

// FETCH FOR app.put
