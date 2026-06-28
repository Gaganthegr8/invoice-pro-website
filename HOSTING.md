# Hosting & Deployment Guide — Invoice Pro Website

This is a plain static site (HTML/CSS/JS, no build step, no framework) so it
deploys to any static host in minutes. Below are two paths — Vercel and
Netlify — plus how to connect your own domain to either.

---

## Before you deploy: host your installers on GitHub Releases

GitHub blocks any file over 100MB from being committed to a normal repo,
and your `.dmg` / `.exe` installers are well over that. **Don't put them in
the repo at all** — use GitHub Releases instead, which supports files up to
2GB each, completely free.

### Step 1 — Build your installers
Via your GitHub Actions workflow (or `npm run dist-mac` / `npm run dist-win`
locally), producing:
- `Invoice-Pro-1.1.0.dmg`
- `Invoice-Pro-Setup-1.1.0.exe`

### Step 2 — Create a GitHub Release
1. Push this website folder to a GitHub repo first (see Step A1/B below).
2. On that repo's GitHub page, click **Releases** (right sidebar) →
   **Create a new release**.
3. Add a tag, e.g. `v1.1.0`.
4. Drag both installer files into the **Attach binaries** box at the
   bottom of the release form.
5. Click **Publish release**.

### Step 3 — Copy the download URLs
Each attached file gets a permanent URL in this format:
```
https://github.com/<your-username>/<your-repo>/releases/download/<tag>/<filename>
```
For example:
```
https://github.com/Gaganthegr8/invoice-pro-website/releases/download/v1.1.0/Invoice-Pro-1.1.0.dmg
```

### Step 4 — Paste those URLs into the site
Update two files:
- **`script.js`** — the `MAC_DMG` and `WIN_EXE` constants near the top
- **`index.html`** — the two `<a href="...">` links in the Download section
  (search for `mac-download-link` and `win-download-link`)

This repo's copy already has placeholder URLs pointed at
`Gaganthegr8/invoice-pro-website` — just update the tag/filename if yours
differ, or swap the whole URL if you used a different repo name.

> **Never commit the `.dmg`/`.exe` files themselves into git.** If you
> already tried and got the `git push` rejected, see the **Fixing a
> rejected push** section near the bottom of this file.

---

## Option A — Deploy with Vercel

### A1. Push this folder to GitHub (recommended)
1. Create a new repository on GitHub (e.g. `invoice-pro-website`).
2. From inside this project folder:
   ```
   git init
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/invoice-pro-website.git
   git push -u origin main
   ```

### A2. Import into Vercel
1. Go to https://vercel.com and sign up / log in (GitHub login is easiest).
2. Click **Add New → Project**.
3. Select the `invoice-pro-website` repo you just pushed.
4. Framework preset: choose **Other** (it's a plain static site — no build
   command, no install command, no output directory needed).
5. Click **Deploy**.

Vercel gives you a live URL immediately, like
`https://invoice-pro-website.vercel.app`.

### A3. (Optional) Skip GitHub — deploy directly from your computer
If you don't want to use GitHub at all:
```
npm install -g vercel
cd invoice-website
vercel
```
Follow the prompts (link to a new project, accept defaults). It deploys
straight from your folder and gives you a live link.

---

## Option B — Deploy with Netlify

### B1. Drag-and-drop (fastest, no GitHub needed)
1. Go to https://app.netlify.com/drop
2. Drag your entire `invoice-website` folder onto the page.
3. Netlify uploads it and gives you a live URL in seconds, like
   `https://random-name-123.netlify.app`.

This is the quickest way to get something live today. The downside: to
update the site later you'd re-drag the folder each time, so it's better
for a quick first look than for ongoing use.

### B2. Connect to GitHub (recommended for ongoing updates)
1. Push the folder to GitHub the same way as step A1 above.
2. Go to https://app.netlify.com → **Add new site → Import an existing project**.
3. Connect your GitHub account, pick the repo.
4. Build command: leave blank. Publish directory: `.` (this is already set
   in `netlify.toml`).
5. Click **Deploy site**.

Now every time you `git push` an update, Netlify automatically redeploys.

---

## Connecting your own domain (works the same way on both)

Once you've bought a domain (Namecheap, GoDaddy, Google Domains successor,
etc.), here's how to point it at your deployed site:

### On Vercel
1. Open your project → **Settings → Domains**.
2. Type your domain (e.g. `invoicepro.com`) → **Add**.
3. Vercel shows you DNS records to add. Usually:
   - An **A record** pointing `@` to Vercel's IP, or
   - A **CNAME record** pointing `www` to `cname.vercel-dns.com`
4. Go to your domain registrar's DNS settings, add those exact records.
5. Wait 10–60 minutes for DNS to propagate. Vercel auto-issues a free SSL
   certificate (the padlock/https) once it verifies the domain.

### On Netlify
1. Open your site → **Domain settings → Add a custom domain**.
2. Type your domain → **Verify**.
3. Netlify shows you DNS records (usually a CNAME to `your-site.netlify.app`
   or Netlify's load-balancer IP for an apex domain).
4. Add those records at your registrar.
5. Same as Vercel — wait for propagation, free SSL is automatic.

**Either way, the steps are:** buy domain → deploy site → add domain in the
host's dashboard → copy the DNS records they give you → paste into your
registrar's DNS panel → wait.

---

## Recommended overall plan

1. **Buy the domain** from any registrar (Namecheap and Cloudflare Registrar
   tend to be the cheapest with no upsell pressure).
2. **Push this folder to a GitHub repo** — even if you start with Netlify's
   drag-and-drop, having it in GitHub means either host can redeploy
   automatically on every future change, and you can switch hosts freely.
3. **Deploy to Vercel or Netlify** (both free, both excellent — pick
   whichever dashboard you find friendlier; functionally near-identical for
   a static site like this).
4. **Add the two installer files** to `downloads/` before or right after
   first deploy.
5. **Point your domain** at the deployed site using the DNS steps above.
6. **Test both download buttons** on the live domain from an actual Mac and
   an actual Windows machine (or ask a friend) before sharing the link
   widely.

---

## Updating the site later

Whenever you want to change copy, add a new FAQ, or ship a new app version:
- If connected to GitHub: edit the files, `git commit`, `git push` — it
  redeploys automatically within ~30 seconds.
- If using Netlify drag-and-drop without GitHub: just drag the updated
  folder onto https://app.netlify.com/drop again.

To ship a new app version, update:
- the version text in `index.html` (search for `v1.1.0`)
- the `MAC_DMG` / `WIN_EXE` URLs in `script.js` and the two download-card
  `href`s in `index.html`, pointing at your new GitHub Release's files

---

## Fixing a rejected push (file too large)

If you accidentally committed the `.dmg`/`.exe` directly into the repo and
`git push` was rejected with an error like:

```
remote: error: File downloads/Invoice-Pro-1.1.0.dmg is 114.73 MB; this
exceeds GitHub's file size limit of 100.00 MB
```

The files are now baked into your git history, so just deleting them from
disk and re-committing isn't enough — git still remembers the old commit
that contains them. For a brand-new repo with only one or two commits, the
simplest fix is to wipe git history and start clean:

```
rm -rf .git
git init
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git add .
git commit -m "Initial website"
git push -u origin main
```

Make sure the large files are no longer inside the folder (move them out,
or rely on the `.gitignore` below) before running `git add .` again.

Add this `.gitignore` so it never happens again:
```
downloads/*.dmg
downloads/*.exe
```

Then follow the GitHub Releases steps above to host the installers instead.
