# SpookyBluez AI Gateway Deployment

## Live Targets

- Local nginx site: `http://192.168.1.154/`
- Current ngrok tunnel: `https://2144-204-225-80-70.ngrok-free.app`
- Server web root: `/var/www/html`
- Live page: `/var/www/html/index.html`

## Deploy

Upload the local `index.html` to the Raspberry Pi, back up the existing live file, and replace it.

```bash
sudo cp /var/www/html/index.html /var/www/html/index-backup-YYYYMMDD-HHMMSS.html
sudo cp /tmp/index.html /var/www/html/index.html
sudo chmod 0644 /var/www/html/index.html
```

## Rollback

The original portfolio page from the first deployment is backed up on the server:

```bash
sudo cp /var/www/html/index-portfolio-backup-20260429-165825.html /var/www/html/index.html
```

After rollback or deploy, verify:

```bash
curl -I http://192.168.1.154/
```

Then open the local or ngrok URL in a browser.
