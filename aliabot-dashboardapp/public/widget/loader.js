(function () {
  'use strict';

  if (window.__aliabotWidgetLoaded) return;
  window.__aliabotWidgetLoaded = true;

  var currentScript = document.currentScript;

  if (!currentScript) {
    console.error('[Aliabot] No se pudo detectar el script del widget.');
    return;
  }

  // Se deriva del propio <script src>, no se fija a mano: el loader siempre
  // llama de vuelta al mismo origen (app.aliabot.co) desde el que se sirvió.
  var CHAT_ORIGIN = new URL(currentScript.src).origin;

  var agentId = currentScript.getAttribute('data-agent-id');
  if (!agentId) {
    console.error('[Aliabot] Falta el atributo data-agent-id en el script del widget.');
    return;
  }

  var STORAGE_KEY = 'aliabot_visitor_id_' + agentId;
  var isOpen = false;
  var bubbleEl, panelEl;

  function fallbackUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getVisitorId() {
    try {
      var existing = window.localStorage.getItem(STORAGE_KEY);
      if (existing) return existing;
      var created = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : fallbackUuid();
      window.localStorage.setItem(STORAGE_KEY, created);
      return created;
    } catch (e) {
      return fallbackUuid();
    }
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'aliabot-widget-style';
    style.textContent = [
      '@keyframes aliabot-fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }',
      '@media (max-width: 480px) {',
      '  #aliabot-widget-panel { width: 100vw !important; height: 100vh !important; right: 0 !important; left: 0 !important; bottom: 0 !important; border-radius: 0 !important; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function bubbleIconsHtml() {
    return (
      '<svg id="aliabot-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">' +
      '<path d="M4 4h16v12H7l-3 3V4z" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>' +
      '</svg>' +
      '<svg id="aliabot-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:none">' +
      '<path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function setBubbleIcon(open) {
    var chatIcon = document.getElementById('aliabot-icon-chat');
    var closeIcon = document.getElementById('aliabot-icon-close');
    if (chatIcon) chatIcon.style.display = open ? 'none' : 'block';
    if (closeIcon) closeIcon.style.display = open ? 'block' : 'none';
  }

  function createBubble(position, primaryColor) {
    var btn = document.createElement('button');
    btn.id = 'aliabot-widget-bubble';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir chat');
    var side = position === 'bottom-left' ? 'left' : 'right';
    btn.style.cssText = [
      'position:fixed',
      'bottom:20px',
      side + ':20px',
      'width:60px',
      'height:60px',
      'border-radius:50%',
      'border:none',
      'outline:none',
      'cursor:pointer',
      'background:' + primaryColor,
      'box-shadow:0 8px 24px rgba(17,20,58,0.25)',
      'z-index:2147483000',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:0',
      'margin:0',
      'transition:transform 0.15s ease',
      'box-sizing:border-box',
    ].join(';');
    btn.innerHTML = bubbleIconsHtml();
    btn.addEventListener('mouseenter', function () {
      btn.style.transform = 'scale(1.06)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'scale(1)';
    });
    btn.addEventListener('click', toggleWidget);
    return btn;
  }

  function createPanel(position) {
    var panel = document.createElement('div');
    panel.id = 'aliabot-widget-panel';
    var side = position === 'bottom-left' ? 'left' : 'right';
    panel.style.cssText = [
      'position:fixed',
      'bottom:92px',
      side + ':20px',
      'width:370px',
      'height:560px',
      'max-height:calc(100vh - 120px)',
      'max-width:calc(100vw - 40px)',
      'border-radius:16px',
      'overflow:hidden',
      'box-shadow:0 16px 48px rgba(17,20,58,0.28)',
      'z-index:2147483000',
      'display:none',
      'background:#fff',
      'animation:aliabot-fade-in 0.18s ease',
      'box-sizing:border-box',
    ].join(';');

    var iframeSrc =
      CHAT_ORIGIN +
      '/widget/chat?agentId=' +
      encodeURIComponent(agentId) +
      '&visitorId=' +
      encodeURIComponent(getVisitorId());

    var iframe = document.createElement('iframe');
    iframe.id = 'aliabot-widget-iframe';
    iframe.src = iframeSrc;
    iframe.title = 'Aliabot chat';
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
    panel.appendChild(iframe);

    return panel;
  }

  function toggleWidget() {
    isOpen = !isOpen;
    panelEl.style.display = isOpen ? 'block' : 'none';
    setBubbleIcon(isOpen);
  }

  function init() {
    var apiUrl = CHAT_ORIGIN + '/api/widget/config?agentId=' + encodeURIComponent(agentId);

    fetch(apiUrl)
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (!result.ok || !result.data || result.data.available === false) {
          return;
        }

        var config = result.data;
        var position = config.position === 'bottom-left' ? 'bottom-left' : 'bottom-right';
        var primaryColor = config.primaryColor || 'linear-gradient(135deg, #2563EB, #7C3AED)';

        injectStyles();
        panelEl = createPanel(position);
        bubbleEl = createBubble(position, primaryColor);
        document.body.appendChild(panelEl);
        document.body.appendChild(bubbleEl);
      })
      .catch(function (err) {
        console.error('[Aliabot] No se pudo cargar el widget.', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
