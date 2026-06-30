/* فروشگاه‌ساز لاراول – Vertical Showcase */
(function ($) {
  'use strict';

  var PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  function toPersianNum(num) {
    return String(num).padStart(2, '0').replace(/\d/g, function (d) {
      return PERSIAN_DIGITS[parseInt(d, 10)];
    });
  }

  function isMobileView() {
    return $(window).width() < 1025;
  }

  function preloadImages(urls) {
    urls.forEach(function (src) {
      if (!src) return;
      var img = new Image();
      img.src = src;
    });
  }

  window.mkdf = window.mkdf || {};
  mkdf.body = $('body');
  mkdf.windowWidth = $(window).width();
  mkdf.windowHeight = $(window).height();

  $(window).on('resize', function () {
    mkdf.windowWidth = $(window).width();
    mkdf.windowHeight = $(window).height();
    mkdf.body.toggleClass('mkdf-vs-is-mobile', isMobileView());
  });

  function initVerticalShowcase() {
    var $showcases = $('.mkdf-vertical-showcase');
    if (!$showcases.length) return;

    $showcases.each(function () {
      var $holder = $(this);
      var $wrapper = $('.mkdf-wrapper');
      var $stripe = $holder.find('.mkdf-vs-stripe');
      var $frameHolder = $holder.find('.mkdf-vs-frame-holder');
      var $innerMobile = $holder.find('.mkdf-vs-inner-mobile');
      var $innerLaptop = $holder.find('.mkdf-vs-inner-laptop');
      var $frameInfo = $holder.find('.mkdf-vs-frame-info');
      var $slideText = $frameInfo.find('.mkdf-vs-frame-slide-text');
      var $slideNumber = $frameInfo.find('.mkdf-vs-frame-slide-number');
      var $titleImage = $frameInfo.find('.mkdf-vs-frame-title-image');
      var $title = $frameInfo.find('.mkdf-vs-frame-title');
      var $subtitle = $frameInfo.find('.mkdf-vs-frame-subtitle');
      var $swiperEl = $holder.find('.swiper-container');
      var $slides = $swiperEl.find('.swiper-slide');
      var $pagination = $holder.find('.mkdf-vs-pagination');
      var totalSlides = $slides.length;
      var slideIndex = 1;
      var currentDevice = 'mobile';
      var stripeRotation = 0;
      var isMobile = isMobileView();

      if (isMobile) {
        mkdf.body.addClass('mkdf-vs-is-mobile');
      }

      var swiper = new Swiper($swiperEl[0], {
        loop: false,
        direction: 'vertical',
        slidesPerView: 1,
        mousewheel: {
          invert: false,
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: false,
          eventsTarget: $holder[0]
        },
        touchRatio: 1,
        threshold: 5,
        shortSwipes: true,
        longSwipes: true,
        followFinger: true,
        touchStartForcePreventDefault: false,
        speed: isMobile ? 600 : 1000,
        simulateTouch: true,
        allowTouchMove: true,
        resistanceRatio: 0.85,
        pagination: {
          el: $pagination[0],
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' bullet-clickable" role="button" tabindex="0" aria-label="اسلاید ' + toPersianNum(index + 1) + '"></span>';
          }
        },
        init: false
      });

      function setHeights() {
        isMobile = isMobileView();

        if (mkdf.body.hasClass('mkdf-paspartu-enabled') && !isMobile) {
          var padding = parseInt($wrapper.css('padding'), 10) || 0;
          $holder.css('height', 'calc(100vh - ' + (padding * 2) + 'px)');
          $swiperEl.css('height', 'calc(100vh - ' + (padding * 2) + 'px)');
        } else if (isMobile) {
          var mobileHeaderHeight = $('.mkdf-mobile-header-inner').outerHeight() || 70;
          $holder.css('height', 'calc(100dvh - ' + mobileHeaderHeight + 'px)');
          $swiperEl.css('height', 'calc(100dvh - ' + mobileHeaderHeight + 'px)');
        } else {
          $holder.css('height', '100vh');
          $swiperEl.css('height', '100vh');
        }
      }

      setHeights();
      $(window).on('resize', setHeights);

      $('.mkdf-logo-wrapper').addClass('mkdf-logo-wrapper-vertical-showcase mkdf-vs-frame-even');

      function switchDevice(device) {
        if (!device || device === 'contact' || device === currentDevice) {
          return;
        }

        if (device === 'laptop') {
          $frameHolder.addClass('mkdf-vs-device-laptop');
        } else {
          $frameHolder.removeClass('mkdf-vs-device-laptop');
        }

        currentDevice = device;
      }

      function updateStripeRotation(index) {
        if (!index || index >= totalSlides) return;
        stripeRotation = (index - 1) * 180;
        $stripe.css('transform', 'rotate(' + stripeRotation + 'deg)');
      }

      function setActiveScreen() {
        var $active = $swiperEl.find('.swiper-slide-active');
        var screenIdx = $active.data('screen-index');
        var device = $active.data('device');

        if (screenIdx === undefined || !device) return;

        var $frame = device === 'laptop' ? $innerLaptop : $innerMobile;
        var $layers = $frame.find('> div');

        $layers.removeClass('prev-active');
        $layers.filter('.active').removeClass('active').addClass('prev-active');

        if (screenIdx >= 0 && screenIdx < $layers.length) {
          $layers.eq(screenIdx).addClass('active');
        }
      }

      function buildScreenLayers() {
        var imageUrls = [];
        var mobileHtml = '';
        var laptopHtml = '';
        var mobileIdx = 0;
        var laptopIdx = 0;
        var placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        $slides.each(function (i) {
          var $slide = $(this);
          var slideNum = i + 1;
          var device = $slide.data('device');
          var $img = $slide.find('.mkdf-vs-item>img');

          $slide.attr('data-slide-index', slideNum);

          if (!device || !$img.length) return;

          var src = $img.attr('src') || $img.attr('data-src');
          var alt = $img.attr('alt') || '';
          if (!src) return;

          imageUrls.push(src);

          var layerHtml = '<div class="mkdf-screen-layer" data-slide="' + slideNum + '">' +
            '<img src="' + src + '" alt="' + alt + '" decoding="async"></div>';

          if (device === 'mobile') {
            $slide.attr('data-screen-index', mobileIdx++);
            mobileHtml += layerHtml;
          } else if (device === 'laptop') {
            $slide.attr('data-screen-index', laptopIdx++);
            laptopHtml += layerHtml;
          }

          $img.attr('data-src', src).attr('src', placeholder);
        });

        $innerMobile.html(mobileHtml);
        $innerLaptop.html(laptopHtml);
        preloadImages(imageUrls);

        $innerMobile.find('> div:first-child').addClass('active');
        $innerLaptop.find('> div:first-child').addClass('active');
      }

      buildScreenLayers();

      $holder.find('.mkdf-vs-inner-frame img').waitForImages(function () {
        swiper.init();

        var $logo = $('.mkdf-logo-wrapper');

        function readActiveSlide() {
          var $active = $swiperEl.find('.swiper-slide-active');
          slideIndex = $active.data('slide-index') || (swiper.activeIndex + 1);

          if ($active.find('.mkdf-vs-contact-form').length) {
            return { device: 'contact', text: '', image: '', title: '', subtitle: '' };
          }

          return {
            device: $active.data('device') || 'mobile',
            text: $active.find('.mkdf-vs-item-slide-text').text().trim(),
            image: $active.find('.mkdf-vs-item-title-image').html(),
            title: $active.find('.mkdf-vs-item-title').text().trim(),
            subtitle: $active.find('.mkdf-vs-item-subtitle').text().trim()
          };
        }

        var current = {};

        function updateInfo() {
          current = readActiveSlide();
        }

        function renderInfo(skipDevice) {
          if (current.device === 'contact') return;

          $slideText.text(current.text);
          $slideNumber.text(toPersianNum(slideIndex));
          $titleImage.html(current.image);
          $title.text(current.title);
          $subtitle.text(current.subtitle);

          if (!skipDevice) {
            switchDevice(current.device);
          }
        }

        function onSlideChange() {
          updateInfo();
          updateStripeRotation(slideIndex);
          setActiveScreen();
          $holder.toggleClass('mkdf-vs-is-first-slide', slideIndex === 1);

          if (slideIndex === totalSlides) {
            $holder.addClass('mkdf-vs-last-slide');
            $logo.addClass('mkdf-vs-last-slide');
            return;
          }

          $holder.removeClass('mkdf-vs-last-slide');
          $logo.removeClass('mkdf-vs-last-slide');

          switchDevice(current.device);

          if (isMobile) {
            renderInfo(true);
            $frameInfo.removeClass('mkdf-vs-frame-animate-out');
            return;
          }

          $frameInfo.addClass('mkdf-vs-frame-animate-out');

          setTimeout(function () {
            if (slideIndex % 2 === 0) {
              $logo.addClass('mkdf-vs-frame-even');
              $frameInfo.addClass('mkdf-vs-frame-even');
            } else {
              $logo.removeClass('mkdf-vs-frame-even');
              $frameInfo.removeClass('mkdf-vs-frame-even');
            }
            renderInfo(true);
          }, 400);

          setTimeout(function () {
            $frameInfo.removeClass('mkdf-vs-frame-animate-out');
          }, 700);
        }

        updateInfo();
        renderInfo();
        updateStripeRotation(slideIndex);
        $holder.toggleClass('mkdf-vs-is-first-slide', slideIndex === 1);

        setTimeout(function () {
          $frameInfo.removeClass('mkdf-vs-frame-animate-out');
          $holder.removeClass('mkdf-vs-ready-animation');
          $logo.removeClass('mkdf-vs-frame-even');
          $logo.css('opacity', 1);
        }, isMobile ? 80 : 500);

        $pagination.on('click touchend', '.swiper-pagination-bullet', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var idx = $(this).index();
          if (idx >= 0) {
            swiper.slideTo(idx);
          }
        });

        swiper.on('slideChangeTransitionStart', onSlideChange);
      });
    });
  }

  function initFullscreenMenu() {
    var $openers = $('.mkdf-fs-menu-btn');
    var $menu = $('.mkdf-fullscreen-menu-holder-outer');
    if (!$openers.length || !$menu.length) return;

    var menuOpen = false;
    var guardUntil = 0;

    function getSwiper() {
      var el = document.querySelector('.swiper-container');
      return el && el.swiper ? el.swiper : null;
    }

    function setMenuOpen(open) {
      menuOpen = open;
      guardUntil = Date.now() + 500;

      $openers.attr('aria-expanded', open ? 'true' : 'false');
      $openers.toggleClass('is-open', open);
      mkdf.body.toggleClass('mkdf-fs-menu-open', open);

      var sw = getSwiper();
      if (!sw) return;

      if (open) {
        sw.allowTouchMove = false;
        sw.disable();
        if (sw.mousewheel && sw.mousewheel.disable) sw.mousewheel.disable();
      } else {
        sw.allowTouchMove = true;
        sw.enable();
        if (sw.mousewheel && sw.mousewheel.enable) sw.mousewheel.enable();
      }
    }

    function toggleMenu() {
      setMenuOpen(!menuOpen);
    }

    $menu.css({ height: mkdf.windowHeight, minHeight: mkdf.windowHeight });
    $(window).on('resize', function () {
      $menu.css({ height: mkdf.windowHeight, minHeight: mkdf.windowHeight });
    });

    $openers.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      toggleMenu();
    });

    $menu.on('click', function (e) {
      e.stopPropagation();
    });

    $(document).on('click.mkdfFsMenu', function (e) {
      if (Date.now() < guardUntil) return;
      if (!menuOpen) return;
      if ($(e.target).closest('.mkdf-fs-menu-btn, .mkdf-fullscreen-menu-holder-outer').length) return;
      setMenuOpen(false);
    });

    $(document).on('keydown.mkdfFsMenu', function (e) {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    });

    $('.mkdf-fullscreen-menu > ul li.has_sub > a').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $li = $(this).parent();
      if ($li.hasClass('open_sub')) {
        $li.removeClass('open_sub').find('> .sub_menu').slideUp(200);
      } else {
        $li.siblings('.open_sub').removeClass('open_sub').find('> .sub_menu').slideUp(200);
        $li.addClass('open_sub').find('> .sub_menu').slideDown(200);
      }
    });
  }

  function initSideMenu() {
    var $wrapper = $('.mkdf-wrapper');
    var $openers = $('a.mkdf-side-menu-button-opener');
    var bodyClass = 'mkdf-right-side-menu-opened';

    if (mkdf.body.hasClass('mkdf-side-menu-slide-from-right') && !$wrapper.find('.mkdf-cover').length) {
      $wrapper.prepend('<div class="mkdf-cover"/>');
    }

    $('a.mkdf-side-menu-button-opener, a.mkdf-close-side-menu').on('click', function (e) {
      e.preventDefault();
      if (mkdf.body.hasClass(bodyClass)) {
        mkdf.body.removeClass(bodyClass);
        $openers.removeClass('opened');
      } else {
        mkdf.body.addClass(bodyClass);
        $openers.addClass('opened');
      }
    });

    $wrapper.find('.mkdf-cover').on('click', function () {
      mkdf.body.removeClass(bodyClass);
      $openers.removeClass('opened');
    });
  }

  function initBackToTop() {
    var $btt = $('#mkdf-back-to-top');
    if (!$btt.length) return;

    $btt.on('click', function (e) {
      e.preventDefault();
      var sw = document.querySelector('.swiper-container');
      if (sw && sw.swiper) sw.swiper.slideTo(0);
    });
  }

  $(document).ready(function () {
    initVerticalShowcase();
    initFullscreenMenu();
    initSideMenu();
    initBackToTop();
  });
})(jQuery);
