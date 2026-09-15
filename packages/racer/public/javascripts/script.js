$(function () {
  /* Prevent scrolling with arrow and page keys, but never swallow keys that
     belong to the nickname field - w/a/s/d would drive the car while typing */
  var ar = new Array(33, 34, 35, 36, 37, 38, 39, 40);
  $(document).keydown(function (e) {
    if ($(e.target).is('input, textarea')) {
      return true;
    }
    var key = e.which;
    if ($.inArray(key, ar) > -1) {
      e.preventDefault();
      return false;
    }
    return true;
  });

  /* Defer until Dom.ready, otherwise the form will not be there yet */
  $('#startform').on('submit', function (event) {
    event.preventDefault();
    startRace($('#nickname').val());
    return false;
  });
});
