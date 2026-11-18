# MotiqAI landing: notes for Claude

- Fixnote CSS/JS cache-bust: every change to uygulamalar/fixnote/fixnote.css or fixnote.js must also bump the shared `?v=` value (YYYYMMDD + letter) on the fixnote.css and fixnote.js links in fixnote.html and fixnote-en.html. Cloudflare serves these with max-age=14400, so without a new value visitors see new HTML with old CSS (unstyled sections).
