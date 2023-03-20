(function ($, Drupal) {
  Drupal.behaviors.diffyTryLoadWait = {
    attach: function (context, settings) {
      $('body').once('diffyTryLoadWait').each(function () {
        let interval = setInterval(checkResults, 5000);
        function checkResults() {
          let url = window.location.href.replace('/try/', '/try-load/');
          $.get(url, function (data) {
            if (data.length == 3) {
              clearInterval(interval);
              $('#diffy-try-text p.progress-text').toggleClass('hidden');
              $('#diffy-try-text p.completed-text').toggleClass('hidden');
              $('.screenshots--wrap').addClass('completed-screen');
              $('.screenshots--wrap').removeClass('progress-screen');
            }

            $('#diffy-try-results').html(data.join(''));
          });
        }
      });
    }
  };
})(jQuery, Drupal);
