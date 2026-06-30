'use strict';

/* ═══════════════════════════════════════════════
   CONFIGURAÇÃO
═══════════════════════════════════════════════ */
var TIMELINE = { iniciando: 250, rachando: 600, abrindo: 900, revelando: 500 };
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var overlay;


/* ═══════════════════════════════════════════════
   NAVEGAÇÃO
═══════════════════════════════════════════════ */
function _resetAnimacoes(tela) {
  tela.querySelectorAll('.entrada').forEach(function(el) {
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
  });
  tela.querySelectorAll('.presente-item').forEach(function(el) {
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
  });
}

function navigate(to) {
  if (!overlay) overlay = document.getElementById('overlay-transicao');
  overlay.style.opacity = '1';

  setTimeout(function() {
    document.querySelectorAll('[data-screen]').forEach(function(s) {
      s.classList.remove('active');
    });

    var target = document.querySelector('[data-screen="' + to + '"]');
    if (!target) return;

    _resetAnimacoes(target);
    target.classList.add('active');
    window.scrollTo(0, 0);

    setTimeout(function() { overlay.style.opacity = '0'; }, 50);
  }, reducedMotion ? 100 : 300);
}


/* ═══════════════════════════════════════════════
   PÉTALAS DE EXPLOSÃO DO SELO
═══════════════════════════════════════════════ */
function criarPetalasSelo(container) {
  var angulos = [0, 45, 90, 135, 180, 225, 270, 315];
  var distancias = [70, 85, 75, 90, 70, 80, 75, 85];

  angulos.forEach(function(ang, i) {
    var p = document.createElement('div');
    p.className = 'petala-selo';
    p.style.setProperty('--ang', ang + 'deg');
    p.style.setProperty('--dist', distancias[i] + 'px');
    container.appendChild(p);
  });
}


/* ═══════════════════════════════════════════════
   ABERTURA DO SELO
═══════════════════════════════════════════════ */
function abrirSelo(seloEl) {
  if (seloEl.classList.contains('iniciando')) return;

  if (reducedMotion) {
    navigate('convite');
    return;
  }

  seloEl.classList.remove('idle');
  seloEl.classList.add('iniciando');

  // === NARRAÇÃO / SOM — descomentar quando os arquivos existirem ===
  // var somRachadura = new Audio('./assets/audio/cera-rachando.mp3');
  // somRachadura.play();
  // var narracao = new Audio('./assets/audio/narracao.mp3');
  // setTimeout(function() { narracao.play(); }, TIMELINE.iniciando + TIMELINE.rachando);
  // ================================================================

  setTimeout(function() {
    seloEl.classList.add('rachando');
  }, TIMELINE.iniciando);

  setTimeout(function() {
    seloEl.classList.add('abrindo');
  }, TIMELINE.iniciando + TIMELINE.rachando);

  var telaConvite = document.querySelector('[data-screen="convite"]');

  setTimeout(function() {
    if (!overlay) overlay = document.getElementById('overlay-transicao');
    overlay.style.opacity = '1';
  }, TIMELINE.iniciando + TIMELINE.rachando + TIMELINE.abrindo);

  setTimeout(function() {
    document.querySelectorAll('[data-screen]').forEach(function(s) {
      s.classList.remove('active');
    });
    if (telaConvite) {
      _resetAnimacoes(telaConvite);
      telaConvite.classList.add('active');
    }
    window.scrollTo(0, 0);

    setTimeout(function() {
      if (!overlay) overlay = document.getElementById('overlay-transicao');
      overlay.style.opacity = '0';
    }, 100);
  }, TIMELINE.iniciando + TIMELINE.rachando + TIMELINE.abrindo + TIMELINE.revelando);
}


/* ═══════════════════════════════════════════════
   PÉTALAS AMBIENTE — convite screen
═══════════════════════════════════════════════ */
function initPetalasAmbiente() {
  if (reducedMotion) return;

  var convite = document.querySelector('[data-screen="convite"]');
  if (!convite) return;

  var config = [
    { left: '12%', dur: '9s',  delay: '0s'   },
    { left: '30%', dur: '12s', delay: '2.5s' },
    { left: '50%', dur: '10s', delay: '5s'   },
    { left: '68%', dur: '13s', delay: '1s'   },
    { left: '82%', dur: '8s',  delay: '3.5s' },
    { left: '22%', dur: '11s', delay: '7s'   },
  ];

  config.forEach(function(c) {
    var p = document.createElement('div');
    p.className = 'petala-ambiente';
    p.style.left = c.left;
    p.style.animationDuration = c.dur;
    p.style.animationDelay = c.delay;
    convite.appendChild(p);
  });
}


/* ═══════════════════════════════════════════════
   SELOS MINIATURA NOS SUB-HEADERS
═══════════════════════════════════════════════ */
function initMiniSelos() {
  var miniSVG = '<svg class="selo-mini" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<path fill="url(#gradCera)"'
    + '  d="M100,15 C140,12 175,40 182,80 C188,118 168,155 130,178'
    + '     C95,198 55,190 28,162 C5,138 8,95 22,62 C38,28 68,18 100,15 Z"/>'
    + '<g transform="translate(100,82)">'
    + '<ellipse cx="0" cy="-14" rx="9" ry="14" fill="#F1E6CC" opacity="0.9"/>'
    + '<ellipse cx="0" cy="-14" rx="9" ry="14" fill="#F1E6CC" opacity="0.9" transform="rotate(72)"/>'
    + '<ellipse cx="0" cy="-14" rx="9" ry="14" fill="#F1E6CC" opacity="0.9" transform="rotate(144)"/>'
    + '<ellipse cx="0" cy="-14" rx="9" ry="14" fill="#F1E6CC" opacity="0.9" transform="rotate(216)"/>'
    + '<ellipse cx="0" cy="-14" rx="9" ry="14" fill="#F1E6CC" opacity="0.9" transform="rotate(288)"/>'
    + '<circle cx="0" cy="0" r="5" fill="#57162A"/>'
    + '</g>'
    + '<text x="100" y="135" text-anchor="middle" font-family="Italiana,Georgia,serif" font-size="24" fill="#F1E6CC">XV</text>'
    + '</svg>';

  document.querySelectorAll('.sub-header').forEach(function(header) {
    header.insertAdjacentHTML('afterbegin', miniSVG);
  });
}


/* ═══════════════════════════════════════════════
   CONFIRMAR PRESENÇA
═══════════════════════════════════════════════ */
function confirmarPresenca() {
  var nome = document.getElementById('inp-nome').value.trim();
  var tel  = document.getElementById('inp-tel').value.trim();
  var qtd  = document.getElementById('sel-qtd').value;

  if (!nome || !tel) {
    showToast('Preencha seu nome e telefone 🌹');
    return;
  }

  var msg = 'Olá! Gostaria de confirmar minha presença na festa da Júlia Florencio 🌹'
    + '%0A%0A*Nome:* ' + encodeURIComponent(nome)
    + '%0A*Telefone:* ' + encodeURIComponent(tel)
    + '%0A*Convidados:* ' + qtd;

  window.open('https://wa.me/5585985245365?text=' + msg, '_blank');
}


/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() {
    t.classList.remove('show');
  }, 3000);
}


/* ═══════════════════════════════════════════════
   INICIALIZAÇÃO
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  overlay = document.getElementById('overlay-transicao');

  // Injetar selos miniatura nos sub-headers
  initMiniSelos();

  // Pétalas ambiente no convite
  initPetalasAmbiente();

  // Pétalas de explosão no container do selo interativo
  var seloAbertura = document.getElementById('selo-abertura');
  if (seloAbertura) {
    criarPetalasSelo(seloAbertura);

    // Clique
    seloAbertura.addEventListener('click', function() {
      abrirSelo(seloAbertura);
    });

    // Teclado (Enter / Espaço)
    seloAbertura.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirSelo(seloAbertura);
      }
    });
  }

  // Menu do convite — delegação por data-goto
  document.querySelectorAll('.menu-item[data-goto]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      navigate(this.dataset.goto);
    });
  });
});
