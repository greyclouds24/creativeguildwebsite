/**
 * Validates clients_full.json shape: root object with string keys and object values.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "..", "assets", "data", "clients_full.json");

if (!fs.existsSync(file)) {
	console.error(`Missing file: ${file}`);
	process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
if (data === null || typeof data !== "object" || Array.isArray(data)) {
	console.error("Root must be a JSON object.");
	process.exit(1);
}

let errors = 0;
for (const [k, v] of Object.entries(data)) {
	if (typeof k !== "string" || k.length === 0) {
		console.error("Invalid key:", k);
		errors++;
	}
	if (v === null || typeof v !== "object" || Array.isArray(v)) {
		console.error(`Value for "${k}" must be an object.`);
		errors++;
	}
}

if (errors) {
	process.exit(1);
}
console.log(`OK: ${Object.keys(data).length} client records in ${file}`);
