$files = Get-ChildItem -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Normalize line endings to Windows standard just in case to match the raw strings below
    $content = $content -replace "`r`n", "`n" -replace "`r", "`n" -replace "`n", "`r`n"

    # 1. Turkish Form HTML
    $trDiv = '<div class="newsletter-form">' + "`r`n" + '        <input type="email" placeholder="E-posta adresiniz" />' + "`r`n" + '        <button type="submit">Kayıt Ol</button>' + "`r`n" + '      </div>'
    $trForm = '<form class="newsletter-form" name="newsletter" method="POST" data-netlify="true">' + "`r`n" + '        <input type="hidden" name="form-name" value="newsletter" />' + "`r`n" + '        <input type="email" name="email" placeholder="E-posta adresiniz" required />' + "`r`n" + '        <button type="submit">Kayıt Ol</button>' + "`r`n" + '      </form>'
    $content = $content -replace [regex]::Escape($trDiv), $trForm

    # 2. English Form HTML
    $enDiv = '<div class="newsletter-form">' + "`r`n" + '        <input type="email" placeholder="Your email address" />' + "`r`n" + '        <button type="submit">Subscribe</button>' + "`r`n" + '      </div>'
    $enForm = '<form class="newsletter-form" name="newsletter" method="POST" data-netlify="true">' + "`r`n" + '        <input type="hidden" name="form-name" value="newsletter" />' + "`r`n" + '        <input type="email" name="email" placeholder="Your email address" required />' + "`r`n" + '        <button type="submit">Subscribe</button>' + "`r`n" + '      </form>'
    $content = $content -replace [regex]::Escape($enDiv), $enForm

    # 3. JavaScript Block
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
    
    # Replace from '// ===== NEWSLETTER FORM =====' until '</script>'
    $content = $content -replace '(?s)// ===== NEWSLETTER FORM =====.*?(?=</script>)', ($newJS + "`r`n")

    # 4. Hidden Form in index.html
    if ($file.Name -eq 'index.html') {
        if ($content -notmatch '<!-- Hidden static newsletter form for Netlify -->') {
            $hiddenForm = @"
<!-- Hidden static newsletter form for Netlify -->
<form name="newsletter" method="POST" data-netlify="true" hidden>
  <input type="hidden" name="form-name" value="newsletter" />
  <input type="email" name="email" required />
</form>
"@
            $content = $content -replace '<body>', ("<body>`r`n" + $hiddenForm)
        }
    }

    if ($originalContent -ne $content) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    }
}
