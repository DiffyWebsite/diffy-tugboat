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

      const $marketingIndividualMonthBtn = $('.marketing-individual-month-btn');
      const $marketingIndividualAnnualBtn = $('.marketing-individual-annual-btn');
      const $marketingAgencyMonthBtn = $('.marketing-agency-month-btn');
      const $marketingAgencyAnnualBtn = $('.marketing-agency-annual-btn');

      switchers.click(function() {
        var type = $(this).data('type');
        switchers.toggleClass('active');
        let prices = {
          individual: {
            price: '$50/mo',
            description: '(50¢ per page)',
          },
          agency: {
            price: '$150/mo',
            description: '(15¢ per page)'
          }
        };
        if (type == 'annual') {
          prices = {
            individual: {
              price: '$500/yr',
              description: '(41.6¢ per page)',
            },
            agency: {
              price: '$1500/yr',
              description: '(12.5¢ per page)'
            }
          };

          $marketingIndividualMonthBtn.addClass('marketing-hidden');
          $marketingIndividualAnnualBtn.removeClass('marketing-hidden');
          $marketingAgencyMonthBtn.addClass('marketing-hidden');
          $marketingAgencyAnnualBtn.removeClass('marketing-hidden');
        } else {
          $marketingIndividualMonthBtn.removeClass('marketing-hidden');
          $marketingIndividualAnnualBtn.addClass('marketing-hidden');
          $marketingAgencyMonthBtn.removeClass('marketing-hidden');
          $marketingAgencyAnnualBtn.addClass('marketing-hidden');
        }
        $individualPricePlace.text(prices.individual.price);
        $individualPriceDescription.text(prices.individual.description);
        $agencyPricePlace.text(prices.agency.price);
        $agencyPriceDescription.text(prices.agency.description);
      });
    }
  };
})(jQuery, Drupal);
