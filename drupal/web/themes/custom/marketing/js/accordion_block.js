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
