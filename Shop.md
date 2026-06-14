# Shop Architecture

This document describes the current Shop implementation and serves as a living reference. Update this file whenever new Shop features, products, services, filters, or navigation behaviors are added.

## Overview
- Entry page: `src/pages/Shop.jsx`
- Styles: `src/pages/Shop.css`
- Service detail: `src/pages/ServiceDetail.jsx` + `src/pages/ServiceDetail.css`
- Navbar integration: `src/components/Navbar.jsx` + `src/components/Navbar.css`

## Data Model (Static for now)
Shop items are defined as static arrays in `Shop.jsx`:
- `PRODUCTS`: product cards with `id`, `name`, `description`, `image`, `price`, `rating`, `reviews`, `discount`, `tags`.
- `SERVICES`: service cards with `id`, `name`, `description`, `image`, `price`, `rating`, `reviews`, `discount`, `tags`.

Price formatting:
- Prices are rendered in rupees with the `₹` symbol.

Rating behavior:
- `rating` is numeric, formatted to one decimal place.
- Stars render as full, half, or empty based on the rating value.

These arrays are rendered directly into two sections:
- Products section: `#products`
- Services section: `#services`

Item cards use a consistent structure and rely on `id` for:
- URL targets (e.g., `/shop/<id>` for product checkout links, `/subscribe/genesetu` for the GeneSetu subscription page)
- Hash anchors for in-page scroll (e.g., `/shop#shop-item-<id>`)

When adding new items, ensure:
- `id` is unique and URL-safe.
- The item is added to the correct array (PRODUCTS or SERVICES).
- The ID is included in navbar search items (see Shop Search below).

## Routing and Anchors
- Product checkout links use `/shop/<id>`.
- GeneSetu now uses a dedicated subscription route at `/subscribe/genesetu` instead of the generic shop checkout page.
- The Shop page listens to `location.hash` and scrolls to element IDs.
- Section anchors use `#products` and `#services`.

## Navbar and Search
On the Shop page, the navbar switches to a lightweight set of links (Products, Services) plus a search box.

Search behavior:
- The search input is in `Navbar.jsx` and uses a local list of shop items.
- The query is synced to `?q=` in the URL and drives filtering on the Shop page.
- Results link to `/shop#shop-item-<id>`.
- If no results match, an empty-state message appears in the dropdown.

When adding new items, update the `shopSearchItems` list in `Navbar.jsx` to include:
- `id`, `label`, `type`, and `href`.

## Filters Drawer (UI only for now)
The filters UI is a slide-in drawer from the left:
- Drawer markup and state are in `Shop.jsx`.
- Drawer styles are in `Shop.css`.

Controls included:
- Price ordering (radio): low to high, high to low.
- Price range slider (0 to 10000).
- Type (radio): Product, Service.
- Tags (pill buttons).
- Clear filters button.

Current status: Fully functional (filters apply to products/services).

Drawer toggle:
- The navbar shows a hamburger button on the Shop page.
- Clicking the button dispatches a `toggle-shop-filters` event.
- The Shop page listens for the event and opens/closes the drawer.
- Clicking the backdrop or the close button closes the drawer.

## Visual Styles
Cards use two variants:
- Products: Editorial Glass Rail aesthetic.
- Services: Tech Ledger aesthetic.

Common card structure:
- Image area
- Title
- Description
- Meta grid (2x2)
	- Top left: Rating (full, half, empty stars)
	- Top right: Review count
	- Bottom left: Starting from price
	- Bottom right: Discount
- Learn More button (Products only)

- Subscribe Now button (GeneSetu product card)
- Buy Now button (other products)
- Add to cart button (Services)
	- Turns into a quantity counter after first click
	- Counter uses +/- to update cart quantity

Click targets:
- Service card image and title link to the service detail page (`/service/<id>`)

## GeneSetu Subscription — Razorpay Integration

GeneSetu Premium uses Razorpay Subscriptions (true autopay — customer authorises once, billed monthly automatically).

### Pricing
| Region | Currency | Base Price | Streak Discount (≥30 days) |
|---|---|---|---|
| South Asia (IN, PK, BD, LK, NP, MV, BT, AF) | INR | ₹38/month | ₹30/month (20% off) |
| Rest of world | USD | $4/month | $3.20/month (20% off) |

Region is detected via `https://ipapi.co/json/` on page load. Falls back to USD if detection fails.

### Streak Discount Rules
- Users with `current_streak >= 30` in the `profiles` table qualify for 20% discount.
- Streak is **verified server-side** in the `create-razorpay-subscription` edge function to prevent client-side tampering.
- On autopay renewal (webhook `subscription.charged`), the streak is re-checked and the plan is updated for the next billing cycle if the discount status has changed.

### Razorpay Plan IDs (Live)
| Plan | Plan ID |
|---|---|
| `premium_inr` (₹38/month) | `plan_T1VHYeoualhkkW` |
| `premium_inr_discounted` (₹30.40/month) | `plan_T1VI9nIjmYYvSk` |
| `premium_usd` ($4/month) | `plan_T1VLC9TEAAwZjj` |
| `premium_usd_discounted` ($3.20/month) | `plan_T1VMcOnUhl599T` |

### Payment Flow
1. User clicks "Start Premium" on `/subscribe/genesetu`
2. Frontend calls `create-razorpay-subscription` edge function (JWT-authenticated)
3. Edge function verifies streak server-side, creates Razorpay subscription, returns `subscription_id`
4. Frontend loads `checkout.razorpay.com/v1/checkout.js` and opens modal with `subscription_id`
5. User authorises payment in Razorpay modal
6. On success, `razorpay_payment_id`, `razorpay_subscription_id`, `razorpay_signature` returned
7. Frontend calls `verify-razorpay-payment` edge function for HMAC verification
8. Edge function verifies signature, sets `profiles.is_premium = true`, `profiles.subscription_tier = 'premium'`, `profiles.subscription_expiry = now + 30 days`
9. A row is created in `public.subscriptions` with `status = 'active'`
10. UI transitions to success state: "You're now Premium"

### Autopay Renewal (Webhook)
The `razorpay-webhook` edge function handles:
- `subscription.charged` → extends `subscription_expiry` by 30 days, re-checks streak, updates plan if discount status changed
- `subscription.cancelled` → sets `is_premium = false`, `subscription_tier = 'free'`
- `subscription.halted` → same as cancelled (triggered after repeated payment failures)

**Webhook URL** (register in Razorpay Dashboard → Settings → Webhooks):
```
https://bpcprnncbdjjxzqpumzy.supabase.co/functions/v1/razorpay-webhook
```

Events to enable: `subscription.charged`, `subscription.cancelled`, `subscription.halted`

### Supabase Edge Functions
| Function | Route | Purpose |
|---|---|---|
| `create-razorpay-subscription` | `POST /functions/v1/create-razorpay-subscription` | Creates Razorpay subscription, verifies streak |
| `verify-razorpay-payment` | `POST /functions/v1/verify-razorpay-payment` | HMAC signature verification, activates premium |
| `razorpay-webhook` | `POST /functions/v1/razorpay-webhook` | Handles renewal, cancellation, and streak-based plan updates |

### Database Fields Used (profiles table)
| Field | Type | Usage |
|---|---|---|
| `is_premium` | boolean | Whether user has active premium |
| `subscription_tier` | text | `'free'` or `'premium'` |
| `subscription_expiry` | timestamptz | When current billing period ends |
| `current_streak` | integer | Nutri-logging streak (determines discount) |

### Database: subscriptions table
New table `public.subscriptions` tracks each Razorpay subscription record per user:
- `razorpay_subscription_id` — Razorpay sub ID (unique)
- `plan_type` — which plan (e.g. `premium_inr_discounted`)
- `status` — `pending | active | halted | cancelled | expired | failed`
- `discount_applied` — whether 20% streak discount was applied
- `current_period_start / end` — billing cycle dates

### Supabase Secrets Required
Set via Supabase CLI: `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET_KEY`, `RAZORPAY_WEBHOOK_SECRET`
The webhook secret is obtained from Razorpay Dashboard → Settings → Webhooks after registering the webhook URL.

## Update Checklist (Required)
When adding or changing Shop features, update this file with:
- New sections or routing behavior.
- New data fields in `PRODUCTS` or `SERVICES`.
- Search items changes in the navbar.
- Filter behavior once implemented.
- Any new layout or styling conventions.
