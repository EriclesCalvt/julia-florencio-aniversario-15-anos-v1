'use strict';

/* ═══════════════════════════════════════════
   OVERLAY DE TRANSIÇÃO
═══════════════════════════════════════════ */
var overlay;

function navigate(to) {
  if (!overlay) overlay = document.getElementById('transition-overlay');
  overlay.style.opacity = '1';

  setTimeout(function() {
    document.querySelectorAll('[data-screen]').forEach(function(s) {
      s.classList.remove('active');
    });

    var target = document.querySelector('[data-screen="' + to + '"]');
    if (!target) return;

    // Reiniciar animações de entrada ao voltar para o convite
    if (to === 'convite') {
      target.querySelectorAll('.entrada').forEach(function(el) {
        el.style.animation = 'none';
        void el.offsetHeight; // reflow
        el.style.animation = '';
      });
    }

    // Reiniciar animações de lista ao entrar em presentes
    if (to === 'presentes') {
      target.querySelectorAll('.presente-item').forEach(function(el) {
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = '';
      });
    }

    target.classList.add('active');
    window.scrollTo(0, 0);

    setTimeout(function() {
      overlay.style.opacity = '0';
    }, 50);
  }, 300);
}

/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
function showToast(msg) {
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();

  var t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);

  setTimeout(function() { t.classList.add('show'); }, 50);
  setTimeout(function() {
    t.classList.remove('show');
    setTimeout(function() { t.remove(); }, 300);
  }, 3000);
}

/* ═══════════════════════════════════════════
   CONFIRMAR PRESENÇA
═══════════════════════════════════════════ */
function confirmarPresenca() {
  var nome = document.getElementById('inp-nome').value.trim();
  var tel  = document.getElementById('inp-tel').value.trim();
  var qtd  = document.getElementById('sel-qtd').value;

  if (!nome || !tel) {
    showToast('Preencha seu nome e telefone 🌹');
    return;
  }

  var msg = 'Olá! Gostaria de confirmar minha presença na festa da Júlia Florencio 🌹%0A%0A*Nome:* '
    + encodeURIComponent(nome)
    + '%0A*Telefone:* '
    + encodeURIComponent(tel)
    + '%0A*Convidados:* '
    + qtd;

  window.open('https://wa.me/5585985245365?text=' + msg, '_blank');

  // NARRAÇÃO/ÁUDIO HOOK — descomentar quando disponível
  // const successAudio = new Audio('./assets/audio/confirmation.mp3');
  // successAudio.play();
}

/* ═══════════════════════════════════════════
   OVERTURE — lógica do vídeo
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  overlay = document.getElementById('transition-overlay');

  // Menu do convite
  document.querySelectorAll('.menu-item[data-goto]').forEach(function(item) {
    item.addEventListener('click', function() {
      navigate(this.dataset.goto);
    });
  });

  var video    = document.getElementById('intro-video');
  var btnPular = document.getElementById('btn-pular');
  var progBar  = document.getElementById('progress-bar');
  var roseWrap = document.getElementById('rose-wrap');

  if (!video) return;

  // NARRAÇÃO — descomentar quando arquivo de áudio estiver disponível
  // const narration = new Audio('./assets/audio/narration.mp3');
  // video.addEventListener('play',   () => narration.play());
  // video.addEventListener('pause',  () => narration.pause());
  // video.addEventListener('seeked', () => { narration.currentTime = video.currentTime; });

  // Fase 1 (0–1.5s): rosa CSS anima via keyframe
  // Fase 2 (1.5s): dissolver rosa e iniciar vídeo
  setTimeout(function() {
    if (roseWrap) {
      roseWrap.style.transition = 'opacity 0.8s ease';
      roseWrap.style.opacity = '0';
    }
    var p = video.play();
    if (p !== undefined) {
      p.catch(function() {
        // Autoplay bloqueado pelo navegador
        btnPular.classList.add('visible');
      });
    }
  }, 1500);

  // Barra de progresso sincronizada com o vídeo
  video.addEventListener('timeupdate', function() {
    if (video.duration && progBar) {
      progBar.style.width = ((video.currentTime / video.duration) * 100) + '%';
    }
  });

  // Botão pular aparece em 2s
  setTimeout(function() {
    btnPular.classList.add('visible');
  }, 2000);

  // Fim do vídeo → convite
  video.addEventListener('ended', function() {
    navigate('convite');
  });

  // Pular
  btnPular.addEventListener('click', function() {
    navigate('convite');
  });

  // Vídeo com erro → mostrar pular imediatamente
  video.addEventListener('error', function() {
    btnPular.classList.add('visible');
  });
});
