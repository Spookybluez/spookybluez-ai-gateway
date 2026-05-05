const ALLOWED_ROUTES = new Set([
  "github-actions",
  "make",
  "power-automate",
  "google-apps-script",
]);

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const route = normalizeRoute(context.params.route);

  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405, {
      Allow: "POST",
    });
  }

  if (!ALLOWED_ROUTES.has(route)) {
    return json({ ok: false, error: "Unknown OpenClaw webhook route." }, 404);
  }

  if (!env.OPENCLAW_ORIGIN_BASE_URL) {
    return json({ ok: false, error: "OpenClaw origin is not configured." }, 503);
  }

  const origin = normalizeOrigin(env.OPENCLAW_ORIGIN_BASE_URL);
  if (!origin) {
    return json({ ok: false, error: "OpenClaw origin is invalid." }, 503);
  }

  const targetUrl = new URL(`/plugins/webhooks/${route}`, origin);
  targetUrl.search = url.search;

  const upstreamResponse = await fetch(targetUrl, {
    method: "POST",
    headers: buildForwardHeaders(request),
    body: request.body,
    redirect: "manual",
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: buildResponseHeaders(upstreamResponse),
  });
}

function normalizeRoute(value) {
  if (Array.isArray(value)) {
    return value.join("/");
  }
  return String(value ?? "").replace(/^\/+|\/+$/g, "");
}

function normalizeOrigin(value) {
  try {
    const origin = new URL(value);
    if (origin.protocol !== "https:") {
      return null;
    }
    origin.pathname = "/";
    origin.search = "";
    origin.hash = "";
    return origin;
  } catch {
    return null;
  }
}

function buildForwardHeaders(request) {
  const headers = new Headers();
  copyHeader(request.headers, headers, "authorization");
  copyHeader(request.headers, headers, "content-type");
  copyHeader(request.headers, headers, "x-openclaw-webhook-secret");
  copyHeader(request.headers, headers, "user-agent");
  headers.set("x-spookybluez-gateway", "openclaw-webhook-proxy");
  return headers;
}

function buildResponseHeaders(response) {
  const headers = new Headers();
  copyHeader(response.headers, headers, "content-type");
  copyHeader(response.headers, headers, "cache-control");
  headers.set("access-control-allow-origin", "*");
  headers.set("x-spookybluez-gateway", "openclaw-webhook-proxy");
  return headers;
}

function copyHeader(source, target, name) {
  const value = source.get(name);
  if (value) {
    target.set(name, value);
  }
}

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}
