/* =========================================================
   Prefix Planet — 45-question mission engine
   ครูสามารถเปิด/ปิดเวลาได้ที่ CONFIG.timerEnabled
   ========================================================= */
(function () {
  'use strict';

  const PP = window.PrefixPlanet;
  const questions = Array.isArray(window.PREFIX_QUESTIONS) ? window.PREFIX_QUESTIONS : [];
  if (!PP) return;

  const CONFIG = Object.freeze({
    timerEnabled: true,
    durationSeconds: 45 * 60,
    passingScore: 36
  });

  const planetNames = ['Meaning Moon', 'Base Word Forest', 'Word Factory', 'Sentence City', 'Master Galaxy'];
  const typeLabels = {
    'multiple-choice': 'Multiple Choice',
    'word-assembly': 'Word Assembly',
    'matching': 'Matching',
    'sentence-completion': 'Sentence Completion',
    'boss-analysis': 'Boss Analysis'
  };

  const freshState = () => ({
    version: 1,
    started: false,
    submitted: false,
    currentIndex: 0,
    answers: {},
    flagged: [],
    celebratedPlanets: [],
    startedAt: null,
    endTime: null,
    timerEnabled: CONFIG.timerEnabled,
    timedOut: false
  });

  function loadState() {
    const stored = PP.read(PP.KEYS.mission, null);
    if (!stored || typeof stored !== 'object') return freshState();
    const validAnswers = stored.answers && typeof stored.answers === 'object' ? stored.answers : {};
    return {
      ...freshState(),
      ...stored,
      currentIndex: Number.isInteger(stored.currentIndex) ? Math.max(0, Math.min(44, stored.currentIndex)) : 0,
      answers: validAnswers,
      flagged: Array.isArray(stored.flagged) ? stored.flagged.filter((id) => Number.isInteger(id)) : [],
      celebratedPlanets: Array.isArray(stored.celebratedPlanets) ? stored.celebratedPlanets : []
    };
  }

  let state = loadState();
  let timerInterval = null;
  let transitionTimeout = null;
  let submitLocked = false;

  const answerCount = () => questions.filter((question) => Object.prototype.hasOwnProperty.call(state.answers, question.id)).length;
  const unansweredIds = () => questions.filter((question) => !Object.prototype.hasOwnProperty.call(state.answers, question.id)).map((question) => question.id);
  const planetIsComplete = (planet) => questions.filter((question) => question.planet === planet).every((question) => Object.prototype.hasOwnProperty.call(state.answers, question.id));
  const completedPlanets = () => [1, 2, 3, 4, 5].filter(planetIsComplete);

  function saveState() {
    PP.write(PP.KEYS.mission, state);
  }

  function renderProfile() {
    const profile = PP.getProfile();
    const startButton = document.getElementById('start-mission');
    document.getElementById('mission-avatar').textContent = profile ? profile.avatar : '👤';
    document.getElementById('mission-name').textContent = profile ? profile.name : 'ยังไม่ได้สร้างโปรไฟล์';
    document.getElementById('mission-class').textContent = profile ? `${profile.classroom} · เลขที่ ${profile.number}` : 'กรุณากรอกข้อมูลก่อนเริ่มภารกิจ';
    startButton.disabled = !profile;
    if (state.submitted) {
      startButton.disabled = false;
      startButton.textContent = '📊 ดูผลคะแนนล่าสุด';
      document.getElementById('mission-start-message').textContent = 'ภารกิจครั้งล่าสุดถูกส่งแล้ว คุณสามารถดูคะแนนหรือเริ่มใหม่จากหน้าผลการเรียน';
    } else if (state.started) {
      startButton.textContent = '🚀 ทำภารกิจต่อ';
      document.getElementById('mission-start-message').textContent = `บันทึกคำตอบแล้ว ${answerCount()} จาก 45 ข้อ`;
    } else {
      startButton.textContent = '🚀 เริ่มภารกิจ';
      document.getElementById('mission-start-message').textContent = profile ? 'พร้อมออกเดินทางแล้ว!' : 'สร้างโปรไฟล์เพื่อปลดล็อกปุ่มเริ่มภารกิจ';
    }
  }

  function startMission() {
    if (state.submitted) {
      location.assign('result.html');
      return;
    }
    if (!PP.getProfile()) {
      PP.openProfileModal();
      return;
    }
    if (!state.started) {
      state = freshState();
      state.started = true;
      state.startedAt = Date.now();
      state.timerEnabled = CONFIG.timerEnabled;
      state.endTime = CONFIG.timerEnabled ? Date.now() + (CONFIG.durationSeconds * 1000) : null;
      PP.remove(PP.KEYS.result);
      saveState();
    }
    document.getElementById('mission-start-section').hidden = true;
    document.getElementById('mission-page-hero').hidden = true;
    document.getElementById('exam-shell').hidden = false;
    document.getElementById('site-footer').hidden = true;
    const missionScene = document.getElementById('mission-scene');
    const examLayout = document.querySelector('.exam-layout');
    if (missionScene && examLayout && !missionScene.classList.contains('exam-mini-scene')) {
      missionScene.classList.add('exam-mini-scene');
      examLayout.before(missionScene);
    }
    renderQuestion();
    startTimer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderQuestion() {
    const question = questions[state.currentIndex];
    if (!question) return;
    const selected = state.answers[question.id];
    document.getElementById('exam-planet-name').textContent = planetNames[question.planet - 1];
    document.getElementById('exam-counter').textContent = `ข้อที่ ${question.id} จาก 45`;
    document.getElementById('question-type').textContent = typeLabels[question.type] || question.type;
    document.getElementById('boss-chip').hidden = !question.boss;
    document.getElementById('question-text').textContent = question.question;

    const options = document.getElementById('answer-options');
    options.innerHTML = question.options.map((option, index) => {
      const inputId = `answer-${question.id}-${index}`;
      return `<div class="answer-choice"><input type="radio" id="${inputId}" name="question-${question.id}" value="${PP.escapeHTML(option)}" ${selected === option ? 'checked' : ''}><label for="${inputId}" data-letter="${String.fromCharCode(65 + index)}"><span class="en">${PP.escapeHTML(option)}</span></label></div>`;
    }).join('');
    options.querySelectorAll('input').forEach((input) => input.addEventListener('change', () => recordAnswer(question.id, input.value)));

    const flagged = state.flagged.includes(question.id);
    const flagButton = document.getElementById('flag-question');
    flagButton.setAttribute('aria-pressed', String(flagged));
    flagButton.innerHTML = flagged ? '★ ทำเครื่องหมายไว้แล้ว' : '☆ ทำเครื่องหมายไว้ทบทวน';
    document.getElementById('previous-question').disabled = state.currentIndex === 0;
    document.getElementById('next-question').disabled = state.currentIndex === questions.length - 1;
    document.getElementById('save-next-question').textContent = state.currentIndex === questions.length - 1 ? 'ตรวจความครบถ้วน ✓' : 'บันทึกและไปข้อต่อไป →';
    updateMissionHUD();
    updateNavigator();
    updatePuffyMessage();
    document.getElementById('question-card').focus?.({ preventScroll: true });
  }

  function recordAnswer(questionId, value) {
    const beforeCompleted = completedPlanets();
    state.answers[questionId] = value;
    saveState();
    PP.playTone('click');
    updateMissionHUD();
    updateNavigator();

    const question = questions.find((item) => item.id === questionId);
    const planet = question?.planet;
    if (planet && !beforeCompleted.includes(planet) && planetIsComplete(planet) && !state.celebratedPlanets.includes(planet)) {
      state.celebratedPlanets.push(planet);
      saveState();
      showPlanetTransition(planet);
    }
  }

  function updateMissionHUD() {
    const answered = answerCount();
    const percent = Math.round((answered / questions.length) * 100);
    const crystals = completedPlanets();
    document.getElementById('energy-fill').style.setProperty('--energy', `${percent}%`);
    document.getElementById('energy-label').textContent = `${percent}%`;
    document.getElementById('crystal-count').textContent = `${crystals.length}/5`;
    const shipStep = Math.floor(answered / 3);
    const shipLeft = Math.min(92, 3 + (shipStep / 15) * 89);
    document.getElementById('ship-marker').style.setProperty('--ship-left', `${shipLeft}%`);

    const currentPlanet = questions[state.currentIndex]?.planet || 1;
    document.querySelectorAll('[data-planet-node]').forEach((node) => {
      const planet = Number(node.dataset.planetNode);
      node.classList.toggle('active', planet === currentPlanet);
      node.classList.toggle('completed', crystals.includes(planet));
      if (crystals.includes(planet)) node.setAttribute('aria-label', `ดาวที่ ${planet} ตอบครบแล้ว`);
      else if (planet === currentPlanet) node.setAttribute('aria-label', `ดาวที่ ${planet} กำลังทำ`);
      else node.setAttribute('aria-label', `ดาวที่ ${planet} ยังตอบไม่ครบ`);
    });
    document.querySelectorAll('.css-map-planet').forEach((node, index) => {
      const planet = index + 1;
      node.classList.toggle('unlocked', planet === 1 || crystals.includes(planet - 1) || crystals.includes(planet));
      node.classList.toggle('completed', crystals.includes(planet));
      node.classList.toggle('active', planet === currentPlanet);
    });
    document.dispatchEvent(new CustomEvent('prefixplanet:mission-progress', { detail: { answered, crystals, currentPlanet } }));
  }

  function updateNavigator() {
    const host = document.getElementById('question-navigator');
    if (!host) return;
    host.innerHTML = questions.map((question, index) => {
      const classes = ['nav-number'];
      if (Object.prototype.hasOwnProperty.call(state.answers, question.id)) classes.push('answered');
      if (state.flagged.includes(question.id)) classes.push('flagged');
      if (index === state.currentIndex) classes.push('current');
      const parts = [`ข้อ ${question.id}`];
      if (Object.prototype.hasOwnProperty.call(state.answers, question.id)) parts.push('ตอบแล้ว'); else parts.push('ยังไม่ตอบ');
      if (state.flagged.includes(question.id)) parts.push('ทำเครื่องหมายไว้');
      return `<button class="${classes.join(' ')}" type="button" data-go-question="${index}" aria-label="${parts.join(' · ')}" ${index === state.currentIndex ? 'aria-current="step"' : ''}>${question.id}</button>`;
    }).join('');
    host.querySelectorAll('[data-go-question]').forEach((button) => button.addEventListener('click', () => goToQuestion(Number(button.dataset.goQuestion))));
  }

  function goToQuestion(index) {
    state.currentIndex = Math.max(0, Math.min(questions.length - 1, index));
    saveState();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updatePuffyMessage() {
    const answered = answerCount();
    let message = 'เดินทางมาได้ดีมาก!';
    if (answered >= 36) message = 'อีกนิดเดียวก็ถึงดาวดวงสุดท้ายแล้ว!';
    else if (state.flagged.length) message = 'อย่าลืมกลับไปตรวจข้อที่ทำเครื่องหมายไว้นะ!';
    else if (answered >= 18) message = 'เกินครึ่งทางแล้ว รักษาสมาธิไว้นะ!';
    else if ((state.currentIndex + 1) % 9 >= 7) message = 'อีกนิดเดียวก็ถึงดาวดวงต่อไปแล้ว!';
    document.getElementById('puffy-message').textContent = message;
  }

  function toggleFlag() {
    const id = questions[state.currentIndex].id;
    state.flagged = state.flagged.includes(id) ? state.flagged.filter((item) => item !== id) : [...state.flagged, id];
    saveState();
    PP.playTone('click');
    renderQuestion();
  }

  function showPlanetTransition(planet) {
    const overlay = document.getElementById('planet-transition');
    document.getElementById('transition-title').textContent = `ได้รับ Crystal จาก ${planetNames[planet - 1]}!`;
    document.getElementById('transition-message').textContent = planet < 5
      ? `ตอบครบ 9 ข้อแล้ว ยานกำลังเดินทางไปยัง ${planetNames[planet]}`
      : 'ตอบครบทั้ง 45 ข้อแล้ว ตรวจสอบคำตอบก่อนส่งภารกิจได้เลย';
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    PP.playTone('crystal');
    document.getElementById('skip-transition').focus();
    window.clearTimeout(transitionTimeout);
    transitionTimeout = window.setTimeout(() => closePlanetTransition(planet), 2600);
  }

  function closePlanetTransition(planet = questions[state.currentIndex]?.planet || 1) {
    const overlay = document.getElementById('planet-transition');
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    window.clearTimeout(transitionTimeout);
    if (planet < 5 && state.currentIndex < planet * 9) {
      goToQuestion(planet * 9);
    } else {
      renderQuestion();
    }
  }

  function startTimer() {
    window.clearInterval(timerInterval);
    const timer = document.getElementById('mission-timer');
    if (!state.timerEnabled) {
      timer.textContent = 'ไม่จับเวลา';
      timer.classList.remove('warning', 'danger');
      return;
    }
    if (!state.endTime) {
      state.endTime = Date.now() + (CONFIG.durationSeconds * 1000);
      saveState();
    }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      timer.classList.toggle('warning', remaining <= 300 && remaining > 60);
      timer.classList.toggle('danger', remaining <= 60);
      timer.setAttribute('aria-label', `เหลือเวลา ${minutes} นาที ${seconds} วินาที`);
      if (remaining <= 0) {
        window.clearInterval(timerInterval);
        state.timedOut = true;
        saveState();
        PP.toast('หมดเวลา ระบบกำลังส่งคำตอบอัตโนมัติ', 'error', 4500);
        finalizeSubmission(true);
      }
    };
    tick();
    timerInterval = window.setInterval(tick, 1000);
  }

  function requestSubmission() {
    if (submitLocked) return;
    const missing = unansweredIds();
    if (missing.length) {
      PP.openModal({
        title: `ยังไม่ได้ตอบ ${missing.length} ข้อ`,
        body: `<p>ข้อที่ยังไม่ได้ตอบ:</p><div class="btn-row">${missing.map((id) => `<span class="chip chip-gold">${id}</span>`).join('')}</div><p class="muted" style="margin-top:16px">คุณสามารถกลับไปทำต่อ หรือส่งคำตอบโดยเว้นข้อเหล่านี้ไว้ได้</p>`,
        actions: [
          { label: 'กลับไปทำต่อ', className: 'btn btn-secondary' },
          { label: 'ยืนยันส่งคำตอบ', className: 'btn btn-danger', onClick: confirmSubmission }
        ]
      });
    } else {
      confirmSubmission();
    }
  }

  function confirmSubmission() {
    PP.openModal({
      title: 'ส่งคำตอบทั้งหมด?',
      body: `<p>เมื่อส่งแล้วจะไม่สามารถกลับมาแก้ไขคำตอบได้ ระบบจะแสดงคะแนนและเฉลยครบทั้ง 45 ข้อ</p><div class="soft-panel"><strong>ตอบแล้ว ${answerCount()} จาก 45 ข้อ</strong><br><span class="muted">ทำเครื่องหมายไว้ทบทวน ${state.flagged.length} ข้อ</span></div>`,
      actions: [
        { label: 'ตรวจคำตอบอีกครั้ง', className: 'btn btn-secondary' },
        { label: 'ส่งภารกิจ', className: 'btn', onClick: () => finalizeSubmission(false) }
      ]
    });
  }

  function finalizeSubmission(timedOut) {
    if (submitLocked || state.submitted) return;
    submitLocked = true;
    window.clearInterval(timerInterval);
    const submittedAt = Date.now();
    const result = {
      version: 1,
      profile: PP.getProfile(),
      answers: { ...state.answers },
      flagged: [...state.flagged],
      startedAt: state.startedAt || submittedAt,
      submittedAt,
      durationSeconds: Math.max(0, Math.round((submittedAt - (state.startedAt || submittedAt)) / 1000)),
      timedOut: Boolean(timedOut),
      timerEnabled: Boolean(state.timerEnabled)
    };
    state.submitted = true;
    state.timedOut = Boolean(timedOut);
    saveState();
    PP.write(PP.KEYS.result, result);
    PP.playTone('complete');
    location.assign('result.html');
  }

  function bindEvents() {
    document.getElementById('start-mission').addEventListener('click', startMission);
    document.getElementById('edit-mission-profile').addEventListener('click', PP.openProfileModal);
    document.getElementById('previous-question').addEventListener('click', () => goToQuestion(state.currentIndex - 1));
    document.getElementById('next-question').addEventListener('click', () => goToQuestion(state.currentIndex + 1));
    document.getElementById('save-next-question').addEventListener('click', () => {
      const question = questions[state.currentIndex];
      if (!Object.prototype.hasOwnProperty.call(state.answers, question.id)) {
        PP.toast('เลือกคำตอบก่อน หรือใช้ปุ่ม “ข้อต่อไป” หากต้องการข้าม', 'error');
        return;
      }
      if (state.currentIndex === questions.length - 1) requestSubmission();
      else goToQuestion(state.currentIndex + 1);
    });
    document.getElementById('flag-question').addEventListener('click', toggleFlag);
    document.getElementById('submit-mission').addEventListener('click', requestSubmission);
    document.getElementById('skip-transition').addEventListener('click', () => closePlanetTransition());
    document.getElementById('focus-mode').addEventListener('click', (event) => {
      const active = document.body.classList.toggle('focus-mode');
      event.currentTarget.setAttribute('aria-pressed', String(active));
      event.currentTarget.textContent = active ? '↙' : '🎯';
      event.currentTarget.setAttribute('aria-label', active ? 'ปิด Focus Mode' : 'เปิด Focus Mode');
    });

    document.addEventListener('prefixplanet:profile', renderProfile);
    document.addEventListener('keydown', (event) => {
      const modal = document.getElementById('global-modal');
      if (document.getElementById('exam-shell').hidden || (modal && !modal.hidden)) return;
      if (event.target.matches('input, button, select, textarea')) return;
      if (['1', '2', '3', '4'].includes(event.key)) {
        const input = document.querySelectorAll('#answer-options input')[Number(event.key) - 1];
        if (input) { input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); }
      }
      if (event.key === 'ArrowLeft' && state.currentIndex > 0) goToQuestion(state.currentIndex - 1);
      if (event.key === 'ArrowRight' && state.currentIndex < questions.length - 1) goToQuestion(state.currentIndex + 1);
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && state.started && !state.submitted) startTimer();
    });
  }

  function init() {
    if (!document.getElementById('mission-start-section')) return;
    if (questions.length !== 45) {
      document.getElementById('mission-start-message').textContent = 'ไม่สามารถโหลดคำถามครบ 45 ข้อได้ กรุณาโหลดหน้าใหม่';
      document.getElementById('start-mission').disabled = true;
      return;
    }
    renderProfile();
    bindEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
