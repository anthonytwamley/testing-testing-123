# Plant Selector

A simple GitHub Pages plant selector built from your spreadsheet data.

## Files
- `index.html` – main page
- `style.css` – styles
- `script.js` – filter logic
- `plants.json` – plant data

## How to upload to GitHub
1. Create a new repository on GitHub.
2. Upload all four files to the repository root.
3. In the repository, go to **Settings** → **Pages**.
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master`) and `/root`
5. Save.
6. GitHub will publish the site and give you a live URL.

## Updating the plant list later
Replace `plants.json` with a new version using the same field names.

## Notes
- Colour and feature filters work on individual terms.  
  Example: selecting `Green` will also match `Green; Blue`.
- The app is static, so it works well with GitHub Pages.
