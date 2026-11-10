# Supabase Keepalive

The Free Supabase project is kept active by a small daily GitHub Actions request. The request performs a single `SELECT 1` database query and never reads application data.

## Security model

- The endpoint accepts `POST /api/internal/keepalive` only.
- It requires `Authorization: Bearer <secret>`.
- The secret is compared in constant time before any database operation.
- Responses never include database data, counts, credentials, or diagnostic details.
- Requests and responses are explicitly non-cacheable.

## Required secrets

Generate one secret locally. Do not commit its value or place it in a `NEXT_PUBLIC_` variable.

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Configure this exact generated value in the production deployment environment:

| Variable | Value |
|---|---|
| `SUPABASE_KEEPALIVE_SECRET` | The generated random secret. |

Then configure these repository-level GitHub Actions secrets:

| Secret | Value |
|---|---|
| `SUPABASE_KEEPALIVE_URL` | `https://<production-domain>/api/internal/keepalive` |
| `SUPABASE_KEEPALIVE_SECRET` | The same generated random secret configured in production. |

Use the final production domain, not a localhost or preview URL. Set the production environment variable before triggering the GitHub workflow.

## Workflow behavior

`.github/workflows/supabase-keepalive.yml` runs daily at 17:23 UTC (22:53 Asia/Kolkata) and can be started manually from the Actions tab. It uses bounded network retries and returns a failed workflow for any non-2xx endpoint response.

Scheduled GitHub workflows can be delayed, so this is a best-effort Free-plan safeguard rather than a guaranteed availability mechanism.

## Verification

After deploying the endpoint and configuring both GitHub Secrets:

1. Open the repository's **Actions** tab.
2. Select **Supabase keepalive**.
3. Choose **Run workflow** on the default branch.
4. Confirm the `Database heartbeat` job succeeds and its request returns `{"ok":true}`.

To check a local server after setting `SUPABASE_KEEPALIVE_SECRET` in `.env` and restarting `npm run dev`:

```powershell
$headers = @{ Authorization = "Bearer $env:SUPABASE_KEEPALIVE_SECRET" }
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/internal/keepalive -Headers $headers
```

Expected response:

```json
{ "ok": true }
```

## Failure guide

| Result | Meaning | Resolution |
|---|---|---|
| GitHub workflow exits before calling the endpoint | A required GitHub Secret is missing. | Add both secrets with the exact names above. |
| `401` | The bearer secret does not match. | Regenerate or copy the same secret into the deployment and GitHub Actions. |
| `503` | The endpoint secret is missing or the database cannot be queried. | Verify the deployment environment variable, then inspect deployment logs and Supabase project status. |

If the project is already paused, resume it from Supabase before rerunning the workflow. A heartbeat cannot resume a paused project by itself.
