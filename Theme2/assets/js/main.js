/* فروشگاه‌ساز لاراول – Vertical Showcase */
(function ($) {
  'use strict';

  var PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  function toPersianNum(num) {
    return String(num).padStart(2, '0').replace(/\d/g, function (d) {
      return PERSIAN_DIGITS[parseInt(d, 10)];
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
      var $innerFrame = $holder.find('.mkdf-vs-inner-frame');
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
      var $bgText = $frameInfo.find('.mkdf-vs-frame-bg-text .mkdf-vs-frame-bg-text-content');
      var $logo = $('.mkdf-logo-wrapper');

      var swiper = new Swiper($swiperEl[0], {
        loop: false,
        direction: 'vertical',
        slidesPerView: 1,
        mousewheel: {
          invert: false,
          eventsTarget: $holder[0]
        },
        touchStartForcePreventDefault: false,
        speed: 1000,
        simulateTouch: true,
        allowTouchMove: true,
        pagination: {
          el: $holder.find('.swiper-pagination')[0],
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' bullet-clickable" role="button" aria-label="اسلاید ' + toPersianNum(index + 1) + '"></span>';
          }
        },
        init: false
      });

      function setHeights() {
        if (mkdf.body.hasClass('mkdf-paspartu-enabled') && mkdf.windowWidth >= 1025) {
          var padding = parseInt($wrapper.css('padding'), 10) || 0;
          $holder.css('height', 'calc(100vh - ' + (padding * 2) + 'px)');
          $swiperEl.css('height', 'calc(100vh - ' + (padding * 2) + 'px)');
        } else if (mkdf.windowWidth < 1025) {
          var mobileHeaderHeight = $('.mkdf-mobile-header-inner').outerHeight() || 70;
          $holder.css('height', 'calc(100vh - ' + mobileHeaderHeight + 'px)');
          $swiperEl.css('height', 'calc(100vh - ' + mobileHeaderHeight + 'px)');
        } else {
          $holder.css('height', '100vh');
          $swiperEl.css('height', '100vh');
        }
      }

      setHeights();
      $(window).on('resize', setHeights);

      $logo.addClass('mkdf-logo-wrapper-vertical-showcase mkdf-vs-frame-even');

      function switchDevice(device) {
        if (device === 'laptop') {
          $frameHolder.addClass('mkdf-vs-device-laptop');
          $mobileFrame.hide();
          $laptopFrame.show();
          $innerFrame.appendTo($laptopFrame.find('.laptop-screen-bezel'));
        } else {
          $frameHolder.removeClass('mkdf-vs-device-laptop');
          $mobileFrame.show();
          $laptopFrame.hide();
          $innerFrame.appendTo($mobileFrame);
        }
      }

      function updateStripeRotation(index) {
        if (!index || index >= totalSlides) return;
        stripeRotation = (index - 1) * 180;
        $stripe.css('transform', 'rotate(' + stripeRotation + 'deg)');
      }

      $holder.waitForImages(function () {
        swiper.init();

        function readActiveSlide() {
          var $active = $swiperEl.find('.swiper-slide-active');
          slideIndex = $active.data('slide-index') || (swiper.activeIndex + 1);
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

        function renderInfo() {
          $slideText.text(current.text);
          $slideNumber.text(toPersianNum(slideIndex));
          $titleImage.html(current.image);
          $title.text(current.title);
          $subtitle.text(current.subtitle);
          switchDevice(current.device);
        }

        function showBgChars() {
          if (!$bgText.length) return;
          $bgText.find('span').each(function (i) {
            var $char = $(this);
            setTimeout(function () {
              $char.addClass('mkdf-show');
            }, 50 * i);
          });
        }

        function hideBgChars() {
          if (!$bgText.length) return;
          $bgText.find('span').removeClass('mkdf-show');
        }

        var counter = 1;
        $slides.each(function () {
          var $slide = $(this);
          $slide.attr('data-slide-index', counter);
          var src = $slide.find('.mkdf-vs-item>img').attr('src');
          var alt = $slide.find('.mkdf-vs-item>img').attr('alt') || '';
          if (src) {
            $innerFrame.append('<div data-device="' + ($slide.data('device') || 'mobile') + '"><img src="' + src + '" alt="' + alt + '"></div>');
          }
          counter++;
        });

        $innerFrame.find('div:first-child').addClass('active');
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
          setTimeout(function () {
            $frameInfo.removeClass('mkdf-vs-frame-animate-out');
          }, 700);
          $holder.removeClass('mkdf-vs-ready-animation');
        }, 500);

        setTimeout(function () {
          showBgChars();
          $logo.removeClass('mkdf-vs-frame-even');
          $logo.css('opacity', 1);
        }, 1000);

        swiper.on('slideChangeTransitionStart', function () {
          updateInfo();
          updateStripeRotation(slideIndex);

          var $featureDivs = $innerFrame.find('div');
          $featureDivs.removeClass('prev-active');
          $featureDivs.filter('.active').removeClass('active').addClass('prev-active');

          if (slideIndex <= featureSlides.length) {
            $featureDivs.eq(slideIndex - 1).addClass('active');
          }

          if (slideIndex == totalSlides) {
            isLastSlide = true;
            $holder.addClass('mkdf-vs-last-slide');
            $logo.addClass('mkdf-vs-last-slide');
            hideBgChars();
          } else {
            isLastSlide = false;
            $holder.removeClass('mkdf-vs-last-slide');
            $logo.removeClass('mkdf-vs-last-slide');
          }

          if (!isLastSlide) {
            hideBgChars();
            $frameInfo.addClass('mkdf-vs-frame-animate-out');

            setTimeout(function () {
              if (slideIndex % 2 === 0) {
                $logo.addClass('mkdf-vs-frame-even');
              } else {
                $logo.removeClass('mkdf-vs-frame-even');
              }
            }, 400);

            setTimeout(function () {
              if (slideIndex % 2 === 0) {
                $frameInfo.addClass('mkdf-vs-frame-even');
              } else {
                $frameInfo.removeClass('mkdf-vs-frame-even');
              }
              renderInfo();
              setTimeout(showBgChars, 100);
              $frameInfo.removeClass('mkdf-vs-frame-animate-out');
            }, 700);
          }
        });
      });
    });
  }

  function initFullscreenMenu() {
    var $openers = $('a.mkdf-fullscreen-menu-opener');
    if (!$openers.length) return;

    var $menu = $('.mkdf-fullscreen-menu-holder-outer');
    var animationClass = 'mkdf-push-nav-right';

    $menu.height(mkdf.windowHeight);
    $(window).on('resize', function () {
      $menu.height(mkdf.windowHeight);
    });

    $openers.on('click', function (e) {
      e.preventDefault();
      var $opener = $(this);

      if ($opener.hasClass('mkdf-fm-opened')) {
        $opener.removeClass('mkdf-fm-opened');
        mkdf.body.removeClass('mkdf-fullscreen-menu-opened ' + animationClass);
      } else {
        $opener.addClass('mkdf-fm-opened');
        mkdf.body.addClass('mkdf-fullscreen-menu-opened ' + animationClass);
      }
    });

    $('.mkdf-fullscreen-menu > ul li.has_sub > a').on('click', function (e) {
      e.preventDefault();
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
