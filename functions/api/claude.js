// Cloudflare Pages Function — proxies requests to the Anthropic API.
// Lives at the path /api/claude on your deployed site.
// The ANTHROPIC_API_KEY secret is injected at runtime from the project's
// Environment Variables (set in the Cloudflare dashboard).

export async function onRequest({ request, env }) {
  // Block all non-POST methods
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: `Method ${request.method} not allowed on /api/claude. Use POST.`,
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", Allow: "POST" },
      },
    );
  }

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "ANTHROPIC_API_KEY is not configured. Go to Cloudflare → your Pages project → Settings → Environment variables and add it as an encrypted secret, then redeploy.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const body = await request.text();

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body,
    });

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: "Proxy error: " + (e?.message || String(e)),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
