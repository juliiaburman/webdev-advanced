
// Retrieves the venue data from the server, converting it into JSON
function fetchVenues() {
    fetch("/venues")
  .then((response) => response.json())
  .then(data => {
    console.log(data)
  });
}

fetchVenues();