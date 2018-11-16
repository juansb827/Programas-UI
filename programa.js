$(document).ready(function() {
  var elementPosition = 0;
  var headerInitialHeight = 0;
  var contentEnd = 0;

  checkSize();

  /*$(window).resize(checkSize);*/
  $(window).scroll(updateHeight);

  updateHeight();

  function checkSize() {
    elementPosition = $(".prog-header").offset();
    headerInitialHeight = $(".prog-header").outerHeight();
    contentEnd = $(".content").offset().top + $(".content").outerHeight();

  }

  /**
   * Calcula porcentaje de avanze en un rango
   *  e.g  en un rango [2,4]
   *    3 estaria al 50%
   *    4 100%
   *    2 0%
   */
  function calcPercentage(init, end, current) {
    var diff = end - init;
    current = current - init;
    if (current <= 0) {
      //Evita que se retornen valores <= 0
      return 0;
    }
    return Math.min(current / diff, 1);
  }

  function updateHeight() {
    var height = $(".prog-header").outerHeight();
    
    if ($(window).scrollTop() > elementPosition.top) {
      $(".prog-header")
        .css("position", "fixed")
        .css("top", "0");

      var st = $(this).scrollTop();
      var newHeight = headerInitialHeight - (st - elementPosition.top);
      var minHeight = $(".prog-header")
        .css("min-height")
        .slice(0, -2);

      if (newHeight <= minHeight) {
        newHeight = minHeight;

        $(".prog-header ").addClass("shrink");
      } else {
        $(".prog-header ").removeClass("shrink");
      }

      $(".prog-header").outerHeight(newHeight + "px");

      $("nav")
        .css("position", "fixed")
        .css("top", newHeight + "px");
    } else {
      $(".prog-header").css("position", "absolute");

      $("nav")
        .css("position", "absolute")
        .css("top", height + "px");
    }
  }

  $("#target").click(function() {
    alert("Handler for .click() called.");
  });
});
