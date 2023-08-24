(function ($, Drupal) {
  Drupal.behaviors.calculatorBehavior = {
    attach: function (context, settings) {
      var hours = 2;
      var projects = 2;
      var pages = 10;
      var breakpoints = 3;
      var deployments = 2;
      var form = $('.counter-form:not(.processed)').once('processed');
      if (!form) {
        // The form is not found out it has been already processed.
        return;
      }
      var hoursInput = $('.hours', form);
      var textEl = $('.hours + label', form);

      function update() {
        hours = Math.ceil(projects * pages * breakpoints * deployments / 60);
        hoursInput.val(hours);
        if (hours == 1) {
          textEl.text('Hour a month');
        }
        else {
          textEl.text('Hours a month');
        }
      }

      $('.projects', form).change(function () {
        projects = $(this).val();
        update();
      });
      $('.pages', form).change(function () {
        pages = $(this).val();
        update();
      });
      $('.breakpoints', form).change(function () {
        breakpoints = $(this).val();
        update();
      });
      $('.deployments', form).change(function () {
        deployments = $(this).val();
        update();
      });
    }
  };
})(jQuery, Drupal);
