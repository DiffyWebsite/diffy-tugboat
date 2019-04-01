$(function() {
  let hours = 2;
  let projects = 2;
  let pages = 20;
  let breakpoints = 3;
  let deployments = 1;
  const form = $('.counter-form');
  const hoursInput = $('.hours', form)

  function update() {
    hours = projects * pages * breakpoints * deployments / 2;
    console.log(hours);
    hoursInput.val(hours)
  }
  $('.projects', form).change(function() {
    projects = $(this).val();
    update();
  });
  $('.pages', form).change(function() {
    pages = $(this).val();
    update();
  });
  $('.breakpoints', form).change(function() {
    breakpoints = $(this).val();
    update();
  });
  $('.deployments', form).change(function() {
    deployments = $(this).val();
    update();
  });
});
