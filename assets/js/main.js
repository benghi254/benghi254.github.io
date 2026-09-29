/**
 * Wauga Elvis - Artistic & Futuristic Portfolio Script
 * Interactive WebGL/Canvas, Custom Cyber Cursor, 3D Card Parallax & Magnetic Dynamics
 */
!(function($) {
  "use strict";

  // --------------------------------------------------------------
  // 1. Interactive Ambient Canvas (Mouse Reactive Particles & WebGL-style Mesh)
  // --------------------------------------------------------------
  function initArtisticCanvas() {
    var canvas = document.getElementById('artistic-bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    
    var width, height;
    var particles = [];
    var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, radius: 220 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Update CSS Variables for ambient lighting
      document.documentElement.style.setProperty('--mx', e.clientX + 'px');
      document.documentElement.style.setProperty('--my', e.clientY + 'px');
    });

    // Particle Constructor
    function Particle() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 255, 65, ' : 'rgba(255, 54, 0, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive force
      var dx = mouse.x - this.x;
      var dy = mouse.y - this.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        var force = (mouse.radius - dist) / mouse.radius;
        var angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 3;
        this.y -= Math.sin(angle) * force * 3;
      }
    };

    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color.includes('255, 54') ? '#ff3600' : '#00ff41';
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // Spawn Particles
    var count = Math.min(Math.floor(window.innerWidth / 15), 70);
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (var a = 0; a < particles.length; a++) {
        particles[a].update();
        particles[a].draw();

        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            var opacity = (1 - dist / 130) * 0.25;
            ctx.strokeStyle = particles[a].color.includes('255, 54') 
              ? 'rgba(255, 54, 0, ' + opacity + ')' 
              : 'rgba(0, 255, 65, ' + opacity + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // --------------------------------------------------------------
  // 2. Custom Cyber Dual Cursor Interpolation
  // --------------------------------------------------------------
  function initCyberCursor() {
    var cursor = document.getElementById('cyber-cursor');
    var follower = document.getElementById('cyber-cursor-follower');
    if (!cursor || !follower) return;

    var posX = 0, posY = 0;
    var mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function renderFollower() {
      posX += (mouseX - posX) * 0.18;
      posY += (mouseY - posY) * 0.18;

      follower.style.left = posX + 'px';
      follower.style.top = posY + 'px';

      requestAnimationFrame(renderFollower);
    }
    renderFollower();

    // Hover state triggers
    var hoverTargets = 'a, button, .art-card, .project-card, .map-card, .skill-chip, .achievement-tile, .info-pill, .timeline-content';
    $(document).on('mouseenter', hoverTargets, function() {
      $('body').addClass('cursor-hover');
    }).on('mouseleave', hoverTargets, function() {
      $('body').removeClass('cursor-hover');
    });
  }

  // --------------------------------------------------------------
  // 3. 3D Card Parallax & Dynamic Light Spotlight
  // --------------------------------------------------------------
  function init3DTiltCards() {
    var cards = document.querySelectorAll('.art-card, .project-card, .map-card, .achievement-tile, .skill-category-card, .timeline-content');

    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
        card.style.setProperty('--card-mx', x + 'px');
        card.style.setProperty('--card-my', y + 'px');
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // --------------------------------------------------------------
  // 4. Magnetic Buttons Effect
  // --------------------------------------------------------------
  function initMagneticButtons() {
    var buttons = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary, .social-links a');

    buttons.forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });

      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // --------------------------------------------------------------
  // 5. Header Scroll & Navigation Smooth Scroll
  // --------------------------------------------------------------
  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  $(document).on('click', '.nav-menu a, .mobile-nav a, .btn-scroll', function(e) {
    var href = $(this).attr('href');
    if (href && href.startsWith('#')) {
      var target = $(href);
      if (target.length) {
        e.preventDefault();

        var scrollPos = target.offset().top - 70;
        $('html, body').stop().animate({
          scrollTop: scrollPos
        }, 600, 'easeInOutExpo');

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('bx-menu bx-x');
        }

        return false;
      }
    }
  });

  // Scrollspy
  $(window).on('scroll load', function() {
    var cur_pos = $(this).scrollTop() + 90;
    var sections = $('section');
    var nav = $('.nav-menu, .mobile-nav');

    sections.each(function() {
      var top = $(this).offset().top,
          bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        nav.find('li').removeClass('active');
        nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
    });

    if ($(this).scrollTop() < 150) {
      nav.find('li').removeClass('active');
      nav.find('a[href="#hero"]').parent('li').addClass('active');
    }
  });

  // Mobile Navigation toggle
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="bx bx-menu"></i></button>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('bx-menu bx-x');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('bx-menu bx-x');
        }
      }
    });
  }

  // --------------------------------------------------------------
  // 6. Portfolio Isotope & Venobox Gallery
  // --------------------------------------------------------------
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

    $('.venobox').venobox();
  });

  // --------------------------------------------------------------
  // 7. Initialization on DOM Ready
  // --------------------------------------------------------------
  $(document).ready(function() {
    initArtisticCanvas();
    initCyberCursor();
    init3DTiltCards();
    initMagneticButtons();
  });

})(jQuery);