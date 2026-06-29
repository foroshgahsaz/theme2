(function () {
  'use strict';

  const slides = [
    {
      screen: 'https://foton.qodeinteractive.com/wp-content/uploads/2019/12/screen-1.png',
      icon: 'https://foton.qodeinteractive.com/wp-content/uploads/2019/11/h11-img-7.png',
      slideText: 'Protecting the Data',
      title: 'Centralized Apps',
      subtitle: 'Lorem ipsum dolor sit amet, percipitur sadipscing.',
      number: '01'
    },
    {
      screen: 'https://foton.qodeinteractive.com/wp-content/uploads/2019/12/screen-2.png',
      icon: 'https://foton.qodeinteractive.com/wp-content/uploads/2019/11/h11-img-8.png',
      slideText: 'Top Notch Features',
      title: 'Market Analysis',
      subtitle: 'Lorem ipsum dolor sit amet, percipitur sadipscing.',
      number: '02'
    },
    {
      screen: 'https://foton.qodeinteractive.com/wp-content/uploads/2019/12/screen-3.png',
      icon: 'https://foton.qodeinteractive.com/wp-content/uploads/2019/11/h11-img-9.png',
      slideText: 'Managing Toolset',
      title: 'Web Solution',
      subtitle: 'Lorem ipsum dolor sit amet, percipitur sadipscing.',
      number: '03'
    }
  ];

  const showcase = document.getElementById('vertical-showcase');
  const frameInfo = document.getElementById('frame-info');
  const screenContainer = document.getElementById('screen-container');
  const frameIcon = document.getElementById('frame-icon');
  const frameTitle = document.getElementById('frame-title');
  const frameSubtitle = document.getElementById('frame-subtitle');
  const frameSlideNumber = document.getElementById('frame-slide-number');
  const frameSlideText = document.getElementById('frame-slide-text');

  let currentIndex = 0;
  let isAnimating = false;

  function initScreens() {
    slides.forEach(function (slide, i) {
      const img = document.createElement('img');
      img.src = slide.screen;
      img.alt = 'App screen ' + (i + 1);
      if (i === 0) img.classList.add('active');
      screenContainer.appendChild(img);
    });
  }

  function updateScreen(index) {
    const imgs = screenContainer.querySelectorAll('img');
    imgs.forEach(function (img, i) {
      img.classList.remove('active', 'prev-active');
      if (i === index) {
        img.classList.add('active');
      } else if (i === currentIndex) {
        img.classList.add('prev-active');
      }
    });
  }

  function updateFrameInfo(index) {
    if (index >= slides.length) return;

    const slide = slides[index];

    frameInfo.classList.add('animating-out');

    setTimeout(function () {
      frameIcon.src = slide.icon;
      frameTitle.textContent = slide.title;
      frameSubtitle.textContent = slide.subtitle;
      frameSlideNumber.textContent = slide.number;
      frameSlideText.textContent = slide.slideText;

      frameInfo.classList.remove('animating-out');
    }, 400);
  }

  function setLastSlide(isLast) {
    if (isLast) {
      showcase.classList.add('last-slide');
    } else {
      showcase.classList.remove('last-slide');
    }
  }

  const swiper = new Swiper('.vs-swiper', {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    mousewheel: {
      releaseOnEdges: true,
      sensitivity: 1
    },
    pagination: {
      el: '.vs-pagination',
      clickable: true
    },
    on: {
      slideChange: function () {
        const idx = this.activeIndex;
        const isLast = idx === this.slides.length - 1;

        if (idx < slides.length) {
          updateScreen(idx);
          updateFrameInfo(idx);
          currentIndex = idx;
        }

        setLastSlide(isLast);
      }
    }
  });

  initScreens();

  setTimeout(function () {
    showcase.classList.add('ready');
  }, 300);

  const menuBtn = document.getElementById('menu-btn');
  const fullscreenMenu = document.getElementById('fullscreen-menu');

  menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('is-open');
    fullscreenMenu.classList.toggle('is-open');
    document.body.classList.toggle('overflow-hidden');
  });

  document.querySelectorAll('.menu-item.has-sub .menu-link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const sub = this.nextElementSibling;
      if (sub) {
        sub.classList.toggle('is-open');
        sub.classList.toggle('hidden');
      }
    });
  });

  const sidePanel = document.getElementById('side-panel');
  const sideOverlay = document.getElementById('side-overlay');
  const sideClose = document.getElementById('side-close');

  function openSide() {
    sidePanel.classList.add('is-open');
    sideOverlay.classList.add('is-open');
  }

  function closeSide() {
    sidePanel.classList.remove('is-open');
    sideOverlay.classList.remove('is-open');
  }

  sideClose.addEventListener('click', closeSide);
  sideOverlay.addEventListener('click', closeSide);

  const backToTop = document.getElementById('back-to-top');
  backToTop.addEventListener('click', function (e) {
    e.preventDefault();
    swiper.slideTo(0);
  });

  swiper.on('slideChange', function () {
    if (this.activeIndex > 0) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (fullscreenMenu.classList.contains('is-open')) {
        menuBtn.classList.remove('is-open');
        fullscreenMenu.classList.remove('is-open');
      }
      closeSide();
    }
  });
})();
