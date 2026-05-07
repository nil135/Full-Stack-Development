# Product Images Setup

Your ecommerce site is now configured to load product images from `/public/products/` directory.

## Required Images

Add the following image files to `public/products/` folder:

1. **headphones.jpg** - Premium Wireless Headphones
2. **smartwatch.jpg** - Smartwatch Pro
3. **charger.jpg** - Portable Charger
4. **cable.jpg** - USB-C Cable
5. **backpack.jpg** - Camera Backpack
6. **phone-stand.jpg** - Phone Stand
7. **placeholder.jpg** - Fallback image (optional)

## How to Add Images

### Option 1: Use Placeholder Service (Quick)

Replace the image paths in `backend/models/Product.js` with placeholder URLs:

```javascript
image: "https://via.placeholder.com/300x300?text=Headphones";
```

### Option 2: Add Real Images (Recommended)

1. Create `public/products/` folder if it doesn't exist
2. Add your product images with the filenames above
3. Images will be served automatically from `/products/` path

## Image Requirements

- **Format:** JPG, PNG, or WebP
- **Recommended Size:** 300x300px or larger (square format works best)
- **Max File Size:** 500KB per image for optimal performance

## Current Configuration

ProductCard.js is configured to:

- Load images from `product.image` prop
- Fallback to `/products/placeholder.jpg` if no image is found
- Display images in responsive containers with proper styling

Backend Product model includes image paths for all 6 products pointing to `/products/` directory.
