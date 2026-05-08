/**
 * Warm sessionStorage copy of assets/data/clients_full.json (stale-while-revalidate).
 */
(function () {
	var url = new URL("assets/data/clients_full.json", window.location.href).href;
	var key = "cg_clients_full_cache_v1";
	try {
		var cached = sessionStorage.getItem(key);
		if (cached) JSON.parse(cached);
	} catch (_) {
		sessionStorage.removeItem(key);
	}
	fetch(url, { cache: "no-cache" })
		.then(function (r) {
			if (!r.ok) throw new Error("HTTP " + r.status);
			return r.text();
		})
		.then(function (text) {
			JSON.parse(text);
			try {
				sessionStorage.setItem(key, text);
			} catch (_) {}
		})
		.catch(function () {});
})();
