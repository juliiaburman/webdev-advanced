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

// FETCH FOR app.post



// FETCH FOR app.put
//getting the prefilled form for the venue we want to edit
function loadVenueEdit() {
  const urlData = new URLSearchParams(window.location.search); // extract query parameters (everything after ?) from the URL so we can access values like the venue id more info here https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  const id = urlData.get("id"); //get the venue id from the URL query parameters

  fetch(`/api/venues/${id}`) //sends a request to the server
    .then(res => res.json()) //server responds with JSON
    .then(data => {
      document.querySelector('input[name="name"]').value = data.name; //find the name input field and fill it with the value data
      document.querySelector('input[name="website-url"]').value = data.url;
      document.querySelector('input[name="image-url"]').value = data.image_url;
      document.querySelector('#add-district').value = data.district; //selects the district dropdown and sets the correct option
      document.querySelector('#venue-type').value = data.category;
    });
}

//sending the update form through fetch
function updateVenue(event) {
  event.preventDefault(); //stops the default form submission behavior which is reloading the page so we instead can send the request using fetch

  const urlData = new URLSearchParams(window.location.search);
  const id = urlData.get("id");
  const updatedVenue = {
    name: document.querySelector('input[name="name"]').value, //get the name form the input field
    url: document.querySelector('input[name="website-url"]').value,
    image_url: document.querySelector('input[name="image-url"]').value,
    district: document.querySelector('#add-district').value,
    category: document.querySelector('#venue-type').value
  };

  fetch(`/api/venues/${id}`, { //sending a request to the server
    method: "PUT", //telling the server that the request is an update
    headers: {
      "Content-Type": "application/json" //telling that the data we're sending is JSON
    },
    body: JSON.stringify(updatedVenue) //converting the JavaScript object into JSON text
  })
  .then(res => res.json())
  .then((data) => {
    console.log("Updated venue:", data);
    window.location.href = "/index.html"; //redirecting back to hompage
  });
}

document.addEventListener("DOMContentLoaded", () => { //once the DOM/HTML page is loaded...
  if (window.location.pathname.includes("index.html")) { //run the fetchVenues function if the index.html is loaded
    fetchVenues();
  }
  if (window.location.pathname.includes("editvenue.html")) { //run the loadVenueEdit function if the editvenue.html is loaded
    loadVenueEdit();
    const form = document.querySelector("#edit-venue-form");
    form.addEventListener("submit", updateVenue);
  }
});


// FETCH FOR app.delete
