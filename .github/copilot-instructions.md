# Project instructions

## Project
- This is a small, static ecommerce storefront built with plain HTML, CSS, and JavaScript.
- Keep it dependency-free; there is no package manager or build step.
- Product data and storefront interactions live in `app.js`, page structure in `index.html`, and presentation in `styles.css`.
- Checkout is a demonstration placeholder. Do not present it as a real payment flow.

## Code and UX
- Prefer small, direct changes that fit the existing code and naming style.
- Keep the storefront responsive and preserve its calm, minimal visual style.
- Use semantic HTML, accessible names for controls, keyboard operation, and visible feedback for user actions.
- Keep product names and descriptions consistent with their images.
- Do not add libraries or change the framework without a clear need.

## Validation
- Run the app locally with `python -m http.server 8765 --bind 127.0.0.1` and open `http://127.0.0.1:8765`.
- For UI changes, verify the relevant interaction in the integrated browser at desktop and mobile widths.
- Smoke-test category filters, add/remove and quantity changes, subtotal, drawer keyboard behavior, and image loading when relevant.
- Check the browser console for uncaught errors.
