# Tutorials

Hugo site using the [Hugo Book](https://themes.gohugo.io/themes/hugo-book/) theme (vendored in `themes/hugo-book`).
Live at https://dersavage.github.io/tutorials/.

- Tutorials: `content/docs/*.md`; the interactive Logo 101 course lives in `static/logo-101/` (lessons in `sections/sNN.js`, checked with `node verify.js`)
- Deploys on every push to `main` via `.github/workflows/pages.yml` (set Pages source to "GitHub Actions")
- Local preview: `hugo server`
