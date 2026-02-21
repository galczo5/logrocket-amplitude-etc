# Stage 9 — Replace Placeholder Images with Generated Assets

Once all images have been generated using the prompts in `docs/prompts/`, hand them to Claude and ask it to wire them into the codebase.

## What to tell Claude

> "I've generated all the images from the prompts in docs/prompts/. Please use the prompt files to find out where each image belongs, place the image files in the right location, and update the code to reference them."

## What Claude will do

1. Read each `.txt` file in `docs/prompts/` to find the `Used in` and `Save generated image as` metadata.
2. Decide on a static asset location (e.g. `public/images/products/` and `public/images/home/`).
3. Expect you to have the generated `.png` files available (either already copied into the repo or provided as a path).
4. Update `server/data/products.ts` — replace the `https://placehold.co/400x600.png` URL on each product with the correct local path.
5. Update `src/pages/HomePage.tsx` — replace the three `HERO_SLIDES` image URLs and three `CATEGORIES` image URLs with local paths.

## Image inventory

### Product images (400×600 px) — `server/data/products.ts`

| Prompt file                    | Product id | image field value (target)                      |
| ------------------------------ | ---------- | ----------------------------------------------- |
| p1-classic-crew-neck-tee.txt   | p1         | /images/products/p1-classic-crew-neck-tee.png   |
| p2-graphic-mountain-tee.txt    | p2         | /images/products/p2-graphic-mountain-tee.png    |
| p3-floral-v-neck-tee.txt       | p3         | /images/products/p3-floral-v-neck-tee.png       |
| p4-essential-polo.txt          | p4         | /images/products/p4-essential-polo.png          |
| p5-vintage-band-tee.txt        | p5         | /images/products/p5-vintage-band-tee.png        |
| p6-striped-breton-top.txt      | p6         | /images/products/p6-striped-breton-top.png      |
| p7-performance-dry-fit-tee.txt | p7         | /images/products/p7-performance-dry-fit-tee.png |
| p8-pocket-tee.txt              | p8         | /images/products/p8-pocket-tee.png              |
| p9-cropped-graphic-tee.txt     | p9         | /images/products/p9-cropped-graphic-tee.png     |
| p10-longline-tee.txt           | p10        | /images/products/p10-longline-tee.png           |
| p11-tie-dye-tee.txt            | p11        | /images/products/p11-tie-dye-tee.png            |
| p12-pima-cotton-v-neck.txt     | p12        | /images/products/p12-pima-cotton-v-neck.png     |

### Hero banner images (1600×700 px) — `src/pages/HomePage.tsx` › `HERO_SLIDES`

| Prompt file                      | Array index | Heading                       |
| -------------------------------- | ----------- | ----------------------------- |
| hero-slide-1-premium-tshirts.txt | [0]         | Premium T-Shirts for Everyone |
| hero-slide-2-new-arrivals.txt    | [1]         | New Arrivals Just Dropped     |
| hero-slide-3-quality-fabrics.txt | [2]         | Quality You Can Feel          |

### Category banner images (800×400 px) — `src/pages/HomePage.tsx` › `CATEGORIES`

| Prompt file                    | Array index | Label              |
| ------------------------------ | ----------- | ------------------ |
| category-mens-collection.txt   | [0]         | Men's Collection   |
| category-womens-collection.txt | [1]         | Women's Collection |
| category-unisex-collection.txt | [2]         | Unisex Collection  |
