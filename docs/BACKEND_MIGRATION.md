# Backend migration (demo static site → self-hosted sync)

## Phase 1 (current)

- Godot desktop reads/writes `user://example_client_list_full.json` after load (see `mvp-auto/client_list.gd`).
- Web build fetches the published snapshot at `assets/data/clients_full.json` via `ClientPublishUrl` + `HTTPRequest`.
- Repo mirror: run `npm run import-clients-from-godot` before deploy so GitHub Pages serves the latest snapshot.

## Phase 2 (self-hosted API, no third-party services)

- Implement a small HTTP service (for example Node + SQLite) with `GET /clients/snapshot` and `POST /clients/patches` (or `PUT` snapshot for demo).
- In Godot, add an `HttpSyncAdapter` alongside the file path: same `ClientRecordMerge.merge_client_roots()` for combining remote and local maps.
- Swap `ClientPublishUrl`-based load for the API URL on Web; keep IndexedDB `user://` writes for offline tweaks if needed.
- Authenticate later; for internal demo, host on a private LAN or VPN first.

## Notes

- `_sync` metadata is written on every save (`ClientSyncMeta`) to support future conflict resolution.
- `client_record_merge.gd` merges full client records by `_sync.updated_at` when you wire up live sync.
