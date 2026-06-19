document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuIcon?.classList.toggle('hidden', !isOpen);
      closeIcon?.classList.toggle('hidden', isOpen);
    });
  }

  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('shadow-sm', window.scrollY > 20);
    header.classList.toggle('bg-white/95', window.scrollY > 20);
    header.classList.toggle('backdrop-blur-md', window.scrollY > 20);
  });

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'ثبت شد ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        newsletterForm.reset();
      }, 2500);
    });
  }
});
