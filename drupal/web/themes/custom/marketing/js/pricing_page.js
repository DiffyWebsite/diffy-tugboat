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
      var $enterprisePricePlace = $('.enterprise-price-text');
      var $enterprisePriceDescription = $('.enterprise-price-description');

      const $marketingIndividualMonthBtn = $('.marketing-individual-month-btn');
      const $marketingIndividualAnnualBtn = $('.marketing-individual-annual-btn');
      const $marketingAgencyMonthBtn = $('.marketing-agency-month-btn');
      const $marketingAgencyAnnualBtn = $('.marketing-agency-annual-btn');
      const $marketingEnterpriseMonthBtn = $('.marketing-enterprise-month-btn');
      const $marketingEnterpriseAnnualBtn = $('.marketing-enterprise-annual-btn');

      switchers.click(function() {
        var type = $(this).data('type');
        switchers.toggleClass('active');
        let prices = {
          individual: {
            price: '$78',
            description: 'billed month-to-month',
          },
          agency: {
            price: '$241',
            description: 'billed month-to-month'
          },
          enterprise: {
            price: '$953',
            description: 'billed month-to-month'
          }
        };
        if (type == 'annual') {
          prices = {
            individual: {
              price: '$64',
              description: 'billed annually',
            },
            agency: {
              price: '$190',
              description: 'billed annually'
            },
            enterprise: {
              price: '$784',
              description: 'billed annually'
            }
          };
        }
        $individualPricePlace.text(prices.individual.price);
        $individualPriceDescription.text(prices.individual.description);
        $agencyPricePlace.text(prices.agency.price);
        $agencyPriceDescription.text(prices.agency.description);
        $enterprisePricePlace.text(prices.enterprise.price);
        $enterprisePriceDescription.text(prices.enterprise.description);
      });
    }
  };
})(jQuery, Drupal);
