Space Adventure One — Godot HTML5 export target
===============================================

Export from Godot using preset: "Web (Space Adventure / WebSocket)".
Files (index.html, .js, .wasm, .pck, etc.) replace contents of this folder.

For production playtests over HTTPS, set websocket_url on the root node of
web_multiplayer_world.tscn to your tunnel host, e.g. wss://playtest.example.com
(port 443 is default; no :443 in URL).

See the game repo: PLAYTEST_SERVER.md and space-adventure-playtest.html (parent folder).
