import dotenv from "dotenv";
import path from "path";

// Load .env explicitly
const envPath = path.resolve(__dirname, "../.env");
console.log(`Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("Error loading .env file:", result.error);
}

console.log("Environment Variables Check:");
console.log("--------------------------------");
console.log(
  "EMAIL_FROM_EMAIL:",
  process.env.EMAIL_FROM_EMAIL ? "OK" : "MISSING"
);
console.log("EMAIL_FROM_NAME:", process.env.EMAIL_FROM_NAME ? "OK" : "MISSING");
console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "OK" : "MISSING");

console.log("--------------------------------");
console.log("Full Value (EMAIL):", process.env.EMAIL_FROM_EMAIL);
