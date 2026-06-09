## Plan: Shop Pricing Rework

Replace the Pricing page with a Shop experience on /pricing, add a page-specific Shop navbar, and build product/service sections with a clinical design language and client-side search filtering. Use the current website colour scheme and typography to maintain brand consistency while elevating the user experience with a more polished and structured layout.

**Steps**
1. Update routing and navigation: replace the Pricing page route component with the new Shop component, and swap the navbar item label from Pricing to Shop with no mega menu hover behavior. *Depends on final component location/name.*
2. Create the Shop page structure: hero with "Solutions that change lives," in-page anchors for Products and Services, and a Shop-specific navbar (logo, Products anchor, Services anchor, search input, Login/Sign Up). *Depends on step 1 for route wiring.*
3. Build the Products section: three product cards (Gene Setu, Luminary, EviNote) with brief descriptions and non-functional Buy Now buttons. Ensure the buttons are visually present but disabled/coming-soon. *Parallel with step 4.*
4. Build the Services section: 2x2 grid with the four services (Blood Report Analysis, MRI Results Analysis, Healthcare Tests, Software/Web Development). Use an Amazon-like card layout (image/placeholder, title, description, price/CTA area) within a clinical aesthetic. *Parallel with step 3.*
5. Implement search filtering: client-side filter over both product and service lists; show an empty-state if no matches. *Depends on steps 3-4.*
6. Styling pass: establish a clinical design system (cool neutrals, clean borders, subtle gradients, careful typography) and responsive behavior (2x2 grid on desktop, 1 column on mobile). *Depends on steps 2-5.*
7. QA and polish: verify anchor navigation, hover/active states, disabled CTAs, and responsive layout at key breakpoints. *Depends on steps 1-6.*

**Relevant files**
- `c:/Users/kedar/OneDrive/Documents/GitHub/Company-Website-V2/src/components/Navbar.jsx` - update nav item label to Shop and remove Pricing mega menu.
- `c:/Users/kedar/OneDrive/Documents/GitHub/Company-Website-V2/src/pages/Pricing.jsx` - replace with new Shop page content or rename to Shop and update routing.
- `c:/Users/kedar/OneDrive/Documents/GitHub/Company-Website-V2/src/pages/Pricing.css` - replace or add Shop styling (or create Shop.css and update imports).
- `c:/Users/kedar/OneDrive/Documents/GitHub/Company-Website-V2/src/App.jsx` - update routes if the component name/path changes.

**Verification**
1. Load /pricing and confirm: hero + Products + Services sections render; anchor nav scrolls to sections.
2. Type in search and confirm filtering across both sections with empty-state.
3. Confirm Shop navbar appears only on this page and global navbar remains unchanged elsewhere.
4. Confirm Shop nav has no mega menu hover behavior.
5. Check mobile layout: single-column cards, readable typography, and no overlap at 320px width.

**Decisions**
- Replace /pricing with Shop content; no separate /shop route.
- Shop navbar is page-specific; global navbar remains elsewhere.
- Search is client-side filtering only.
- Buy Now buttons are non-functional for now.
- Design tone: clinical.
- Services list: Blood Report Analysis, MRI Results Analysis, Healthcare Tests, Software/Web Development.

