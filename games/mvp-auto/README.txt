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

Client list snapshot (published to the site):
- Run from website repo root: npm run import-clients-from-godot
  Copies Godot userdata example_client_list_full.json -> assets/data/clients_full.json
- npm run validate-client-json
