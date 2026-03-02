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
connectDB(); // should be called before any other function
