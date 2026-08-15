# CleanHub website deployment

## Public addresses

- Public website: `https://cleanhubimpex.com`
- Management system: `https://app.cleanhubimpex.com`

The public site is static and does not interfere with the management subdomain.

## Deploying

Upload every file and the complete `assets` directory to the document root for `cleanhubimpex.com`. The host must serve `index.html` for the root address and `404.html` for missing pages.

The package includes:

- `_headers` for hosts that support Cloudflare Pages/Netlify-style header rules.
- `render.yaml` for a Render Static Site deployment.
- `vercel.json` for Vercel deployments.
- `robots.txt` and `sitemap.xml` for search engines.
- `site.webmanifest` for installable-site metadata.

## Connecting the live catalog

The website currently loads `products.json`. When the management application exposes a public, read-only catalog API, edit `config.js`:

```js
catalogEndpoint: "https://app.cleanhubimpex.com/api/public/products"
```

The URL above is an example only. Use the actual endpoint supplied by the management-system developer. The expected response is either a JSON array or `{ "products": [...] }` with this minimum shape:

```json
{
  "name": "Langano Broom",
  "detail": "English description",
  "detailAm": "Amharic description",
  "category": "brooms"
}
```

Allowed category values are `detergents`, `brooms`, `tissues`, and `bins`. If the remote endpoint fails, the site automatically falls back to `products.json`.

## DNS

Point only the root domain and `www` host to the website host. Preserve all existing DNS records for `app.cleanhubimpex.com` so the management system remains online.

For this domain's current GoDaddy-to-Render setup, follow `DNS-MIGRATION.md`. It records the existing website values and a rollback path. Do not modify the `app` CNAME.

## Final checks

1. Open the root domain over HTTPS.
2. Test English and Amharic.
3. Test Telegram, phone, map, Instagram, and management links.
4. Confirm the Telegram video loads.
5. Test the catalog filters and search.
6. Confirm `https://cleanhubimpex.com/robots.txt` and `/sitemap.xml` load.
