# My Personal Website

Source for my personal page, [saifsidhik.page](https://saifsidhik.page).

Everything under `public/` is published as-is by the workflow in `.github/workflows/pages.yml` on every push to `main`; there is no build step. Page content is data-driven: projects, publications, experience and profile details live in `public/data/*.json`, and `public/js/app.js` renders them.

To preview locally:

```sh
python3 -m http.server -d public 8000
```
