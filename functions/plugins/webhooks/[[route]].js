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

  const requestBody = await readLimitedText(request, 65536);
  if (!requestBody.ok) {
    return json({ ok: false, error: requestBody.error }, 413);
  }
  const requestPayload = parseJsonObject(requestBody.value);

  const targetUrl = new URL(`/plugins/webhooks/${route}`, origin);
  targetUrl.search = url.search;

  const upstreamResponse = await fetch(targetUrl, {
    method: "POST",
    headers: buildForwardHeaders(request),
    body: requestBody.value,
    redirect: "manual",
  });

  const responseBody = await upstreamResponse.text();
  const responsePayload = parseJsonObject(responseBody);

  if (env.POWER_AUTOMATE_NOTIFICATION_URL) {
    context.waitUntil(
      notifyPowerAutomate({
        url: env.POWER_AUTOMATE_NOTIFICATION_URL,
        route,
        requestPayload,
        responsePayload,
        status: upstreamResponse.status,
      }),
    );
  }

  return new Response(responseBody, {
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

async function readLimitedText(request, maxBytes) {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return { ok: false, error: "Request body is too large." };
  }
  return { ok: true, value: text };
}

function parseJsonObject(text) {
  try {
    const value = JSON.parse(text);
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value;
    }
  } catch {
    return null;
  }
  return null;
}

async function notifyPowerAutomate(params) {
  const { url, route, requestPayload, responsePayload, status } = params;
  const flow = responsePayload?.result?.flow;
  const goal = typeof requestPayload?.goal === "string" ? requestPayload.goal : "OpenClaw workflow event";
  const ok = Boolean(responsePayload?.ok);
  const title = ok ? `OpenClaw: ${route}` : `OpenClaw alert: ${route}`;
  const message = ok
    ? compactMessage(`Queued: ${goal}`)
    : compactMessage(`Webhook returned HTTP ${status}`);

  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title,
      message,
      route,
      status,
      ok,
      goal,
      flowId: typeof flow?.flowId === "string" ? flow.flowId : null,
      source: "spookybluez-ai-gateway",
    }),
  });
}

function compactMessage(value) {
  return value.length > 180 ? `${value.slice(0, 177)}...` : value;
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
