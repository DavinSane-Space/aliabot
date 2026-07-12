// Shared navbar for all Aliabot marketing pages.
// Renders into <div id="navbar-root"></div>, placed via <script src="/assets/navbar.js"></script>.
(function () {
  var NAV_LINKS = [
    { href: '/funciones', label: 'Funciones' },
    { href: '/clientes-potenciales', label: 'Clientes potenciales' },
    { href: '/precios', label: 'Precios' },
    { href: '/seguridad', label: 'Seguridad' }
  ];

  var ACTIVE_STYLE = 'color:#2563EB; border-color:#2563EB;';
  var INACTIVE_STYLE = 'color:#1E2185; border-color:transparent;';
  var HOVER_ATTRS = ' onmouseover="this.style.color=\'#2563EB\'" onmouseout="this.style.color=\'#1E2185\'"';

  var currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';

  var linksHtml = NAV_LINKS.map(function (link) {
    var isActive = currentPath === link.href;
    var classes = 'font-body-md text-body-md border-b-2 pb-1 transition-all duration-300' + (isActive ? ' font-bold' : '');
    var style = isActive ? ACTIVE_STYLE : INACTIVE_STYLE;
    var hover = isActive ? '' : HOVER_ATTRS;
    return '<a class="' + classes + '" style="' + style + '"' + hover + ' href="' + link.href + '">' + link.label + '</a>';
  }).join('\n    ');

  var html = [
    '<nav class="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 md:px-8">',
    '  <div class="inline-flex items-center gap-10 px-8 py-3 w-fit max-w-full rounded-full" style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(107, 155, 252, 0.2); border-radius: 16px; box-shadow: 0 4px 24px rgba(37, 99, 235, 0.08);">',
    '    <a href="/" class="font-headline-md text-headline-md font-bold tracking-tighter" style="background: linear-gradient(135deg, #2563EB, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Aliabot</a>',
    '    <div class="hidden md:flex items-center gap-8">',
    '    ' + linksHtml,
    '    </div>',
    '    <div class="flex items-center gap-3">',
    '      <a class="hidden md:block font-body-md text-body-md transition-all duration-300 px-2" style="color:#1E2185;" onmouseover="this.style.color=\'#2563EB\'" onmouseout="this.style.color=\'#1E2185\'" href="https://aliabot-dashboard.vercel.app/iniciar-sesion">Iniciar sesión</a>',
    '      <a class="px-5 py-2 rounded-full font-bold text-sm shadow-[0_0_12px_rgba(0,87,255,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap inline-block" style="background: linear-gradient(135deg, #2563EB, #7C3AED); color:#FFFFFF;" href="https://aliabot-dashboard.vercel.app/crear-cuenta">Comenzar prueba gratis</a>',
    '    </div>',
    '  </div>',
    '</nav>'
  ].join('\n');

  var root = document.getElementById('navbar-root');
  if (root) {
    root.outerHTML = html;
  } else {
    document.write(html);
  }
})();
