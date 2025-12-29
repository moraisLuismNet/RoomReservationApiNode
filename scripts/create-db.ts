import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";

async function createDatabase() {
  // Read appsettings to get credentials
  const configPath = path.join(process.cwd(), "appsettings.json");
  let dbName = "room-reservation-db";
  let user = "postgres";
  let password = "password";
  let host = "localhost";
  let port = 5432;

  try {
    const fileContent = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(fileContent);
    const pgString = config.DatabaseSettings.ConnectionStrings.PostgreSQL;

    // Simple manual parse for this fallback script
    const pairs = pgString.split(";");
    pairs.forEach((pair: string) => {
      const [key, value] = pair.split("=");
      if (!key || !value) return;
      const k = key.trim().toLowerCase();
      const v = value.trim();
      if (k === "database") dbName = v;
      if (k === "username" || k === "user") user = v;
      if (k === "password") password = v;
      if (k === "host") host = v;
      if (k === "port") port = parseInt(v);
    });
  } catch (e) {
    console.warn("Could not read appsettings.json, using defaults");
  }

  console.log(
    `Attempting to create database: ${dbName} at ${host}:${port} as ${user}`
  );

  const client = new Client({
    user: user,
    password: password,
    host: host,
    port: port,
    database: "postgres", // Connect to default DB
  });

  try {
    await client.connect();

    // Check if database exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );

    if (res.rowCount === 0) {
      console.log(`Database ${dbName} does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
}

createDatabase();
