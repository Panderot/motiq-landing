$files = Get-ChildItem -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $orig = $content
    
    # Replace Turkish visible form
    $content = [regex]::Replace($content, '(?s)<div class="newsletter-form">\s*<input type="email" placeholder="E-posta adresiniz"\s*/>\s*<button type="submit">Kayıt Ol</button>\s*</div>', 
    '<form class="newsletter-form" name="newsletter" method="POST" data-netlify="true">
        <input type="hidden" name="form-name" value="newsletter" />
        <input type="email" name="email" placeholder="E-posta adresiniz" required />
        <button type="submit">Kayıt Ol</button>
      </form>')

    # Replace English visible form
    $content = [regex]::Replace($content, '(?s)<div class="newsletter-form">\s*<input type="email" placeholder="Your email address"\s*/>\s*<button type="submit">Subscribe</button>\s*</div>', 
    '<form class="newsletter-form" name="newsletter" method="POST" data-netlify="true">
        <input type="hidden" name="form-name" value="newsletter" />
        <input type="email" name="email" placeholder="Your email address" required />
        <button type="submit">Subscribe</button>
      </form>')

    # Replace JS
    $jsSearch = '(?s)// ===== NEWSLETTER FORM =====.*?}\s*(?=</script>|<!--)'
    $newJS = @"
  // ===== NEWSLETTER FORM =====
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn = newsletterForm.querySelector('button');
      const originalText = btn.textContent;
      
      const formData = new FormData(newsletterForm);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        btn.textContent = originalText === 'Subscribe' ? '✓ Saved!' : '✓ Kaydedildi!';
        btn.style.background = '#22c55e';
        input.value = '';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
      })
      .catch(err => console.error(err));
    });
  }
"@
    $content = [regex]::Replace($content, $jsSearch, $newJS)

    if ($file.Name -eq 'index.html' -and $content -notmatch '<!-- Hidden static newsletter form') {
        $content = [regex]::Replace($content, '<body>', "<body>`r`n<!-- Hidden static newsletter form for Netlify -->`r`n<form name=`"newsletter`" method=`"POST`" data-netlify=`"true`" hidden>`r`n  <input type=`"hidden`" name=`"form-name`" value=`"newsletter`" />`r`n  <input type=`"email`" name=`"email`" required />`r`n</form>")
    }

    if ($content -ne $orig) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    }
}
