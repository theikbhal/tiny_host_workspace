import { unzipSync } from "fflate";

export default {
	async fetch(req, env) {
		const url = new URL(req.url);
		const host = req.headers.get("host");

		// =========================
		// SITE FILE SERVING LOGIC
		// =========================
		if (req.method === "GET" && host?.endsWith(".simplhost.com")) {
			const sub = host.split(".")[0];

			if (sub === "www" || sub === "simplhost") {
				return new Response("Main site");
			}

			let path = url.pathname.slice(1);
			if (!path) path = "index.html";

			const object = await env.SIMPLHOST_BUCKET.get(`${sub}/${path}`);

			if (!object) {
				return new Response("Not found", { status: 404 });
			}

			return new Response(object.body, {
				headers: {
					"Content-Type": guessContentType(path)
				}
			});
		}

		// =========================
		// FILE UPLOAD ENDPOINT
		// =========================
		if (req.method === "POST" && url.pathname === "/upload") {
			const form = await req.formData();
			const file = form.get("file");
			const subdomain = form.get("subdomain");

			if (!file || !subdomain) {
				return new Response("Missing file or subdomain", { status: 400 });
			}

			const fileName = file.name;
			const buf = new Uint8Array(await file.arrayBuffer());
			const sitePath = `${subdomain}/`;

			// Clean existing files for this subdomain to avoid stale assets
			const existing = await env.SIMPLHOST_BUCKET.list({ prefix: sitePath });
			const toDelete = existing.objects.map(obj => obj.key);
			if (toDelete.length > 0) {
				await env.SIMPLHOST_BUCKET.delete(toDelete);
			}

			// ZIP UPLOAD
			if (fileName.toLowerCase().endsWith(".zip")) {
				const unzipped = unzipSync(buf);

				for (const path in unzipped) {
					if (path.endsWith("/")) continue;

					// remove parent folder
					const cleanPath = path.split("/").slice(1).join("/");

					await env.SIMPLHOST_BUCKET.put(
						sitePath + cleanPath,
						unzipped[path]
					);
				}
			}

			// SINGLE FILE UPLOAD
			else {
				await env.SIMPLHOST_BUCKET.put(sitePath + fileName, buf);
			}

			// Save into Supabase
			await fetch(`${env.SUPABASE_URL}/rest/v1/sites`, {
				method: "POST",
				headers: {
					apikey: env.SUPABASE_KEY,
					Authorization: `Bearer ${env.SUPABASE_KEY}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					subdomain,
					domain: `${subdomain}.simplhost.com`,
					created_at: new Date().toISOString()
				})
			});

			return new Response(
				JSON.stringify({
					success: true,
					url: `https://${subdomain}.simplhost.com`
				}),
				{ headers: { "Content-Type": "application/json" } }
			);
		}

		// =========================
		// SITE DELETION ENDPOINT
		// =========================
		if (req.method === "DELETE" && url.pathname === "/delete") {
			const subdomain = url.searchParams.get("subdomain");

			if (!subdomain) {
				return new Response("Missing subdomain", { status: 400 });
			}

			// List all objects with the subdomain prefix
			const list = await env.SIMPLHOST_BUCKET.list({ prefix: `${subdomain}/` });

			// Delete all objects
			const keys = list.objects.map(obj => obj.key);
			if (keys.length > 0) {
				await env.SIMPLHOST_BUCKET.delete(keys);
			}

			return new Response(JSON.stringify({ success: true, deleted: keys.length }), {
				headers: { "Content-Type": "application/json" }
			});
		}

		// =========================
		// SITE RENAME (move files) ENDPOINT
		// =========================
		if (req.method === "POST" && url.pathname === "/rename") {
			const form = await req.formData();
			const oldSub = form.get("old_subdomain");
			const newSub = form.get("new_subdomain");

			if (!oldSub || !newSub) {
				return new Response("Missing old_subdomain or new_subdomain", { status: 400 });
			}

			if (oldSub === newSub) {
				return new Response(JSON.stringify({ success: true, moved: 0 }), {
					headers: { "Content-Type": "application/json" }
				});
			}

			const oldPrefix = `${oldSub}/`;
			const newPrefix = `${newSub}/`;

			const list = await env.SIMPLHOST_BUCKET.list({ prefix: oldPrefix });
			const keys = list.objects.map(obj => obj.key);

			for (const key of keys) {
				const relPath = key.slice(oldPrefix.length);
				const object = await env.SIMPLHOST_BUCKET.get(key);
				if (!object) continue;
				await env.SIMPLHOST_BUCKET.put(newPrefix + relPath, object.body);
			}

			if (keys.length > 0) {
				await env.SIMPLHOST_BUCKET.delete(keys);
			}

			return new Response(JSON.stringify({ success: true, moved: keys.length }), {
				headers: { "Content-Type": "application/json" }
			});
		}

		return new Response("Worker running");
	}
};

// Guess content type
function guessContentType(path) {
	if (path.endsWith(".html")) return "text/html";
	if (path.endsWith(".css")) return "text/css";
	if (path.endsWith(".js")) return "application/javascript";
	if (path.endsWith(".png")) return "image/png";
	if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
	if (path.endsWith(".svg")) return "image/svg+xml";
	return "application/octet-stream";
}
