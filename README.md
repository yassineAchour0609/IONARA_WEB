# IONARA Tunisia
A gaming storefront for Tunisia, available in French, English and Arabic (RTL).

## Run locally
Requires Node.js 20.19+ and MongoDB (local installation or an existing MongoDB connection).

From the repository root:
```powershell
npm run setup
# Set MONGODB_URI in backend/.env if MongoDB is not local.
npm run dev
```
Open http://localhost:3000. The Windows launcher `start-shop.bat` runs the same setup and Next.js application.
Setup installs missing frontend/backend dependencies and creates a local JWT secret without printing it.
MongoDB must be running. Startup fails explicitly when the database or secret is unavailable.
For production: `npm run build`, then `npm start`. Use HTTPS and set NODE_ENV=production and CLIENT_URL to the exact public origin. Run the API behind the Next.js same-origin proxy; it binds to loopback.

## Tunisia configuration
- TND is the default currency, formatted to three decimal places (`fr-TN`, `en-GB`, `ar-TN`).
- Official IONARA Tunisia `prices.TND` (in DT) are configured in `shared/catalog.json` matching the product posters, alongside fixed `EUR` and `USD` prices.
- Rebuild/restart both services after catalog changes. The frontend and API consume the same file.
- Set `WHATSAPP_NUMBER` (216 plus the 8-digit mobile number) and `CONTACT_EMAIL` in `backend/.env`. Blank values hide contact links.
- Checkout saves an **unpaid order request** awaiting manual confirmation with the customer's preferred Tunisian payment method (`d17`, `edinar`, `sobflous`, `izi`, or `manual`). It does not charge automatically online.
- Review prices, stock, product editions and fulfillment terms before publishing. Unsupported guarantees, reviews and delivery promises from the original demo are not used in the active shop.

## Features and structure
- `frontend/`: Next.js App Router, React, TypeScript; responsive storefront, catalog filters/sorting, quick view, Steam library search, cart, promo codes, registration/login and order lookup.
- `frontend/src/i18n/messages.json`: complete French/English/Arabic UI and error dictionaries. Locale is saved in a cookie; HTML language/direction and metadata are rendered on the server. Arabic uses RTL.
- `shared/catalog.json`: authoritative products and fixed currency prices; game names remain proper names.
- `backend/`: Express + MongoDB. Password hashing, HttpOnly session cookies, owner-only order access, input validation, origin checks and rate limits.
- `legacy/`: archived original static shop and components, excluded from the running application.
- `scripts/`: cross-platform setup and startup.

Cart data stores product identifiers and quantities only. The server calculates totals and discounts, disregarding client prices.
Order requests carry an idempotency key, so retries do not create duplicate orders.
Database errors return failures; there are no fabricated users, tokens, orders or successful payment messages.
The destructive public product-seed endpoint has been removed.

## API
- GET /api/health — real database readiness
- GET /api/config — public shop contact details only
- GET /api/products and /api/products/:slug
- POST /api/auth/register, /login, /logout; GET /api/auth/me
- POST /api/orders — authenticated order request
- GET /api/orders/:orderNumber — authenticated owner only

Frontend calls use /api with a server-side proxy. Set API_URL in frontend/.env.local if the API runs elsewhere.
Promo codes: IONARA10 and GAMER10 (10%), VIP20 (20%), validated again by the API.

## Verification
```powershell
npm test
npm run test:i18n
npm run build
npm install
npx playwright install chromium
npm run test:browser
```
API tests use a separate temporary MongoDB instance provided by mongodb-memory-server. Its initial install/test downloads a MongoDB binary; it never connects to the shop database.
Browser tests use Playwright Chromium. They start isolated test servers and a temporary database, and exercise language switching, RTL, catalog/cart, auth failures and persisted orders.
No production database migration is performed. Existing orders/users are not deleted; old guest orders lack verified ownership and are not exposed to new accounts.
