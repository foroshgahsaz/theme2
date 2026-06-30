/* فروشگاه‌ساز لاراول – Vertical Showcase */
(function ($) {
  'use strict';

  var PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  function toPersianNum(num) {
    return String(num).padStart(2, '0').replace(/\d/g, function (d) {
      return PERSIAN_DIGITS[parseInt(d, 10)];
    });
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
  });

  function initVerticalShowcase() {
    var $showcases = $('.mkdf-vertical-showcase');
    if (!$showcases.length) return;

    $showcases.each(function () {
      var $holder = $(this);
      var $wrapper = $('.mkdf-wrapper');
      var $stripe = $holder.find('.mkdf-vs-stripe');
      var $frameHolder = $holder.find('.mkdf-vs-frame-holder');
      var $mobileFrame = $holder.find('.mkdf-vs-frame-mobile-holder');
      var $laptopFrame = $holder.find('.mkdf-vs-frame-laptop-holder');
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
      var featureSlides = $slides.filter('[data-device]');
      var totalSlides = $slides.length;
      var slideIndex = 1;
      var isLastSlide = false;
      var stripeRotation = 0;
      var isMobile = mkdf.windowWidth < 1025;
      var $bgText = $frameInfo.find('.mkdf-vs-frame-bg-text .mkdf-vs-frame-bg-text-content');
      var $logo = $('.mkdf-logo-wrapper');
      var currentDevice = 'mobile';
      var deviceTransitionTimer = null;

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
        threshold: 8,
        shortSwipes: true,
        longSwipes: true,
        followFinger: true,
        touchStartForcePreventDefault: false,
        speed: isMobile ? 700 : 1000,
        simulateTouch: true,
        allowTouchMove: true,
        resistanceRatio: 0.85,
        pagination: {
          el: $holder.find('.swiper-pagination')[0],
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' bullet-clickable" role="button" tabindex="0" aria-label="اسلاید ' + toPersianNum(index + 1) + '"></span>';
          }
        },
        init: false
      });

      function setHeights() {
        isMobile = mkdf.windowWidth < 1025;

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

      $logo.addClass('mkdf-logo-wrapper-vertical-showcase mkdf-vs-frame-even');

      function switchDevice(device, useFade) {
        if (device === 'contact' || !device) {
          return;
        }

        if (device === currentDevice) {
          return;
        }

        if (deviceTransitionTimer) {
          clearTimeout(deviceTransitionTimer);
          deviceTransitionTimer = null;
        }

        var applyDevice = function () {
          if (device === 'laptop') {
            $frameHolder.addClass('mkdf-vs-device-laptop');
          } else {
            $frameHolder.removeClass('mkdf-vs-device-laptop');
          }
          currentDevice = device;
        };

        if (useFade && isMobile) {
          $frameHolder.addClass('mkdf-vs-device-transitioning');
          deviceTransitionTimer = setTimeout(function () {
            applyDevice();
            deviceTransitionTimer = setTimeout(function () {
              $frameHolder.removeClass('mkdf-vs-device-transitioning');
              deviceTransitionTimer = null;
            }, 500);
          }, 280);
          return;
        }

        $frameHolder.removeClass('mkdf-vs-device-transitioning');
        applyDevice();
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

        if (screenIdx === undefined || !device) {
          return;
        }

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

          if (!device || !$img.length) {
            return;
          }

          var src = $img.attr('src') || $img.attr('data-src');
          var alt = $img.attr('alt') || '';

          if (!src) {
            return;
          }

          imageUrls.push(src);

          var layerHtml = '<div class="mkdf-screen-layer" data-slide="' + slideNum + '">' +
            '<img src="' + src + '" alt="' + alt + '" decoding="async"></div>';

          if (device === 'mobile') {
            $slide.attr('data-screen-index', mobileIdx);
            mobileHtml += layerHtml;
            mobileIdx++;
          } else if (device === 'laptop') {
            $slide.attr('data-screen-index', laptopIdx);
            laptopHtml += layerHtml;
            laptopIdx++;
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
            switchDevice(current.device, true);
          }
        }

        function showBgChars() {
          if (!$bgText.length) return;
          $bgText.find('span').each(function (i) {
            var $char = $(this);
            setTimeout(function () {
              $char.addClass('mkdf-show');
            }, 40 * i);
          });
        }

        function hideBgChars() {
          if (!$bgText.length) return;
          $bgText.find('span').removeClass('mkdf-show');
        }

        updateInfo();
        renderInfo();
        updateStripeRotation(slideIndex);

        if ($bgText.length) {
          var chars = $bgText.text().trim().split('');
          $bgText.empty();
          chars.forEach(function (ch) {
            if (ch !== ' ') {
              $bgText.append('<span class="mkdf-vs-frame-bg-text-char">' + ch + '</span>');
            } else {
              $bgText.append('<span class="mkdf-vs-frame-bg-text-char">&nbsp;</span>');
            }
          });
          setTimeout(function () {
            $bgText.css('opacity', 1);
          }, 100);
        }

        setTimeout(function () {
          $frameInfo.removeClass('mkdf-vs-frame-animate-out');
          $holder.removeClass('mkdf-vs-ready-animation');
        }, isMobile ? 50 : 500);

        setTimeout(function () {
          showBgChars();
          $logo.removeClass('mkdf-vs-frame-even');
          $logo.css('opacity', 1);
        }, isMobile ? 300 : 1000);

        $holder.on('click', '.swiper-pagination-bullet', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var index = $(this).index();
          if (index >= 0) {
            swiper.slideTo(index);
          }
        });

        swiper.on('slideChangeTransitionStart', function () {
          updateInfo();
          updateStripeRotation(slideIndex);
          setActiveScreen();

          if (slideIndex == totalSlides) {
            isLastSlide = true;
            $holder.addClass('mkdf-vs-last-slide');
            $logo.addClass('mkdf-vs-last-slide');
            hideBgChars();
            return;
          }

          isLastSlide = false;
          $holder.removeClass('mkdf-vs-last-slide');
          $logo.removeClass('mkdf-vs-last-slide');

          var deviceChanged = current.device !== currentDevice;
          switchDevice(current.device, deviceChanged);
          hideBgChars();

          if (isMobile) {
            renderInfo(true);
            $frameInfo.removeClass('mkdf-vs-frame-animate-out');
            setTimeout(showBgChars, 80);
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
            showBgChars();
          }, 700);
        });
      });
    });
  }

  function initFullscreenMenu() {
    var $openers = $('a.mkdf-fullscreen-menu-opener');
    if (!$openers.length) return;

    var $menu = $('.mkdf-fullscreen-menu-holder-outer');
    var animationClass = 'mkdf-push-nav-right';
    var menuToggleLock = false;

    function setMenuOpen(isOpen) {
      $openers.toggleClass('mkdf-fm-opened', isOpen);
      mkdf.body.toggleClass('mkdf-fullscreen-menu-opened ' + animationClass, isOpen);

      var swiperEl = document.querySelector('.swiper-container');
      if (swiperEl && swiperEl.swiper) {
        if (isOpen) {
          swiperEl.swiper.disable();
          if (swiperEl.swiper.mousewheel && swiperEl.swiper.mousewheel.disable) {
            swiperEl.swiper.mousewheel.disable();
          }
        } else {
          swiperEl.swiper.enable();
          if (swiperEl.swiper.mousewheel && swiperEl.swiper.mousewheel.enable) {
            swiperEl.swiper.mousewheel.enable();
          }
        }
      }
    }

    $menu.height(mkdf.windowHeight);
    $(window).on('resize', function () {
      $menu.height(mkdf.windowHeight);
    });

    $openers.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (menuToggleLock) {
        return;
      }

      menuToggleLock = true;
      setTimeout(function () {
        menuToggleLock = false;
      }, 350);

      var isOpen = $(this).hasClass('mkdf-fm-opened');
      setMenuOpen(!isOpen);
    });

    $menu.on('click', function (e) {
      e.stopPropagation();
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
      var swiperEl = document.querySelector('.swiper-container');
      if (swiperEl && swiperEl.swiper) {
        swiperEl.swiper.slideTo(0);
      }
    });
  }

  $(document).ready(function () {
    initVerticalShowcase();
    initFullscreenMenu();
    initSideMenu();
    initBackToTop();
  });
})(jQuery);
