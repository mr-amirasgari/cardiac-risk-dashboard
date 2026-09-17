# Cardiac Risk Demo — GitHub Pages

A minimal static browser demo for the exported ONNX cardiac-risk model.

## Files

```text
index.html
style.css
app.js
models/
  cardiac_model.onnx
  model_metadata.json
  feature_names.json
```

## Run locally

Do not open `index.html` directly with `file://` because the browser blocks `fetch()` for local model files.

From this folder run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload all files from this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save.

No backend, Python server, build step, or database is required on GitHub Pages.

## Notes

- ONNX Runtime Web 1.30.0 is loaded from jsDelivr.
- Inference runs in the visitor's browser.
- The model is the MIMIC-IV-ED demo model and is not validated for clinical use.
