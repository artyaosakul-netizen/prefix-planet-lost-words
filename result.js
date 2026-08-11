/* =========================================================
   Prefix Planet — Scoring, review, charts, history and export
   ========================================================= */
(function () {
  'use strict';

  const PP = window.PrefixPlanet;
  const questions = Array.isArray(window.PREFIX_QUESTIONS) ? window.PREFIX_QUESTIONS : [];
  if (!PP) return;

  const planetNames = ['Meaning Moon', 'Base Word Forest', 'Word Factory', 'Sentence City', 'Master Galaxy'];
  let result = null;
  let reviewEntries = [];
  let score = 0;
  let planetScores = [];

  function analyze() {
    reviewEntries = questions.map((question) => {
      const hasAnswer = Object.prototype.hasOwnProperty.call(result.answers || {}, question.id);
      const userAnswer = hasAnswer ? result.answers[question.id] : null;
      const correct = hasAnswer && userAnswer === question.correctAnswer;
      return { question, userAnswer, status: !hasAnswer ? 'unanswered' : (correct ? 'correct' : 'incorrect') };
    });
    score = reviewEntries.filter((entry) => entry.status === 'correct').length;
    planetScores = [1, 2, 3, 4, 5].map((planet) => reviewEntries.filter((entry) => entry.question.planet === planet && entry.status === 'correct').length);
  }

  function rankFor(value) {
    if (value >= 41) return { name: 'Prefix Master', label: 'ดีเยี่ยม', pass: true };
    if (value >= 36) return { name: 'Word Explorer', label: 'ผ่านเกณฑ์', pass: true };
    if (value >= 27) return { name: 'Rising Learner', label: 'ควรทบทวนบางหัวข้อ', pass: false };
    return { name: 'Keep Practicing', label: 'ควรกลับไปเรียนรู้อีกครั้ง', pass: false };
  }

  function badgesFor(value) {
    const badges = [];
    if (value >= 36) badges.push('Galaxy Explorer Badge');
    if (value >= 41) badges.push('Prefix Master Badge');
    if (value === 45) badges.push('Perfect Mission Badge');
    return badges;
  }

  function recordAttemptOnce() {
    if (result.recorded) return;
    const rank = rankFor(score);
    const earnedBadges = badgesFor(score);
    const progress = PP.getProgress();
    const attempts = Number(progress.attempts || 0) + 1;
    PP.updateProgress({
      latestScore: score,
      bestScore: Math.max(Number(progress.bestScore || 0), score),
      attempts,
      badges: [...new Set([...progress.badges, ...earnedBadges])]
    });

    const history = PP.read(PP.KEYS.history, []);
    const safeHistory = Array.isArray(history) ? history : [];
    safeHistory.unshift({
      attempt: attempts,
      submittedAt: result.submittedAt,
      score,
      percentage: Math.round((score / 45) * 100),
      rank: rank.name
    });
    PP.write(PP.KEYS.history, safeHistory.slice(0, 5));
    result = { ...result, recorded: true, score, planetScores, rank: rank.name };
    PP.write(PP.KEYS.result, result);
  }

  function formatDuration(totalSeconds) {
    const safe = Math.max(0, Number(totalSeconds || 0));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${minutes} นาที ${String(seconds).padStart(2, '0')} วินาที`;
  }

  function weakestAdvice() {
    const minimum = Math.min(...planetScores);
    const planet = planetScores.indexOf(minimum) + 1;
    const advice = {
      1: 'ทบทวนกลุ่มความหมายของ Prefix ในบทที่ 3',
      2: 'ฝึกแยก Prefix และ Base Word ในบทที่ 2',
      3: 'ทดลองสร้างคำเพิ่มใน Word Builder',
      4: 'ฝึก Sentence Rescue เพื่ออ่านคำจากบริบท',
      5: 'ทบทวนทุกบท แล้วลองวิเคราะห์คำใหม่ทีละส่วน'
    };
    return `${advice[planet]} — ดาวที่ควรทบทวนมากที่สุดคือ ${planetNames[planet - 1]} (${minimum}/9)`;
  }

  function renderSummary() {
    const profile = result.profile || { name: 'Word Explorer', classroom: '-', number: '-', avatar: '🚀' };
    const wrong = reviewEntries.filter((entry) => entry.status === 'incorrect').length;
    const unanswered = reviewEntries.filter((entry) => entry.status === 'unanswered').length;
    const percentage = Math.round((score / 45) * 100);
    const rank = rankFor(score);
    const submitted = new Date(result.submittedAt || Date.now());

    document.getElementById('result-avatar').textContent = profile.avatar || '🚀';
    document.getElementById('result-name').textContent = profile.name || 'Word Explorer';
    document.getElementById('result-class').textContent = `${profile.classroom || '-'} · เลขที่ ${profile.number || '-'}`;
    document.getElementById('result-score').textContent = score;
    document.getElementById('result-percent').textContent = `${percentage}%`;
    document.getElementById('result-correct').textContent = score;
    document.getElementById('result-wrong').textContent = wrong;
    document.getElementById('result-unanswered').textContent = unanswered;
    document.getElementById('result-rank').textContent = `${rank.name} — ${rank.label}`;
    document.getElementById('result-status').textContent = rank.pass ? 'ภารกิจสำเร็จ!' : 'ยังไม่ผ่านเกณฑ์ 80%';
    document.getElementById('result-message').textContent = rank.pass
      ? 'Puffy ภูมิใจมาก! คุณช่วยกู้คืน Prefix Crystals และฟื้นฟูจักรวาลคำศัพท์ได้สำเร็จ'
      : `Puffy ขอเป็นกำลังใจให้ ลองทบทวนแล้วกลับมาพิชิตใหม่อีกครั้งนะ · ${weakestAdvice()}`;
    document.getElementById('result-meta').textContent = `ส่งคำตอบเมื่อ ${submitted.toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })} · ใช้เวลา ${formatDuration(result.durationSeconds)}${result.timedOut ? ' · ส่งอัตโนมัติเมื่อหมดเวลา' : ''}`;

    const badges = badgesFor(score);
    document.getElementById('result-badges').innerHTML = badges.length
      ? badges.map((badge) => `<span class="chip chip-gold">🏅 ${PP.escapeHTML(badge)}</span>`).join('')
      : '<span class="muted">ทำคะแนนอย่างน้อย 36 คะแนนเพื่อรับ Galaxy Explorer Badge</span>';
  }

  function renderPlanetScores() {
    const icons = ['🌙', '🌲', '⚙️', '🏙️', '🌌'];
    document.getElementById('planet-score-list').innerHTML = planetScores.map((value, index) => {
      const percent = Math.round((value / 9) * 100);
      return `<div class="planet-score-row"><strong>${icons[index]} ${planetNames[index]}</strong><div class="progress-track" aria-label="${planetNames[index]} ${value} จาก 9"><div class="progress-fill" style="--progress:${percent}%"></div></div><strong class="en">${value}/9</strong></div>`;
    }).join('');
    renderRadarChart();
  }

  function renderRadarChart() {
    const host = document.getElementById('radar-chart');
    const size = 360;
    const center = size / 2;
    const radius = 124;
    const pointAt = (index, ratio) => {
      const angle = (-Math.PI / 2) + (index * Math.PI * 2 / 5);
      return [center + Math.cos(angle) * radius * ratio, center + Math.sin(angle) * radius * ratio];
    };
    const polygon = (ratio) => [0, 1, 2, 3, 4].map((index) => pointAt(index, ratio).join(',')).join(' ');
    const dataPolygon = planetScores.map((value, index) => pointAt(index, value / 9).join(',')).join(' ');
    const axes = [0, 1, 2, 3, 4].map((index) => {
      const [x, y] = pointAt(index, 1);
      return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="currentColor" opacity=".17"/>`;
    }).join('');
    const labels = [0, 1, 2, 3, 4].map((index) => {
      const [x, y] = pointAt(index, 1.17);
      return `<text x="${x}" y="${y}" fill="currentColor" font-size="12" font-family="Nunito, sans-serif" font-weight="800" text-anchor="middle" dominant-baseline="middle">P${index + 1}</text>`;
    }).join('');
    host.innerHTML = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="คะแนนดาว 1 ถึง 5 คือ ${planetScores.join(', ')} จาก 9 คะแนน">
      <polygon points="${polygon(1)}" fill="none" stroke="currentColor" opacity=".2"/>
      <polygon points="${polygon(.66)}" fill="none" stroke="currentColor" opacity=".13"/>
      <polygon points="${polygon(.33)}" fill="none" stroke="currentColor" opacity=".1"/>
      ${axes}
      <polygon points="${dataPolygon}" fill="rgba(117,87,232,.30)" stroke="#7557e8" stroke-width="4" stroke-linejoin="round"/>
      ${planetScores.map((value, index) => { const [x, y] = pointAt(index, value / 9); return `<circle cx="${x}" cy="${y}" r="5" fill="#f47fb2" stroke="white" stroke-width="2"/>`; }).join('')}
      ${labels}
    </svg>`;
  }

  function renderHistory() {
    const history = PP.read(PP.KEYS.history, []);
    const body = document.getElementById('history-body');
    if (!Array.isArray(history) || !history.length) {
      body.innerHTML = '<tr><td colspan="5" class="muted">ยังไม่มีประวัติการทำข้อสอบ</td></tr>';
      return;
    }
    body.innerHTML = history.map((item, index) => `<tr><td>${item.attempt || history.length - index}</td><td>${new Date(item.submittedAt).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}</td><td><strong>${item.score}/45</strong></td><td>${item.percentage}%</td><td>${PP.escapeHTML(item.rank)}</td></tr>`).join('');
  }

  function reviewLink(planet) {
    if (planet === 1) return 'content.html#lesson-3';
    if (planet === 2) return 'content.html#lesson-2';
    if (planet === 3) return 'content.html#builder';
    return 'content.html#practice';
  }

  function renderReview() {
    const statusFilter = document.getElementById('review-status').value;
    const planetFilter = document.getElementById('review-planet').value;
    const filtered = reviewEntries.filter((entry) => (statusFilter === 'all' || entry.status === statusFilter) && (planetFilter === 'all' || entry.question.planet === Number(planetFilter)));
    const host = document.getElementById('review-list');
    if (!filtered.length) {
      host.innerHTML = '<div class="empty-state card"><div style="font-size:3rem">✨</div><h3>ไม่มีข้อที่ตรงกับตัวกรองนี้</h3><p class="muted">ลองเปลี่ยนสถานะคำตอบหรือเลือกดาวดวงอื่น</p></div>';
      return;
    }
    const statusText = { correct: '✓ ตอบถูก', incorrect: '✕ ตอบผิด', unanswered: '— ไม่ได้ตอบ' };
    host.innerHTML = filtered.map(({ question, userAnswer, status }) => `
      <article class="review-card card ${status}">
        <div class="question-meta"><div><span class="chip">ข้อ ${question.id} · ดาว ${question.planet}</span> ${question.boss ? '<span class="chip chip-gold">👑 BOSS</span>' : ''}</div><strong class="${status === 'correct' ? 'success-text' : status === 'incorrect' ? 'danger-text' : 'gold-text'}">${statusText[status]}</strong></div>
        <h3 class="en">${PP.escapeHTML(question.question)}</h3>
        <div class="review-answer">
          <div class="answer-box ${status === 'incorrect' ? 'incorrect' : ''}"><small>คำตอบของผู้เรียน</small><strong class="en">${userAnswer === null ? 'ไม่ได้ตอบ' : PP.escapeHTML(userAnswer)}</strong></div>
          <div class="answer-box correct"><small>คำตอบที่ถูกต้อง</small><strong class="en">${PP.escapeHTML(question.correctAnswer)}</strong></div>
        </div>
        <div class="word-breakdown">
          <div class="breakdown-part"><small>Prefix</small><strong class="part-prefix en">${PP.escapeHTML(question.prefix)}</strong><br>${PP.escapeHTML(question.prefixMeaning || '')}</div>
          <div class="breakdown-part"><small>Base Word</small><strong class="part-base en">${PP.escapeHTML(question.baseWord)}</strong><br>${PP.escapeHTML(question.baseMeaning || '')}</div>
          <div class="breakdown-part"><small>New Word</small><strong class="part-new en">${PP.escapeHTML(question.newWord || '')}</strong></div>
          <div class="breakdown-part"><small>Meaning</small><strong class="part-meaning">${PP.escapeHTML(question.meaning)}</strong></div>
        </div>
        <div class="soft-panel"><strong>คำอธิบาย</strong><p style="margin:4px 0">${PP.escapeHTML(question.explanation)}</p><p class="muted" style="margin:0"><strong>คำแปล/บริบท:</strong> ${PP.escapeHTML(question.sentenceTranslation || question.meaning)}</p></div>
        <a class="btn btn-secondary btn-sm" href="${reviewLink(question.planet)}" style="margin-top:13px">📘 กลับไปทบทวนบทเรียนที่เกี่ยวข้อง</a>
      </article>`).join('');
  }

  function downloadCSV() {
    const profile = result.profile || {};
    const rows = [
      ['Prefix Planet: The Lost Words'],
      ['ชื่อ–นามสกุล', profile.name || ''],
      ['ชั้นเรียน', profile.classroom || ''],
      ['เลขที่', profile.number || ''],
      ['คะแนน', `${score}/45`],
      ['เปอร์เซ็นต์', `${Math.round((score / 45) * 100)}%`],
      ['วันที่ส่ง', new Date(result.submittedAt).toLocaleString('th-TH')],
      [],
      ['ข้อ', 'ดาว', 'ประเภท', 'คำถาม', 'คำตอบผู้เรียน', 'คำตอบที่ถูก', 'ผล', 'คำอธิบาย']
    ];
    reviewEntries.forEach(({ question, userAnswer, status }) => rows.push([
      question.id,
      question.planet,
      question.type,
      question.question,
      userAnswer || 'ไม่ได้ตอบ',
      question.correctAnswer,
      status === 'correct' ? 'ถูก' : status === 'incorrect' ? 'ผิด' : 'ไม่ได้ตอบ',
      question.explanation
    ]));
    const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = `\uFEFF${rows.map((row) => row.map(quote).join(',')).join('\r\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `prefix-planet-result-${new Date(result.submittedAt).toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    PP.toast('ดาวน์โหลดผลเป็น CSV แล้ว');
  }

  function retryMission() {
    PP.openModal({
      title: 'เริ่มภารกิจใหม่?',
      body: '<p>ระบบจะล้างคำตอบของภารกิจปัจจุบัน แต่ยังเก็บคะแนนและประวัติครั้งนี้ไว้ในความก้าวหน้า</p>',
      actions: [
        { label: 'ยกเลิก', className: 'btn btn-secondary' },
        { label: 'เริ่มใหม่', className: 'btn', onClick: () => { PP.remove(PP.KEYS.mission); PP.remove(PP.KEYS.result); location.assign('mission.html'); } }
      ]
    });
  }

  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#7557e8', '#5dc8e8', '#f47fb2', '#f7bd3e', '#37b778'];
    for (let index = 0; index < 70; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[index % colors.length];
      piece.style.setProperty('--fall', `${2.2 + Math.random() * 2}s`);
      piece.style.setProperty('--drift', `${(Math.random() - .5) * 180}px`);
      piece.style.animationDelay = `${Math.random() * .8}s`;
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 5200);
    }
  }

  function bindEvents() {
    document.getElementById('review-status').addEventListener('change', renderReview);
    document.getElementById('review-planet').addEventListener('change', renderReview);
    document.getElementById('retry-mission').addEventListener('click', retryMission);
    document.getElementById('print-result').addEventListener('click', () => window.print());
    document.getElementById('download-csv').addEventListener('click', downloadCSV);
    document.addEventListener('prefixplanet:history-cleared', renderHistory);
  }

  function init() {
    result = PP.read(PP.KEYS.result, null);
    const valid = result && typeof result === 'object' && result.answers && questions.length === 45;
    document.getElementById('no-result').hidden = Boolean(valid);
    document.getElementById('result-content').hidden = !valid;
    if (!valid) return;
    analyze();
    recordAttemptOnce();
    renderSummary();
    renderPlanetScores();
    renderHistory();
    renderReview();
    bindEvents();
    if (score >= 36) window.setTimeout(confetti, 280);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
