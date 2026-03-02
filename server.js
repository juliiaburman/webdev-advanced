//Part of the server side (Node + Express)

const express = require("express"); //loads the Express library so it's installed
const app = express(); //creates your server application
const PORT = 3000; //port number where the server will run

// Middlewares
app.use(express.json()); //allows us to parse/convert incoming JSON request bodies to JavaScript object so that Express can read it
app.use("/", express.static("public")); //if the browser asks for a file, express should look inside the public folder

// Routes
app.get("/venues", (req, res) => { //creating a route for the homepage
  res.json({ message: "The venue route works :)" });//when someone goes to /welcome, send back this text
});

// Start server
app.listen(PORT, () => { //starts the server
  console.log(`Server running at http://localhost:${PORT}`); //prints a message so we know the server is running
});