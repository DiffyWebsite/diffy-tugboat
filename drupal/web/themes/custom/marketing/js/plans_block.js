(function ($, Drupal) {
  Drupal.behaviors.plansBlockBehavior = {
    attach: function (context, settings) {
      var switchers = $('.price-period-switcher .switcher:not(.processed)').once('processed');
      if (switchers.length == 0) {
        return;
      }
      var switcherAnnual = $('.price-period-switcher .switcher.annual');
      var switcherMonthly = $('.price-period-switcher .switcher.monthly');
      var checkSwitcher = $('.price-period-switcher #check-switcher');
      var $individualPricePlace = $('.individual-price-text');
      var $individualPriceDescription = $('.individual-price-description');
      var $agencyPricePlace = $('.agency-price-text');
      var $agencyPriceDescription = $('.agency-price-description');
      var $enterprisePricePlace = $('.enterprise-price-text');
      var $enterprisePriceDescription = $('.enterprise-price-description');

      // price data
      var $individual_billedAnnuallyPrice = $('.pricing-card--individual .billed-annually-price').text();
      var $individual_billedMonthPrice = $('.pricing-card--individual .billed-month-price').text();
      var $agency_billedAnnuallyPrice = $('.pricing-card--agency .billed-annually-price').text();
      var $agency_billedMonthPrice = $('.pricing-card--agency .billed-month-price').text();
      var $enterprise_billedAnnuallyPrice = $('.pricing-card--enterprise .billed-annually-price').text();
      var $enterprise_billedMonthPrice = $('.pricing-card--enterprise .billed-month-price').text();

      // buttons
      const $marketingIndividualMonthBtn = $('.marketing-individual-month-btn');
      const $marketingIndividualAnnualBtn = $('.marketing-individual-annual-btn');
      const $marketingAgencyMonthBtn = $('.marketing-agency-month-btn');
      const $marketingAgencyAnnualBtn = $('.marketing-agency-annual-btn');
      const $marketingEnterpriseMonthBtn = $('.marketing-enterprise-month-btn');
      const $marketingEnterpriseAnnualBtn = $('.marketing-enterprise-annual-btn');

      checkSwitcher.click(function(){
        if ($(this).is(':checked')){
          switcherMonthly.trigger('click');
        } else {
          switcherAnnual.trigger('click');
        }
      });

      switchers.click(function() {
        var type = $(this).data('type');
        switcherAnnual.removeClass('active');
        switcherMonthly.addClass('active');
        checkSwitcher.prop('checked', true);
        let prices = {
          individual: {
            price: $individual_billedMonthPrice,
            description: 'billed month-to-month',
          },
          agency: {
            price: $agency_billedMonthPrice,
            description: 'billed month-to-month'
          },
          enterprise: {
            price: $enterprise_billedMonthPrice,
            description: 'billed month-to-month'
          }
        };
        if (type == 'annual') {
          switcherAnnual.addClass('active');
          switcherMonthly.removeClass('active');
          checkSwitcher.prop('checked', false);
          prices = {
            individual: {
              price: $individual_billedAnnuallyPrice,
              description: 'billed annually',
            },
            agency: {
              price: $agency_billedAnnuallyPrice,
              description: 'billed annually'
            },
            enterprise: {
              price: $enterprise_billedAnnuallyPrice,
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
