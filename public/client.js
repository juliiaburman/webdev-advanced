// Retrieves the venue data from the server, converting it into JSON
function fetchVenues() {
  fetch("/api/venues")
    .then((response) => response.json())
    .then((data) => {
      console.log("---------> DATA:", data);
      data.forEach((element) => {
        let card = document.createElement("div");
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
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    </div></div>`;
        document.getElementById("listofshops").appendChild(card);
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchVenues();
});
