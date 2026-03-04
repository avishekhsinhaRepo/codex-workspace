# Repository Guidelines

## Project Structure & Module Organization
This repository is a small static web app for FoodExpress.
- `index.html`: Main page layout (navbar, menu, cart offcanvas, checkout/contact modals).
- `style.css`: Custom styling, theme variables, responsive tweaks, and dark-mode tokens.
- `script.js`: Client-side behavior (theme toggle, cart logic, filtering, form submission handlers).

Keep related changes together: UI structure in `index.html`, visuals in `style.css`, behavior in `script.js`.

## Build, Test, and Development Commands
No build pipeline is required; run locally with a static server.
- `python3 -m http.server 8000`: Start local server from repo root.
- `open http://localhost:8000` (macOS): Open the app in a browser.

If you prefer Node tooling, `npx serve .` is acceptable, but not required.

## Coding Style & Naming Conventions
- Use 4-space indentation in HTML, CSS, and JavaScript to match existing files.
- JavaScript: vanilla ES6+, `camelCase` for functions/variables (`updateCart`, `filterMenu`).
- HTML: use descriptive `id`/`data-*` attributes in kebab-case (`theme-toggle`, `data-category`).
- CSS: centralize reusable values in `:root` custom properties; mirror dark mode overrides under `[data-theme="dark"]`.
- Reuse Bootstrap utility classes before adding custom CSS.

## Testing Guidelines
There is currently no automated test framework in this repo. Validate changes manually before opening a PR:
- Theme toggle persists across reloads.
- Add/remove/update cart quantities and total price calculations.
- Menu category filters show/hide correct cards.
- Checkout and contact forms enforce required fields and close modals on success.

For future automated tests, place them in a `tests/` directory and use `*.test.js` naming.

## Commit & Pull Request Guidelines
Follow the existing commit style from history: short, imperative, and capitalized (for example, `Add contact modal and form submission functionality`).

PRs should include:
- A clear summary of user-visible changes.
- Manual test steps performed.
- Screenshots/GIFs for UI updates.
- Linked issue/ticket when applicable.

## Security & Configuration Tips
- Do not commit secrets or environment-specific credentials.
- Keep CDN dependency versions pinned (Bootstrap and icons in `index.html`) to avoid unexpected breakage.
