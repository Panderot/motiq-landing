$files = Get-ChildItem -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $orig = $content
    
    # Check if English
    $isEnglish = ($file.Name -like "*en*") -or ($file.Name -eq "privacy-policy.html") -or ($file.Name -eq "terms-of-use.html")

    # Replace Turkish newsletter form (both div-based and old Netlify form-based)
    $content = [regex]::Replace($content, '(?s)<div class="newsletter-form">\s*<input type="email" placeholder="E-posta adresiniz"\s*/>\s*<button type="submit">Kayıt Ol</button>\s*</div>', 
    '<form class="newsletter-form" name="newsletter" method="POST" action="/api/newsletter">
        <input type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true" style="display: none;">
        <input type="email" name="email" placeholder="E-posta adresiniz" required />
        <button type="submit">Kayıt Ol</button>
      </form>')
    $content = [regex]::Replace($content, '(?s)<form class="newsletter-form" name="newsletter" method="POST" data-netlify="true">\s*<input type="hidden" name="form-name" value="newsletter" />\s*<input type="email" name="email" placeholder="E-posta adresiniz" required />\s*<button type="submit">Kayıt Ol</button>\s*</form>', 
    '<form class="newsletter-form" name="newsletter" method="POST" action="/api/newsletter">
        <input type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true" style="display: none;">
        <input type="email" name="email" placeholder="E-posta adresiniz" required />
        <button type="submit">Kayıt Ol</button>
      </form>')

    # Replace English newsletter form (both div-based and old Netlify form-based)
    $content = [regex]::Replace($content, '(?s)<div class="newsletter-form">\s*<input type="email" placeholder="Your email address"\s*/>\s*<button type="submit">Subscribe</button>\s*</div>', 
    '<form class="newsletter-form" name="newsletter" method="POST" action="/api/newsletter">
        <input type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true" style="display: none;">
        <input type="email" name="email" placeholder="Your email address" required />
        <button type="submit">Subscribe</button>
      </form>')
    $content = [regex]::Replace($content, '(?s)<form class="newsletter-form" name="newsletter" method="POST" data-netlify="true">\s*<input type="hidden" name="form-name" value="newsletter" />\s*<input type="email" name="email" placeholder="Your email address" required />\s*<button type="submit">Subscribe</button>\s*</form>', 
    '<form class="newsletter-form" name="newsletter" method="POST" action="/api/newsletter">
        <input type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true" style="display: none;">
        <input type="email" name="email" placeholder="Your email address" required />
        <button type="submit">Subscribe</button>
      </form>')

    # Replace JS
    $jsSearch = '(?s)// ===== NEWSLETTER FORM =====.*?}\s*(?=</script>|<!--)'
    if ($content -match $jsSearch) {
        $successMsg = if ($isEnglish) { "✓ Subscribed!" } else { "✓ Kaydedildi!" }
        $errorMsg = if ($isEnglish) { "Please try again" } else { "Tekrar deneyin" }

        $newJS = @"
  // ===== NEWSLETTER FORM =====
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    let isSubmitting = false;
    newsletterForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (isSubmitting) return;

      const emailInput = newsletterForm.querySelector('input[name="email"]');
      const companyWebsiteInput = newsletterForm.querySelector('input[name="company_website"]');
      const btn = newsletterForm.querySelector('button');
      
      const email = emailInput ? emailInput.value : '';
      const company_website = companyWebsiteInput ? companyWebsiteInput.value : '';
      
      const originalText = btn.textContent;
      const originalBg = btn.style.background;

      isSubmitting = true;
      btn.disabled = true;

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, company_website })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          btn.textContent = '$successMsg';
          btn.style.background = '#22c55e';
          if (emailInput) emailInput.value = '';
        } else {
          btn.textContent = '$errorMsg';
          btn.style.background = '#ef4444';
        }
      } catch (err) {
        console.error(err);
        btn.textContent = '$errorMsg';
        btn.style.background = '#ef4444';
      } finally {
        isSubmitting = false;
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = originalBg;
        }, 3000);
      }
    });
  }
"@
        $content = [regex]::Replace($content, $jsSearch, $newJS)
    }

    # Remove hidden Netlify form if index.html
    if ($file.Name -eq 'index.html') {
        $content = [regex]::Replace($content, '(?s)<!-- Hidden static newsletter form for Netlify -->\s*<form name="newsletter".*?</form>\s*', '')
    }

    if ($content -ne $orig) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    }
}
