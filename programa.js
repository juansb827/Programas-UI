//http://leafo.net/sticky-kit/
$(document).ready(function() {

  var elementPosition = 0; //Posición inicial del
  var maxHeight = 0;
  var minHeight = 0;
  var navHeight = 0;
  var stickyOffset = 0; //Distancia que se deben empujar hacia abajo los items fijos
  var offsetHeader = 0;
  var offsetNavbar = 0;
  var currentMode = "";
  var shrinked = false;
  var open = true;  
  var navbarOpen = true; 
    

  var programComponent = $(".program-component");
  var header = $(".program-component .prog-header");
  var toggleNavbarBtn = $(".program-component .toggle-sidedrawer");
  var toggleHeaderBtn = $(".program-component .toggle-header-mobile");
  var nav = $(".program-component nav");
  var stickyElement = $(".mock-sticky");

  
  init();
     setTimeout(()=>{
        $(document.body).trigger("sticky_kit:recalc");
      })
  nav.addClass('transitions');
 

  function init() {
    onWindowResize();

    $(window).resize(function() {
      clearTimeout($.data(this, "resizeTimer"));
      $.data(
        this,
        "resizeTimer",
        setTimeout(function() {
          onWindowResize();
        }, 250)
      );
    });

    toggleHeaderBtn.click(function () {
      open = !open;
      toggleHeader(open);
      
    });

    toggleNavbarBtn.click(function () {
      navbarOpen = !navbarOpen;
      toggleNavbar(navbarOpen);
    })

    function scrollListeners(){
      $(window).scroll(function() {
        console.log('CURRENT', currentMode);
        if (currentMode === "MOBILE") {
          onScrollMobile();
        } else {
          onScrollDesktop();
        }
      });
    }
    scrollListeners();
    

    function onScrollDesktop() {
      updateHeaderHeight();      
    }

    function onScrollMobile() {      
      if ($(".program-component .prog-header").css("position") == "fixed") {
        toggleHeaderBtn.show();
      } else {
        toggleHeaderBtn.hide();
      }
    }

    function onWindowResize() {
      shrinked = false;
      $(window).off('scroll');
      header.trigger("sticky_kit:detach");
      nav.trigger("sticky_kit:detach");
        
      
      var newMode = $("#mobile-indicator").is(":visible")
        ? "MOBILE"
        : "DESKTOP";

      

      checkSize(newMode);
      nav.outerHeight(navHeight + "px");
      
      header.stick_in_parent({
        offset_top: offsetHeader,
        recalc_every: null//newMode === 'DESKTOP' ? null : null
      });
      
      if ( newMode === 'DESKTOP') { //Cambio a DESKTOP
        disableMobile();         
      }
      
      if (newMode === 'DESKTOP') { // newMode !== currentMode && 
        nav.stick_in_parent({
          offset_top: offsetNavbar
        });
      } else {
        //nav.css('fixed', offsetNavbar + 'px');
      }

      
      scrollListeners();

      if ( newMode === 'MOBILE') { //Cambio a MOBILE //newMode !== currentMode  &&
          navbarOpen = false;
          open = false;
          toggleHeader(false);  
          toggleNavbar(false);  
          nav.trigger("sticky_kit:detach");
          nav.css('position', 'fixed');
          nav.css('top', offsetNavbar);
          setTimeout(() => {
            $(document.body).trigger("sticky_kit:recalc");
            if (
              $(".program-component .prog-header").css("position") === "fixed"
            ) {
              toggleHeaderBtn.show();
            }
          }, 0);
        
      }
      currentMode = newMode;
      
      if (currentMode === 'DESKTOP') {        
        updateHeaderHeight();
        
      }
      $(document.body).trigger("sticky_kit:recalc");
      
    }

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
        header.addClass("shrinked");
        
        if (!shrinked) {
          shrinked = true;
         setTimeout(()=>{
          $(document.body).trigger("sticky_kit:recalc");  
         }, 0);
         
          console.log('recalc');
        }
      } else {
        
        header.removeClass("shrinked");
      }

      header.outerHeight(newHeight + "px");
      /*programComponent.css('padding-top', newHeight + "px"); */

     
    }

   
  }



  function checkSize(mode) {
    stickyOffset = stickyElement[0].offsetTop + stickyElement.outerHeight();
    elementPosition = header.offset();
    offsetHeader = stickyOffset;
    minHeight = parseInt(header.css("min-height").slice(0, -2));
    if (mode === "MOBILE") {
      //En mobile ignora el CSS
      header.css("max-height", "calc(100vh - " + stickyOffset + "px)");      
      navHeight = $(window).height() - stickyOffset;
      offsetNavbar = stickyOffset;
    } else {
      //Elimina el style max-height que se pudo haber colocado en mobile
      //para que tome el max-height que esta en CSS
      header.css("max-height", "");
      navHeight = $(window).height() - minHeight - stickyOffset;
      offsetNavbar = stickyOffset + minHeight;
    }

    maxHeight = parseInt(header.css("max-height").slice(0, -2));   

  }


  function disableMobile() {
    $(toggleHeaderBtn).hide();
    $("body").css("overflow", "auto");
    header.css("max-height", "");
    nav.removeClass('closed');
    header.css("position", "");
    $(".program-component .prog-header .content-wrapper").scrollTop(0);
  }

  function toggleNavbar(open) { 
    if (!open) {
      nav.addClass('closed')
    }else{
      nav.removeClass('closed')
    }       
  }     

  function toggleHeader(open) {      

    if (!open) {
      $(".program-component .prog-header .content-wrapper").scrollTop(0);
      $(".prog-header")
        .outerHeight(minHeight)
        .addClass("shrinked");
      $("body").css("overflow", "auto");
    } else {
      $(".prog-header")
        .css("height", "calc(100vh - " + stickyOffset + "px)")
        .removeClass("shrinked");
      $("body").css("overflow", "hidden");
    }
  }

  function calculateHeight(
    initialHeight,
    minHeight,
    position,
    scrollTop,
    stickyOffset
  ) {
    if (scrollTop > position.top - stickyOffset) {
      //Calcula la nueva altura en funcion de la distancia scrolleada despues de su posicion inicial
      var newHeight = initialHeight - (scrollTop - position.top + stickyOffset);
  
      if (newHeight <= minHeight) {
        return minHeight;
      }
  
      return newHeight;
    }
  
    return initialHeight;
  }

  
});

