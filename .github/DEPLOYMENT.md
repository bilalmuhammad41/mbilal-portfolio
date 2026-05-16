# Deployment (GitHub Pages)

This site is a **static Next.js export** deployed to GitHub Pages at:

**https://bilalmuhammad41.github.io/mbilal-portfolio/**

Deployments are **manual only** via GitHub Actions.

## One-time setup

1. Open the repository on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. (Recommended) Create an environment named `github-pages` under **Settings** → **Environments** and add protection rules (required reviewers, etc.)

## Release workflow

| Step | Action |
|------|--------|
| 1 | Merge changes to `main` |
| 2 | Create a [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) with tag `vX.Y.Z` (e.g. `v1.0.0`) |
| 3 | Run **Deploy to GitHub Pages** manually (see below) |
| 4 | Verify the live URL and `deployment.json` on the site |

Tags follow **semantic versioning**: `vMAJOR.MINOR.PATCH`.

## Manual deployment

1. Go to **Actions** → **Deploy to GitHub Pages**
2. Click **Run workflow**
3. Fill in:
   - **git_ref**: branch, tag, or SHA to deploy (e.g. `main` or `v1.0.0`)
   - **release_tag**: optional label shown in the deployment manifest (e.g. `v1.0.0`)
   - **confirm**: type `deploy` exactly
4. Approve the `github-pages` environment if required
5. Wait for **build** then **deploy** jobs to succeed

Each successful deploy writes `deployment.json` at the site root with commit, release label, and timestamp.

## CI (automatic)

**CI** runs on pushes and pull requests to `main`:

- `npm ci`
- `npm run lint`
- `npm run build` (static export with `/mbilal-portfolio` base path)

CI does **not** deploy to production.

## Local static build (matches CI)

```bash
# Linux / macOS
NEXT_PUBLIC_BASE_PATH=/mbilal-portfolio npm run build

# Git Bash on Windows (disable MSYS path conversion)
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/mbilal-portfolio npm run build

# PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/mbilal-portfolio"; npm run build
```

Output: `out/` (asset URLs are prefixed with `/mbilal-portfolio`)

Preview locally:

```bash
npx serve out
```

Open http://localhost:3000/mbilal-portfolio/ (port may vary; the path must include `/mbilal-portfolio`).
