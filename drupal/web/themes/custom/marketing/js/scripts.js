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

// If there are any utm_* tags available -- pass them to the app as well.
(function ($, Drupal) {

  'use strict';

  /**
   * Check if there are any links to app.diffy.website and bypass all utm tags.
   */
  Drupal.behaviors.diffyUTMs = {
    attach: function (context, settings) {
      var currentUrl = document.location.toString();
      if (currentUrl.indexOf('?') !== -1 && currentUrl.indexOf('utm_') !== -1) {
        var getParameters = currentUrl.substr(currentUrl.indexOf('?'));
        $(context).find('a[href*="app.diffy.website"]').once('diffyUTMs').each(function(){
          var href = $(this).attr('href');
          href = href + getParameters;
          $(this).attr('href', href);
        });
        $(context).find('a[href^="/"]').once('diffyUTMs').each(function(){
          var href = $(this).attr('href');
          href = href + getParameters;
          $(this).attr('href', href);
        });
      }

    }
  };

})(jQuery, Drupal);
