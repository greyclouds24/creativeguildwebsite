Place your Godot Web export files in this folder.

Expected result after export:
- games/mvp-auto/index.html
- games/mvp-auto/*.js
- games/mvp-auto/*.wasm
- games/mvp-auto/*.pck

Suggested export flow:
1) Open mvp-auto project in Godot.
2) Project -> Export -> Web.
3) Export path:
   c:/Users/micha/Documents/Creative Guild/website/creativeguildwebsite/games/mvp-auto/index.html

After exporting, open:
- mvp-auto.html

Client list (browser build):
- Prefer res://web_clients_manifest.json + web_clients_shard_*.json (built from website:
  npm run shard-clients).
- If manifest is missing, the game falls back to res://web_clients_full.json, then demo JSON.
- Keep assets/data/clients_full.json as source; run shard-clients before Web export when the
  monolith is too large.
