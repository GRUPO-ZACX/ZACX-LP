(function () {
  // =========================
  // ✅ TRAVA ZOOM POR GESTOS (iOS Safari)
  // =========================
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturechange", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("gestureend", function (e) { e.preventDefault(); }, { passive: false });

  // =========================
  // Helpers (compatível)
  // =========================
  function closest(el, selector) {
    while (el && el.nodeType === 1) {
      if (matches(el, selector)) return el;
      el = el.parentNode;
    }
    return null;
  }

  function matches(el, selector) {
    var p = Element.prototype;
    var fn = p.matches || p.webkitMatchesSelector || p.msMatchesSelector || p.mozMatchesSelector;
    if (!fn) return false;
    return fn.call(el, selector);
  }

  function trimStr(s) {
    return (s || "").replace(/^\s+|\s+$/g, "");
  }

  // =========================
  // Menu mobile (abre/fecha)
  // =========================
  var burgerMobile = document.querySelector(".hamburger--mobile");
  var burgerDesktop = document.querySelector(".hamburger--desktop");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMobile() {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (burgerMobile) burgerMobile.setAttribute("aria-expanded", "false");
    if (burgerDesktop) burgerDesktop.setAttribute("aria-expanded", "false");
  }

  function openMobile() {
    if (!mobileMenu) return;

    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (burgerMobile) burgerMobile.setAttribute("aria-expanded", "true");
    if (burgerDesktop) burgerDesktop.setAttribute("aria-expanded", "true");
  }

  function toggleMobile() {
    if (!mobileMenu) return;
    var hiddenState = mobileMenu.getAttribute("aria-hidden") === "true";
    if (hiddenState) openMobile();
    else closeMobile();
  }

  if (burgerMobile && mobileMenu) {
    burgerMobile.addEventListener("click", function () {
      toggleMobile();
    });
  }

  if (burgerDesktop && mobileMenu) {
    burgerDesktop.addEventListener("click", function () {
      toggleMobile();
    });
  }

  if (mobileMenu) {
    document.addEventListener("click", function (e) {
      var clickedInside = closest(e.target, ".topbar-wrap");
      if (!clickedInside) closeMobile();
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobile();
    });

    var links = mobileMenu.querySelectorAll("a");
    var i;
    for (i = 0; i < links.length; i++) {
      links[i].addEventListener("click", closeMobile);
    }
  }

  window.addEventListener("resize", function () {
    if (window.matchMedia && window.matchMedia("(min-width: 981px)").matches) {
      closeMobile();
    }
  });

  // =========================
  // Select custom (abre pra cima)
  // =========================
  var btn = document.getElementById("segmentoBtn");
  var list = document.getElementById("segmentoList");
  var label = document.getElementById("segmentoLabel");
  var hidden = document.getElementById("segmentoValue");

  function closeList() {
    if (!list) return;
    list.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function toggleList() {
    if (!list) return;
    var open = !list.classList.contains("open");
    if (open) list.classList.add("open");
    else list.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (btn && list) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      toggleList();
    });

    list.addEventListener("click", function (e) {
      var item = closest(e.target, ".select-item");
      if (!item) return;

      var value = item.getAttribute("data-value") || trimStr(item.textContent || "");
      if (hidden) hidden.value = value;
      if (label) label.textContent = value;

      closeList();
    });

    document.addEventListener("click", function (e) {
      var clickedInside = closest(e.target, ".field--select");
      if (!clickedInside) closeList();
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeList();
    });
  }

  // =========================
  // Telefone: FORMATO (DD) 912345678
  // =========================
  var phoneInput = document.querySelector('input[name="telefone"]');

  function formatPhoneBR(digits) {
    var d = (digits || "").replace(/\D/g, "").slice(0, 11);
    var ddd = d.slice(0, 2);
    var rest = d.slice(2);

    if (d.length === 0) return "";
    if (d.length < 3) return "(" + ddd;
    return "(" + ddd + ") " + rest;
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var digits = (this.value || "").replace(/\D/g, "");
      this.value = formatPhoneBR(digits);
    });

    phoneInput.addEventListener("blur", function () {
      var digits = (this.value || "").replace(/\D/g, "");
      if (digits.length > 0 && digits.length < 11) {
        this.value = formatPhoneBR(digits);
      }
    });
  }

  // =========================
  // FORM: Envio para Linyt
  // =========================
  var leadForm = document.getElementById("leadForm");
  var submitBtn = document.getElementById("submitBtn");
  var note = document.getElementById("formNote");
  var isSubmitting = false;

  function setError(msg) {
    if (note) {
        note.textContent = msg;
        note.style.color = "#ff4444"; // Garante cor de erro
    }
  }

  function clearError() {
    if (note) note.textContent = "";
  }

  var defaultBtnText = submitBtn ? submitBtn.textContent : "Agendar uma Reunião";

  function markSuccess() {
    if (!submitBtn) return;
    clearError();
    // Feedback visual de sucesso
    if(note) {
        note.style.color = "#00ff88"; 
        note.textContent = "Solicitação enviada com sucesso! Em breve entraremos em contato.";
    }
    
    submitBtn.textContent = "SOLICITAÇÃO ENVIADA!";
    submitBtn.style.background = "#dfff06";
    submitBtn.style.color = "#1d10d7";
    submitBtn.disabled = true;
    submitBtn.style.cursor = "default";
  }

  function trimStr2(s) {
    return (s || "").replace(/^\s+|\s+$/g, "");
  }

  function isValidEmail2(email) {
    if (!email) return false;
    var e = trimStr2(email);
    var at = e.indexOf("@");
    if (at <= 0) return false;
    var dotAfter = e.indexOf(".", at + 2);
    if (dotAfter === -1) return false;
    if (dotAfter >= e.length - 1) return false;
    return true;
  }

  function runValidation() {
    if (!leadForm) return false;

    var nome = leadForm.querySelector('input[name="nome"]');
    var email = leadForm.querySelector('input[name="email"]');
    var empresa = leadForm.querySelector('input[name="empresa"]');
    var telefone = leadForm.querySelector('input[name="telefone"]');
    var segmento = document.getElementById("segmentoValue");

    if (!nome || !trimStr2(nome.value)) { setError("Preencha seu nome e sobrenome."); return false; }
    if (!email || !trimStr2(email.value)) { setError("Preencha seu e-mail corporativo."); return false; }
    if (!isValidEmail2(email.value)) { setError("E-mail inválido (ex: nome@empresa.com)."); return false; }
    if (!empresa || !trimStr2(empresa.value)) { setError("Preencha o nome da sua empresa."); return false; }

    var telDigits = (telefone && telefone.value) ? telefone.value.replace(/\D/g, "") : "";
    if (telDigits.length !== 11) { setError("Telefone deve ter 11 dígitos (DD + número)."); return false; }

    if (!segmento || !trimStr2(segmento.value)) { setError("Selecione o segmento da sua empresa."); return false; }

    clearError();
    return true;
  }

  function buildCaptureData() {
    function value(name) {
      var input = leadForm.querySelector('input[name="' + name + '"]');
      return input ? trimStr2(input.value) : "";
    }
    var telefone = value("telefone").replace(/\D/g, "");
    return {
      nome: value("nome"),
      email: value("email"),
      telefone: telefone,
      whatsapp: telefone,
      origem: "Formulário do site ZACX",
      extra_fields: {
        empresa: value("empresa"),
        segmento: value("segmento")
      }
    };
  }

  function resetSubmitState() {
    if (!submitBtn) return;
    submitBtn.textContent = defaultBtnText;
    submitBtn.disabled = false;
    submitBtn.style.cursor = "pointer";
  }

  function sendCapture() {
    if (!leadForm || isSubmitting) return;
    isSubmitting = true;
    if (submitBtn) {
      submitBtn.textContent = "Enviando...";
      submitBtn.disabled = true;
      submitBtn.style.cursor = "wait";
    }

    return fetch(leadForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildCaptureData())
    })
      .then(function (response) {
        return response.json().catch(function () {
          return {};
        }).then(function (result) {
          if (!response.ok) {
            throw new Error(result.message || "Não foi possível enviar agora. Tente novamente.");
          }
          return result;
        });
      })
      .then(function () {
        markSuccess();
        leadForm.reset();
        if (label) label.textContent = "";
        if (hidden) hidden.value = "";
      })
      .catch(function (error) {
        isSubmitting = false;
        resetSubmitState();
        setError(error.message || "Falha ao enviar. Verifique sua conexão e tente novamente.");
      });
  }

  // Intercepta o submit padrão
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!runValidation()) return;
      sendCapture();
    });
  }


  // Logos: movimento linear contínuo, reciclando itens fora da tela.
  (function () {
    var track = document.getElementById("logosTrack");
    if (!track || track.children.length < 2) return;
    var offset = 0;
    var lastTime = null;
    var speed = 36;
    var step = 0;

    var originalLogos = Array.prototype.slice.call(track.children);
    function measure() {
      var items = track.children;
      step = items[1].offsetLeft - items[0].offsetLeft;
      var minimumItems = Math.ceil(track.parentElement.clientWidth / step) + 2;
      var copyIndex = 0;
      while (step > 0 && track.children.length < minimumItems) {
        var clone = originalLogos[copyIndex % originalLogos.length].cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        var link = clone.querySelector("a");
        if (link) link.setAttribute("tabindex", "-1");
        track.appendChild(clone);
        copyIndex++;
      }
    }

    function frame(time) {
      if (lastTime !== null && !document.hidden && step > 0) {
        offset += Math.min(time - lastTime, 64) * speed / 1000;
        while (offset >= step) {
          // O item já saiu da área visível; retorna ao fim sem salto.
          track.appendChild(track.firstElementChild);
          offset -= step;
        }
        track.style.transform = "translate3d(" + (-offset) + "px,0,0)";
      }
      lastTime = time;
      window.requestAnimationFrame(frame);
    }

    measure();
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", function () { lastTime = null; });
    window.requestAnimationFrame(frame);
  })();

})();

(function () {
  var videos = Array.prototype.slice.call(document.querySelectorAll('.portfolio-film'));
  if (!videos.length) return;
  var buttons = document.querySelectorAll('[data-film]');
  var status = document.getElementById('filmStatus');
  var current = 0;
  var paused = false;
  var soundEnabled = false;
  var playbackReady = false;
  var inView = false;
  var startTimer = null;
  function showSoundNotice() { status.textContent = soundEnabled ? "" : "Clique no vídeo para ativar o áudio"; }
  function play() {
    if (!playbackReady || !inView || document.hidden) return;
    var active = videos[current];
    active.muted = !soundEnabled;
    var attempt = active.play();
    if (attempt) attempt.catch(function (error) {
      if (active !== videos[current] || error.name === 'AbortError') return;
      if (!active.muted) {
        soundEnabled = false;
        active.muted = true;
        active.play().catch(function () { status.textContent = 'Toque no vídeo para reproduzir.'; });
        status.textContent = 'Toque no vídeo para ativar o som.';
      } else status.textContent = 'Toque no vídeo para reproduzir.';
    });
  }
  function enableSound() {
    soundEnabled = true;
    videos[current].muted = false;
    status.textContent = '';
    if (!paused) play();
  }
  function select(index) {
    current = index;
    showSoundNotice();
    videos.forEach(function (video, i) {
      video.pause();
      var relative = (i - current + videos.length) % videos.length;
      video.setAttribute('data-position', ['center', 'right', 'left'][relative]);
      buttons[i].setAttribute('data-position', ['center', 'right', 'left'][relative]);
      buttons[i].setAttribute('aria-pressed', i === current ? 'true' : 'false');
      buttons[i].style.setProperty('--progress', '0');
    });
    videos[current].currentTime = 0;
    if (!paused) play();
  }
  videos.forEach(function (video, i) {
    video.muted = true;
    video.addEventListener('click', function () {
      playbackReady = true;
      if (i !== current) { soundEnabled = true; paused = false; select(i); }
      else if (video.muted) { enableSound(); }
      else if (video.paused) { paused = false; showSoundNotice(); play(); }
      else { paused = true; video.pause(); }
    });
    video.addEventListener('ended', function () {
      if (i === current) { paused = false; select((current + 1) % videos.length); }
    });
    video.addEventListener('timeupdate', function () {
      if (i === current && video.duration > 0) buttons[i].style.setProperty('--progress', String(video.currentTime / video.duration));
    });
    video.addEventListener('error', function () {
      if (i === current) status.textContent = 'Não foi possível carregar este vídeo. Selecione outro para continuar.';
    });
    video.addEventListener('loadeddata', function () {
      if (i !== current && video.currentTime === 0) video.currentTime = 0.1;
    });
  });
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () { playbackReady = true; paused = false; select(Number(this.getAttribute('data-film'))); });
  }
  select(0);
  function updatePlaybackVisibility() {
    if (startTimer !== null) { clearTimeout(startTimer); startTimer = null; }
    if (!inView || document.hidden) {
      playbackReady = false;
      videos.forEach(function (video) { video.pause(); });
      return;
    }
    startTimer = setTimeout(function () {
      startTimer = null;
      if (inView && !document.hidden) { playbackReady = true; if (!paused) play(); }
    }, 2000);
  }
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      var visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      if (visible !== inView) { inView = visible; updatePlaybackVisibility(); }
    }, {threshold: [0, 0.35]});
    observer.observe(document.querySelector('.film-deck'));
  } else {
    function checkVisibility() {
      var rect = document.querySelector('.film-deck').getBoundingClientRect();
      var visible = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0) >= Math.min(rect.height, innerHeight) * 0.35;
      if (visible !== inView) { inView = visible; updatePlaybackVisibility(); }
    }
    window.addEventListener('scroll', checkVisibility, {passive:true}); checkVisibility();
  }
  document.addEventListener('visibilitychange', updatePlaybackVisibility);
})();

(function () {
  var rows = document.querySelectorAll('.strategy-row');
  rows.forEach(function (row) {
    row.addEventListener('toggle', function () {
      if (row.open) rows.forEach(function (other) { if (other !== row) other.open = false; });
    });
  });
  var deck = document.querySelector('.film-deck');
  if (!deck) return;
  var startX = null;
  var dragged = false;
  deck.addEventListener('click', function (event) {
    if (dragged) { event.preventDefault(); event.stopImmediatePropagation(); dragged = false; }
  }, true);
  deck.addEventListener('pointerdown', function (event) { startX = event.clientX; dragged = false; });
  deck.addEventListener('pointerup', function (event) {
    if (startX === null) return;
    var delta = event.clientX - startX;
    startX = null;
    if (Math.abs(delta) < 45) return;
    dragged = true;
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-film]'));
    var current = buttons.findIndex(function (button) { return button.getAttribute('aria-pressed') === 'true'; });
    buttons[(current + (delta < 0 ? 1 : 2)) % 3].click();
  });
  deck.addEventListener('pointercancel', function () { startX = null; });
})();

(function () {
  var panels = Array.prototype.slice.call(document.querySelectorAll('.offer-panel'));
  var offerVideos = Array.from(document.querySelectorAll('.offer-media video'));
  var visiblePanels = new Set();
  var canObserve = 'IntersectionObserver' in window;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function syncOfferVideos() {
    offerVideos.forEach(function (video) {
      var panel = video.closest('.offer-panel');
      var visible = !canObserve || visiblePanels.has(panel);
      if (visible && !document.hidden && !reducedMotion.matches && panel.classList.contains('is-active')) {
        if (video.paused) video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  }

  if (offerVideos.length) {
    var offerObserver = canObserve ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visiblePanels.add(entry.target);
        else visiblePanels.delete(entry.target);
      });
      syncOfferVideos();
    }) : null;
    offerVideos.forEach(function (video) {
      var media = video.parentElement;
      video.muted = true;
      video.addEventListener('playing', function () { media.classList.add('has-video-frame'); });
      video.addEventListener('error', function () { media.classList.remove('has-video-frame'); });
      if (offerObserver) offerObserver.observe(video.closest('.offer-panel'));
    });
    document.addEventListener('visibilitychange', syncOfferVideos);
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', syncOfferVideos);
  }

  var gallery = document.querySelector('.offer-gallery');
  var galleryPanel = gallery && gallery.closest('.offer-panel');

  function startOfferGallery() {
    var template = gallery.querySelector('template');
    if (!template) return;

    var sets = Array.from({ length: 3 }, function () {
      var column = document.createElement('div');
      var track = document.createElement('div');
      var set = document.createElement('div');
      column.className = 'offer-gallery-column';
      track.className = 'offer-gallery-track';
      set.className = 'offer-gallery-set';
      track.appendChild(set);
      column.appendChild(track);
      gallery.appendChild(column);
      return set;
    });

    Array.from(template.content.children).forEach(function (image, index) {
      sets[index % sets.length].appendChild(image);
    });
    sets.forEach(function (set) { set.parentElement.appendChild(set.cloneNode(true)); });
    template.remove();
  }

  if (gallery) {
    if (canObserve) {
      var galleryObserver = new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        gallery.classList.toggle('is-in-view', visible);
        if (visible && galleryPanel.classList.contains('is-active')) startOfferGallery();
      });
      galleryObserver.observe(gallery);
    } else {
      gallery.classList.add('is-in-view');
      if (galleryPanel.classList.contains('is-active')) startOfferGallery();
    }
  }

  panels.forEach(function (panel) {
    panel.querySelector('.offer-trigger').addEventListener('click', function () {
      panels.forEach(function (other) {
        var active = other === panel;
        other.classList.toggle('is-active', active);
        other.querySelector('.offer-trigger').setAttribute('aria-expanded', String(active));
      });
      if (panel === galleryPanel) startOfferGallery();
      syncOfferVideos();
    });
  });
  var strip = document.querySelector('.feedback-grid');
  if (!strip) return;
  var track = document.createElement('div');
  track.className = 'feedback-track';
  var originals = Array.prototype.slice.call(strip.children);
  originals.forEach(function (card) { track.appendChild(card); });
  strip.appendChild(track);
  // Repeat complete groups so even wide screens stay filled throughout the loop.
  for (var group = 0; group < 3; group++) originals.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    var playButton = clone.querySelector('.feedback-play');
    if (playButton) playButton.tabIndex = -1;
    track.appendChild(clone);
  });
  var cycle = 0, offset = 0, last = null, dragging = false, pointer = 0;
  var feedbackAudio = document.getElementById('feedbackAudioBrenda');
  var keyboardOnAudio = false;
  var pointerOnAudio = false;

  if (feedbackAudio) {
    var playButtons = strip.querySelectorAll('.feedback-play');
    var waveforms = strip.querySelectorAll('.feedback-waveform');

    playButtons.forEach(function (button) {
      button.addEventListener('pointerenter', function (event) {
        pointerOnAudio = event.pointerType === 'mouse';
      });
      button.addEventListener('pointerleave', function () { pointerOnAudio = false; });
    });

    function updateAudioState() {
      var playing = !feedbackAudio.paused && !feedbackAudio.ended;
      strip.classList.toggle('is-audio-playing', playing);
      playButtons.forEach(function (button) {
        button.setAttribute('aria-label', (playing ? 'Pausar' : 'Ouvir') + ' depoimento de Brenda Rocha');
      });
    }

    function updateWaveforms() {
      var progress = Number.isFinite(feedbackAudio.duration) && feedbackAudio.duration > 0
        ? feedbackAudio.currentTime / feedbackAudio.duration
        : 0;
      waveforms.forEach(function (waveform) {
        Array.from(waveform.children).forEach(function (bar, index) {
          bar.classList.toggle('is-played', index < Math.round(progress * waveform.children.length));
        });
      });
    }

    ['play', 'pause', 'ended'].forEach(function (event) {
      feedbackAudio.addEventListener(event, updateAudioState);
    });
    feedbackAudio.addEventListener('timeupdate', updateWaveforms);
    strip.addEventListener('click', function (event) {
      if (!event.target.closest('.feedback-play')) return;
      if (feedbackAudio.paused) feedbackAudio.play().catch(updateAudioState);
      else feedbackAudio.pause();
    });
    strip.addEventListener('focusin', function (event) {
      if (!event.target.matches('.feedback-play:focus-visible')) return;
      keyboardOnAudio = true;
      var card = event.target.closest('.feedback-card');
      offset = Math.max(0, card.offsetLeft - Math.max(0, (strip.clientWidth - card.offsetWidth) / 2));
      render();
    });
    strip.addEventListener('focusout', function () { keyboardOnAudio = false; });
  }

  function measure() { cycle = track.children[originals.length].offsetLeft - track.children[0].offsetLeft; }
  function render() {
    if (cycle > 0) offset = ((offset % cycle) + cycle) % cycle;
    track.style.transform = 'translate3d(' + (-offset) + 'px,0,0)';
  }
  function frame(time) {
    var audioPlaying = feedbackAudio && !feedbackAudio.paused;
    if (last !== null && !dragging && !document.hidden && !audioPlaying && !keyboardOnAudio && !pointerOnAudio && !reducedMotion.matches) {
      offset += Math.min(time - last, 64) * 0.022;
    }
    last = time; render(); requestAnimationFrame(frame);
  }
  measure(); window.addEventListener('resize', measure);
  document.addEventListener('visibilitychange', function () { last = null; });
  document.querySelectorAll('[data-feedback-dir]').forEach(function (button) {
    button.addEventListener('click', function () { offset += (originals[0].getBoundingClientRect().width + 24) * Number(button.dataset.feedbackDir); render(); });
  });
  strip.addEventListener('pointerdown', function (event) {
    if (event.target.closest('.feedback-play')) return;
    dragging = true;
    pointer = event.clientX;
    strip.setPointerCapture(event.pointerId);
  });
  strip.addEventListener('pointermove', function (event) { if (dragging) { offset += pointer - event.clientX; pointer = event.clientX; render(); } });
  function stop() { dragging = false; }
  strip.addEventListener('pointerup', stop); strip.addEventListener('pointercancel', stop);
  requestAnimationFrame(frame);

})();

(function () {
  var header = document.querySelector('.topbar-wrap');
  var logo = document.querySelector('.brand');
  var hero = document.querySelector('.hero');
  if (!header || !logo || !hero) return;
  var queued = false;
  function update() {
    queued = false;
    var heroBottom = hero.getBoundingClientRect().bottom;
    var rect = logo.getBoundingClientRect();
    var split = Math.max(0, Math.min(100, (heroBottom - rect.top) / rect.height * 100));
    logo.style.setProperty('--blue-start', split + '%');
    header.classList.toggle('is-past-hero', heroBottom <= rect.top + rect.height / 2);
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  window.addEventListener('load', update);
  update();
})();

(function () {
  var steps = document.querySelectorAll('.process-step');
  if (!steps.length || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  steps.forEach(function (step) {
    step.classList.add('is-pending');
    observer.observe(step);
  });
})();

(function () {
  var section = document.querySelector('.why-section');
  if (!section) return;
  var rows = Array.prototype.slice.call(section.querySelectorAll('.why-content article'));
  var count = section.querySelector('.years-count');
  var counterStarted = false;
  function animateCount() {
    counterStarted = true;
    var start = null;
    function frame(time) {
      if (start === null) start = time;
      var progress = Math.min((time - start) / 1500, 1);
      count.textContent = String(Math.min(6, Math.floor((1 - Math.pow(1 - progress, 3)) * 6)));
      if (progress < 1) requestAnimationFrame(frame);
      else count.closest("strong").classList.add("count-finished");
    }
    requestAnimationFrame(frame);
  }
  var queued = false;
  function update() {
    queued = false;
    rows.forEach(function (row, index) {
      var passed = row.getBoundingClientRect().top < window.innerHeight * 0.62;
      if (passed && !row.classList.contains('is-highlighted') && !row.dataset.fillPending) {
        row.dataset.fillPending = 'true';
        window.setTimeout(function () {
          if (row.getBoundingClientRect().top < window.innerHeight * 0.62) row.classList.add('is-highlighted');
          delete row.dataset.fillPending;
        }, index * 650);
      } else if (!passed) row.classList.remove('is-highlighted');
    });
    if (count && !counterStarted && count.getBoundingClientRect().top < window.innerHeight * 0.92) animateCount();
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', schedule, {passive:true}); window.addEventListener('resize', schedule); update();
})();

(function () {
  var section = document.querySelector('.multichannel');
  if (!section) return;
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { section.classList.add('is-connected'); observer.disconnect(); }
    }, {threshold:0.25});
    observer.observe(section);
  } else section.classList.add('is-connected');
})();
