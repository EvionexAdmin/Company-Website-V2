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
- URL targets (e.g., `/shop/<id>` for Buy Now links)
- Hash anchors for in-page scroll (e.g., `/shop#shop-item-<id>`)

When adding new items, ensure:
- `id` is unique and URL-safe.
- The item is added to the correct array (PRODUCTS or SERVICES).
- The ID is included in navbar search items (see Shop Search below).

## Routing and Anchors
- Buy Now links use `/shop/<id>`.
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

- Buy Now button (Products)
- Add to cart button (Services)
	- Turns into a quantity counter after first click
	- Counter uses +/- to update cart quantity

Click targets:
- Service card image and title link to the service detail page (`/service/<id>`)

## Update Checklist (Required)
When adding or changing Shop features, update this file with:
- New sections or routing behavior.
- New data fields in `PRODUCTS` or `SERVICES`.
- Search items changes in the navbar.
- Filter behavior once implemented.
- Any new layout or styling conventions.
