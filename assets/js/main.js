document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 20);
  });

  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  menuBtn?.addEventListener('click', () => mobileNav?.classList.toggle('is-open'));
  mobileNav?.addEventListener('click', (e) => {
    if (e.target === mobileNav) mobileNav.classList.remove('is-open');
  });

  const testimonials = [
    {
      text: 'طراحی ساده و ظریف یک شاهکار مطلق است — اتاق را کاملاً متعادل می‌کند. کیفیت ساخت فوق‌العاده و تجربه خریدی واقعاً حرفه‌ای.',
      name: 'رژینا ساگانا',
      meta: 'ایران · ۳۰ دی ۱۴۰۴',
    },
    {
      text: 'از لحظه ورود به نمایشگاه تا تحویل محصول، همه چیز بی‌نقص بود. تیم مشاوره فوق‌العاده حرفه‌ای عمل کرد.',
      name: 'علی رضایی',
      meta: 'ایران · ۱۵ بهمن ۱۴۰۴',
    },
    {
      text: 'کیفیت پارچه و دوخت بی‌نظیر است. صندلی‌ها بعد از یک سال استفاده روزانه هنوز مثل روز اول هستند.',
      name: 'نیلوفر کریمی',
      meta: 'ایران · ۲ اسفند ۱۴۰۴',
    },
  ];

  let tIndex = 0;
  const slide = document.getElementById('testimonial-slide');
  const renderTestimonial = () => {
    if (!slide) return;
    const t = testimonials[tIndex];
    slide.innerHTML = `
      <div class="badge"><span class="badge-inner">تراست‌پایلت</span> طراحی</div>
      <p>${t.text}</p>
      <div class="testimonial-author"><div class="name">${t.name}</div><div class="meta">${t.meta}</div></div>
    `;
  };

  document.getElementById('t-prev')?.addEventListener('click', () => {
    tIndex = (tIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial();
  });
  document.getElementById('t-next')?.addEventListener('click', () => {
    tIndex = (tIndex + 1) % testimonials.length;
    renderTestimonial();
  });

  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.textContent.trim();
    btn.textContent = 'ثبت شد ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original + ' <svg class="arrow" viewBox="0 0 16 16"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"/></svg>';
      btn.disabled = false;
      e.target.reset();
    }, 2500);
  });
});
