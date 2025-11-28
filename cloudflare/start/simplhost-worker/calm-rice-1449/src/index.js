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
