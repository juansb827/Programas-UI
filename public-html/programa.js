$(document).ready(function() {
  /**
   * Variables del estado de la UI,
   * se usan para determinar los efectos visuales
   * se calculan cuando el componente se inicializa y tambien cada vez que el tamaño de pantalla cambia
   *  */
  var elementPosition = 0; //Posición inicial del
  var maxHeight = 0;
  var minHeight = 0;
  var navHeight = 0;

  //Corrimiento del efecto "sticky", es necesario para que el header de este componente no
  //cubra los elementos fijos de la página (e.g header uniandes)
  var stickyOffset = 0;
  //Distancia despues de la cual el MenuLateral se vuelve Fijo
  var offsetNavbar = 0;
  //Modo Actual, Desktop o Mobile
  var currentMode = "";
  //Si el header esta a su altura minima
  var shrinked = false;
  //Si el menu lateral esta abierto
  var navbarOpen = false;

  var programComponent = $(".program-component");
  var header = $(".program-component .prog-header");
  var toggleNavbarBtn = $(".program-component .toggle-sidedrawer");

  var nav = $(".program-component nav");
  var stickyElement = $(componentProps.stickyElementSelector);

  //Headers de los items de la sección de contenido
  var contentHeaders = $(".program-component .content .item-header")
    .toArray()
    .map($);
  
  //Lista items del menu
  var menuItemsList = $(".menu-container .menu-item");
  var menuItemsById = {}; //menuItemsList organizado en un Map

  function initMenuItems() {
    //Inicializa el Map menuItemsById
    for (var i = 0; i < menuItemsList.length; i++) {
      var menuItem = $(menuItemsList[i]);
      var dataId = menuItem.attr("data-target");
      menuItemsById[dataId] = menuItem;
    }

    $(".menu-container .menu-item .item-name").click(onItemClickHandler);
    $(".menu-container .menu-item .sub-item").click(onItemClickHandler);

    
    function onItemClickHandler() {
      var dataId = $(this).attr("data-target");      
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

  /**
   * LightBox con video
   * */
  $(".program-component .prog-media-container").click(function() {
    lity(componentProps.videoURL);
    if ($(this).css("opacity") !== "0") {
    }
  });

  function init() {
    onWindowResize();
    /** Ignora  */
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

    toggleNavbarBtn.click(function() {
      toggleNavbar(!navbarOpen);
    });
  }

  function registerScrollListeners() {
    $(window).scroll(function() {
      
      updateHeaderHeight();
      updateActiveItem();
     
    });
  }
  /** Actualiza el item activo (resaltado) del menu*/
  function updateActiveItem() {
    var activeItem = getActiveItem(
      $(window).scrollTop(),
      contentHeaders,
      stickyOffset + minHeight + 100
    );
    var dataId = activeItem.attr("id");
    if (menuItemsById[dataId]) {
      var prevActive = $(".menu-container .menu-item.active").attr(
        "data-target"
      );
      if (prevActive !== dataId) {
        //Scroll a una nueva seccion
        console.log("active item changed");
        $(".navigation-menu .menu-toggle").addClass("animate");
        setTimeout(function() {
          $(".navigation-menu .menu-toggle").removeClass("animate");
        }, 500);
      }
      menuItemsList.removeClass("active");
      menuItemsById[dataId].addClass("active");
    }
  }

  function onWindowResize() {
    shrinked = false;

    //Remueve los listeners
    $(window).off("scroll");
    header.trigger("sticky_kit:detach");
    nav.trigger("sticky_kit:detach");
    //Determina el nuevo modo
    var newMode = $("#mobile-indicator").is(":visible") ? "MOBILE" : "DESKTOP";

    updateVars(newMode);
    console.log("height", navHeight);
    nav.css("height", navHeight);

    if (newMode === "DESKTOP") {
      //Cambio a DESKTOP

      header.stick_in_parent({
        offset_top: stickyOffset,
        recalc_every: null //newMode === 'DESKTOP' ? null : null
      });
      header.css("max-height", "");
      nav.removeClass("closed");
      header.css("position", "");

      nav.stick_in_parent({
        offset_top: offsetNavbar
      });
    } else {
      //Cambio a MOBILE
      nav.css("position", "fixed");
      nav.css("top", offsetNavbar);
    }

    registerScrollListeners();

    if (newMode === "MOBILE") {
      toggleNavbar(false);

      setTimeout(function() {
        if ($(".program-component .prog-header").css("position") === "fixed") {
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

  /** 
   * Actualiza la altura del header segun la posicion del scroll 
   * */
  function updateHeaderHeight() {
    var st = $(window).scrollTop();
    var newHeight = calculateHeight(
      maxHeight,
      minHeight,
      elementPosition,
      st,
      stickyOffset
    );

    if (newHeight <= minHeight) {
      header.addClass("shrinked");
      if (!shrinked) {
        shrinked = true;
        setTimeout(function() {
          $(document.body).trigger("sticky_kit:recalc");
        }, 0);
      }
    } else {
      header.removeClass("shrinked");
    }

    header.outerHeight(newHeight + "px");
  }

  /**
   * Actualiza las variables del estado de la UI
   */
  function updateVars(mode) {
    stickyOffset = stickyElement[0].offsetTop + stickyElement.outerHeight();
    elementPosition = header.offset();
    minHeight = parseInt(header.css("min-height").slice(0, -2));

    if (mode === "MOBILE") {
      header.css("max-height", "auto");
      header.css("height", "auto");
      navHeight = "calc(100vh - " + stickyOffset + "px)";
      offsetNavbar = stickyOffset;
      programComponent.css("padding-top", "");
      minHeight = 0;
    } else {
      //DESKTOP

      //La altura minima del header se ajusta a la cantidad de texto del titulo
      minHeight =
        $(".content-wrapper .prof-title").outerHeight() +
        $(".prog-header .prog-data").outerHeight();
      header.css("min-height", minHeight + "px");

      //La altura maxima del header (configurada en css) se reajusta si es mayor al viewport
      header.css("max-height", "calc(100vh - " + stickyOffset + "px)");
      var viewPortHeight = parseInt(header.css("max-height").slice(0, -2)); //Altura del viewport
      header.css("max-height", ""); //
      var cssMaxHeight = parseInt(header.css("max-height").slice(0, -2));
      programComponent.css("padding-top","");
      if (cssMaxHeight > viewPortHeight) {
        //Altura de css sobrepasa el alto de viewport
        header.css("max-height", "calc(100vh - " + stickyOffset + "px)");     
        //El header siempre tendra position: absolute o fixed, entonces es necesario que
        //el padding-top de programComponent la altura del header.
        programComponent.css(
          "padding-top",
          "calc(100vh - " + stickyOffset + "px)"
        );
      }
      navHeight = "calc(100vh - " + minHeight + "px - " + stickyOffset + "px)";     
      offsetNavbar = stickyOffset + minHeight;
    }

    maxHeight = parseInt(header.css("max-height").slice(0, -2));
  }

  function toggleNavbar(open) {
    
    navbarOpen = open;
    if (!open) {
      header.addClass("nav-closed");
      nav.addClass("closed");
    } else {
      nav.removeClass("closed");
      header.removeClass("nav-closed");
    }
  }
});

/**
 * Determina cual de los items es el activo segun  la posicion del scroll y la posicion de los headers
 * @param headers  Lista de headers de la seccion de contenido
 */
function getActiveItem(scrollTop, headers, offset) {
  scrollTop += offset;
  var activeItem = headers[0];

  for (var i = 1; i < headers.length; i++) {
    var item = headers[i];
    var distanceFromTop = item.offset().top;
    if (distanceFromTop > scrollTop) {
      break; //El header activo se encontró en la iteración anterior
    }
    activeItem = item;
  }

  return activeItem;
}

/**
 * Calcula la nueva altura del header en funcion de la distancia scrolleada
 * @param initialHeight - altura original del header
 * @param initialHeight - altura minima header (despues de cierta distancia el header no se encogera más)
 * @param position - posicion del header respecto al inicio de la página
 * @param scrollTop - posicion del scroll respecto al inicio de la página
 * @param stickyOffset - corrimiento,
 */
function calculateHeight(
  initialHeight,
  minHeight,
  position,
  scrollTop,
  stickyOffset
) {
  if (scrollTop > position.top - stickyOffset) {
    var newHeight = initialHeight - (scrollTop - position.top + stickyOffset);
    
    return Math.max(minHeight, newHeight);
  }
  return initialHeight;
}

/**
 * Usa la libreria https://github.com/briangonzalez/jquery.adaptive-backgrounds.js
 * Calcula el color dominante de la imagen del header y lo pone de fondo
 * TODO: PASAR LÓGICA A DRUPAL
 */
function initBackgroundColor() {
  $.adaptiveBackground.run({
    parent: "header",
    success: function($img, data) {
      //console.log("Success!", $img, data);
      var rgbColor = data.color.slice(4, -1).split(",");
      //Usa como color de fuente, el color mas lejano (negro o blanco)
      //del color dominate de la imagen
      var contrast = getFurthestColor(rgbColor, [[255, 255, 255], [0, 0, 0]]);
      contrast = "rgb(" + contrast.join() + ")";

      $(
        ".prog-media-container .video-icon, .program-component .prog-header, .prog-data .data-item"
      ).css("color", contrast);
      $(".prog-data .data-item").css("border-color", contrast);
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
 * Retorna el color que este mas lejano del color base usando
 * https://en.wikipedia.org/wiki/Color_difference
 * @param color - color base
 * @param colors lista de colores contra los cuales se compara el color base
 */
function getFurthestColor(color, colors) {
  var r1 = color[0];
  var g1 = color[1];
  var b1 = color[2];
  var max = Number.MIN_VALUE;
  var furthestColor = color;
  colors.forEach(function(c) {
    var r2 = c[0];
    var g2 = c[1];
    var b2 = c[2];
    var distance =
      Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2);
    if (distance > max) {
      max = distance;
      furthestColor = c;
    }
  });
  return furthestColor;
}
