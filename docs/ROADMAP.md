# Roadmap

These are the next project issues to create or work through for `Spookybluez/spookybluez-ai-gateway`.

## 1. Add Custom Domain

Use a branded custom domain for the public AI Gateway landing page instead of the default `pages.dev` URL.

Acceptance criteria:

- Custom domain resolves to the Cloudflare Pages site.
- HTTPS is active.
- README and deployment docs include the new canonical URL.

## 2. Add Live AI Gateway Prompt Demo

Add a small live demo where a visitor can submit a prompt and see a response routed through an AI Gateway endpoint.

Acceptance criteria:

- Demo does not expose provider keys in client code.
- Requests are rate-limited or otherwise protected.
- UI has loading, success, and error states.

## 3. Add Cloudflare Web Analytics

Add lightweight Cloudflare Web Analytics to understand page traffic.

Acceptance criteria:

- Analytics script is added through Cloudflare’s recommended snippet.
- README documents where analytics are configured.
- No heavier third-party analytics are added.

## 4. Replace Placeholder SDK Values

Replace placeholder SDK values with production route names once the gateway routes are finalized.

Acceptance criteria:

- Code example uses the real public gateway base URL or clearly documented route alias.
- No real secrets are committed.
- README and landing page stay consistent.

## 5. Add Mobile Screenshot To README

Keep the mobile screenshot current after major visual changes.

Acceptance criteria:

- `assets/screenshot-mobile.png` shows a readable mobile hero.
- README displays both desktop and mobile previews.

Status: completed.

## 6. Add Architecture Diagram To README

Add a concise visual diagram of the request path.

Acceptance criteria:

- Diagram shows app, AI Gateway, provider selection, providers/local models, and response path.
- Diagram is readable in GitHub’s README view.
- It matches the landing page’s request-flow language.
