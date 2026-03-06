//Part of the server side (Node + Express)

const { Client } = require("pg"); // import the Postgres library for Node
const express = require("express"); //loads the Express library so it's installed
const app = express(); //creates your server application
const PORT = 3000; //port number where the server will run

const client = new Client({
  // Client is a database connection object used to connect Node to your containerized PostgreSQL
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

// CRUD READ / displaying the venues on the homepage
app.get("/api/venues", (req, res) => { //recieves the get request from the browser
  const query = {
    text: `SELECT * FROM venues ORDER BY id ASC;`, //store the SQL command inside a JavaScript object called query
  };
  client
    .query(query) //run the query to send the SQL command to the database and execute it
    .then((result) => {
      res.json(result.rows); //sends back the data/rows of venues from the database to the browser
    })
    .catch((err) => {
      console.error("Error executing query", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
});

// CRUD CREATE / adding venue through form
app.post("/api/venues", async (req, res) => { //recieves the post from client
  try {
    const {
      name,
      "website-url": website_url,
      "image-url": image_url,
      district,
      venue,
    } = req.body;

    const query = { //store the new venue in the database
      text: `INSERT INTO venues (name, url, image_url, district, category)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *;`,
      values: [name, website_url, image_url, district, venue],
    };

    const result = await client.query(query);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting venue", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CRUD UPDATE / editing existing venues
app.get("/api/venues/:id", (req, res) => {
  //creating an API route that returns one venue
  const venueId = req.params.id;
  const query = {
    text: `SELECT * FROM venues WHERE id = $1;`,
    values: [venueId],
  };
  client
    .query(query) //run the query
    .then((result) => {
      //awaits the result of the query
      res.json(result.rows[0]);
    })
    .catch((err) => {
      console.error("Error executing query", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
});

//updating the venue data through the form
app.put("/api/venues/:id", express.json(), (req, res) => {
  //creating a PUT API route and express.json() allows Express to read JSON data from the request body.
  const venueId = req.params.id;
  const { name, url, image_url, district, category } = req.body; //extracts the updated values from the request body
  const query = {
    //creates a query object for PostgreSQL.
    text: `
      UPDATE venues
      SET name = $1, url = $2, image_url = $3, district = $4, category = $5
      WHERE id = $6
    `,
    values: [name, url, image_url, district, category, venueId],
  };

  client
    .query(query) //sends the SQL query to PostgreSQL
    .then(() => {
      res.json({ message: "Venue updated successfully" });
    })
    .catch((err) => {
      console.error("Error updating venue", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
});

// CRUD DELETE / using DELETE
app.delete("/api/venues/:id", async (req, res) => {
  const venueId = req.params.id;

  try {
    const query = {
      text: `DELETE FROM venues WHERE id = $1 RETURNING *;`,
      values: [venueId],
    };

    const result = await client.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (err) {
    console.error("Error deleting venue", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  //starts the server
  console.log(`Server running at http://localhost:${PORT}`); //prints a message so we know the server is running
  connectDB(); // the database connects everytime the server starts
});
