/**
 * Copy Godot user-data client JSON into the static site mirror.
 *
 * Usage:
 *   node scripts/import-clients-from-godot-userdata.mjs [SOURCE]
 *   GODOT_CLIENTS_JSON="C:/path/to/example_client_list_full.json" node scripts/import-clients-from-godot-userdata.mjs
 *
 * Default SOURCE (Windows): %APPDATA%/Godot/app_userdata/MVP Auto/example_client_list_full.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const DEST = path.join(repoRoot, "assets", "data", "clients_full.json");

function defaultWindowsSource() {
	const base = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
	return path.join(base, "Godot", "app_userdata", "MVP Auto", "example_client_list_full.json");
}

const src =
	process.env.GODOT_CLIENTS_JSON?.trim() ||
	process.argv[2]?.trim() ||
	(process.platform === "win32"
		? defaultWindowsSource()
		: path.join(os.homedir(), ".local", "share", "godot", "app_userdata", "MVP Auto", "example_client_list_full.json"));

if (!src || !fs.existsSync(src)) {
	console.error(`Source file not found:\n  ${src}`);
	console.error("Pass a path as argv[1] or set GODOT_CLIENTS_JSON.");
	process.exit(1);
}

const raw = fs.readFileSync(src, "utf8");
JSON.parse(raw); // validate
fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.writeFileSync(DEST, raw, "utf8");
console.log(`Wrote ${DEST}\n  from ${src}`);
