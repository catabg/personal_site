# Personal Site (Astro)

A minimal, single‑page portfolio for communication work.

## Quick start

```bash
npm install
npm run dev
```

Astro will start a dev server and print the local URL.

## Update your content

- Edit the copy in `src/pages/index.astro`.
- Replace `Your Name`, `hello@example.com`, and the placeholder links.
- Add your CV as `public/cv.pdf` (then the CV link will work).

## Deploy to GitHub Pages (beginner friendly)

### 1) Create a GitHub repo

1. Go to GitHub and create a new repository. Example: `personal-site`.
2. Keep it empty (no README) since we already have one here.

### 2) Connect your local project to GitHub

In your terminal, from the project folder:

```bash
git init
git add .
git commit -m "Initial commit"

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

git push -u origin main
```

If you already made a repo and got a different URL, use that URL instead.

### 3) Update your Astro config for GitHub Pages

Open `astro.config.mjs` and update these values:

- `site`: `https://YOUR_USERNAME.github.io`
- `base`: `/<YOUR_REPO>`

Important notes:

- If your repo is named `YOUR_USERNAME.github.io`, set `base` to `/`.
- For any other repo name, `base` must match the repo name.

### 4) Enable GitHub Pages

1. Open your GitHub repo.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.

You already have a workflow at `.github/workflows/deploy.yml` that builds and deploys the site on every push to `main`.

### 5) Deploy

Push your changes:

```bash
git add .
git commit -m "Update site"

git push
```

Then open the **Actions** tab in your repo to watch the deployment. Once it finishes, your site will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## Common tweaks

- Add a favicon in `public/` and reference it in `src/layouts/BaseLayout.astro`.
- Add more work cards in `src/pages/index.astro`.
- Replace the placeholder fonts in `src/layouts/BaseLayout.astro`.
