# THELIVINGSTOP Shopify Theme

Production-ready Shopify Online Store 2.0 theme for THELIVINGSTOP.

## Import

1. Zip the contents of `D:\SHopify\thelivingstop-theme`, not the parent folder.
2. In Shopify Admin, go to **Online Store > Themes > Add theme > Upload zip file**.
3. Open **Customize** and connect real collections/products to the homepage sections.
4. Create a Shopify page called `Products` and assign the `products` template to expose the finished products page at `/pages/products`.

## Included Structure

- `layout/theme.liquid`
- JSON templates for home, collection, product, cart, about, mission, contact, and early-access signup pages
- Section groups for sticky header and footer
- Reusable snippets for logo, product cards, price, buttons, cart drawer, and red-circle accent
- `assets/theme.css` and `assets/theme.js`
- Theme settings for brand colors and logo

## Assets

Local brand assets have been copied into `assets` with Shopify-safe filenames:

- Logos: `logo-white.png`, `logo-dark.png`, `logo-alt.png`, `logo-mark.png`
- Signature motion: `full-stop-motion.svg`, a native animated SVG built for the red full-stop mark
- Reels: `living-stop-reel-1.mp4` is packaged for upload size. The source folder also includes reels 2-5; upload them to Shopify Files or compress and add them to assets, then update the video filename settings in the theme editor.
- Product/fallback imagery: `black-tee-male-1.jpg`, `white-tee-male-1.jpg`, `matching-outfits-1.jpg`, `product-concrete-1.jpg`, and related files
- Materials: `material-1.jpg`, `material-2.jpg`, `material-3.jpg`

When real Shopify products are added, Shopify product media automatically replaces fallback imagery in collection and product templates.

## Product Pages

The theme is prepared for these product handles. Import `D:\SHopify\THELIVINGSTOP-products-import.csv` in Shopify Admin, or create products manually with the same handles:

- `life-period-tee-black`
- `basic-black-tee-female`
- `life-period-tee-white`
- `basic-white-tee-female`
- `concrete-gray-tee-male`
- `concrete-gray-tee-female`
- `babyblue-tee-male`
- `babyblue-tee-female`
- `black-polo-unisex`
- `gray-polo-female`
- `matching-living-fit`
- `white-basic-unisex`
- `stitches-handmade-detail`

Each handle has a matching local fallback gallery copied from `D:\SHopify\PRODUCTS shoots`. The product page always shows the requested material images: `t-shirt material  3.jpeg`, `t-shirt material 2.jpeg`, and `t-shirt material.jpeg`, optimized as theme assets.

## Early Access Signup

Create a Shopify page called `Sign up` and assign the `signup` template. It collects contact details, phone, location, preferred size, fit questions, and explicit launch-update consent through Shopify's native contact form. The footer and fallback navigation link to `/pages/signup`.

For a pre-launch-only experience, use the separate theme at `D:\SHopify\thelivingstop-teaser-theme`. Create the `LIVING10` discount code in Shopify Admin before publishing it.

## Checkout

The theme includes a cart drawer, cart page, subtotal, quantity updates, remove controls, checkout CTA, and checkout reassurance. Shopify controls the hosted checkout page itself unless the store is on Shopify Plus.

## Brand Notes

Keep Montserrat as the primary typeface. Keep the red circle #BF0404. Do not recolor the full logo red, and do not use logo typography without the red circle. Mission copy should stay optimistic and lifestyle-led: fashion first, ethical mission built into the DNA.

## Launch Countdown

The standalone 15 AUG countdown theme lives at D:\SHopify\thelivingstop-launch-theme and is packaged as D:\SHopify\THELIVINGSTOP-launch-countdown-theme.zip. It includes four launch videos, a configurable countdown, and Shopify contact signup.
