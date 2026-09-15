# Nova-Scan — Prototype

An interactive prototype for **Nova-Scan**: a low-cost, smartphone-based spectrometer (built from salvaged DVD diffraction gratings) that lets anyone check packaged or loose food for common adulterants on the spot.

This is a **front-end prototype only** — a clickable simulation of the app experience for pitching and demoing. There is no real spectral hardware or backend; scan results are drawn from a small demo dataset so you can walk through the full flow: scan → traffic-light verdict → whistleblower report → medical hazard info → community risk map.

## Try it

Open `index.html` in a browser, or click "Try the scan" on the landing page. Use the bottom nav on the phone mockup to jump between screens (Scan / Report / Learn / Map).

## Structure

```
nova-scan/
├── index.html      # landing page + phone-mockup app shell
├── css/style.css   # all styling
├── js/app.js       # screen switching + scan simulation logic
└── README.md
```

## Deploy to GitHub Pages

1. Create a new repo on GitHub and push this folder's contents to it:
   ```bash
   git init
   git add .
   git commit -m "Nova-Scan prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. Your prototype will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Next steps for a real build

- Replace the demo `RESULTS` array in `js/app.js` with real spectral analysis output.
- Wire the "Submit to FSSAI" action to an actual reporting endpoint.
- Replace the map's placeholder pins with a real geolocation + backend feed.
- Add camera access (`getUserMedia`) for the live viewfinder.
