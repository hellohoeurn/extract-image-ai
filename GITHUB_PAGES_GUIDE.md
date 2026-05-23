# OPPA Sheet Digitizer — Free Version (GitHub Pages)

This is the FREE, public, no-login version. It uses Tesseract OCR running in the
browser — no API key, no billing, no Claude account needed by anyone.

Trade-off: free in-browser OCR is less accurate than paid AI, especially on
handwritten Khmer and messy digits. You'll correct more cells by hand. But the
link works for ANYONE, costs nothing, forever.

---

## What you get

A public URL like:
    https://hellohoeurn.github.io/extract-image-ai/

Anyone opens it in any browser. No sign-in. No cost. Ever.

---

## Deploy to GitHub Pages — 5 minutes, all in the browser

### Step 1 — Put index.html in your repo

1. Go to your repo: https://github.com/HelloHoeurn/extract-image-ai
2. Click **Add file** → **Upload files**
3. Drag the `index.html` file (from this download) into the upload box
4. Scroll down, click the green **Commit changes** button

> The file MUST be named exactly `index.html` and sit at the top level of the
> repo (not inside a folder). That's what GitHub Pages serves as the homepage.

### Step 2 — Turn on GitHub Pages

1. In your repo, click **Settings** (top menu)
2. In the left sidebar, click **Pages**
3. Under **Source**, choose **Deploy from a branch**
4. Under **Branch**, select **main** (or **master**) and folder **/ (root)**
5. Click **Save**

### Step 3 — Wait, then open your URL

1. Wait 1–2 minutes (GitHub builds the site)
2. Refresh the Settings → Pages screen
3. You'll see: "Your site is live at https://hellohoeurn.github.io/extract-image-ai/"
4. Click the link — your app is live

### Step 4 — Share it

Send that URL to your team. It works in any browser, no login, no cost.

---

## Using the app

1. Open the URL
2. Drop or select an OPPA sheet photo
3. Click **Read sheet**
   - FIRST TIME is slow (30–60s) — it downloads the Khmer language pack (~15MB)
   - Later reads on the same device are faster (it's cached)
4. Review the table against the image
5. **Fix the mistakes** — click any cell and type. Free OCR WILL make errors.
6. Click **Copy** (paste into Excel/Sheets) or **Export CSV**

---

## Important: set expectations with your team

Free in-browser OCR is genuinely weaker than the paid Claude version. Tell your team:

- Treat the result as a DRAFT, not a finished sheet
- Always compare against the photo and fix cells
- The 9-digit Worker IDs and clear printed numbers usually read okay
- Handwritten Khmer operations will often be wrong — expect to retype these
- The raw OCR text is shown at the bottom ("Show raw OCR text") if the table
  parsing missed something — you can copy from there too

If accuracy is too low to be useful, the paid Claude version (the
`cloudflare-deploy` files) is dramatically better — it just needs ~USD 5 of
Anthropic API credit. Keep that option in your back pocket.

---

## Updating the app later

When you get a new `index.html`:
1. Repo → click the existing `index.html` → pencil icon (Edit) → or re-upload
2. Or **Add file → Upload files**, drag the new one, commit (it overwrites)
3. Wait 1–2 minutes, refresh your live URL

---

## Troubleshooting

**404 on the github.io URL**
- Pages isn't enabled yet, or the file isn't named `index.html` at the repo root.
- Re-check Settings → Pages shows "Your site is live at…"
- Wait the full 2 minutes after enabling.

**Page loads but stuck on "Loading…"**
- A CDN is blocked on the network. Whitelist: cdn.jsdelivr.net,
  cdn.tailwindcss.com, fonts.googleapis.com, fonts.gstatic.com

**"Read sheet" never finishes / fails**
- First run downloads ~15MB. On slow connections give it 1–2 minutes.
- If it errors, check the network can reach cdn.jsdelivr.net (that's where the
  OCR engine and language packs come from).

**Khmer shows as boxes □□□**
- Whitelist fonts.googleapis.com and fonts.gstatic.com on the network.

**Accuracy is poor**
- Expected for free OCR. Use a flatter, higher-contrast, straight-on photo.
- For real accuracy, switch to the paid Claude/Cloudflare version.
