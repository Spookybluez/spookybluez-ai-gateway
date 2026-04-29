# ngrok AI Gateway Page Replacement Design

## Context

The current page at `http://192.168.1.154/` is a static nginx-served portfolio page titled `SpookyBluez | Portfolio`. It uses a dark neon/vaporwave style, has project and contact sections, includes an audio player, and links to `/admin/`.

The replacement will turn the homepage into a focused product-style landing page for `SpookyBluez AI Gateway`, based on ngrok AI Gateway capabilities documented by ngrok.

## Goal

Replace the portfolio homepage with a polished one-page landing site that explains AI Gateway clearly to a technical visitor. The page should feel like a real product/demo page while keeping a small amount of SpookyBluez identity through dark styling and neon accents.

## Audience

The page is for developers and technical visitors who need to understand what an AI Gateway does, how requests flow through it, and how they would connect an SDK to it.

## Content Structure

### Hero

- Headline: `One gateway for every AI model.`
- Supporting copy explains that apps can route AI requests through ngrok AI Gateway to providers such as OpenAI, Anthropic, Google, and self-hosted models.
- Primary CTA scrolls to the SDK example section.
- Secondary CTA scrolls to the request flow section.

### Why It Matters

Three compact feature panels:

- `One endpoint`: route AI requests through a single gateway URL.
- `Automatic failover`: retry across models, providers, or keys when a request fails.
- `Traffic visibility`: inspect, secure, and observe AI traffic.

### Request Flow

Show a simple visual flow:

`App -> ngrok AI Gateway -> model/provider selection -> AI provider or local model -> response`

The section should explain that the gateway validates the AI Gateway API key, selects a model/provider, forwards the request, and returns the response.

### Code Example

Show an OpenAI SDK-style example using a placeholder endpoint and placeholder AI Gateway API key:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-ai-gateway.ngrok.app/v1",
    api_key="ng-xxxxx-g1-xxxxx"
)

response = client.chat.completions.create(
    model="ngrok/auto",
    messages=[{"role": "user", "content": "Hello from the gateway"}]
)
```

The page must not include real secrets, private keys, or production credentials.

### Gateway Capabilities

List technical capabilities in a dense but readable grid:

- SDK compatibility
- Automatic model selection
- Managed provider keys
- Bring your own keys
- Self-hosted model routing
- Access control
- Content modification
- Observability

### Footer

Use small SpookyBluez branding and `2026`. Keep footer links minimal. Do not carry over the Pi-hole admin link unless explicitly requested later.

## Visual Direction

Use a dark technical landing page style with neon cyan and magenta accents. The page should preserve some glow from the old vaporwave page, but should feel cleaner, sharper, and more product-oriented.

Avoid a one-note purple/blue gradient. Use restrained accent colors, strong text contrast, and stable responsive sections.

## Technical Shape

The page can remain a static HTML/CSS page suitable for nginx. A single `index.html` with embedded CSS is acceptable unless the existing server has a separate stylesheet workflow available during implementation.

Use anchor links for the two CTAs. The page should not require JavaScript for core content or navigation.

## Verification

After implementation, verify:

- The page loads at the target local URL or in a local preview.
- CTAs scroll to the intended sections.
- No real API keys or sensitive values are present.
- The layout works on desktop and mobile widths.
- Text does not overflow buttons, cards, or code blocks.

## Sources

- ngrok AI Gateway overview: `https://ngrok.com/docs/ai-gateway/overview`
- ngrok AI Gateway request flow: `https://ngrok.com/docs/ai-gateway/how-it-works`
- ngrok AI Gateway SDK integration: `https://ngrok.com/docs/ai-gateway/sdks`
