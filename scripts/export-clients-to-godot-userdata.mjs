/**
 * Copy repo mirror back into Godot user-data (overwrite). Use to seed a local Godot build.
 *
 * Usage:
 *   node scripts/export-clients-to-godot-userdata.mjs [DEST]
 *   GODOT_CLIENTS_JSON="C:/path/to/example_client_list_full.json" node scripts/export-clients-to-godot-userdata.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const SRC = path.join(repoRoot, "assets", "data", "clients_full.json");

function defaultWindowsDest() {
	const base = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
	return path.join(base, "Godot", "app_userdata", "MVP Auto", "example_client_list_full.json");
}

const dest =
	process.env.GODOT_CLIENTS_JSON?.trim() ||
	process.argv[2]?.trim() ||
	(process.platform === "win32"
		? defaultWindowsDest()
		: path.join(os.homedir(), ".local", "share", "godot", "app_userdata", "MVP Auto", "example_client_list_full.json"));

if (!fs.existsSync(SRC)) {
	console.error(`Repo file missing: ${SRC}`);
	process.exit(1);
}

const raw = fs.readFileSync(SRC, "utf8");
JSON.parse(raw);
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, raw, "utf8");
console.log(`Wrote ${dest}\n  from ${SRC}`);
