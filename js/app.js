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
   ABERTURA DO ENVELOPE
═══════════════════════════════════════════════ */
function abrirEnvelope() {
  var envelope = document.getElementById('envelope');
  var selo = document.getElementById('selo-abertura');
  if (!envelope || !selo) return;
  if (envelope.classList.contains('aberto') || selo.classList.contains('iniciando')) return;

  if (reducedMotion) {
    navigate('convite');
    return;
  }

  selo.classList.remove('idle');
  selo.classList.add('iniciando');

  // === NARRAÇÃO / SOM — descomentar quando os arquivos existirem ===
  // var somRachadura = new Audio('./assets/audio/cera-rachando.mp3');
  // somRachadura.play();
  // var narracao = new Audio('./assets/audio/narracao.mp3');
  // setTimeout(function() { narracao.play(); }, 850);
  // ================================================================

  setTimeout(function() { selo.classList.add('rachando'); }, 250);
  setTimeout(function() {
    selo.classList.add('abrindo');
    envelope.classList.add('aberto');
  }, 850);

  var T_LEITURA = 850 + 550 + 1100 + 2200;
  var T_REVELANDO = 500;

  setTimeout(function() {
    if (!overlay) overlay = document.getElementById('overlay-transicao');
    overlay.style.opacity = '1';
  }, T_LEITURA);

  setTimeout(function() {
    document.querySelectorAll('[data-screen]').forEach(function(s) { s.classList.remove('active'); });
    var telaConvite = document.querySelector('[data-screen="convite"]');
    if (telaConvite) {
      _resetAnimacoes(telaConvite);
      telaConvite.classList.add('active');
    }
    window.scrollTo(0, 0);
    setTimeout(function() {
      if (!overlay) overlay = document.getElementById('overlay-transicao');
      overlay.style.opacity = '0';
    }, 100);
  }, T_LEITURA + T_REVELANDO);
}

function criarPetalasEnvelope(envelopeEl) {
  var deslocamentos = [-40, 20, 50, -15, 35];
  var posicoes = ['30%', '50%', '70%', '42%', '60%'];
  deslocamentos.forEach(function(dx, i) {
    var p = document.createElement('div');
    p.className = 'petala-envelope';
    p.style.left = posicoes[i];
    p.style.setProperty('--dx', dx + 'px');
    envelopeEl.appendChild(p);
  });
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
   VITRAL — roseta na tela convite
═══════════════════════════════════════════════ */
function initVitral() {
  var svgNS = 'http://www.w3.org/2000/svg';
  var rw = document.getElementById('vitral-convite');
  if (!rw) return;

  var cx = 150, cy = 150, innerR = 28, outerR = 145, spokes = 12;

  for (var i = 0; i < spokes; i++) {
    var a = (i * 360 / spokes) * Math.PI / 180;
    var x1 = cx + innerR * Math.cos(a), y1 = cy + innerR * Math.sin(a);
    var x2 = cx + outerR * Math.cos(a), y2 = cy + outerR * Math.sin(a);
    var line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#C8923E'); line.setAttribute('stroke-width', '0.7'); line.setAttribute('opacity', '0.3');
    rw.appendChild(line);

    var ma = ((i + 0.5) * 360 / spokes) * Math.PI / 180;
    var pr = (innerR + outerR) / 2 + 24;
    var px = cx + pr * Math.cos(ma), py = cy + pr * Math.sin(ma);
    var petal = document.createElementNS(svgNS, 'ellipse');
    petal.setAttribute('cx', px); petal.setAttribute('cy', py);
    petal.setAttribute('rx', 10); petal.setAttribute('ry', 22);
    petal.setAttribute('transform', 'rotate(' + ((i + 0.5) * 30 + 90) + ' ' + px + ' ' + py + ')');
    petal.setAttribute('fill', 'none'); petal.setAttribute('stroke', '#E0B36C');
    petal.setAttribute('stroke-width', '0.8'); petal.setAttribute('opacity', '0.4');
    rw.appendChild(petal);
  }

  [44, 88, 128, 145].forEach(function(r) {
    var c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', 'none'); c.setAttribute('stroke', '#C8923E');
    c.setAttribute('stroke-width', '0.5'); c.setAttribute('opacity', '0.22');
    rw.appendChild(c);
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
    + '<circle cx="0" cy="0" r="5" fill="#7A2138"/>'
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

  initMiniSelos();
  initPetalasAmbiente();
  initVitral();

  var envelope = document.getElementById('envelope');
  if (envelope) {
    criarPetalasEnvelope(envelope);
    var seloAbertura = document.getElementById('selo-abertura');
    if (seloAbertura) criarPetalasSelo(seloAbertura);

    envelope.addEventListener('click', abrirEnvelope);
    envelope.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirEnvelope();
      }
    });
  }

  document.querySelectorAll('.menu-item[data-goto]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      navigate(this.dataset.goto);
    });
  });
});
