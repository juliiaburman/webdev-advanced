// storing the current sorting option in the dropdown
let currentSort = "";

// ------------------------
// FETCH FOR app.get (displaying venues)
// ------------------------
function fetchVenues() {
  const container = document.getElementById("listofvenues");
  container.innerHTML = ""; // clear existing cards

  fetch("/api/venues")
    .then((response) => response.json())
    .then((data) => {
      // Sorting using dropdown menu
      if (currentSort === "district") {
        data.sort((a, b) => a.district.localeCompare(b.district));
      }
      if (currentSort === "category") {
        data.sort((a, b) => a.category.localeCompare(b.category));
      }

      // Create cards for each venue
      data.forEach((element) => {
        const card = document.createElement("div");

        card.innerHTML = `
          <div class="venue-card">
            <div class="venue-image">
              <img src="${element.image_url}" alt="Cafe placeholder image" />
            </div>
            <div class="venue-name">
              <a href="https://${element.url}"><h3>${element.name}</h3></a>
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

        container.appendChild(card);

        // ------------------------
        // Add delete functionality
        // ------------------------
        const deleteBtn = card.querySelector(".delete-button");
        deleteBtn.addEventListener("click", () => {
          const id = deleteBtn.dataset.id;

          if (confirm("Are you sure you want to delete this venue?")) {
            fetch(`/api/venues/${id}`, { method: "DELETE" })
              .then((res) => res.json())
              .then(() => {
                alert("Venue deleted successfully");
                fetchVenues(); // reload list
              })
              .catch((err) => console.error("Error deleting venue:", err));
          }
        });
      });
    })
    .catch((err) => {
      console.error("Error fetching venues:", err);
    });
}

// ------------------------
// FETCH FOR app.post (add venue)
// ------------------------
const addVenueForm = document.querySelector(".add-venue-form");
if (addVenueForm) {
  addVenueForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(addVenueForm);
    const data = {
      name: formData.get("name"),
      "website-url": formData.get("website-url"),
      "image-url": formData.get("image-url"),
      district: formData.get("district"),
      venue: formData.get("venue"),
    };

    fetch("/api/venues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Venue added successfully!");
        window.location.href = "/index.html";
      })
      .catch((err) => console.error("Error submitting venue:", err));
  });
}

// ------------------------
// FETCH FOR app.put (update/edit form)
// ------------------------
function loadVenueEdit() {
  const urlData = new URLSearchParams(window.location.search);
  const id = urlData.get("id");

  fetch(`/api/venues/${id}`)
    .then((res) => res.json())
    .then((data) => {
      document.querySelector('input[name="name"]').value = data.name;
      document.querySelector('input[name="website-url"]').value = data.url;
      document.querySelector('input[name="image-url"]').value = data.image_url;
      document.querySelector("#add-district").value = data.district;
      document.querySelector("#venue-type").value = data.category;
    });
}

function updateVenue(event) {
  event.preventDefault();

  const urlData = new URLSearchParams(window.location.search);
  const id = urlData.get("id");
  const updatedVenue = {
    name: document.querySelector('input[name="name"]').value,
    url: document.querySelector('input[name="website-url"]').value,
    image_url: document.querySelector('input[name="image-url"]').value,
    district: document.querySelector("#add-district").value,
    category: document.querySelector("#venue-type").value,
  };

  fetch(`/api/venues/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedVenue),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Venue updated successfully!");
      window.location.href = "/index.html";
    })
    .catch((err) => console.error("Error updating venue:", err));
}

// ------------------------
// DOMContentLoaded
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("index.html")) {
    fetchVenues();

    const sortDropdown = document.querySelector("#sort-by");
    if (sortDropdown) {
      sortDropdown.addEventListener("change", () => {
        currentSort = sortDropdown.value;
        fetchVenues();
      });
    }
  }

  if (window.location.pathname.includes("editvenue.html")) {
    loadVenueEdit();
    const editForm = document.querySelector("#edit-venue-form");
    if (editForm) {
      editForm.addEventListener("submit", updateVenue);
    }
  }
});
