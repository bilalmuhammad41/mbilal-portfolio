# Deployment (GitHub Pages)

This site is a **static Next.js export** deployed to GitHub Pages at:

**https://bilalmuhammad41.github.io/left-brain-right-pixels/**

Deployments are **manual only** via GitHub Actions, triggered from a semver tag.

## One-time setup

1. Open the repository on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. (Recommended) Create an environment named `github-pages` under **Settings** → **Environments** and add protection rules (required reviewers, etc.)

## Release workflow

| Step | Action |
|------|--------|
| 1 | Merge changes to `main` |
| 2 | Create a [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) with tag `vX.Y.Z` (e.g. `v1.0.0`) |
| 3 | Run **Deploy to GitHub Pages** from that tag (see below) |
| 4 | Verify the live URL after the workflow completes |

Tags follow **semantic versioning**: `vMAJOR.MINOR.PATCH`.

## Manual deployment

1. Go to **Actions** → **Deploy to GitHub Pages**
2. Click **Run workflow** (must be run from a semver tag, e.g. `v1.0.0`)
3. Fill in:
   - **confirm**: type `deploy` exactly
4. Approve the `github-pages` environment if required
5. Wait for the **deploy** job to succeed

The workflow runs `npm ci`, `npm run lint`, `npm run build`, uploads `out/`, and deploys via GitHub Pages.

Deployment summary (tag, commit, URL) is written to the workflow run summary — not to a `deployment.json` file on the site.

## CI (automatic)

**CI** runs on pushes and pull requests to `main`:

- `npm ci`
- `npm run lint`
- `npm run build` (static export with `/left-brain-right-pixels` base path)
- Verifies `out/index.html`, `out/.nojekyll`, and base path in built HTML

CI does **not** deploy to production.

## Local static build (matches CI)

```bash
# Linux / macOS
NEXT_PUBLIC_BASE_PATH=/left-brain-right-pixels npm run build

# Git Bash on Windows (disable MSYS path conversion)
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/left-brain-right-pixels npm run build

# PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/left-brain-right-pixels"; npm run build
```

Output: `out/` (asset URLs are prefixed with `/left-brain-right-pixels`)

Preview locally:

```bash
npx serve out
```

Open http://localhost:3000/left-brain-right-pixels/ (port may vary; the path must include `/left-brain-right-pixels`).
