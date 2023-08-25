(function ($, Drupal) {
  Drupal.behaviors.diffyTryLoadWait = {
    attach: function (context, settings) {

      $('#diffy-try--carousel').carousel({
        interval: false
      });

      $('body').once('diffyTryLoadWait').each(function () {
        let interval = setInterval(checkResults, 5000);
        function checkResults() {
          let url = window.location.href.replace('/try/', '/try-load/');
          $.get(url, function (data) {
            if (data[640].indexOf('progress-text') == -1
              && data[1024].indexOf('progress-text') == -1
              && data[1200].indexOf('progress-text') == -1) {
              clearInterval(interval);
            }

            $('#carousel-item-640').html(data[640]);
            $('#carousel-item-1024').html(data[1024]);
            $('#carousel-item-1200').html(data[1200]);

          });
        }
      });
    }
  };
})(jQuery, Drupal);
