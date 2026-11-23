# Rajsha Diecast – Fullstack

Rajsha Diecast is a full-stack e-commerce/admin application for a diecast catalog.

## Stack
- **Client:** Next.js (App Router), React, TypeScript (`client/`, dev/start on port `3001`)
- **Server:** Node.js, Express, TypeScript, Mongoose (`server/`, default port `5000`)
- **Database:** MongoDB via `DB_URL`

## Current scalable foundation
- Shared backend utilities in `server/src/utils/`:
  - `http.ts` – consistent success/error responses (`ApiError`, `sendSuccess`, `sendError`)
  - `query.ts` – pagination/search parsing (`parseListQuery`, `buildMeta`, `buildSearchFilter`, `notDeletedFilter`)
  - `audit.ts` – server-derived actor (`getRequestActor`) and payload allow-lists (`pickAllowed`)
  - `crudService.ts` – reusable list/find/update/soft-delete/status helpers for simple masters
- Global 404 and error middleware in `server/src/app.ts`
- Basic request logging and auth/admin rate limiting middleware (`server/src/middleware/requestLogger.ts`, `server/src/middleware/rateLimit.ts`)
- Unified frontend API client: `client/api/axiosApi.ts` (canonical) and `client/app/admin-panel/api/axios.ts` (re-export)
- Shared admin list infrastructure: `client/app/admin-panel/api/types.ts`, `client/app/admin-panel/hooks/useAdminList.ts`, and server-pagination support in `client/app/admin-panel/common/AdminDataTable.tsx`

## List API contract (migrated resources)
- Supports query params such as `page`, `limit`, `search`, `isActive`, `isDisplay`, `all/paginate`, and `sort` (where applicable).
- **Non-paginated (legacy-compatible):** `data` is an array.
- **Paginated:** `data` is an array and `meta` is `{ page, limit, total, totalPages }`.

## Migration progress (implemented so far)
- **Backend refactored to shared scalable pattern:** `FooterLinkGroup`, `FooterLink`, `ScaleSize`, `Brand`, `Banner`, `PackagingType`, `CollectionType`, `Budget`, `CMS` (plus shared error handling in `Counter` controller). These include pagination/search support, server-derived audit actors, validation/allow-lists, soft-delete filters, and model indexes/timestamps where applicable. Budget mutation routes now require admin session auth.
- **Frontend admin migrated to shared list hook/server pagination:** `FooterLinkGroup`, `FooterLink`, `Banner`, `ScaleSize`, `Brand`, `PackagingType`, `CollectionType`, `CMS` (APIs updated for `ListParams` and optional client-supplied audit fields; pages no longer hardcode audit actors for these flows).
- **Remaining (not fully migrated):** other admin pages/APIs and backend resources (e.g. `Product`, `Checkout`, `Cart`, `Orders/OrderLines`, `Transactions`, `Payments`, `Users/AdminUsers`, `CompanySetup`, `Review`, `Inventory` flows and any other untouched masters) still need consolidation to the shared pattern, stronger validation/auth consistency, and performance-focused data access as appropriate. Complex domains should keep custom business logic but adopt shared infra (errors, query parsing, audit, logging).

## Rule of thumb
Keep complex domains custom (catalog rules, cart/checkout/orders/payments, inventory/stock transitions), but put common infrastructure in shared modules: list/query handling, response/error shape, auth-derived audit fields, validation, logging/observability, and reusable admin data hooks/components.

## Setup
1. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`
2. Create `server/.env` (example values, do not commit secrets):
   - `DB_URL=<your-mongodb-connection-string>`
   - `PORT=5000`
   - `CLIENT_URL=http://localhost:3001`
   - plus any auth/mail/payment secrets required by enabled features (`JWT_SECRET`, SMTP/Razorpay vars, etc.)
3. Run development servers:
   - Server: `cd server && npm run dev`
   - Client: `cd client && npm run dev`

## Verification scripts
- Server typecheck: `cd server && npm run typecheck`
- Server build: `cd server && npm run build`
- Client typecheck: `cd client && npm run typecheck` (note: pre-existing unrelated type errors may exist in untouched files such as `client/lib/richText.ts` depending on current branch state)
- Client build: `cd client && npm run build`

## Next recommended steps
- Continue rolling the shared CRUD/query/audit pattern across remaining backend resources and align route auth/middleware consistently.
- Migrate remaining admin APIs/pages to `useAdminList` + server-side pagination/search and remove client-side full-list filtering and client-supplied audit actors.
- Add automated tests (API/unit/integration as applicable) and CI workflows for typecheck/build/tests.
- Extend guardrails: structured/centralized logging, broader rate limiting policies, request validation schemas, and additional DB indexes based on real query patterns.
