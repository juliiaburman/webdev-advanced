//This code should only be run once to add the stores.json into the database

const { Client } = require("pg"); // Set up a database client to allow Node to connect to the PostgreSQL database running in the Docker container
const fs = require("fs"); //Import Node's file system module so we can read the stores.json file

// Configure the client to connect to your containerized PostgreSQL
const client = new Client({
  host: "localhost", // since the container's port is mapped to localho
  port: 5432,
  user: "postgres", // default user
  password: "12345", // password set in the container command
  database: "postgres", // default database
});

// Establish the connection so the PostgreSQL database can be used in the Node application
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database with async/await");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}
// Disconnect to ensure that all the data is in the database
async function disconnectDB() {
  try {
    await client.end();
    console.log("Disconnected to PostgreSQL database with async/await");
  } catch (err) {
    console.error("Disconnection error", err.stack);
  }
}

connectDB(); // should be called before any other function

// Read the stores.json file and convert it into a JavaScript object
const data = JSON.parse(fs.readFileSync("stores.json", "utf8"));

data.forEach((venue) => {
  //Insert venues in the database
  const query = {
    text: `INSERT INTO venues (name, url, image_url, district, category) VALUES ($1, $2, $3, $4, $5)`,
    values: [
      venue.name,
      venue.url,
      venue.image_url,
      venue.district,
      venue.category,
    ],
  };

  client.query(query);
  console.log("Inserted venue:", venue.name);
});

disconnectDB(); //should be called at the end
