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
  var stickyElement = $(componentProps.stickyElementSelector);

  var items = $(".program-component .content .content-item");
  var contentItems = [];
  for (var i = 0; i < items.length; i++) {
    contentItems.push($(items[i]));
  }

  var menuItemsList = $(".menu-container .menu-item");
  var menuItemById = {};

  function initMenuItems() {
    for (var i = 0; i < menuItemsList.length; i++) {
      var menuItem = $(menuItemsList[i]);
      var dataId = menuItem.attr("data-target");
      menuItemById[dataId] = menuItem;
    }

    $(".menu-container .menu-item .item-name").click(onItemClickHandler);
    $(".menu-container .menu-item .sub-item").click(onItemClickHandler);

    function onItemClickHandler() {
      var dataId = $(this).attr("data-target");
      console.log("onItemClickHandler", dataId);
      var contentOffset = $(".content #" + dataId).offset();
      if (contentOffset) {
        $("html, body").animate(
          {
            scrollTop: contentOffset.top - stickyOffset - minHeight
          },
          500
        );
      }
    }
  }

  initMenuItems();
  init();
  initBackgroundColor();
  nav.addClass("transitions");
 


  $(".program-component .prog-media-container").click(function() {
    if ($(this).css("opacity") !== "0") {
      lity(componentProps.videoURL);
    }
  });

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

    toggleHeaderBtn.click(function() {
      open = !open;
      toggleHeader(open);
    });

    toggleNavbarBtn.click(function() {
      navbarOpen = !navbarOpen;
      toggleNavbar(navbarOpen);
    });

    function scrollListeners() {
      $(window).scroll(handleScroll);
      function handleScroll() {
        if (currentMode === "MOBILE") {
          //onScrollMobile();
        } else {
          onScrollDesktop();
        }
        updateActiveItem();
      }
    }
    scrollListeners();

    function updateActiveItem() {
      var activeItem = getActiveItem(
        $(window).scrollTop(),
        contentItems,
        stickyOffset + minHeight + 100
      );
      var dataId = activeItem.attr("id");
      if (menuItemById[dataId]) {
        var prevActive = $(".menu-container .menu-item.active").attr('data-target');
        if (prevActive !== dataId) { //Scroll a una nueva seccion
          console.log('active item changed');
          $('.navigation-menu .menu-toggle').addClass('animate');
          setTimeout(function(){
            $('.navigation-menu .menu-toggle').removeClass('animate');
          }, 500)
          
        }
        menuItemsList.removeClass("active");
        menuItemById[dataId].addClass("active");
      }
    }

    function getActiveItem(scrollTop, items, offset) {
      scrollTop += offset;
      var activeItem = items[0];

      for (var i = 1; i < items.length; i++) {
        var item = items[i];
        var distanceFromTop = item.offset().top;
        if (distanceFromTop <= scrollTop) {
          activeItem = item;
        } else {
          break;
        }
      }

      return activeItem;
    }

    function onScrollDesktop() {
      updateHeaderHeight();
    }
    /*
    function onScrollMobile() {
      if ($(".program-component .prog-header").css("position") == "fixed") {
        toggleHeaderBtn.show();
      } else {
        toggleHeaderBtn.hide();
      }
    }*/

    function onWindowResize() {
      shrinked = false;
      $(window).off("scroll");
      header.trigger("sticky_kit:detach");
      nav.trigger("sticky_kit:detach");

      var newMode = $("#mobile-indicator").is(":visible")
        ? "MOBILE"
        : "DESKTOP";

      checkSize(newMode);
      nav.outerHeight(navHeight + "px");

      if (newMode === "DESKTOP") {
        //Cambio a DESKTOP
        header.stick_in_parent({
          offset_top: offsetHeader,
          recalc_every: null //newMode === 'DESKTOP' ? null : null
        });
        disableMobile();

        nav.stick_in_parent({
          offset_top: offsetNavbar
        });
      } else {
        console.log("here");
        nav.css("position", "fixed");
        nav.css("top", offsetNavbar);
      }

      scrollListeners();

      if (newMode === "MOBILE") {
        //Cambio a MOBILE //newMode !== currentMode  &&
        navbarOpen = false;
        open = false;

        toggleNavbar(false);

        setTimeout(function() {
          if (
            $(".program-component .prog-header").css("position") === "fixed"
          ) {
            toggleHeaderBtn.show();
          }
        }, 0);
      }
      currentMode = newMode;

      if (currentMode === "DESKTOP") {
        updateHeaderHeight();
      }
      setTimeout(function() {
        $(document.body).trigger("sticky_kit:recalc");
      });
      updateActiveItem();
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
          setTimeout(function() {
            $(document.body).trigger("sticky_kit:recalc");
          }, 0);

          console.log("recalc");
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
      header.css("max-height", "auto");
      header.css("height", "auto");
      navHeight = $(window).height() - stickyOffset;
      offsetNavbar = stickyOffset;
      programComponent.css("padding-top", "");
      minHeight = 0;
      /*
      minHeight =
        $(".content-wrapper .prof-title").outerHeight() +
        $(".prog-header .toggle-header-mobile").outerHeight();
      header.css("min-height", minHeight + "px");

      header.css("max-height", "calc(100vh - " + stickyOffset + "px)");
      programComponent.css("padding-top", "");
      
      */
    } else {
      //DESKTOP
      //La altura minima se ajusta a la cantidad de texto del titulo
      minHeight =
        $(".content-wrapper .prof-title").outerHeight() +
        $(".prog-header .prog-data").outerHeight();
      //Si la altura maxima del header (configurada en css) es mayor al alto
      //viewport, esta se reajusta
      header.css("min-height", minHeight + "px");
      header.css("max-height", "calc(100vh - " + stickyOffset + "px)");
      var calculatedMax = parseInt(header.css("max-height").slice(0, -2));
      header.css("max-height", "");
      var cssMaxHeight = parseInt(header.css("max-height").slice(0, -2));
      if (calculatedMax <= cssMaxHeight) {
        //Altura de css sobrepasa el alto de viewport
        header.css("max-height", calculatedMax + "px");
        programComponent.css("padding-top", calculatedMax + "px");
      }
      navHeight = $(window).height() - minHeight - stickyOffset;
      offsetNavbar = stickyOffset + minHeight;
    }

    maxHeight = parseInt(header.css("max-height").slice(0, -2));
  }

  function disableMobile() {
    $(toggleHeaderBtn).hide();
    $("body").css("overflow", "auto");
    header.css("max-height", "");
    nav.removeClass("closed");
    header.css("position", "");
    //$(".program-component .prog-header .content-wrapper").scrollTop(0);
  }

  function toggleNavbar(open) {
    if (!open) {
      header.addClass("nav-closed");
      nav.addClass("closed");
    } else {
      nav.removeClass("closed");
      header.removeClass("nav-closed");
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

  function initBackgroundColor() {
     
    $.adaptiveBackground.run({
      parent: "header",
      success: function($img, data) {
        
        //console.log("Success!", $img, data);
       var rgbColor = data.color.slice(4, -1).split(',');
       //Usa como color de fuente el color mas lejano (negro o blanco) 
       //del color dominate de la imagen
       var contrast = getFurthestColor(rgbColor, [[255, 255, 255], [0, 0, 0]]);
       contrast = 'rgb('+ contrast.join() +')';
       
       $(".prog-media-container .video-icon, .program-component .prog-header, .prog-data .data-item")
        .css("color", contrast );
        $('.prog-data .data-item').css("border-color", contrast );
        $(".bottom-gradient").css(
          "background-image",
          "linear-gradient( to bottom, rgba(255, 255, 255, 0), " + data.color
        );
  
        $(".left-gradient").css(
          "background-image",
          "linear-gradient( to left, rgba(255, 255, 255, 0), " + data.color
        );
      }
    });
  }
  /**
   * Retorna el color que este mas lejano de baseColor usando
   * https://en.wikipedia.org/wiki/Color_difference
   */
  function getFurthestColor(color, colors) {
     var r1 = color[0];
     var g1= color[1];
     var b1 = color[2];
     var max = Number.MIN_VALUE;
     var furthestColor = color;
     colors.forEach(function(c) {
       var r2 = c[0];
       var g2 = c[1];
       var b2 = c[2];
       var distance = Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2);
       if (distance > max) {
         max = distance;
         furthestColor = c;
       }
     });
     return furthestColor;
    //.slice(4, -1).split(',')
  }

});
