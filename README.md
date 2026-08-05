# THELIVINGSTOP Shopify Theme

Production-ready Shopify Online Store 2.0 theme for THELIVINGSTOP.

## Import

1. Zip the contents of `D:\SHopify\thelivingstop-theme`, not the parent folder.
2. In Shopify Admin, go to **Online Store > Themes > Add theme > Upload zip file**.
3. Open **Customize** and connect real collections/products to the homepage sections.
4. Create a Shopify page called `Products` and assign the `products` template to expose the finished products page at `/pages/products`.

## Included Structure

- `layout/theme.liquid`
- JSON templates for home, collection, product, cart, about, mission, and contact pages
- Section groups for sticky header and footer
- Reusable snippets for logo, product cards, price, buttons, cart drawer, red-circle accent, and animation layer
- `assets/theme.css` and `assets/theme.js`
- Theme settings for brand colors, logo, and random full-stop animation controls

## Assets

Local brand assets have been copied into `assets` with Shopify-safe filenames:

- Logos: `logo-white.png`, `logo-dark.png`, `logo-alt.png`, `logo-mark.png`
- Animation: `animation.svg`, `animation-2.svg`, `animation.mp4`, `animation-2.mp4`
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

## Checkout

The theme includes a cart drawer, cart page, subtotal, quantity updates, remove controls, checkout CTA, and checkout reassurance. Shopify controls the hosted checkout page itself unless the store is on Shopify Plus.

## Brand Notes

Keep Montserrat as the primary typeface. Keep the red circle #BF0404. Do not recolor the full logo red, and do not use logo typography without the red circle. Mission copy should stay optimistic and lifestyle-led: fashion first, ethical mission built into the DNA.
