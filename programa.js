//http://leafo.net/sticky-kit/
$(document).ready(function() {
  var elementPosition = 0;
  var headerInitialHeight = 0;
 
  //Distancia que se deben empujar hacia abajo los items fijos
  var stickyOffset = 100;
  checkSize();

  /*$(window).resize(checkSize);*/
  $(window).scroll(updateHeight);

  updateHeight();

  function checkSize() {
    var navHeight = $("nav").outerHeight() - stickyOffset;
    //$("nav").outerHeight(navHeight + "px");
    elementPosition = $(".prog-header").offset();
    headerInitialHeight = $(".prog-header").outerHeight();
    
  }

  $(".program-component .prog-header").stick_in_parent({
    offset_top: stickyOffset,
    bottoming: false
  });

  $(".program-component nav").stick_in_parent({
    offset_top: $(".prog-header").outerHeight() + stickyOffset
    /*spacer: false*/
  });

  function updateHeight() {
    return;
    var height = $(".prog-header").outerHeight();

    if ($(window).scrollTop() > elementPosition.top - stickyOffset) {
      var st = $(this).scrollTop();

      //Calcula la nueva altura del header en base a la distancia scrolleada
      var newHeight =
        headerInitialHeight - (st - elementPosition.top + stickyOffset);
      var minHeight = parseInt(
        $(".prog-header")
          .css("min-height")
          .slice(0, -2)
      );

      if (newHeight <= minHeight) {
        //La nueva altura no puede ser menor que min-height
        newHeight = minHeight;
        $(".prog-header ").addClass("shrink");
      } else {
        $(".prog-header ").removeClass("shrink");
      }

      $(".prog-header").outerHeight(newHeight + "px");
    }
  }
});
