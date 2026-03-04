//This code should only be run once to add the stores.json into the database

// Set up a database client to allow Node to connect to the PostgreSQL database running in the Docker container
const { Client } = require("pg");
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

let data = readfile("stores.json");
let id = 1;
data.forEach((s) => {
  const res = client.query(query, [id, s.name, s.url, s.district]);
  console.log(res.rows[0]);
  id = id + 1;
});

disconnectDB(); //should be called at the end
