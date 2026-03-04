const { Client } = require("pg");
const fs = require("fs");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "12345",
  database: "postgres",
});

async function insertIntoDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");

    const data = JSON.parse(fs.readFileSync("stores.json", "utf8"));

    for (const venue of data) {
      const query = {
        text: `INSERT INTO venues (name, url, image_url, district, category) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        values: [
          venue.name,
          venue.url,
          venue.image_url,
          venue.district,
          venue.category,
        ],
      };
      const res = await client.query(query);
      console.log(res.rows[0]);
    }
  } catch (err) {
    console.error("Error", err.stack);
  } finally {
    await client.end();
    console.log("Disconnected from PostgreSQL database");
  }
}

// insertIntoDB();
