/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'bibliotecaAndes\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icono-logoUniandesColombia': '&#xe90b;',
		'icono-uniandes-fixed': '&#xe908;',
		'icono-Play-solid': '&#xe900;',
		'icono-play-border': '&#xe901;',
		'icono-play': '&#xe902;',
		'icono-busqueda': '&#xe903;',
		'icono-Estructura': '&#xe904;',
		'icono-Profesores': '&#xe905;',
		'icono-Lapiz': '&#xe906;',
		'icono-info': '&#xe907;',
		'icono-Articulo': '&#xe909;',
		'icono-Telefono': '&#xe90a;',
		'icono-Investigacion': '&#xe90c;',
		'icono-Educacion': '&#xe90d;',
		'icono-Correo': '&#xe90e;',
		'icono-Clases': '&#xe90f;',
		'icono-double-prev': '&#xe910;',
		'icono-double-next': '&#xe912;',
		'icono-prev': '&#xe911;',
		'icono-next': '&#xe913;',
		'icono-down': '&#xe914;',
		'icono-close': '&#xe915;',
		'icono-up': '&#xe916;',
		'icono-user': '&#xe917;',
		'icono-notificacion': '&#xe918;',
		'icono-ver-mas': '&#xe919;',
		'icono-file-text': '&#xe926;',
		'icono-phone': '&#xe942;',
		'icono-location': '&#xe947;',
		'icono-calendar': '&#xe953;',
		'icono-plus': '&#xea0a;',
		'icono-minus': '&#xea0b;',
		'icono-google-plus': '&#xea8b;',
		'icono-facebook': '&#xea90;',
		'icono-twitter': '&#xea96;',
		'icono-youtube': '&#xea9d;',
		'icono-vimeo': '&#xeaa0;',
		'icono-linkedin': '&#xeaca;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icono-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
