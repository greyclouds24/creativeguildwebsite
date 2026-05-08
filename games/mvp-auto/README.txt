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
- Ships inside the Godot Web export as res://web_clients_full.json in the project root.
- Before exporting Web: copy your latest clients snapshot into the Godot project:
  web_clients_full.json (from assets/data/clients_full.json or your generator).
- Site JSON (assets/data/clients_full.json) is optional; the game no longer downloads it.
