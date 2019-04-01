(function($) {
  $(function () {
    $('.navbar-toggler').click(function () {
      $('.navbar-block__mobile--overlay').toggleClass('js-navbar-block__mobile--show');
      $('.site-logo').toggleClass('js-logo-color');
      $('body').toggleClass('js-mobile-menu');
      $('.js-button--change').toggleClass('fa-bars fa-times');
    });

    $('.js-hidden').removeClass('js-hidden');

    $('.pricing-card__head').matchHeight({
      property: 'height'
    });
    $('.pricing-card__body').matchHeight({
      property: 'height'
    });
    $('.pricing-card__bottom').matchHeight({
      property: 'height'
    });
  })
})(jQuery);
