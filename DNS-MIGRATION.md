# CleanHub DNS migration: GoDaddy to Render

This change moves only the public website. The management system remains at `https://app.cleanhubimpex.com`.

## Current records observed on 15 August 2026

| Host | Type | Current value | Action |
| --- | --- | --- | --- |
| `@` | A | `76.223.105.230` | Replace after the Render site is ready |
| `@` | A | `13.248.243.5` | Replace after the Render site is ready |
| `app` | CNAME | `cleanhub-management-system.onrender.com` | **Keep unchanged** |

The nameservers are `ns31.domaincontrol.com` and `ns32.domaincontrol.com`, so DNS is managed in GoDaddy.

## Safe migration order

1. Put these website files in a Git repository.
2. In Render, create a new **Static Site** from that repository. Render can detect `render.yaml`.
3. Confirm the temporary `*.onrender.com` address displays the complete site.
4. In the Render site settings, add `cleanhubimpex.com` and `www.cleanhubimpex.com` as custom domains.
5. Render will show the required DNS target. In GoDaddy, replace only the existing website records for `@` and `www`:
   - Set the root `@` A record to the IP Render displays. Render's documented fallback for DNS providers without ALIAS/ANAME support is `216.24.57.1`, but use the value shown in the Render dashboard.
   - Set `www` as a CNAME to the new site's `*.onrender.com` hostname.
   - Remove any conflicting `@`/`www` AAAA or GoDaddy Website Builder records if Render reports a conflict.
6. Do not edit the `app` CNAME, MX, TXT, email, verification, or other unrelated records.
7. Return to Render and select **Verify** for both custom domains. Wait for HTTPS certificates to become active.
8. Test both the public site and management login before cancelling or disconnecting the old GoDaddy website product.

## Verification checklist

- `https://cleanhubimpex.com` opens the new website.
- `https://www.cleanhubimpex.com` redirects or opens securely.
- `https://app.cleanhubimpex.com` still opens the management system.
- The Management Login button opens the app subdomain.
- Telegram, Instagram, phone, map, catalog, English, and Amharic all work.

## Rollback

If the public website fails, restore the two original root A records (`76.223.105.230` and `13.248.243.5`). Do not alter the `app` CNAME during rollback.
