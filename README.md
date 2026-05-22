# World Cup Draft Room

Beta fantasy draft site for a 2026 World Cup league.

## Local beta

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Test before the World Cup

Commissioners can use `Settings -> Commissioner Tools` to:

- start World Cup/Test mode before `2026-06-11`
- hide the draft room and open Stats
- reopen the draft room after a test
- restart a draft while keeping managers, queues, watchlists, and settings

Run the browser beta flow:

```bash
npm run test:e2e
```

## Cloudflare

The app is configured for Cloudflare Pages with D1 binding `DB`.

```bash
npm run build
npm run cf:deploy
```

`wrangler` needs `CLOUDFLARE_API_TOKEN` in this non-interactive environment.

## Security

Local Vite beta stores only profile info in browser storage. Cloudflare deployment uses Pages Functions, D1, PBKDF2 password hashes, salts, and HttpOnly session cookies.
