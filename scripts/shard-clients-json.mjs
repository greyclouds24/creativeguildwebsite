/**
 * Check client snapshot size; if over limit, split into shard JSON files + manifest.
 * Website: assets/data/*.json
 * Godot (optional): web_clients_shard_*.json + web_clients_manifest.json in project root
 *
 * Usage:
 *   node scripts/shard-clients-json.mjs
 *   node scripts/shard-clients-json.mjs --check
 *   node scripts/shard-clients-json.mjs --max-mb=2 --godot="C:/path/to/mvp-auto"
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEBSITE_ROOT = join(__dirname, "..");
const INPUT = join(WEBSITE_ROOT, "assets", "data", "clients_full.json");
const SHARD_DIR = join(WEBSITE_ROOT, "assets", "data", "client_shards");
const WEB_MANIFEST = join(WEBSITE_ROOT, "assets", "data", "web_clients_manifest.json");

function parseArgs(argv) {
	const out = { check: false, maxMb: 2, godot: null, pruneMonolith: false };
	for (const a of argv) {
		if (a === "--check") out.check = true;
		else if (a === "--prune-monolith") out.pruneMonolith = true;
		else if (a.startsWith("--max-mb=")) out.maxMb = Number(a.slice("--max-mb=".length)) || out.maxMb;
		else if (a.startsWith("--godot=")) out.godot = a.slice("--godot=".length).replace(/^"(.*)"$/, "$1");
	}
	return out;
}

function guessGodotProject() {
	const env = process.env.GODOT_MVP_AUTO;
	if (env && existsSync(env)) return env;
	const guessed = join(homedir(), "Documents", "godot_files", "projects", "mvp", "mvp-auto");
	if (existsSync(guessed)) return guessed;
	return null;
}

function jsonLine(obj) {
	return JSON.stringify(obj);
}

function buildShards(obj, maxBytes) {
	const keys = Object.keys(obj).sort();
	const shards = [];
	let chunk = {};
	let chunkBytes = 2;

	for (const k of keys) {
		const piece = { [k]: obj[k] };
		const addBytes = Buffer.byteLength(jsonLine(piece), "utf8");
		if (Object.keys(chunk).length > 0 && chunkBytes + addBytes > maxBytes) {
			shards.push(chunk);
			chunk = {};
			chunkBytes = 2;
		}
		chunk[k] = obj[k];
		chunkBytes += addBytes;
	}
	if (Object.keys(chunk).length) shards.push(chunk);
	return shards;
}

function verifyShards(shards, maxBytes) {
	for (let i = 0; i < shards.length; i++) {
		const s = jsonLine(shards[i]);
		const n = Buffer.byteLength(s, "utf8");
		if (n > maxBytes * 1.15) {
			console.error(`Shard ${i} is ${n} bytes (limit ${maxBytes}); increase --max-mb or fix hot keys.`);
			process.exit(1);
		}
	}
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const maxBytes = Math.max(256 * 1024, Math.floor(args.maxMb * 1024 * 1024));

	if (!existsSync(INPUT)) {
		console.error("Missing input:", INPUT);
		process.exit(1);
	}

	const raw = readFileSync(INPUT, "utf8");
	const totalBytes = Buffer.byteLength(raw, "utf8");
	console.log(`clients_full.json: ${(totalBytes / (1024 * 1024)).toFixed(2)} MiB`);

	if (args.check) {
		const over = totalBytes > maxBytes;
		if (over) {
			console.log(`Over limit (${args.maxMb} MiB). Run without --check to shard.`);
			process.exit(1);
		}
		console.log(`Within ${args.maxMb} MiB limit.`);
		process.exit(0);
	}

	const obj = JSON.parse(raw);
	if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
		console.error("clients_full.json must be a JSON object.");
		process.exit(1);
	}

	const needShard = totalBytes > maxBytes;
	let shards;
	if (needShard) {
		shards = buildShards(obj, maxBytes);
		verifyShards(shards, maxBytes);
		console.log(`Split into ${shards.length} shards (target max ${args.maxMb} MiB each).`);
	} else {
		shards = [obj];
		console.log(`Under limit; writing one shard (no split required).`);
	}

	mkdirSync(SHARD_DIR, { recursive: true });
	const shardNames = [];
	for (let i = 0; i < shards.length; i++) {
		const name = `clients_shard_${String(i).padStart(3, "0")}.json`;
		const webPath = join(SHARD_DIR, name);
		writeFileSync(webPath, jsonLine(shards[i]), "utf8");
		shardNames.push(`client_shards/${name}`);
		console.log(`Wrote ${webPath} (${(Buffer.byteLength(jsonLine(shards[i]), "utf8") / 1024).toFixed(1)} KiB)`);
	}

	const manifest = {
		version: 1,
		source: "clients_full.json",
		max_shard_bytes: maxBytes,
		shards: shardNames,
	};
	writeFileSync(WEB_MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");
	console.log("Wrote", WEB_MANIFEST);

	const godotRoot = args.godot ?? guessGodotProject();
	if (godotRoot) {
		const gManifest = {
			version: 1,
			max_shard_bytes: maxBytes,
			shards: [],
		};
		for (let i = 0; i < shards.length; i++) {
			const gName = `web_clients_shard_${String(i).padStart(3, "0")}.json`;
			gManifest.shards.push(gName);
			writeFileSync(join(godotRoot, gName), jsonLine(shards[i]), "utf8");
			console.log(`Wrote Godot ${join(godotRoot, gName)}`);
		}
		writeFileSync(join(godotRoot, "web_clients_manifest.json"), JSON.stringify(gManifest, null, 2) + "\n", "utf8");
		console.log(`Wrote Godot ${join(godotRoot, "web_clients_manifest.json")}`);
		if (args.pruneMonolith) {
			const mono = join(godotRoot, "web_clients_full.json");
			if (existsSync(mono)) {
				unlinkSync(mono);
				console.log("Removed", mono, "(--prune-monolith)");
			}
		}
	} else {
		console.log("Skipping Godot copy (pass --godot=... or set GODOT_MVP_AUTO).");
	}
}

main();
