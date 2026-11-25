# MotiqAI landing: notes for Claude

- Fixnote CSS/JS cache-bust: every change to uygulamalar/fixnote/fixnote.css or fixnote.js must also bump the shared `?v=` value (YYYYMMDD + letter) on the fixnote.css and fixnote.js links in fixnote.html and fixnote-en.html. Cloudflare serves these with max-age=14400, so without a new value visitors see new HTML with old CSS (unstyled sections).

## Folder rules (keep the root clean)

- Site pages (`*.html`) stay in the root. Never move or rename them: the file name is the live URL (motiqai.com/fixnote.html etc.) and moving one breaks links, Google results and the legal-page links. If a page must be renamed, add a 301 line to `_redirects` in the same change.
- Page assets go next to their page group: `uygulamalar/<app>/`, `case-studies/<project>/`.
- Screenshots you take for checking work: `.playwright-mcp/` (Playwright default) or `_calisma/ekran-goruntuleri/`. Never save `shot-*.png` or other screenshots in the root.
- Prompt files, notes, drafts: `_calisma/promptlar/` or `_calisma/notlar/`.
- `_calisma/`, `.playwright-mcp/`, `.wrangler/`, `.vscode/` are git-ignored and never deployed. Do not commit them.
- Fixnote purchase page: prices and iyzico payment links live in one place, `uygulamalar/fixnote/satin-al.js` (`LISANSLAR`, `ODEME_LINKLERI`). Keep prices identical to the pricing cards in fixnote.html / fixnote-en.html. Every change to satin-al.js must bump the `?v=` value on its script tag in satin-al.html and buy.html.
