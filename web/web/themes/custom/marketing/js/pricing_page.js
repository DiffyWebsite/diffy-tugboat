(function ($, Drupal) {
  Drupal.behaviors.pricingPageBehavior = {
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
            price: '$79',
            description: 'billed month-to-month',
          },
          agency: {
            price: '$239',
            description: 'billed month-to-month'
          },
          enterprise: {
            price: '$949',
            description: 'billed month-to-month'
          }
        };
        if (type == 'annual') {
          switcherAnnual.addClass('active');
          switcherMonthly.removeClass('active');
          checkSwitcher.prop('checked', false);
          prices = {
            individual: {
              price: '$59',
              description: 'billed annually',
            },
            agency: {
              price: '$179',
              description: 'billed annually'
            },
            enterprise: {
              price: '$749',
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

// Accordion Block
(function ($, Drupal) {
  Drupal.behaviors.accordionBlockBehavior = {
    attach: function (context, settings) {

      const accordionTriggers = document.querySelectorAll('.accordion__trigger');
      const accordionContent = document.querySelector('.accordion__content');

      if (accordionTriggers.length || accordionContent.length) {
        accordionTriggers.forEach((trigger) => {
          trigger.addEventListener('click', (e) => {
            if (trigger.parentElement.classList.contains('accordion__item_active')) {
              trigger.nextElementSibling.style.height = '';
              trigger.parentElement.classList.remove('accordion__item_active');
            } else {
              accordionTriggers.forEach((item) => {
                item.parentElement.classList.remove('accordion__item_active');
                item.nextElementSibling.style.height = '';
                trigger.nextElementSibling.style.height = (trigger.nextElementSibling.scrollHeight + 20 ) + 'px';
                trigger.parentElement.classList.add('accordion__item_active');
              });
            }
          });
        });
      }

    }
  };
})(jQuery, Drupal);
