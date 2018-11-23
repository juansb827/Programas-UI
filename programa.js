
//http://leafo.net/sticky-kit/
$(document).ready(function() {
  var elementPosition = 0; //Posición inicial del
  var maxHeight = 0;
  var minHeight = 0;
  var navHeight = 0;
  var stickyOffset = 0; //Distancia que se deben empujar hacia abajo los items fijos
  var currentMode = "DESKTOP";
  var shrinked = false;

  var programComponent = $('.program-component')
  var header = $(".program-component .prog-header");
  var nav = $(".program-component nav");
  var stickyElement =  $('.mock-sticky');

  
  init();
  //elementPosition = $(".prog-header").offset();

  //initJS();
  //listenForModeChange();

  function init() {
    elementPosition = $(".prog-header").offset();
    checkSize();
    onWindowResize();
    $(window).resize(onWindowResize);
    
    updateHeaderHeightV2();
    $(window).scroll(updateHeaderHeightV2);

    function onWindowResize() {   
      shrinked = false;
      checkSize();
      
      $(".program-component nav").trigger("sticky_kit:detach");
      $(".program-component .prog-header").trigger("sticky_kit:detach");

      $(".program-component nav").outerHeight(navHeight + "px");
      $(".program-component .prog-header").stick_in_parent({
        offset_top: stickyOffset
      });

      $(".program-component nav").stick_in_parent({
        offset_top: minHeight + stickyOffset
      }); 
     
    }

    function updateHeaderHeightV2() {
      var st = $(window).scrollTop();
      var newHeight = calculateHeight(
        maxHeight,
        minHeight,
        elementPosition,
        st,
        stickyOffset
      );
  
      if (newHeight === minHeight) {
        $(".prog-header ").addClass("shrinked");
        if (!shrinked) {
          shrinked = true;         
        }
      } else {
        
        $(".prog-header ").removeClass("shrinked");
      }
  
      $(".prog-header").outerHeight(newHeight + "px");
      /*programComponent.css('padding-top', newHeight + "px"); */

      if(shrinked === true){
        $(document.body).trigger("sticky_kit:recalc");
        shrinked = false;
      }
      
    }
  }

 

  function listenForModeChange() {
    $(window).resize(function() {
      var newMode = $("#mobile-indicator").is(":visible")
        ? "MOBILE"
        : "DESKTOP";
      if (newMode !== currentMode) {
        switchMode(newMode);
      }
    });
  }

  function initJS() {
    var mode = $("#mobile-indicator").is(":visible") ? "MOBILE" : "DESKTOP";
    switchMode(mode);

   

  }

  function switchMode(newMode) {
    console.log("Switchted to", newMode);
    currentMode = newMode;
    checkSize(currentMode);
    //Remueve todos los listeners que el modo anterior pudo haber agregado
    $(".program-component .prog-header").trigger("sticky_kit:detach");
    $("nav").trigger("sticky_kit:detach");
    $(window)
      .off("resize")
      .off("scroll");
    $(".program-component .toggle-header-mobile").off("click");
    $("body").css("overflow", "auto");
    if (currentMode === "MOBILE") {
      initMobile();
    } else {
      $("nav").outerHeight(navHeight + "px");
      initDesktop();
    }
    listenForModeChange(); //
  }

  function checkSize(mode) {
    if (mode === "MOBILE") {
      //En mobile ocupa toda la pantalla
      maxHeight = $(window).height() - stickyOffset;
    } else {
      //En Desktop Segun el Css
      maxHeight = parseInt(
        header
          .css("max-height")
          .slice(0, -2)
      );
    }

    minHeight = parseInt(
      header
        .css("min-height")
        .slice(0, -2)
    );

    stickyOffset =  stickyElement[0].offsetTop  + stickyElement.outerHeight();
    navHeight = $(window).height() - minHeight - stickyOffset;
  }

  function initDesktop() {
    $("nav").stick_in_parent({
      offset_top: minHeight + stickyOffset
    });

    $(window).resize(function() {
      clearTimeout($.data(this, "resizeTimer"));

      $.data(
        this,
        "resizeTimer",
        setTimeout(function() {
          if (currentMode !== "DESKTOP") return;
          //Ajuste el navbar cuando el tamaño de pantalla cambia
          checkSize(currentMode);
          $(".program-component nav").outerHeight(navHeight + "px");
          $(".program-component nav").trigger("sticky_kit:detach");
          $(".program-component .prog-header").trigger("sticky_kit:detach");

          $(".program-component nav").stick_in_parent({
            offset_top: minHeight + stickyOffset
          });

          $(".program-component .prog-header").stick_in_parent({
            offset_top: stickyOffset
            //bottoming: false
          });

          updateHeaderHeight();
        }, 250)
      );
    });

    updateHeaderHeight();
    $(window).scroll(updateHeaderHeight);
    $(".program-component .prog-header").stick_in_parent({
      offset_top: stickyOffset

      //bottoming: false
    });

    function updateHeaderHeight() {
      var st = $(window).scrollTop();
      var newHeight = calculateHeight(
        maxHeight,
        minHeight,
        elementPosition,
        st,
        stickyOffset
      );

      if (newHeight === minHeight) {
        $(".prog-header ").addClass("shrinked");
      } else {
        $(".prog-header ").removeClass("shrinked");
      }

      $(".prog-header").outerHeight(newHeight + "px");
    }

   
  }

  function initMobile() {
    var open = true;
    $(window).resize(function() {
      // checkSize(currentMode);
    });

    checkSize(currentMode);
    toggleHeader();
    var toggleHeaderBtn = $(".program-component .toggle-header-mobile");
    $(".program-component .prog-header")
      .stick_in_parent({
        offset_top: stickyOffset,
        recalc_every: 10
      })
      .on("sticky_kit:stick", function(e) {
        toggleHeaderBtn.show();
      })
      .on("sticky_kit:unstick", function(e) {
        toggleHeaderBtn.hide();
      })
      .on("sticky_kit:bottom", function(e) {
        toggleHeaderBtn.hide();
      });

    toggleHeaderBtn.click(toggleHeader);

    function toggleHeader() {
      open = !open;

      if (!open) {
        $(".program-component .prog-header .content-wrapper").scrollTop(0);
        $(".prog-header")
          .outerHeight(minHeight)
          .addClass("shrinked");
        $("body").css("overflow", "auto");
      } else {
        $(".prog-header")
          .outerHeight(maxHeight)
          .removeClass("shrinked");
        $("body").css("overflow", "hidden");
      }
    }
  }
});


function calculateHeight(
  initialHeight,
  minHeight,
  position,
  scrollTop,
  stickyOffset
) {
  if (scrollTop > position.top - stickyOffset) {
    //Calcula la nueva altura en funcion de la distancia scrolleada despues de su posicion inicial
    var newHeight =
      initialHeight - (scrollTop - position.top + stickyOffset);

    if (newHeight <= minHeight) {
      return minHeight;
    }

    return newHeight;
  }

  return initialHeight;
}
