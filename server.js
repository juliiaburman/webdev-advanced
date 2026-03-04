//Part of the server side (Node + Express)

const { Client } = require("pg"); // Set up a database client to allow Node to connect to the PostgreSQL database running in the Docker container
const express = require("express"); //loads the Express library so it's installed
const app = express(); //creates your server application
const PORT = 3000; //port number where the server will run

const client = new Client({
  // Configure the client to connect to your containerized PostgreSQL
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

// Middlewares
app.use(express.json()); //allows us to parse/convert incoming JSON request bodies to JavaScript object so that Express can read it
app.use("/", express.static("public")); //if the browser asks for a file, express should look inside the public folder

//-------
// Routes
//-------
app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

//---------
// REST API
//---------
app.get("/api/venues", (req, res) => {
  // CRUD READ / SELECT
  //creating a route
  const query = {
    text: `SELECT * FROM venues;`,
  };
  client
    .query(query) //run the query
    .then((result) => {
      //awaits the result of the query
      console.log(result.rows[0]); //then print the resuls
      res.json(result.rows);
    })
    .catch((err) => {
      console.error("Error executing query", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.post("/api/venues", (req, res) => {
  // CRUD CREATE / INSERT INTO
});

app.put("/api/venues", (req, res) => {
  // CRUD UPDATE / UPDATE
});

app.delete("/api/venues", (req, res) => {
  // CRUD DELETE / DELETE
});

// Start server
app.listen(PORT, () => {
  //starts the server
  console.log(`Server running at http://localhost:${PORT}`); //prints a message so we know the server is running
  connectDB(); // should be called before any other function
});
