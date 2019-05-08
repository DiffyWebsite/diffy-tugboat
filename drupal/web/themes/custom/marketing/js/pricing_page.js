(function ($, Drupal) {
  Drupal.behaviors.pricingPageBehavior = {
    attach: function (context, settings) {
      var switchers = $('.price-period-switcher .switcher:not(.processed)').once('processed');
      if (switchers.length == 0) {
        return;
      }
      var $individualPricePlace = $('.indvidual-price-text');
      var $individualPriceDescription = $('.indvidual-price-description');
      var $agencyPricePlace = $('.agency-price-text');
      var $agencyPriceDescription = $('.agency-price-description');
      switchers.click(function() {
        var type = $(this).data('type');
        switchers.toggleClass('active');
        let prices = {
          individual: {
            price: '$ 50/mo',
            description: '(50¢ per page)',
          },
          agency: {
            price: '$ 150/mo',
            description: '(15¢ per page)'
          }
        };
        if (type == 'annual') {
          prices = {
            individual: {
              price: '$ 250/yr',
              description: '(21¢ per page)',
            },
            agency: {
              price: '$ 750/yr',
              description: '(4.2¢ per page)'
            }
          };
        }
        $individualPricePlace.text(prices.individual.price);
        $individualPriceDescription.text(prices.individual.description);
        $agencyPricePlace.text(prices.agency.price);
        $agencyPriceDescription.text(prices.agency.description);
      });
    }
  };
})(jQuery, Drupal);
