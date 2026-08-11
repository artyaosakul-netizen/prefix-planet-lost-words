/* =========================================================
   Prefix Planet — Shared navigation, settings and utilities
   ========================================================= */
(function () {
  'use strict';

  const KEYS = Object.freeze({
    profile: 'prefixPlanetProfile',
    progress: 'prefixPlanetProgress',
    theme: 'prefixPlanetTheme',
    sound: 'prefixPlanetSound',
    favorites: 'prefixPlanetFavorites',
    mission: 'prefixPlanetMission',
    result: 'prefixPlanetResult',
    history: 'prefixPlanetHistory'
  });

  const avatars = ['🚀', '🪐', '🤖', '🌟', '🛰️', '👩‍🚀', '👨‍🚀', '🌙'];
  const defaultProgress = Object.freeze({
    lessons: [],
    games: {},
    crystals: [],
    latestScore: 0,
    bestScore: 0,
    attempts: 0,
    badges: []
  });

  const safeJSON = (value, fallback) => {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (_error) {
      return fallback;
    }
  };

  const read = (key, fallback = null) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : safeJSON(value, fallback);
    } catch (_error) {
      return fallback;
    }
  };

  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_error) {
      return false;
    }
  };

  const remove = (key) => {
    try { localStorage.removeItem(key); } catch (_error) { /* Storage may be unavailable. */ }
  };

  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const getProfile = () => {
    const profile = read(KEYS.profile, null);
    if (!profile || typeof profile.name !== 'string') return null;
    return {
      name: profile.name.slice(0, 100),
      classroom: String(profile.classroom || '').slice(0, 30),
      number: String(profile.number || '').slice(0, 10),
      avatar: avatars.includes(profile.avatar) ? profile.avatar : avatars[0]
    };
  };

  const getProgress = () => {
    const stored = read(KEYS.progress, {});
    return {
      ...defaultProgress,
      ...stored,
      lessons: Array.isArray(stored.lessons) ? stored.lessons : [],
      games: stored.games && typeof stored.games === 'object' ? stored.games : {},
      crystals: Array.isArray(stored.crystals) ? stored.crystals : [],
      badges: Array.isArray(stored.badges) ? stored.badges : []
    };
  };

  const updateProgress = (updates) => {
    const next = { ...getProgress(), ...updates };
    write(KEYS.progress, next);
    document.dispatchEvent(new CustomEvent('prefixplanet:progress', { detail: next }));
    return next;
  };

  const currentPage = () => {
    const name = location.pathname.split('/').pop() || 'index.html';
    return name === '' ? 'index.html' : name;
  };

  const puffy = (mood = 'happy', label = 'Puffy หุ่นยนต์ผู้ช่วย') => `
    <div class="puffy" data-mood="${escapeHTML(mood)}" role="img" aria-label="${escapeHTML(label)}">
      <div class="puffy-face" aria-hidden="true">
        <span class="puffy-eye left"></span><span class="puffy-eye right"></span><span class="puffy-mouth"></span>
      </div>
    </div>`;

  function renderHeader() {
    const host = document.getElementById('site-header');
    if (!host) return;
    const page = currentPage();
    const isPractice = page === 'content.html' && location.hash === '#practice';
    const profile = getProfile();
    const navItems = [
      ['index.html', 'หน้าแรก'],
      ['content.html', 'เรียนรู้ Prefix'],
      ['vocabulary.html', 'คลังคำศัพท์'],
      ['content.html#practice', 'เกมฝึกฝน'],
      ['mission.html', 'ภารกิจ 45 ข้อ'],
      ['result.html', 'ผลการเรียน']
    ];

    const links = navItems.map(([href, label]) => {
      const file = href.split('#')[0];
      const hash = href.includes('#') ? `#${href.split('#')[1]}` : '';
      const active = file === page && ((hash && isPractice) || (!hash && !isPractice));
      return `<li><a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a></li>`;
    }).join('');

    host.innerHTML = `
      <a class="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
      <header class="site-header">
        <div class="container nav-inner">
          <a class="brand" href="index.html" aria-label="Prefix Planet หน้าแรก">
            <span class="brand-orbit" aria-hidden="true">P</span>
            <span>Prefix Planet</span>
          </a>
          <nav aria-label="เมนูหลัก">
            <ul class="nav-links" id="main-nav">${links}</ul>
          </nav>
          <div class="nav-actions">
            <button class="icon-btn progress-nav-btn" type="button" data-action="progress" aria-label="แสดงความก้าวหน้า" title="ความก้าวหน้า">📊</button>
            <button class="icon-btn sound-btn" type="button" data-action="sound" aria-label="เปิดหรือปิดเสียง" title="เปิดหรือปิดเสียง">🔊</button>
            <button class="icon-btn" type="button" data-action="theme" aria-label="สลับโหมดสว่างและมืด" title="สลับธีม">🌙</button>
            <button class="icon-btn avatar-btn" type="button" data-action="profile" aria-label="แก้ไขข้อมูลผู้เรียน" title="ข้อมูลผู้เรียน">${profile ? escapeHTML(profile.avatar) : '👤'}</button>
            <button class="icon-btn menu-toggle" type="button" data-action="menu" aria-label="เปิดเมนู" aria-expanded="false" aria-controls="main-nav">☰</button>
          </div>
        </div>
      </header>`;
  }

  function renderFooter() {
    const host = document.getElementById('site-footer');
    if (!host) return;
    host.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a class="brand" href="index.html"><span class="brand-orbit" aria-hidden="true">P</span><span>Prefix Planet</span></a>
              <p class="muted" style="margin:12px 0 0">เติมคำหน้า เปลี่ยนความหมาย พิชิตจักรวาลคำศัพท์</p>
            </div>
            <div>
              <strong>ออกเดินทาง</strong>
              <div class="footer-links"><a href="content.html">เรียนรู้ Prefix</a><a href="vocabulary.html">คลังคำศัพท์</a><a href="content.html#practice">เกมฝึกฝน</a></div>
            </div>
            <div>
              <strong>ภารกิจ</strong>
              <div class="footer-links"><a href="mission.html">ข้อสอบ 45 ข้อ</a><a href="result.html">ผลการเรียน</a><button class="btn btn-secondary btn-sm" type="button" data-action="progress">ดูความก้าวหน้า</button></div>
            </div>
          </div>
          <p class="footer-note">สื่อการเรียนรู้สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 4–6 · ข้อมูลการเรียนเก็บไว้ในอุปกรณ์นี้เท่านั้น</p>
        </div>
      </footer>`;
  }

  let audioContext = null;
  const soundEnabled = () => {
    try { return localStorage.getItem(KEYS.sound) !== 'off'; } catch (_error) { return true; }
  };

  const playTone = (kind = 'click') => {
    if (!soundEnabled()) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try {
      audioContext = audioContext || new AudioCtor();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const map = {
        click: [420, 0.045, 'sine'],
        correct: [740, 0.13, 'sine'],
        wrong: [190, 0.16, 'triangle'],
        crystal: [980, 0.22, 'sine'],
        complete: [620, 0.28, 'sine']
      };
      const [frequency, duration, wave] = map[kind] || map.click;
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      if (kind === 'correct' || kind === 'complete') {
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.35, audioContext.currentTime + duration);
      }
      gain.gain.setValueAtTime(0.045, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (_error) { /* Audio is an enhancement; learning remains available. */ }
  };

  const speak = (text, lang = 'en-US') => {
    if (!('speechSynthesis' in window) || !text) {
      toast('อุปกรณ์นี้ไม่รองรับการออกเสียง', 'error');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };

  function applyTheme(theme) {
    const resolved = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = resolved;
    try { localStorage.setItem(KEYS.theme, resolved); } catch (_error) { /* Ignore. */ }
    const button = document.querySelector('[data-action="theme"]');
    if (button) {
      button.textContent = resolved === 'dark' ? '☀️' : '🌙';
      button.setAttribute('aria-label', resolved === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด');
    }
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(KEYS.theme); } catch (_error) { /* Ignore. */ }
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (systemDark ? 'dark' : 'light'));
  }

  function updateSoundButton() {
    const button = document.querySelector('[data-action="sound"]');
    if (!button) return;
    button.textContent = soundEnabled() ? '🔊' : '🔇';
    button.setAttribute('aria-label', soundEnabled() ? 'ปิดเสียง' : 'เปิดเสียง');
  }

  function ensureUIHosts() {
    if (!document.getElementById('global-modal')) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-backdrop" id="global-modal" role="presentation" hidden>
          <section class="modal" role="dialog" aria-modal="true" aria-labelledby="global-modal-title">
            <div class="modal-header"><div><span class="eyebrow">Prefix Planet</span><h2 id="global-modal-title"></h2></div><button class="icon-btn modal-close" type="button" aria-label="ปิดหน้าต่าง">✕</button></div>
            <div id="global-modal-body"></div>
            <div class="modal-actions" id="global-modal-actions"></div>
          </section>
        </div>
        <div class="toast-region" id="toast-region" aria-live="polite" aria-atomic="true"></div>
        <button class="icon-btn back-to-top" id="back-to-top" type="button" aria-label="กลับขึ้นด้านบน">↑</button>`);
    }
  }

  let previousFocus = null;
  function closeModal() {
    const backdrop = document.getElementById('global-modal');
    if (!backdrop) return;
    backdrop.hidden = true;
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  function openModal({ title, body = '', actions = [], onOpen = null }) {
    ensureUIHosts();
    const backdrop = document.getElementById('global-modal');
    const titleNode = document.getElementById('global-modal-title');
    const bodyNode = document.getElementById('global-modal-body');
    const actionsNode = document.getElementById('global-modal-actions');
    previousFocus = document.activeElement;
    titleNode.textContent = title;
    bodyNode.innerHTML = body;
    actionsNode.innerHTML = '';
    actions.forEach((action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = action.className || 'btn';
      button.textContent = action.label;
      button.addEventListener('click', () => {
        if (action.close !== false) closeModal();
        if (typeof action.onClick === 'function') action.onClick();
      });
      actionsNode.appendChild(button);
    });
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    backdrop.querySelector('.modal-close').focus();
    if (typeof onOpen === 'function') onOpen(bodyNode, actionsNode);
  }

  function toast(message, type = 'success', duration = 3200) {
    ensureUIHosts();
    const region = document.getElementById('toast-region');
    const item = document.createElement('div');
    item.className = `toast ${type}`;
    item.setAttribute('role', 'status');
    item.textContent = message;
    region.appendChild(item);
    window.setTimeout(() => item.remove(), duration);
  }

  function profileFormHTML(profile = getProfile()) {
    const data = profile || { name: '', classroom: '', number: '', avatar: avatars[0] };
    return `
      <form id="modal-profile-form" class="form-grid" novalidate>
        <div class="field" style="grid-column:1/-1"><label for="modal-name">ชื่อ–นามสกุล</label><input id="modal-name" name="name" maxlength="100" required value="${escapeHTML(data.name)}" autocomplete="name"></div>
        <div class="field"><label for="modal-class">ชั้นเรียน</label><input id="modal-class" name="classroom" maxlength="30" required value="${escapeHTML(data.classroom)}"><small>ตัวอย่าง: ม.5/2</small></div>
        <div class="field"><label for="modal-number">เลขที่</label><input id="modal-number" name="number" maxlength="10" inputmode="numeric" required value="${escapeHTML(data.number)}"></div>
        <fieldset style="grid-column:1/-1;border:0;padding:0;margin:5px 0"><legend style="font-weight:800;margin-bottom:8px">เลือก Avatar</legend>
          <div class="avatar-picker">${avatars.slice(0, 6).map((avatar) => `<label class="avatar-option"><input type="radio" name="avatar" value="${avatar}" ${data.avatar === avatar ? 'checked' : ''}><span aria-hidden="true">${avatar}</span><span class="sr-only">Avatar ${avatar}</span></label>`).join('')}</div>
        </fieldset>
        <p id="modal-profile-error" class="danger-text" role="alert" style="grid-column:1/-1;margin:0"></p>
      </form>`;
  }

  function saveProfileForm(form) {
    const formData = new FormData(form);
    const profile = {
      name: String(formData.get('name') || '').trim(),
      classroom: String(formData.get('classroom') || '').trim(),
      number: String(formData.get('number') || '').trim(),
      avatar: String(formData.get('avatar') || avatars[0])
    };
    const error = form.querySelector('#modal-profile-error');
    if (!profile.name || !profile.classroom || !profile.number) {
      if (error) error.textContent = 'กรุณากรอกชื่อ ชั้นเรียน และเลขที่ให้ครบถ้วน';
      return false;
    }
    if (!avatars.includes(profile.avatar)) profile.avatar = avatars[0];
    write(KEYS.profile, profile);
    document.dispatchEvent(new CustomEvent('prefixplanet:profile', { detail: profile }));
    renderHeader();
    bindSharedActions();
    toast('บันทึกข้อมูลผู้เรียนแล้ว');
    return true;
  }

  function openProfileModal() {
    openModal({
      title: getProfile() ? 'แก้ไขข้อมูลผู้เรียน' : 'สร้างโปรไฟล์ Word Explorer',
      body: profileFormHTML(),
      actions: [
        { label: 'ยกเลิก', className: 'btn btn-secondary' },
        {
          label: 'บันทึกโปรไฟล์', close: false,
          onClick: () => {
            const form = document.getElementById('modal-profile-form');
            if (form && saveProfileForm(form)) closeModal();
          }
        }
      ]
    });
  }

  function openProgressModal() {
    const progress = getProgress();
    const lessonCount = progress.lessons.length;
    const gameCount = Object.keys(progress.games).filter((key) => progress.games[key] > 0).length;
    const overall = Math.round(((lessonCount / 4) * 35) + ((gameCount / 4) * 25) + ((progress.bestScore / 45) * 40));
    const badgeList = progress.badges.length ? progress.badges.map((badge) => `<span class="chip chip-gold">🏅 ${escapeHTML(badge)}</span>`).join(' ') : '<span class="muted">ยังไม่มี Badge — ออกเดินทางต่อได้เลย!</span>';
    openModal({
      title: 'ความก้าวหน้าของคุณ',
      body: `
        <div class="progress-track" aria-label="ความก้าวหน้ารวม ${overall}%"><div class="progress-fill" style="--progress:${overall}%"></div></div>
        <p style="text-align:center;margin:8px 0 18px"><strong>${overall}%</strong> ของเส้นทางการเรียนรู้</p>
        <div class="progress-grid">
          <div class="stat-card soft-panel"><div class="stat-value">${lessonCount}/4</div><div class="stat-label">บทเรียน</div></div>
          <div class="stat-card soft-panel"><div class="stat-value">${gameCount}/4</div><div class="stat-label">เกมฝึกฝน</div></div>
          <div class="stat-card soft-panel"><div class="stat-value">${progress.latestScore}/45</div><div class="stat-label">คะแนนล่าสุด</div></div>
          <div class="stat-card soft-panel"><div class="stat-value">${progress.bestScore}/45</div><div class="stat-label">คะแนนสูงสุด</div></div>
        </div>
        <h3 style="margin:20px 0 9px">Badge ที่ได้รับ</h3><div class="btn-row">${badgeList}</div>`,
      actions: [{ label: 'ปิด', className: 'btn btn-secondary' }]
    });
  }

  function confirmDataClear(mode = 'all') {
    const all = mode === 'all';
    openModal({
      title: all ? 'ล้างข้อมูลการเรียนทั้งหมด?' : 'ล้างประวัติข้อสอบ?',
      body: `<p>การดำเนินการนี้จะลบ${all ? 'โปรไฟล์ ความก้าวหน้า คำตอบ และประวัติทั้งหมด' : 'ผลสอบย้อนหลังทั้งหมด'}จากอุปกรณ์นี้ และไม่สามารถเรียกคืนได้</p>`,
      actions: [
        { label: 'ยกเลิก', className: 'btn btn-secondary' },
        { label: 'ยืนยันการลบ', className: 'btn btn-danger', onClick: () => {
          if (all) Object.values(KEYS).forEach(remove);
          else remove(KEYS.history);
          toast('ล้างข้อมูลเรียบร้อยแล้ว');
          if (all) window.setTimeout(() => location.assign('index.html'), 650);
          else document.dispatchEvent(new CustomEvent('prefixplanet:history-cleared'));
        } }
      ]
    });
  }

  function bindSharedActions() {
    document.querySelectorAll('[data-action]').forEach((button) => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        playTone('click');
        if (action === 'menu') {
          const nav = document.getElementById('main-nav');
          const open = nav.classList.toggle('open');
          button.setAttribute('aria-expanded', String(open));
          button.textContent = open ? '✕' : '☰';
        }
        if (action === 'theme') applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
        if (action === 'sound') {
          try { localStorage.setItem(KEYS.sound, soundEnabled() ? 'off' : 'on'); } catch (_error) { /* Ignore. */ }
          updateSoundButton();
          if (soundEnabled()) playTone('correct');
          toast(soundEnabled() ? 'เปิดเสียงแล้ว' : 'ปิดเสียงแล้ว');
        }
        if (action === 'profile') openProfileModal();
        if (action === 'progress') openProgressModal();
        if (action === 'clear-all') confirmDataClear('all');
        if (action === 'clear-history') confirmDataClear('history');
      });
    });
  }

  function initGlobalEvents() {
    const modal = document.getElementById('global-modal');
    modal?.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('.modal-close')) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal && !modal.hidden) closeModal();
    });

    const topButton = document.getElementById('back-to-top');
    const updateTopButton = () => topButton?.classList.toggle('visible', window.scrollY > 500);
    window.addEventListener('scroll', updateTopButton, { passive: true });
    topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    document.addEventListener('click', (event) => {
      const speechButton = event.target.closest('[data-speak]');
      if (speechButton) {
        playTone('click');
        speak(speechButton.dataset.speak, speechButton.dataset.lang || 'en-US');
      }
      const protectedLink = event.target.closest('[data-requires-profile]');
      if (protectedLink && !getProfile()) {
        event.preventDefault();
        toast('สร้างโปรไฟล์ก่อนเริ่มภารกิจ', 'error');
        openProfileModal();
      }
    });
    window.addEventListener('hashchange', () => {
      renderHeader();
      bindSharedActions();
      applyTheme(document.documentElement.dataset.theme);
      updateSoundButton();
    });
  }

  function initHomePage() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    const fillProfile = (profile) => {
      if (!profile) return;
      form.elements.name.value = profile.name;
      form.elements.classroom.value = profile.classroom;
      form.elements.number.value = profile.number;
      const avatarInput = [...form.querySelectorAll('input[name="avatar"]')].find((input) => input.value === profile.avatar);
      if (avatarInput) avatarInput.checked = true;
    };
    fillProfile(getProfile());

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const profile = {
        name: String(data.get('name') || '').trim(),
        classroom: String(data.get('classroom') || '').trim(),
        number: String(data.get('number') || '').trim(),
        avatar: String(data.get('avatar') || avatars[0])
      };
      const error = document.getElementById('profile-error');
      if (!profile.name || !profile.classroom || !profile.number) {
        error.textContent = 'กรุณากรอกชื่อ ชั้นเรียน และเลขที่ให้ครบถ้วน';
        form.querySelector(':invalid')?.focus();
        return;
      }
      error.textContent = '';
      if (!avatars.includes(profile.avatar)) profile.avatar = avatars[0];
      write(KEYS.profile, profile);
      document.dispatchEvent(new CustomEvent('prefixplanet:profile', { detail: profile }));
      renderHeader();
      bindSharedActions();
      applyTheme(document.documentElement.dataset.theme);
      updateSoundButton();
      playTone('complete');
      toast('บันทึกบัตรนักสำรวจเรียบร้อยแล้ว');
    });

    const dailyWords = [
      { prefix: 'un-', base: 'certain', word: 'uncertain', meaning: 'ไม่แน่นอน', pos: 'adjective', example: 'The result is still uncertain.', translation: 'ผลลัพธ์ยังไม่แน่นอน' },
      { prefix: 're-', base: 'write', word: 'rewrite', meaning: 'เขียนใหม่', pos: 'verb', example: 'Please rewrite the final paragraph.', translation: 'กรุณาเขียนย่อหน้าสุดท้ายใหม่' },
      { prefix: 'pre-', base: 'view', word: 'preview', meaning: 'ดูตัวอย่างล่วงหน้า', pos: 'noun / verb', example: 'We watched a preview of the new film.', translation: 'พวกเราดูตัวอย่างภาพยนตร์เรื่องใหม่' },
      { prefix: 'mis-', base: 'understand', word: 'misunderstand', meaning: 'เข้าใจผิด', pos: 'verb', example: 'Do not misunderstand her intention.', translation: 'อย่าเข้าใจเจตนาของเธอผิด' },
      { prefix: 'inter-', base: 'national', word: 'international', meaning: 'ระหว่างประเทศ', pos: 'adjective', example: 'The school joined an international project.', translation: 'โรงเรียนเข้าร่วมโครงการระหว่างประเทศ' },
      { prefix: 'over-', base: 'cook', word: 'overcook', meaning: 'ทำให้สุกเกินไป', pos: 'verb', example: 'Do not overcook the vegetables.', translation: 'อย่าปรุงผักให้สุกเกินไป' },
      { prefix: 'co-', base: 'operate', word: 'cooperate', meaning: 'ร่วมมือกัน', pos: 'verb', example: 'The teams must cooperate to succeed.', translation: 'ทุกทีมต้องร่วมมือกันเพื่อให้สำเร็จ' }
    ];
    const now = new Date();
    const dayCode = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000);
    const word = dailyWords[Math.abs(dayCode) % dailyWords.length];
    const textMap = {
      'daily-prefix': word.prefix,
      'daily-base': word.base,
      'daily-result': word.word,
      'daily-new-word': word.word,
      'daily-meaning': word.meaning,
      'daily-pos': word.pos,
      'daily-example': word.example,
      'daily-translation': word.translation
    };
    Object.entries(textMap).forEach(([id, text]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = text;
    });
    const speakButton = document.getElementById('daily-speak');
    if (speakButton) speakButton.dataset.speak = word.word;

    const renderHomeProgress = () => {
      const progress = getProgress();
      const gamesPassed = Object.values(progress.games).filter((score) => Number(score) >= 3).length;
      const values = {
        lessons: `${progress.lessons.length}/4`,
        games: `${gamesPassed}/4`,
        latest: `${progress.latestScore}/45`,
        best: `${progress.bestScore}/45`
      };
      Object.entries(values).forEach(([name, value]) => {
        const node = document.querySelector(`[data-stat="${name}"]`);
        if (node) node.textContent = value;
      });
      const badgeHost = document.getElementById('home-badges');
      if (badgeHost) badgeHost.innerHTML = progress.badges.length
        ? progress.badges.map((badge) => `<span class="chip chip-gold">🏅 ${escapeHTML(badge)}</span>`).join('')
        : '<span class="muted">ยังไม่มี Badge — เล่นเกมและพิชิตภารกิจเพื่อรับรางวัล</span>';
    };
    renderHomeProgress();
    document.addEventListener('prefixplanet:progress', renderHomeProgress);
  }

  function init() {
    renderHeader();
    renderFooter();
    ensureUIHosts();
    initTheme();
    updateSoundButton();
    bindSharedActions();
    initGlobalEvents();
    initHomePage();
    document.documentElement.classList.add('js-ready');
  }

  window.PrefixPlanet = Object.freeze({
    KEYS,
    avatars,
    read,
    write,
    remove,
    escapeHTML,
    getProfile,
    getProgress,
    updateProgress,
    puffy,
    playTone,
    speak,
    toast,
    openModal,
    closeModal,
    openProfileModal,
    confirmDataClear
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
