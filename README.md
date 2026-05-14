# OPPA Sheet Digitizer — Cloudflare Deployment

A standalone web app version of the PIES OPPA Sheet Digitizer, hosted free on Cloudflare Pages.

---

## What's in this folder

```
cloudflare-deploy/
├── index.html              ← The frontend (React app, no build step needed)
├── functions/
│   └── api/
│       └── claude.js       ← Cloudflare Pages Function that proxies to Anthropic
└── README.md               ← This file
```

The frontend calls `/api/claude` on the same domain. The Pages Function holds your Anthropic API key as a secret and forwards requests to `api.anthropic.com`. Your key is never exposed to the browser.

---

## Cost summary

| Item                     | Cost                                                  |
| ------------------------ | ----------------------------------------------------- |
| Cloudflare Pages hosting | **$0** — free forever, commercial use allowed        |
| Cloudflare Worker calls  | **$0** — 100,000/day free, you'll never hit this     |
| Anthropic API usage      | **~$0.10 per sheet extracted** (Opus 4.7)            |

For 50 sheets/day that's ~USD 150/month payable to Anthropic. Hosting stays $0.

---

## Prerequisites — 10 minutes

### 1. Get an Anthropic API key

1. Go to <https://console.anthropic.com>
2. Sign up or log in
3. Click your name (top-right) → **API Keys** → **Create Key**
4. Name it something like `pies-oppa-prod`
5. Copy the key (starts with `sk-ant-…`) somewhere safe — **Anthropic won't show it again**
6. Click **Billing** in the sidebar and add credit (USD 5 minimum is plenty to start)

### 2. Get a free Cloudflare account

1. Go to <https://dash.cloudflare.com/sign-up>
2. Sign up, verify your email
3. You'll land in the Cloudflare dashboard
4. No credit card required for the free tier

---

## Deploy — 5 minutes, all in the dashboard

### Step 1 — Create the Pages project

1. In Cloudflare dashboard, click **Workers & Pages** in the left sidebar
2. Click the **Create** button
3. Choose the **Pages** tab
4. Click **Upload assets** (not "Connect to Git")
5. Project name: type something like `pies-oppa` — this becomes part of your URL: `pies-oppa.pages.dev`
   - Project names can contain only lowercase letters, numbers, and dashes
6. Click **Create project**

### Step 2 — Upload the files

1. You'll see an upload area
2. **Drag the entire `cloudflare-deploy` folder** onto the upload area
   - Or click "select from computer" and choose all files — make sure the `functions/` subfolder structure is preserved
3. Cloudflare will list the files. You should see:
   - `index.html`
   - `functions/api/claude.js`
   - `README.md` (this file — harmless, will just sit there)
4. Click **Deploy site**
5. Wait ~30 seconds for the first deploy to finish

At this point the site is live but the API key isn't set, so extraction will fail. One more step.

### Step 3 — Add your Anthropic API key as a secret

1. From the project page, click **Settings** (top tabs)
2. Click **Variables and Secrets** in the left sub-menu
3. Under **Production**, click **+ Add**
4. Fill in:
   - **Variable name:** `ANTHROPIC_API_KEY` *(exact spelling, case-sensitive, no spaces)*
   - **Value:** paste your `sk-ant-…` key
   - **Type:** select **Secret** (encrypted) — **not** plaintext
5. Click **Deploy** (or **Save**)

### Step 4 — Redeploy so the function picks up the secret

1. Click the **Deployments** tab at the top
2. Find your most recent deployment in the list
3. Click the **⋯** (three dots) menu on the right → **Retry deployment**
4. Wait ~30 seconds

### Step 5 — Test it

1. Click **Visit site** (top right of the project page), or open your URL directly: `https://pies-oppa.pages.dev` (replace with your project name)
2. Upload a test OPPA sheet photo
3. Click **Extract table**
4. After 20–40 seconds you should see the parsed table

If it works, share that URL with your IE team. They can use it from any browser, no login required.

---

## Optional — custom domain

If Pactics owns a domain (e.g. `pactics.com`), you can put the app on a friendly URL like `oppa.pactics.com`:

1. In the project, click **Custom domains** in the left menu
2. Click **Set up a custom domain**
3. Enter your domain (e.g. `oppa.pactics.com`)
4. Cloudflare will either:
   - Auto-configure if your domain is already on Cloudflare DNS, or
   - Give you a CNAME record to add to your registrar's DNS panel
5. Done — your app is now at `https://oppa.pactics.com`

---

## Updating the app

When I send you new files (a new `index.html` or updated function):

1. Go to your Pages project → **Deployments**
2. Click **Create deployment** (top right)
3. Drag the updated folder
4. Wait 30 seconds — new version is live
5. The previous version stays accessible at its own preview URL, so you can always roll back

The API key secret persists between deployments — you only set it once.

---

## Monitoring costs

### Anthropic
- Go to <https://console.anthropic.com> → **Billing** → **Usage**
- Set a usage alert: **Billing** → **Cost alerts** → add an alert at e.g. USD 50/month
- You'll get an email if usage spikes

### Cloudflare
- Pages → your project → **Analytics** shows requests, no cost
- Worker invocation counts are in **Workers & Pages** → your project → **Functions**

---

## Troubleshooting

### "ANTHROPIC_API_KEY is not configured"
You skipped Step 3 or didn't redeploy after adding the secret. Go back to **Settings → Variables and Secrets**, confirm `ANTHROPIC_API_KEY` is there as a Secret, then redeploy (Step 4).

### "API error 401: invalid x-api-key"
Your Anthropic key is wrong or revoked. Go to <https://console.anthropic.com> → API Keys, generate a fresh one, update the secret in Cloudflare, redeploy.

### "API error 429: rate limit"
You've hit Anthropic's rate limit for your tier. Wait a minute and retry. If this happens often, request a rate-limit increase from Anthropic support.

### "API error 400: credit balance is too low"
Top up your Anthropic billing balance at <https://console.anthropic.com> → Billing.

### Page loads but is blank or stuck on "Loading PIES OPPA Digitizer"
Open the browser DevTools (F12) → Console tab. If you see CDN errors (unpkg.com, cdn.tailwindcss.com), one of the CDNs is blocked on the user's network. The IE team may need to whitelist `unpkg.com`, `cdn.tailwindcss.com`, and `fonts.googleapis.com`.

### Khmer text shows as boxes (□□□)
The user's browser doesn't have a Khmer font installed AND the Google Fonts CDN is blocked. Fix: whitelist `fonts.googleapis.com` and `fonts.gstatic.com` on the network.

### Extraction works but Khmer is still inaccurate
Click **Refine Khmer** for a second pass. If still wrong, edit the cells directly. Future plan: add a worker-name lookup table since names are pre-printed from the Pactics HR roster.

---

## Security notes

- The Anthropic key is stored as an **encrypted secret** at Cloudflare and never exposed to the browser.
- The `/api/claude` endpoint accepts any well-formed request from anyone who knows your URL — there's no authentication. For an internal Siem Reap tool this is usually fine, but if you want to lock it down, consider:
  - Cloudflare Access (free for up to 50 users) — adds Google/email login in front of the site
  - Cloudflare Zero Trust rules — restrict by IP range to the Pactics office network
  - Basic auth via a small middleware — I can add this in a future version
- Per the Anthropic API docs, the proxy could be hardened to enforce specific models / max_tokens / prompts. v0.3 forwards whatever the client sends. Fine for trusted internal users; not for a public-internet deployment.

---

## Architecture diagram

```
   Browser (your IE team)
        │
        │  POST /api/claude (image + prompt)
        ▼
   Cloudflare Pages Function  ←── ANTHROPIC_API_KEY (encrypted secret)
        │
        │  POST api.anthropic.com/v1/messages
        ▼
   Anthropic API (Claude Opus 4.7)
        │
        │  JSON response
        ▼
   Cloudflare Pages Function
        │
        │  forward JSON to browser
        ▼
   Browser → React UI renders editable table
```

---

## Need help?

Reply in the Claude chat with any errors and screenshots. I can patch the files and you redeploy.
