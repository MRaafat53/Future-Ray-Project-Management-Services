/**
 * شعاع المستقبل - Main JavaScript
 * jQuery + AOS + Custom interactions
 */

$(document).ready(function () {

  /* ============================================================
     AOS INITIALIZATION
     ============================================================ */
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    delay: 0
  });

  /* ============================================================
     LOADING SCREEN
     ============================================================ */
  $(window).on('load', function () {
    setTimeout(function () {
      $('#loading-screen').addClass('hidden');
    }, 600);
  });

  // Fallback: hide after 3s even if load doesn't fire
  setTimeout(function () {
    $('#loading-screen').addClass('hidden');
  }, 3000);

  /* ============================================================
     NAVBAR SCROLL BEHAVIOR
     ============================================================ */
  function handleNavbarScroll() {
    if ($(window).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  }

  $(window).on('scroll', handleNavbarScroll);
  handleNavbarScroll(); // run on init

  /* ============================================================
     SCROLL-TO-TOP BUTTON
     ============================================================ */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
      $('#scroll-top').addClass('visible');
    } else {
      $('#scroll-top').removeClass('visible');
    }
  });

  $('#scroll-top').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600, 'swing');
  });

  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var target = $(this).attr('href');
    if (target === '#') return;
    var $el = $(target);
    if ($el.length) {
      e.preventDefault();
      var offset = $el.offset().top - 80;
      $('html, body').animate({ scrollTop: offset }, 650, 'swing');
    }
  });

  /* ============================================================
     ACTIVE NAV LINK (based on current page)
     ============================================================ */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.navbar-nav .nav-link').each(function () {
    var linkHref = $(this).attr('href');
    if (linkHref === currentPage ||
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === 'index.html' && linkHref === 'index.html')) {
      $(this).addClass('active');
    }
  });

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  function animateCounter($el) {
    var target = parseInt($el.attr('data-target'), 10);
    var duration = 1800;
    var step = target / (duration / 16);
    var current = 0;
    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      $el.text(Math.floor(current).toLocaleString('ar-EG'));
    }, 16);
  }

  var countersStarted = false;
  function checkCounters() {
    if (countersStarted) return;
    var $statsSection = $('.stats-section');
    if (!$statsSection.length) return;
    var sectionTop = $statsSection.offset().top;
    var windowBottom = $(window).scrollTop() + $(window).height();
    if (windowBottom > sectionTop + 100) {
      countersStarted = true;
      $('[data-counter]').each(function () {
        animateCounter($(this));
      });
    }
  }

  $(window).on('scroll', checkCounters);
  checkCounters();

  /* ============================================================
     CONTACT FORM VALIDATION
     ============================================================ */
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    var valid = true;
    var $form = $(this);

    $form.find('[required]').each(function () {
      var val = $(this).val().trim();
      if (!val) {
        $(this).addClass('is-invalid');
        valid = false;
      } else {
        $(this).removeClass('is-invalid');
      }
    });

    // Email validation
    var $email = $form.find('#email');
    if ($email.length && $email.val().trim()) {
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test($email.val().trim())) {
        $email.addClass('is-invalid');
        valid = false;
      }
    }

    // Phone validation
    var $phone = $form.find('#phone');
    if ($phone.length && $phone.val().trim()) {
      var phoneRe = /^[\d\s\+\-\(\)]{7,20}$/;
      if (!phoneRe.test($phone.val().trim())) {
        $phone.addClass('is-invalid');
        valid = false;
      }
    }

    if (valid) {
      var $btn = $form.find('[type="submit"]');
      var origText = $btn.html();
      $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>جاري الإرسال...').prop('disabled', true);
      setTimeout(function () {
        $btn.html('<i class="fas fa-check me-2"></i>تم الإرسال بنجاح!').removeClass('btn-primary-custom').addClass('btn-success');
        $form[0].reset();
        setTimeout(function () {
          $btn.html(origText).addClass('btn-primary-custom').removeClass('btn-success').prop('disabled', false);
        }, 3500);
      }, 1400);
    }
  });

  // Clear invalid state on input
  $(document).on('input change', '.form-control, .form-select', function () {
    $(this).removeClass('is-invalid');
  });

  /* ============================================================
     NAVBAR COLLAPSE ON MOBILE LINK CLICK
     ============================================================ */
  $('.navbar-nav .nav-link').on('click', function () {
    var $toggler = $('.navbar-toggler');
    var $collapse = $('.navbar-collapse');
    if ($collapse.hasClass('show')) {
      $toggler.trigger('click');
    }
  });

  /* ============================================================
     CARD HOVER TILT (subtle)
     ============================================================ */
  $(document).on('mousemove', '.service-card', function (e) {
    var $card = $(this);
    var rect = this.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var xPercent = (x / rect.width  - 0.5) * 6;
    var yPercent = (y / rect.height - 0.5) * 6;
    $card.css('transform', 'translateY(-8px) rotateX(' + (-yPercent) + 'deg) rotateY(' + xPercent + 'deg)');
    $card.css('transition', 'box-shadow 0.1s, border 0.35s');
  });

  $(document).on('mouseleave', '.service-card', function () {
    $(this).css('transform', '').css('transition', 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)');
  });

});
