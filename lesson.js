/* =========================================================
   Prefix Planet — Interactive lessons, Word Builder and games
   ========================================================= */
(function () {
  'use strict';

  const PP = window.PrefixPlanet;
  if (!PP) return;

  const builderWords = [
    { prefix: 'un-', base: 'happy', word: 'unhappy', prefixMeaning: 'ไม่', meaning: 'ไม่มีความสุข', pos: 'adjective', example: 'She felt unhappy about the result.', translation: 'เธอรู้สึกไม่มีความสุขกับผลลัพธ์' },
    { prefix: 'un-', base: 'fair', word: 'unfair', prefixMeaning: 'ไม่', meaning: 'ไม่ยุติธรรม', pos: 'adjective', example: 'The rule seems unfair to new students.', translation: 'กฎข้อนี้ดูไม่ยุติธรรมต่อนักเรียนใหม่' },
    { prefix: 're-', base: 'write', word: 'rewrite', prefixMeaning: 'อีกครั้ง', meaning: 'เขียนใหม่', pos: 'verb', example: 'I will rewrite the introduction.', translation: 'ฉันจะเขียนบทนำใหม่' },
    { prefix: 're-', base: 'use', word: 'reuse', prefixMeaning: 'อีกครั้ง', meaning: 'นำกลับมาใช้ใหม่', pos: 'verb', example: 'We reuse glass jars at home.', translation: 'พวกเรานำขวดแก้วกลับมาใช้ใหม่ที่บ้าน' },
    { prefix: 'pre-', base: 'view', word: 'preview', prefixMeaning: 'ก่อน', meaning: 'ดูตัวอย่างล่วงหน้า', pos: 'noun / verb', example: 'The class watched a preview of the film.', translation: 'ชั้นเรียนดูตัวอย่างภาพยนตร์ล่วงหน้า' },
    { prefix: 'pre-', base: 'heat', word: 'preheat', prefixMeaning: 'ก่อน', meaning: 'อุ่นล่วงหน้า', pos: 'verb', example: 'Preheat the oven before baking.', translation: 'อุ่นเตาอบก่อนเริ่มอบ' },
    { prefix: 'dis-', base: 'agree', word: 'disagree', prefixMeaning: 'ตรงข้าม / ไม่', meaning: 'ไม่เห็นด้วย', pos: 'verb', example: 'I respectfully disagree with that idea.', translation: 'ฉันไม่เห็นด้วยกับแนวคิดนั้นอย่างสุภาพ' },
    { prefix: 'dis-', base: 'connect', word: 'disconnect', prefixMeaning: 'แยกออก', meaning: 'ตัดการเชื่อมต่อ', pos: 'verb', example: 'Disconnect the cable safely.', translation: 'ตัดการเชื่อมต่อสายอย่างปลอดภัย' },
    { prefix: 'mis-', base: 'spell', word: 'misspell', prefixMeaning: 'ผิด', meaning: 'สะกดผิด', pos: 'verb', example: 'Be careful not to misspell her name.', translation: 'ระวังอย่าสะกดชื่อของเธอผิด' },
    { prefix: 'mis-', base: 'understand', word: 'misunderstand', prefixMeaning: 'ผิด', meaning: 'เข้าใจผิด', pos: 'verb', example: 'Readers may misunderstand the message.', translation: 'ผู้อ่านอาจเข้าใจข้อความผิด' },
    { prefix: 'over-', base: 'cook', word: 'overcook', prefixMeaning: 'มากเกินไป', meaning: 'ทำให้สุกเกินไป', pos: 'verb', example: 'Do not overcook the noodles.', translation: 'อย่าต้มเส้นให้สุกเกินไป' },
    { prefix: 'under-', base: 'estimate', word: 'underestimate', prefixMeaning: 'น้อยเกินไป', meaning: 'ประเมินต่ำเกินไป', pos: 'verb', example: 'Never underestimate your ability.', translation: 'อย่าประเมินความสามารถของตนเองต่ำเกินไป' },
    { prefix: 'inter-', base: 'national', word: 'international', prefixMeaning: 'ระหว่าง', meaning: 'ระหว่างประเทศ', pos: 'adjective', example: 'They joined an international competition.', translation: 'พวกเขาเข้าร่วมการแข่งขันระดับนานาชาติ' },
    { prefix: 'co-', base: 'operate', word: 'cooperate', prefixMeaning: 'ร่วมกัน', meaning: 'ร่วมมือกัน', pos: 'verb', example: 'We must cooperate to solve the problem.', translation: 'เราต้องร่วมมือกันเพื่อแก้ปัญหา' },
    { prefix: 'bi-', base: 'lingual', word: 'bilingual', prefixMeaning: 'สอง', meaning: 'ใช้ได้สองภาษา', pos: 'adjective', example: 'The guide is bilingual.', translation: 'มัคคุเทศก์ใช้ได้สองภาษา' },
    { prefix: 'multi-', base: 'cultural', word: 'multicultural', prefixMeaning: 'หลาย', meaning: 'หลากหลายวัฒนธรรม', pos: 'adjective', example: 'Bangkok is a multicultural city.', translation: 'กรุงเทพฯ เป็นเมืองที่มีหลากหลายวัฒนธรรม' },
    { prefix: 'im-', base: 'possible', word: 'impossible', prefixMeaning: 'ไม่', meaning: 'เป็นไปไม่ได้', pos: 'adjective', example: 'The task is difficult but not impossible.', translation: 'งานนี้ยากแต่ไม่ใช่ว่าจะเป็นไปไม่ได้' },
    { prefix: 'il-', base: 'legal', word: 'illegal', prefixMeaning: 'ไม่', meaning: 'ผิดกฎหมาย', pos: 'adjective', example: 'It is illegal to copy the document.', translation: 'การคัดลอกเอกสารนี้เป็นสิ่งผิดกฎหมาย' },
    { prefix: 'ir-', base: 'regular', word: 'irregular', prefixMeaning: 'ไม่', meaning: 'ไม่สม่ำเสมอ', pos: 'adjective', example: 'The verb has an irregular form.', translation: 'คำกริยานี้มีรูปที่ไม่เป็นไปตามกฎ' }
  ];

  const games = {
    match: {
      title: 'Match the Meaning',
      instruction: 'เลือกความหมายที่ตรงกับ Prefix',
      questions: [
        { prompt: 'Prefix “re-” หมายถึงอะไร?', options: ['again', 'before', 'against', 'half'], answer: 'again', hint: 'คิดถึงคำว่า rewrite', explain: 're- หมายถึง “อีกครั้ง” เช่น rewrite = เขียนใหม่' },
        { prompt: 'Prefix “under-” สื่อความหมายใด?', options: ['above', 'below or too little', 'between', 'many'], answer: 'below or too little', hint: 'under the table แปลว่าใต้โต๊ะ', explain: 'under- หมายถึง ใต้ หรือ น้อยเกินไป เช่น underpaid' },
        { prompt: 'Prefix “anti-” หมายถึงอะไร?', options: ['against', 'together', 'after', 'two'], answer: 'against', hint: 'antiwar = ต่อต้านสงคราม', explain: 'anti- หมายถึง ต่อต้าน เช่น antivirus' },
        { prompt: 'Prefix “tri-” บอกจำนวนเท่าใด?', options: ['one', 'two', 'three', 'many'], answer: 'three', hint: 'triangle มีสามด้าน', explain: 'tri- หมายถึง สาม เช่น triangle และ tricycle' },
        { prompt: 'Prefix “pre-” สื่อถึงเวลาใด?', options: ['before', 'after', 'again', 'wrongly'], answer: 'before', hint: 'preview คือดูก่อน', explain: 'pre- หมายถึง ก่อน เช่น pretest = แบบทดสอบก่อนเรียน' }
      ]
    },
    build: {
      title: 'Build a Word',
      instruction: 'เลือก Prefix ที่ประกอบกับ Base Word แล้วได้คำตามความหมาย',
      questions: [
        { prompt: '___ + write = “เขียนใหม่”', options: ['re-', 'mis-', 'under-', 'anti-'], answer: 're-', hint: 'ต้องการความหมายว่า “อีกครั้ง”', explain: 're- + write = rewrite แปลว่า เขียนใหม่' },
        { prompt: '___ + possible = “เป็นไปไม่ได้”', options: ['in-', 'im-', 'il-', 'ir-'], answer: 'im-', hint: 'possible ขึ้นต้นด้วย p', explain: 'หน้า p ใช้ im- จึงเป็น impossible' },
        { prompt: '___ + national = “ระหว่างประเทศ”', options: ['inter-', 'sub-', 'post-', 'mono-'], answer: 'inter-', hint: 'ความสัมพันธ์ “ระหว่าง” ประเทศ', explain: 'inter- + national = international' },
        { prompt: '___ + paid = “ได้รับค่าจ้างต่ำเกินไป”', options: ['over-', 'super-', 'under-', 'co-'], answer: 'under-', hint: 'ต่ำหรือน้อยกว่าที่ควร', explain: 'under- + paid = underpaid' },
        { prompt: '___ + cycle = “ยานพาหนะสามล้อ”', options: ['bi-', 'tri-', 'semi-', 'multi-'], answer: 'tri-', hint: 'ต้องการจำนวนสาม', explain: 'tri- + cycle = tricycle' }
      ]
    },
    detective: {
      title: 'Prefix Detective',
      instruction: 'ค้นหา Prefix ที่ซ่อนอยู่ในคำศัพท์',
      questions: [
        { prompt: 'คำว่า “misunderstand” มี Prefix ใด?', options: ['mis-', 'under-', 'stand-', 'un-'], answer: 'mis-', hint: 'ส่วนที่แปลว่า “ผิด” อยู่ต้นคำ', explain: 'mis- เป็น Prefix ส่วน understand เป็น Base Word' },
        { prompt: 'คำว่า “submarine” มี Prefix ใด?', options: ['super-', 'marine-', 'sub-', 'semi-'], answer: 'sub-', hint: 'เรือชนิดนี้อยู่ใต้ผิวน้ำ', explain: 'sub- หมายถึง ใต้ และ marine เกี่ยวกับทะเล' },
        { prompt: 'คำว่า “irregular” มี Prefix ใด?', options: ['in-', 're-', 'ir-', 'il-'], answer: 'ir-', hint: 'Base Word คือ regular', explain: 'ir- อยู่หน้า regular และหมายถึง ไม่' },
        { prompt: 'คำว่า “multicultural” มี Prefix ใด?', options: ['mono-', 'culture-', 'multi-', 'co-'], answer: 'multi-', hint: 'คำนี้เกี่ยวกับ “หลาย” วัฒนธรรม', explain: 'multi- หมายถึง หลาย ส่วน cultural คือเกี่ยวกับวัฒนธรรม' },
        { prompt: 'คำว่า “postgraduate” มี Prefix ใด?', options: ['pre-', 'post-', 'graduate-', 'pro-'], answer: 'post-', hint: 'เกิดขึ้นหลังเรียนระดับปริญญาตรี', explain: 'post- หมายถึง หลัง ส่วน graduate คือผู้สำเร็จการศึกษา' }
      ]
    },
    sentence: {
      title: 'Sentence Rescue',
      instruction: 'เลือกคำที่เติมประโยคได้ถูกต้อง',
      questions: [
        { prompt: 'Please _____ the computer after the update.', options: ['restart', 'misstart', 'prestart', 'understart'], answer: 'restart', hint: 'ต้องเริ่มเครื่อง “อีกครั้ง”', explain: 'restart หมายถึง เริ่มใหม่หรือเปิดใหม่อีกครั้ง' },
        { prompt: 'It is _____ to enter this room without permission.', options: ['legal', 'illegal', 'prelegal', 'colegal'], answer: 'illegal', hint: 'สถานการณ์นี้ “ไม่ถูกกฎหมาย”', explain: 'illegal หมายถึง ผิดกฎหมายหรือไม่ได้รับอนุญาตตามกฎหมาย' },
        { prompt: 'The instructions were unclear, so I _____ them.', options: ['understood', 'misunderstood', 'previewed', 'cooperated'], answer: 'misunderstood', hint: 'คำแนะนำไม่ชัดจึงเข้าใจ “ผิด”', explain: 'misunderstood เป็นอดีตของ misunderstand แปลว่า เข้าใจผิด' },
        { prompt: 'Our class joined an _____ school debate.', options: ['interschool', 'underschool', 'antischool', 'monoschool'], answer: 'interschool', hint: 'การแข่งขันเกิดขึ้น “ระหว่างโรงเรียน”', explain: 'interschool หมายถึง ระหว่างโรงเรียนหลายแห่ง' },
        { prompt: 'Do not _____ the rice, or it will become too soft.', options: ['overcook', 'undercook', 'precook', 'co-cook'], answer: 'overcook', hint: 'ท้ายประโยคบอกว่านิ่มเกินไป', explain: 'overcook หมายถึง ทำให้สุกนานหรือมากเกินไป' }
      ]
    }
  };

  let activeGame = 'match';
  let questionIndex = 0;
  let score = 0;
  let combo = 0;
  let answered = false;
  let draggedAnswer = '';
  let showLessonFromHash = null;

  function initLessons() {
    const tabs = [...document.querySelectorAll('[data-lesson-tab]')];
    const panes = [...document.querySelectorAll('[data-lesson-pane]')];
    if (!tabs.length) return;

    const showLesson = (number) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.lessonTab === String(number);
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      panes.forEach((pane) => {
        const active = pane.dataset.lessonPane === String(number);
        pane.classList.toggle('active', active);
        pane.hidden = !active;
      });
    };
    showLessonFromHash = showLesson;

    tabs.forEach((tab) => tab.addEventListener('click', () => showLesson(tab.dataset.lessonTab)));
    document.querySelectorAll('[data-complete-lesson]').forEach((button) => {
      button.addEventListener('click', () => {
        const number = Number(button.dataset.completeLesson);
        const progress = PP.getProgress();
        const lessons = [...new Set([...progress.lessons, number])].sort();
        PP.updateProgress({ lessons });
        button.textContent = '✓ บทนี้สำเร็จแล้ว';
        button.disabled = true;
        PP.playTone('complete');
        PP.toast(`บันทึกบทที่ ${number} สำเร็จแล้ว`);
        updateLessonProgress();
        if (number < 4) window.setTimeout(() => showLesson(number + 1), 450);
      });
    });
    updateLessonProgress();
  }

  function updateLessonProgress() {
    const progress = PP.getProgress();
    const fill = document.getElementById('lesson-progress');
    if (fill) fill.style.setProperty('--progress', `${progress.lessons.length * 25}%`);
    document.querySelectorAll('[data-complete-lesson]').forEach((button) => {
      if (progress.lessons.includes(Number(button.dataset.completeLesson))) {
        button.textContent = '✓ บทนี้สำเร็จแล้ว';
        button.disabled = true;
      }
    });
  }

  function initBuilder() {
    const prefixSelect = document.getElementById('builder-prefix');
    const baseSelect = document.getElementById('builder-base');
    const buildButton = document.getElementById('build-word');
    const result = document.getElementById('builder-result');
    if (!prefixSelect || !baseSelect || !result) return;

    const prefixes = [...new Set(builderWords.map((item) => item.prefix))];
    prefixSelect.innerHTML = prefixes.map((prefix) => `<option value="${prefix}">${prefix}</option>`).join('');

    const updateBases = () => {
      const filtered = builderWords.filter((item) => item.prefix === prefixSelect.value);
      baseSelect.innerHTML = filtered.map((item) => `<option value="${item.base}">${item.base}</option>`).join('');
    };
    prefixSelect.addEventListener('change', updateBases);
    updateBases();

    buildButton.addEventListener('click', () => {
      const item = builderWords.find((entry) => entry.prefix === prefixSelect.value && entry.base === baseSelect.value);
      if (!item) return;
      const prefixText = item.prefix.replace('-', '');
      result.innerHTML = `
        <div>
          <div class="builder-word animate"><span class="part-prefix">${prefixText}</span><span class="part-base">${item.base}</span></div>
          <div class="word-equation" style="justify-content:center;margin:8px 0"><span class="part-prefix">${item.prefix}</span><span>+</span><span class="part-base">${item.base}</span><span>=</span><span class="part-new">${item.word}</span></div>
          <p><span class="chip">${item.pos}</span> <strong>${item.meaning}</strong></p>
          <div class="soft-panel"><p class="en" style="margin-bottom:3px">${item.example}</p><p class="muted" style="margin:0">${item.translation}</p></div>
          <button class="btn btn-secondary btn-sm" type="button" data-speak="${item.word}" style="margin-top:14px">🔊 ฟังคำว่า ${item.word}</button>
        </div>`;
      PP.playTone('crystal');
    });
  }

  function initGames() {
    if (!document.getElementById('game-shell')) return;
    document.querySelectorAll('[data-game]').forEach((tab) => {
      tab.addEventListener('click', () => {
        activeGame = tab.dataset.game;
        document.querySelectorAll('[data-game]').forEach((item) => {
          const active = item === tab;
          item.classList.toggle('active', active);
          item.setAttribute('aria-selected', String(active));
        });
        restartGame();
      });
    });
    document.getElementById('game-next').addEventListener('click', nextQuestion);
    document.getElementById('game-restart').addEventListener('click', restartGame);
    document.getElementById('game-hint').addEventListener('click', showHint);

    const dropzone = document.getElementById('game-dropzone');
    dropzone.addEventListener('dragover', (event) => { event.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (event) => {
      event.preventDefault();
      dropzone.classList.remove('dragover');
      const answer = event.dataTransfer.getData('text/plain') || draggedAnswer;
      if (answer) chooseAnswer(answer);
    });
    dropzone.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && draggedAnswer) chooseAnswer(draggedAnswer);
    });
    restartGame();
  }

  function restartGame() {
    questionIndex = 0;
    score = 0;
    combo = 0;
    answered = false;
    draggedAnswer = '';
    renderGameQuestion();
  }

  function renderGameQuestion() {
    const game = games[activeGame];
    const item = game.questions[questionIndex];
    const total = game.questions.length;
    answered = false;
    document.getElementById('game-score').textContent = score;
    document.getElementById('game-combo').textContent = `×${combo}`;
    document.getElementById('game-crystal').textContent = PP.getProgress().crystals.includes(activeGame) ? '💎' : '◇';
    document.getElementById('game-progress').style.setProperty('--progress', `${(questionIndex / total) * 100}%`);
    document.getElementById('game-question').innerHTML = `<span class="chip">${game.title} · ${questionIndex + 1}/${total}</span><h3>${item.prompt}</h3><p class="muted" style="margin:0">${game.instruction}</p>`;
    const options = document.getElementById('game-options');
    options.innerHTML = item.options.map((option) => `<button class="game-option" type="button" draggable="true" data-answer="${PP.escapeHTML(option)}">${PP.escapeHTML(option)}</button>`).join('');
    options.querySelectorAll('.game-option').forEach((button) => {
      button.addEventListener('click', () => chooseAnswer(button.dataset.answer));
      button.addEventListener('dragstart', (event) => {
        draggedAnswer = button.dataset.answer;
        event.dataTransfer.setData('text/plain', draggedAnswer);
        event.dataTransfer.effectAllowed = 'move';
      });
      button.addEventListener('focus', () => { draggedAnswer = button.dataset.answer; });
    });
    document.getElementById('game-feedback').textContent = 'แตะคำตอบ หรือลากคำตอบมาวางในพื้นที่ด้านล่าง';
    const next = document.getElementById('game-next');
    next.disabled = true;
    next.textContent = questionIndex === total - 1 ? 'ดูผลเกม →' : 'ข้อต่อไป →';
  }

  function chooseAnswer(selected) {
    if (answered) return;
    answered = true;
    const item = games[activeGame].questions[questionIndex];
    const correct = selected === item.answer;
    document.querySelectorAll('.game-option').forEach((button) => {
      button.disabled = true;
      if (button.dataset.answer === item.answer) button.classList.add('correct');
      if (!correct && button.dataset.answer === selected) button.classList.add('wrong');
    });
    if (correct) {
      combo += 1;
      score += 1;
      PP.playTone('correct');
    } else {
      combo = 0;
      PP.playTone('wrong');
    }
    document.getElementById('game-score').textContent = score;
    document.getElementById('game-combo').textContent = `×${combo}`;
    const feedback = document.getElementById('game-feedback');
    feedback.innerHTML = `<strong class="${correct ? 'success-text' : 'danger-text'}">${correct ? '✓ ถูกต้อง!' : '✕ ยังไม่ถูก'}</strong> ${item.explain}`;
    document.getElementById('game-next').disabled = false;
  }

  function showHint() {
    const item = games[activeGame].questions[questionIndex];
    PP.toast(`คำใบ้: ${item.hint}`);
  }

  function nextQuestion() {
    if (!answered) return;
    const total = games[activeGame].questions.length;
    if (questionIndex < total - 1) {
      questionIndex += 1;
      renderGameQuestion();
      return;
    }
    finishGame();
  }

  function finishGame() {
    const passed = score >= 4;
    const progress = PP.getProgress();
    const gamesProgress = { ...progress.games, [activeGame]: Math.max(Number(progress.games[activeGame] || 0), score) };
    const crystals = passed ? [...new Set([...progress.crystals, activeGame])] : progress.crystals;
    PP.updateProgress({ games: gamesProgress, crystals });
    if (passed) PP.playTone('crystal');
    document.getElementById('game-progress').style.setProperty('--progress', '100%');
    document.getElementById('game-crystal').textContent = passed ? '💎' : '◇';
    document.getElementById('game-question').innerHTML = `<span class="chip ${passed ? 'chip-gold' : ''}">${passed ? 'Mission Complete' : 'Keep Practicing'}</span><h3>${passed ? 'ได้รับ Prefix Crystal แล้ว!' : 'เกือบสำเร็จแล้ว!'}</h3><p>${games[activeGame].title}: ได้ ${score}/5 คะแนน</p>`;
    document.getElementById('game-options').innerHTML = '';
    document.getElementById('game-dropzone').textContent = passed ? '💎 Crystal ถูกบันทึกในความก้าวหน้าของคุณ' : 'เล่นใหม่และพยายามให้ได้อย่างน้อย 4 คะแนน';
    document.getElementById('game-feedback').textContent = passed ? 'ยอดเยี่ยม! พร้อมเลือกเกมถัดไปได้เลย' : 'ทบทวนคำอธิบายแล้วลองอีกครั้งนะ';
    document.getElementById('game-next').disabled = true;
  }

  function initHashNavigation() {
    const scrollToHash = () => {
      const lessonMatch = location.hash.match(/^#lesson-([1-4])$/);
      if (lessonMatch && showLessonFromHash) {
        showLessonFromHash(Number(lessonMatch[1]));
        window.setTimeout(() => document.querySelector('.lesson-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
        return;
      }
      if (location.hash === '#practice' || location.hash === '#builder') {
        window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      }
    };
    window.addEventListener('hashchange', scrollToHash);
    scrollToHash();
  }

  function init() {
    initLessons();
    initBuilder();
    initGames();
    initHashNavigation();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
