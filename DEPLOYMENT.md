# SpookyBluez AI Gateway Deployment

## Live Targets

- Local nginx site: `http://192.168.1.154/`
- Cloudflare Pages site: `https://spookybluez-ai-gateway.pages.dev`
- GitHub repository: `https://github.com/Spookybluez/spookybluez-ai-gateway`
- Former Pi/ngrok mirror: removed from `/var/www/html/index.html`
- Former ngrok tunnel: `https://2144-204-225-80-70.ngrok-free.app`

## Deploy

Deploy the static site to Cloudflare Pages:

```powershell
New-Item -ItemType Directory -Force -Path .\dist | Out-Null
Copy-Item .\index.html .\dist\index.html -Force
Copy-Item .\404.html .\dist\404.html -Force
npx --yes wrangler pages deploy .\dist --project-name=spookybluez-ai-gateway --branch=master --commit-dirty=true
```

## Rollback

The original portfolio page from the first deployment is backed up on the server:

```bash
sudo cp /var/www/html/index-portfolio-backup-20260429-165825.html /var/www/html/index.html
```

The last AI Gateway mirror page before deleting the Pi homepage is backed up on the server:

```bash
sudo cp /var/www/html/index-cloudflare-link-backup-20260429-191348.html /var/www/html/index.html
```

After restoring either file, verify the Pi mirror:

```bash
curl -I http://192.168.1.154/
```

## Cloudflare Pages

The static site is also deployed to Cloudflare Pages:

```bash
npx --yes wrangler pages deploy ./dist --project-name=spookybluez-ai-gateway --branch=master --commit-dirty=true
```

Production URL:

```text
https://spookybluez-ai-gateway.pages.dev
```

## GitHub Actions

The repository includes `.github/workflows/deploy-cloudflare-pages.yml`.

Add these GitHub repository secrets to enable automatic deploys on pushes to `master`:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
