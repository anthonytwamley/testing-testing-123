# Plant Selector

A simple GitHub Pages plant selector built from your spreadsheet data.

## Files
- `index.html` – main page
- `style.css` – styles
- `script.js` – filter logic
- `plants.json` – plant data

## Adding plant images
You do not need an image for every plant.
- plants with an image will show the photo
- plants without one will show a placeholder

### Best way to add images
1. Create an `images` folder in the repository.
2. Add image files such as `quercus-robur.jpg`.
3. In `plants.json`, set the `image` field to a relative path, for example:
   `images/quercus-robur.jpg`

You can also use direct image URLs, but local images in the repository are usually more reliable.

## How to upload to GitHub
1. Create a new repository on GitHub.
2. Upload all files to the repository root.
3. In the repository, go to **Settings** → **Pages**.
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` and `/root`
5. Save.
6. GitHub will publish the site and give you a live URL.

## Updating the plant list later
Replace `plants.json` with a new version using the same field names.
