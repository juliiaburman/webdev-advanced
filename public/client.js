// FETCH FOR app.get
// Retrieves the venue data from the server, converting it into JSON and displaying as cards on the homepage
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
      <img src="${element.image_url}" alt="Placeholder image" />
    </div>

    <div class="venue-name">
      <a href="https://${element.url}">
      <h3>${element.name}</h3></a>
    </div>

    <div class="venue-district">${element.district}</div>
    <div class="venue-type">${element.category}</div>

    <div class="venuecard-buttons">
      <a href="/editvenue.html?id=${element.id}"><button class="edit-button">Edit</button></a>
      <button class="delete-button">Delete</button>
    </div></div>`;
        document.getElementById("listofvenues").appendChild(card);
      });
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
