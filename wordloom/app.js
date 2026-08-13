(() => {
  "use strict";

  const questions = Array.isArray(window.WORDLOOM_QUESTIONS) ? window.WORDLOOM_QUESTIONS : [];
  const STORAGE = {
    profile: "wordloom.profile.v1",
    quiz: "wordloom.quiz.v1",
    latest: "wordloom.latest.v1",
    history: "wordloom.history.v1",
    settings: "wordloom.settings.v1"
  };
  const TOTAL_SECONDS = 60 * 60;
  const PASS_SCORE = 48;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const collections = [
    { id: 1, name: "กลับด้านความหมาย", note: "ทำความเข้าใจการปฏิเสธ การตรงข้าม และการย้อนสถานะ", prefixes: ["un-", "dis-", "im-", "ir-", "il-", "de-", "mis-"] },
    { id: 2, name: "เวลาและลำดับ", note: "สังเกตสิ่งที่เกิดก่อน หลัง และเกิดซ้ำอีกครั้ง", prefixes: ["pre-", "post-", "re-", "fore-", "ex-"] },
    { id: 3, name: "ตำแหน่งและการเคลื่อน", note: "อ่านทิศทาง ระยะ และความสัมพันธ์ระหว่างพื้นที่", prefixes: ["sub-", "inter-", "intra-", "trans-", "circum-", "super-"] },
    { id: 4, name: "จำนวนและระดับ", note: "เชื่อมจำนวน ขนาด และระดับที่มากหรือน้อยกว่าปกติ", prefixes: ["mono-", "bi-", "tri-", "multi-", "semi-", "micro-", "macro-"] },
    { id: 5, name: "มุมมองของคำ", note: "ตีความท่าที การสนับสนุน การต่อต้าน และความจริงเทียม", prefixes: ["co-", "auto-", "anti-", "pro-", "tele-", "pseudo-"] },
    { id: 6, name: "วิเคราะห์หลายชั้น", note: "รวบรวม Prefix, Base Word และบริบทเพื่อเลือกความหมายที่แม่นยำ", prefixes: ["ir-", "de-", "under-", "retro-", "counter-"] }
  ];

  const lessons = [
    {
      title: "คำที่พลิกทิศ", intro: "Prefix บางตัวทำให้คำเดิมกลายเป็นความหมายปฏิเสธ ตรงข้าม หรือคืนสถานะ การเลือกใช้ต้องดูทั้งรูปสะกดและบริบท",
      rule: "in- จะเปลี่ยนรูปให้กลมกลืนกับเสียงต้นคำ: im- หน้า m/p/b, il- หน้า l และ ir- หน้า r",
      examples: [["un + certain", "uncertain", "ไม่แน่ใจ"], ["im + possible", "impossible", "เป็นไปไม่ได้"], ["de + activate", "deactivate", "ปิดการทำงาน"], ["mis + read", "misread", "อ่านผิด"]]
    },
    {
      title: "เส้นเวลาของคำ", intro: "คำหนึ่งคำสามารถบอกได้ว่าสิ่งนั้นเกิดก่อน หลัง หรือทำซ้ำ โดยไม่ต้องเพิ่มวลีอธิบายยาว ๆ",
      rule: "pre- = ก่อน, post- = หลัง, re- = อีกครั้ง, fore- = ล่วงหน้า และ ex- = อดีต",
      examples: [["pre + view", "preview", "ดูตัวอย่างล่วงหน้า"], ["post + test", "posttest", "แบบทดสอบหลังเรียน"], ["re + write", "rewrite", "เขียนใหม่"], ["fore + cast", "forecast", "พยากรณ์"]]
    },
    {
      title: "แผนที่ในหนึ่งคำ", intro: "Prefix กลุ่มตำแหน่งทำหน้าที่คล้ายลูกศร บอกว่าอยู่ใต้ อยู่ภายใน อยู่ระหว่าง หรือเคลื่อนผ่านสิ่งใด",
      rule: "inter- คือระหว่างหลายหน่วย ส่วน intra- คือภายในหน่วยเดียว ความแตกต่างเล็กน้อยนี้เปลี่ยนความหมายชัดเจน",
      examples: [["sub + zero", "subzero", "ต่ำกว่าศูนย์"], ["inter + national", "international", "ระหว่างประเทศ"], ["intra + net", "intranet", "เครือข่ายภายใน"], ["trans + continental", "transcontinental", "ข้ามทวีป"]]
    },
    {
      title: "ขนาด จำนวน ระดับ", intro: "หลาย Prefix ทำหน้าที่บอกจำนวนหรือมาตราส่วน ช่วยให้เดาความหมายศัพท์วิทยาศาสตร์และวิชาการได้เร็วขึ้น",
      rule: "อย่าสับสน micro- (เล็ก) กับ macro- (ใหญ่/ภาพรวม) และ over- (มากเกิน) กับ under- (ต่ำหรือไม่พอ)",
      examples: [["bi + lingual", "bilingual", "สองภาษา"], ["multi + media", "multimedia", "สื่อหลายรูปแบบ"], ["micro + scope", "microscope", "เครื่องมือดูสิ่งเล็ก"], ["under + estimate", "underestimate", "ประเมินต่ำเกินไป"]]
    },
    {
      title: "ท่าทีและมุมมอง", intro: "Prefix ไม่ได้บอกแค่ตำแหน่งหรือจำนวน แต่ยังแสดงความสัมพันธ์ เจตนา และระดับความน่าเชื่อถือของคำได้",
      rule: "อ่านทั้งคำและประโยคเสมอ: pro- สนับสนุน, anti- ต่อต้าน, co- ร่วมกัน และ pseudo- ดูคล้ายจริงแต่ไม่ใช่",
      examples: [["co + operate", "cooperate", "ร่วมมือ"], ["anti + social", "antisocial", "ต่อต้าน/หลีกเลี่ยงสังคม"], ["pseudo + science", "pseudoscience", "วิทยาศาสตร์เทียม"], ["tele + medicine", "telemedicine", "การแพทย์ทางไกล"]]
    },
    {
      title: "อ่านคำหลายชั้น", intro: "เมื่อคำยาวขึ้น ให้เริ่มจาก Base Word แล้วค่อยเพิ่ม Prefix ทีละชั้น ก่อนตรวจสมมติฐานกับบริบทจริง",
      rule: "ขั้นตอน 3 จังหวะ: แยกส่วนคำ → รวมความหมายเบื้องต้น → ตรวจด้วยเบาะแสในประโยค",
      examples: [["ir + reversible", "irreversible", "ย้อนกลับไม่ได้"], ["de + centralize", "decentralize", "กระจายจากศูนย์กลาง"], ["re + construction", "reconstruction", "การสร้างใหม่"], ["counter + productive", "counterproductive", "ให้ผลสวนทาง"]]
    }
  ];

  const typeLabels = {
    "multiple-choice": "MULTIPLE CHOICE",
    "word-assembly": "WORD ASSEMBLY",
    matching: "MEANING MATCH",
    "sentence-completion": "SENTENCE COMPLETION",
    analysis: "CONTEXT ANALYSIS"
  };

  let profile = readJSON(STORAGE.profile, null);
  let quiz = normalizeQuiz(readJSON(STORAGE.quiz, null));
  let settings = readJSON(STORAGE.settings, { theme: "light", sound: true });
  let timerId = null;
  let transitionTimer = null;
  let practiceRound = [];
  let practiceIndex = 0;
  let practiceCorrect = 0;
  let practiceLocked = false;
  let reviewFilter = "all";

  function init() {
    document.documentElement.dataset.theme = settings.theme === "dark" ? "dark" : "light";
    renderCollections();
    setupProfile();
    setupLessons();
    setupBuilder();
    setupVocabulary();
    setupPractice();
    setupQuiz();
    bindGlobalEvents();
    updateResumeButton();

    const initialRoute = ["home", "learn", "practice", "quiz", "result"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "home";
    routeTo(initialRoute, false);
    window.setTimeout(() => $("#loading")?.classList.add("is-done"), 280);
  }

  function bindGlobalEvents() {
    $$('[data-route]').forEach(button => button.addEventListener("click", () => routeTo(button.dataset.route)));
    $("#themeToggle").addEventListener("click", toggleTheme);
    $("#soundToggle").addEventListener("click", () => {
      settings.sound = !settings.sound;
      saveJSON(STORAGE.settings, settings);
      toast(settings.sound ? "เปิดเสียงประกอบแล้ว" : "ปิดเสียงประกอบแล้ว");
      if (settings.sound) tone(520, .05);
    });
    $("#menuToggle").addEventListener("click", () => {
      const nav = $(".primary-nav");
      const open = nav.classList.toggle("is-open");
      $("#menuToggle").setAttribute("aria-expanded", String(open));
    });
    $("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("hashchange", () => routeTo(location.hash.slice(1) || "home", false));
    window.addEventListener("keydown", handleKeyboard);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && quiz?.active && !quiz.submitted) updateTimer();
    });
  }

  function routeTo(route, updateHash = true) {
    if (!["home", "learn", "practice", "quiz", "result"].includes(route)) route = "home";
    $$(".view").forEach(view => view.classList.toggle("is-active", view.dataset.view === route));
    $$('[data-route]').forEach(button => button.classList.toggle("is-active", button.dataset.route === route));
    $(".primary-nav").classList.remove("is-open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
    if (updateHash) history.pushState(null, "", `#${route}`);
    if (route === "quiz") updateQuizEntry();
    if (route === "result") renderResult();
    const view = $(`[data-view="${route}"]`);
    view?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCollections() {
    $("#collectionPreview").innerHTML = collections.map(item => `
      <article class="collection-card" tabindex="0" role="button" data-collection="${item.id}" aria-label="เปิดบทเรียนชุดที่ ${item.id} ${item.name}">
        <span>${String(item.id).padStart(2, "0")}</span>
        <h3>${item.name}</h3>
        <p>${item.note}</p>
        <div class="prefix-chips">${item.prefixes.slice(0, 5).map(prefix => `<i>${prefix}</i>`).join("")}</div>
      </article>`).join("");
    $$(".collection-card").forEach(card => {
      const open = () => { routeTo("learn"); selectLesson(Number(card.dataset.collection) - 1); };
      card.addEventListener("click", open);
      card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } });
    });
  }

  function setupProfile() {
    const form = $("#profileForm");
    if (profile) {
      $("#studentName").value = profile.name || "";
      $("#studentClass").value = profile.className || "";
      $("#studentNumber").value = profile.number || "";
      const radio = $(`input[name="avatar"][value="${profile.avatar}"]`);
      if (radio) radio.checked = true;
      $("#profileStatus").textContent = `บันทึกข้อมูลของ ${profile.name} แล้ว`;
    }
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      profile = {
        name: String(data.get("studentName") || "").trim(),
        className: String(data.get("studentClass") || "").trim(),
        number: String(data.get("studentNumber") || "").trim(),
        avatar: String(data.get("avatar") || "arc")
      };
      if (!profile.name || !profile.className || !profile.number) return;
      saveJSON(STORAGE.profile, profile);
      $("#profileStatus").textContent = `บันทึกข้อมูลของ ${profile.name} แล้ว`;
      tone(620, .06);
      toast("บันทึกพื้นที่เรียนเรียบร้อย");
    });
  }

  function setupLessons() {
    $("#lessonTabs").innerHTML = lessons.map((lesson, index) => `<button type="button" data-lesson="${index}"><span>${String(index + 1).padStart(2, "0")}</span>${lesson.title}</button>`).join("");
    $$("[data-lesson]").forEach(button => button.addEventListener("click", () => selectLesson(Number(button.dataset.lesson))));
    selectLesson(0);
  }

  function selectLesson(index) {
    const lesson = lessons[index] || lessons[0];
    $$('[data-lesson]').forEach(button => button.classList.toggle("is-active", Number(button.dataset.lesson) === index));
    $("#lessonContent").innerHTML = `
      <span class="lesson-number">${String(index + 1).padStart(2, "0")} / 06</span>
      <h2>${lesson.title}</h2>
      <p>${lesson.intro}</p>
      <div class="lesson-rule"><strong>จุดสังเกต</strong><br>${lesson.rule}</div>
      <div class="lesson-examples">${lesson.examples.map(example => `<div class="lesson-example"><strong>${example[0]}</strong><span>→ ${example[1]}</span><p>${example[2]}</p></div>`).join("")}</div>`;
  }

  function setupBuilder() {
    const prefixSelect = $("#builderPrefix");
    const uniquePrefixes = [...new Set(questions.map(question => question.prefix))];
    prefixSelect.innerHTML = uniquePrefixes.map(prefix => `<option value="${escapeHTML(prefix)}">${escapeHTML(prefix)}</option>`).join("");
    prefixSelect.addEventListener("change", updateBuilderBases);
    $("#builderBase").addEventListener("change", updateBuilderResult);
    updateBuilderBases();
  }

  function updateBuilderBases() {
    const prefix = $("#builderPrefix").value;
    const matches = questions.filter(question => question.prefix === prefix);
    $("#builderBase").innerHTML = matches.map(question => `<option value="${question.id}">${escapeHTML(question.baseWord)}</option>`).join("");
    updateBuilderResult();
  }

  function updateBuilderResult() {
    const question = questions.find(item => item.id === Number($("#builderBase").value));
    $("#builderResult").innerHTML = question ? `<strong>${escapeHTML(question.newWord)}</strong><small>${escapeHTML(question.meaning)}</small>` : "เลือกชิ้นส่วนคำ";
  }

  function setupVocabulary() {
    $("#wordFilter").innerHTML += collections.map(item => `<option value="${item.id}">ชุด ${item.id}: ${item.name}</option>`).join("");
    $("#wordSearch").addEventListener("input", renderVocabulary);
    $("#wordFilter").addEventListener("change", renderVocabulary);
    $("#shuffleWords").addEventListener("click", () => renderVocabulary(true));
    renderVocabulary();
  }

  function renderVocabulary(shuffle = false) {
    const search = $("#wordSearch").value.trim().toLowerCase();
    const collection = $("#wordFilter").value;
    let words = questions.filter(question => {
      const haystack = `${question.prefix} ${question.baseWord} ${question.newWord} ${question.meaning}`.toLowerCase();
      return (collection === "all" || Number(collection) === question.collection) && (!search || haystack.includes(search));
    });
    if (shuffle) words = shuffled(words);
    $("#wordGrid").innerHTML = words.length ? words.map(question => `
      <article class="word-card" tabindex="0" role="button" aria-label="พลิกบัตรคำ ${escapeHTML(question.newWord)}">
        <div class="front"><small>${escapeHTML(question.prefix)} + ${escapeHTML(question.baseWord)}</small><h3>${escapeHTML(question.newWord)}</h3><p>${escapeHTML(question.meaning)}</p></div>
        <div class="back"><small>WORD NOTES</small><strong>${escapeHTML(question.prefixMeaning)}</strong><p>${escapeHTML(question.explanation)}</p><i>กดอีกครั้งเพื่อกลับด้าน</i></div>
      </article>`).join("") : `<p>ไม่พบคำที่ตรงกับการค้นหา</p>`;
    $$(".word-card").forEach(card => {
      const flip = () => card.classList.toggle("is-flipped");
      card.addEventListener("click", flip);
      card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); flip(); } });
    });
  }

  function setupPractice() {
    $("#practiceStart").addEventListener("click", startPractice);
  }

  function startPractice() {
    practiceRound = shuffled(questions).slice(0, 10);
    practiceIndex = 0;
    practiceCorrect = 0;
    practiceLocked = false;
    $("#practiceStart").textContent = "เริ่มใหม่";
    renderPracticeQuestion();
  }

  function renderPracticeQuestion() {
    const question = practiceRound[practiceIndex];
    if (!question) {
      $("#practicePrompt").textContent = `จบรอบฝึก — คุณตอบถูก ${practiceCorrect} จาก 10 ข้อ`;
      $("#practiceOptions").innerHTML = "";
      $("#practiceScore").textContent = `${practiceCorrect} / 10`;
      tone(740, .08);
      return;
    }
    practiceLocked = false;
    $("#practicePrompt").textContent = question.question;
    $("#practiceScore").textContent = `${practiceCorrect} / ${practiceIndex}`;
    $("#practiceOptions").innerHTML = question.options.map((option, index) => `<button type="button" data-practice-answer="${index}">${escapeHTML(option)}</button>`).join("");
    $$('[data-practice-answer]').forEach(button => button.addEventListener("click", () => answerPractice(Number(button.dataset.practiceAnswer))));
  }

  function answerPractice(answer) {
    if (practiceLocked) return;
    practiceLocked = true;
    const question = practiceRound[practiceIndex];
    if (answer === question.correctAnswer) {
      practiceCorrect += 1;
      tone(700, .06);
    } else {
      tone(250, .08);
    }
    $$('[data-practice-answer]').forEach((button, index) => {
      button.disabled = true;
      if (index === question.correctAnswer) button.classList.add("is-correct");
      if (index === answer && answer !== question.correctAnswer) button.classList.add("is-wrong");
    });
    $("#practiceScore").textContent = `${practiceCorrect} / ${practiceIndex + 1}`;
    window.setTimeout(() => { practiceIndex += 1; renderPracticeQuestion(); }, 750);
  }

  function setupQuiz() {
    $("#beginQuiz").addEventListener("click", beginNewQuiz);
    $("#resumeQuiz").addEventListener("click", resumeQuiz);
    $("#prevQuestion").addEventListener("click", () => moveQuestion(-1));
    $("#nextQuestion").addEventListener("click", () => moveQuestion(1));
    $("#markQuestion").addEventListener("click", toggleMark);
    $("#submitQuiz").addEventListener("click", requestSubmitQuiz);
    $("#exitQuiz").addEventListener("click", leaveQuiz);
    $("#focusToggle").addEventListener("click", () => {
      document.body.classList.toggle("focus-mode");
      $("#focusToggle").textContent = document.body.classList.contains("focus-mode") ? "ออกจากโหมดโฟกัส" : "โหมดโฟกัส";
    });
    $("#toggleNavigator").addEventListener("click", () => {
      const navigator = $("#questionNavigator");
      const hidden = navigator.classList.toggle("hidden");
      $(".navigator-legend").classList.toggle("hidden", hidden);
      $("#toggleNavigator").textContent = hidden ? "ขยาย" : "ย่อ";
      $("#toggleNavigator").setAttribute("aria-expanded", String(!hidden));
    });
    $("#skipTransition").addEventListener("click", hideTransition);
  }

  async function beginNewQuiz() {
    if (!ensureProfile()) return;
    if (quiz?.active && !quiz.submitted) {
      const restart = await askModal({
        eyebrow: "START AGAIN",
        title: "เริ่มแบบทดสอบใหม่หรือไม่",
        body: "คำตอบและเวลาที่เหลือของรอบปัจจุบันจะถูกแทนที่",
        cancelLabel: "เก็บรอบเดิมไว้",
        confirmLabel: "เริ่มรอบใหม่"
      });
      if (!restart) return;
    }
    quiz = {
      version: 1,
      active: true,
      submitted: false,
      index: 0,
      answers: {},
      marked: [],
      startedAt: Date.now(),
      deadline: Date.now() + TOTAL_SECONDS * 1000,
      lastSaved: Date.now()
    };
    saveQuiz();
    showQuizWorkspace();
    tone(480, .08);
  }

  function resumeQuiz() {
    if (!ensureProfile()) return;
    if (!quiz?.active || quiz.submitted) return beginNewQuiz();
    if (remainingSeconds() <= 0) return finishQuiz(true);
    showQuizWorkspace();
  }

  function ensureProfile() {
    profile = readJSON(STORAGE.profile, profile);
    if (profile?.name && profile?.className && profile?.number) return true;
    toast("กรุณาบันทึกชื่อ ชั้น และเลขที่ก่อนเริ่มแบบทดสอบ");
    routeTo("home");
    window.setTimeout(() => $("#studentName")?.focus(), 450);
    return false;
  }

  function updateQuizEntry() {
    if (quiz?.active && !quiz.submitted && remainingSeconds() <= 0) {
      finishQuiz(true);
      return;
    }
    updateResumeButton();
    if (quiz?.active && !quiz.submitted && !$("#quizWorkspace").classList.contains("hidden")) {
      renderQuiz();
      startTimer();
    }
  }

  function updateResumeButton() {
    const canResume = Boolean(quiz?.active && !quiz.submitted && remainingSeconds() > 0);
    $("#resumeQuiz")?.classList.toggle("hidden", !canResume);
    if (canResume) {
      const answered = Object.keys(quiz.answers || {}).length;
      $("#resumeQuiz").textContent = `ทำต่อจากครั้งก่อน (${answered}/60)`;
    }
  }

  function showQuizWorkspace() {
    $("#quizWelcome").classList.add("hidden");
    $("#quizWorkspace").classList.remove("hidden");
    renderQuiz();
    startTimer();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showQuizWelcome() {
    $("#quizWorkspace").classList.add("hidden");
    $("#quizWelcome").classList.remove("hidden");
    document.body.classList.remove("focus-mode");
    clearInterval(timerId);
    timerId = null;
    updateResumeButton();
  }

  function renderQuiz() {
    if (!quiz?.active || quiz.submitted) return showQuizWelcome();
    quiz.index = Math.max(0, Math.min(questions.length - 1, Number(quiz.index) || 0));
    const question = questions[quiz.index];
    const selected = quiz.answers[String(question.id)];
    $("#quizCollectionLabel").textContent = `ชุด ${question.collection}: ${question.collectionName}`;
    $("#quizCounter").textContent = `ข้อ ${question.id} จาก ${questions.length}`;
    $("#questionType").textContent = typeLabels[question.type] || question.type;
    $("#questionDifficulty").textContent = question.difficulty;
    $("#questionText").textContent = question.question;
    $("#questionOptions").innerHTML = question.options.map((option, index) => `
      <button class="option-button${selected === index ? " is-selected" : ""}" type="button" role="radio" aria-checked="${selected === index}" data-answer="${index}">
        <span>${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span>
      </button>`).join("");
    $$('[data-answer]').forEach(button => button.addEventListener("click", () => selectAnswer(Number(button.dataset.answer))));

    const isMarked = quiz.marked.includes(question.id);
    $("#markQuestion").classList.toggle("is-marked", isMarked);
    $("#markQuestion").setAttribute("aria-pressed", String(isMarked));
    $("#markQuestion").textContent = isMarked ? "◆ ทำเครื่องหมายแล้ว" : "◇ ทำเครื่องหมาย";
    $("#prevQuestion").disabled = quiz.index === 0;
    $("#nextQuestion").textContent = quiz.index === questions.length - 1 ? "ตรวจและส่ง →" : "ข้อต่อไป →";
    renderNavigator();
    renderQuizCollections();
    updateQuizProgress();
    updateTimer();
  }

  function selectAnswer(answerIndex) {
    if (!quiz?.active || quiz.submitted) return;
    const question = questions[quiz.index];
    quiz.answers[String(question.id)] = answerIndex;
    quiz.lastSaved = Date.now();
    saveQuiz();
    tone(430, .025);
    renderQuiz();
  }

  function moveQuestion(direction) {
    if (!quiz?.active || quiz.submitted) return;
    if (direction > 0 && quiz.index === questions.length - 1) {
      requestSubmitQuiz();
      return;
    }
    const oldCollection = questions[quiz.index].collection;
    const nextIndex = Math.max(0, Math.min(questions.length - 1, quiz.index + direction));
    const newCollection = questions[nextIndex].collection;
    quiz.index = nextIndex;
    saveQuiz();
    renderQuiz();
    $(".question-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (direction > 0 && newCollection > oldCollection) showTransition(oldCollection);
  }

  function goToQuestion(index) {
    quiz.index = Math.max(0, Math.min(questions.length - 1, index));
    saveQuiz();
    renderQuiz();
    $(".question-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleMark() {
    const id = questions[quiz.index].id;
    quiz.marked = quiz.marked.includes(id) ? quiz.marked.filter(item => item !== id) : [...quiz.marked, id];
    saveQuiz();
    renderQuiz();
  }

  function renderNavigator() {
    $("#questionNavigator").innerHTML = questions.map((question, index) => {
      const classes = [
        Object.prototype.hasOwnProperty.call(quiz.answers, String(question.id)) ? "is-answered" : "",
        index === quiz.index ? "is-current" : "",
        quiz.marked.includes(question.id) ? "is-marked" : ""
      ].filter(Boolean).join(" ");
      const states = [
        Object.prototype.hasOwnProperty.call(quiz.answers, String(question.id)) ? "ตอบแล้ว" : "ยังไม่ตอบ",
        index === quiz.index ? "กำลังทำ" : "",
        quiz.marked.includes(question.id) ? "ทำเครื่องหมายทบทวน" : ""
      ].filter(Boolean).join(", ");
      return `<button type="button" class="${classes}" data-go-question="${index}" aria-label="ข้อ ${question.id}: ${states}"${index === quiz.index ? ' aria-current="step"' : ""}>${question.id}</button>`;
    }).join("");
    $$('[data-go-question]').forEach(button => button.addEventListener("click", () => goToQuestion(Number(button.dataset.goQuestion))));
  }

  function renderQuizCollections() {
    $("#quizCollections").innerHTML = collections.map(collection => {
      const set = questions.filter(question => question.collection === collection.id);
      const complete = set.every(question => Object.prototype.hasOwnProperty.call(quiz.answers, String(question.id)));
      const active = questions[quiz.index].collection === collection.id;
      return `<button class="quiz-collection${complete ? " is-complete" : ""}${active ? " is-active" : ""}" type="button" data-go-collection="${collection.id}"><i></i><span>${String(collection.id).padStart(2, "0")} ${collection.name}</span></button>`;
    }).join("");
    $$('[data-go-collection]').forEach(button => button.addEventListener("click", () => goToQuestion((Number(button.dataset.goCollection) - 1) * 10)));
  }

  function updateQuizProgress() {
    const answered = Object.keys(quiz.answers || {}).length;
    $("#answeredCount").textContent = String(answered);
    $("#quizProgressBar").style.width = `${(answered / questions.length) * 100}%`;
  }

  function showTransition(collectionId) {
    const collection = collections.find(item => item.id === collectionId);
    if (!collection) return;
    clearTimeout(transitionTimer);
    $("#transitionTitle").textContent = `จบชุดที่ ${collection.id}`;
    $("#transitionText").textContent = `${collection.name} — บันทึกคำตอบไว้แล้ว เดินหน้าสู่ชุดถัดไป`;
    $("#transitionOverlay").classList.remove("hidden");
    transitionTimer = window.setTimeout(hideTransition, 2200);
  }

  function hideTransition() {
    clearTimeout(transitionTimer);
    $("#transitionOverlay").classList.add("hidden");
  }

  function startTimer() {
    clearInterval(timerId);
    updateTimer();
    timerId = window.setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    if (!quiz?.active || quiz.submitted) return;
    const left = remainingSeconds();
    const minutes = Math.floor(left / 60);
    const seconds = left % 60;
    const timer = $("#timer");
    if (timer) {
      timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      timer.classList.toggle("warning", left <= 300 && left > 60);
      timer.classList.toggle("danger", left <= 60);
    }
    if (left <= 0) {
      clearInterval(timerId);
      timerId = null;
      finishQuiz(true);
    }
  }

  function remainingSeconds() {
    if (!quiz?.deadline) return TOTAL_SECONDS;
    return Math.max(0, Math.ceil((Number(quiz.deadline) - Date.now()) / 1000));
  }

  async function leaveQuiz() {
    saveQuiz();
    showQuizWelcome();
    toast("บันทึกคำตอบแล้ว เวลาจะยังเดินต่อจนกว่าจะกลับมา");
  }

  async function requestSubmitQuiz() {
    if (!quiz?.active || quiz.submitted) return;
    const unanswered = questions.filter(question => !Object.prototype.hasOwnProperty.call(quiz.answers, String(question.id))).map(question => question.id);
    if (unanswered.length) {
      const continueSubmit = await askModal({
        eyebrow: "UNANSWERED ITEMS",
        title: `ยังไม่ได้ตอบ ${unanswered.length} ข้อ`,
        body: `หมายเลขข้อที่ยังว่าง:<div class="unanswered-list">${unanswered.map(id => `<span>${id}</span>`).join("")}</div>`,
        cancelLabel: "กลับไปทำต่อ",
        confirmLabel: "ส่งทั้งที่ยังไม่ครบ"
      });
      if (!continueSubmit) return;
    }
    const confirmed = await askModal({
      eyebrow: "FINAL SUBMISSION",
      title: "ยืนยันส่งคำตอบ",
      body: "เมื่อส่งแล้วจะไม่สามารถแก้ไขคำตอบในรอบนี้ได้ และระบบจะแสดงคะแนนพร้อมเฉลยทั้งหมด",
      cancelLabel: "ตรวจคำตอบอีกครั้ง",
      confirmLabel: "ยืนยันส่งคำตอบ"
    });
    if (confirmed) finishQuiz(false);
  }

  function finishQuiz(autoSubmitted = false) {
    if (!quiz?.active || quiz.submitted) return;
    clearInterval(timerId);
    timerId = null;
    const submittedAt = Date.now();
    const score = questions.reduce((sum, question) => sum + (quiz.answers[String(question.id)] === question.correctAnswer ? 1 : 0), 0);
    const unanswered = questions.filter(question => !Object.prototype.hasOwnProperty.call(quiz.answers, String(question.id))).length;
    const usedSeconds = Math.min(TOTAL_SECONDS, Math.max(0, Math.round((submittedAt - quiz.startedAt) / 1000)));
    const collectionScores = collections.map(collection => {
      const set = questions.filter(question => question.collection === collection.id);
      const correct = set.filter(question => quiz.answers[String(question.id)] === question.correctAnswer).length;
      return { id: collection.id, name: collection.name, correct, total: set.length };
    });
    const result = {
      id: submittedAt,
      submittedAt,
      autoSubmitted,
      profile: { ...profile },
      answers: { ...quiz.answers },
      score,
      correct: score,
      wrong: questions.length - score - unanswered,
      unanswered,
      percent: Math.round((score / questions.length) * 100),
      usedSeconds,
      collectionScores,
      level: getLevel(score)
    };
    quiz.active = false;
    quiz.submitted = true;
    quiz.resultId = result.id;
    saveQuiz();
    saveJSON(STORAGE.latest, result);
    const history = readJSON(STORAGE.history, []);
    const nextHistory = [result, ...(Array.isArray(history) ? history : []).filter(item => item.id !== result.id)].slice(0, 5);
    saveJSON(STORAGE.history, nextHistory);
    document.body.classList.remove("focus-mode");
    hideTransition();
    routeTo("result");
    if (score >= PASS_SCORE) launchConfetti();
    if (autoSubmitted) toast("หมดเวลา ระบบส่งคำตอบให้อัตโนมัติแล้ว");
  }

  function renderResult() {
    const result = readJSON(STORAGE.latest, null);
    const container = $("#resultContent");
    if (!result || !result.answers) {
      container.innerHTML = `<div class="page-intro"><p class="eyebrow">NO RESULT YET</p><h1>ยังไม่มีผลคะแนน</h1><p>เริ่มทำแบบทดสอบ 60 ข้อเพื่อดูผลและเฉลยอย่างละเอียด</p><button class="button button-primary" type="button" data-result-action="go-quiz">ไปที่แบบทดสอบ</button></div>`;
      bindResultActions();
      return;
    }
    const passed = result.score >= PASS_SCORE;
    const timeText = formatDuration(result.usedSeconds);
    const dateText = new Intl.DateTimeFormat("th-TH", { dateStyle: "long", timeStyle: "short" }).format(new Date(result.submittedAt));
    const badges = [
      { name: "Pattern Reader", earned: result.score >= 36 },
      { name: "Wordloom Graduate", earned: result.score >= 48 },
      { name: "Word Architect", earned: result.score >= 55 },
      { name: "Perfect Weave", earned: result.score === 60 }
    ];
    container.innerHTML = `
      <section class="result-hero">
        <div><p class="eyebrow">${passed ? "MISSION COMPLETE" : "KEEP EXPLORING"}</p><h1>${escapeHTML(result.level.title)}</h1><p>${escapeHTML(result.level.note)}</p><p>${escapeHTML(result.profile?.name || "ผู้เรียน")} · ${escapeHTML(result.profile?.className || "-")} · เลขที่ ${escapeHTML(result.profile?.number || "-")}<br>${dateText}</p></div>
        <div class="score-seal"><strong>${result.score}</strong><span>/ 60 คะแนน</span></div>
      </section>
      <section class="result-summary">
        <article><span>เปอร์เซ็นต์</span><strong>${result.percent}%</strong></article>
        <article><span>ตอบถูก</span><strong>${result.correct}</strong></article>
        <article><span>ตอบผิด / ว่าง</span><strong>${result.wrong} / ${result.unanswered}</strong></article>
        <article><span>เวลาที่ใช้</span><strong>${timeText}</strong></article>
      </section>
      <div class="badge-row">${badges.map(badge => `<span class="badge${badge.earned ? " is-earned" : ""}">${badge.earned ? "●" : "○"} ${badge.name}</span>`).join("")}</div>
      <section class="collection-scores">
        <div><p class="eyebrow">SIX COLLECTIONS</p><h2>คะแนนแยกตามชุด</h2><p>แต่ละชุดมี 10 ข้อ ใช้แถบนี้เลือกหัวข้อที่ควรกลับไปทบทวน</p></div>
        <div class="score-bars">${result.collectionScores.map(item => `<div class="score-bar"><span>${item.name}</span><i><span style="width:${(item.correct / item.total) * 100}%"></span></i><b>${item.correct}/${item.total}</b></div>`).join("")}</div>
      </section>
      <div class="result-actions">
        <button class="button button-primary" type="button" data-result-action="retake">ทำแบบทดสอบอีกครั้ง</button>
        <button class="button button-quiet" type="button" data-result-action="learn">ทบทวนบทเรียน</button>
        <button class="button button-quiet" type="button" data-result-action="print">พิมพ์ผล A4</button>
        <button class="button button-quiet" type="button" data-result-action="csv">ดาวน์โหลด CSV</button>
        <button class="button button-quiet" type="button" data-result-action="history">ดูประวัติ 5 ครั้ง</button>
        <button class="button button-quiet" type="button" data-result-action="clear-history">ล้างประวัติ</button>
        <button class="button button-quiet" type="button" data-result-action="clear-all">ล้างข้อมูลการเรียน</button>
      </div>
      <section class="review-section">
        <p class="eyebrow">ANSWER NOTES</p><h2>เฉลยและการแยกคำ</h2>
        <div class="review-toolbar">
          <button class="is-active" type="button" data-review-filter="all">ทั้งหมด</button>
          <button type="button" data-review-filter="correct">ตอบถูก</button>
          <button type="button" data-review-filter="wrong">ตอบผิด</button>
          <button type="button" data-review-filter="unanswered">ไม่ได้ตอบ</button>
          ${collections.map(item => `<button type="button" data-review-filter="collection-${item.id}">ชุด ${item.id}</button>`).join("")}
        </div>
        <div id="reviewList" class="review-list"></div>
      </section>`;
    reviewFilter = "all";
    renderReview(result);
    bindResultActions();
  }

  function renderReview(result) {
    const list = $("#reviewList");
    if (!list) return;
    const filtered = questions.filter(question => {
      const hasAnswer = Object.prototype.hasOwnProperty.call(result.answers, String(question.id));
      const correct = result.answers[String(question.id)] === question.correctAnswer;
      if (reviewFilter === "correct") return hasAnswer && correct;
      if (reviewFilter === "wrong") return hasAnswer && !correct;
      if (reviewFilter === "unanswered") return !hasAnswer;
      if (reviewFilter.startsWith("collection-")) return question.collection === Number(reviewFilter.split("-")[1]);
      return true;
    });
    list.innerHTML = filtered.map(question => {
      const hasAnswer = Object.prototype.hasOwnProperty.call(result.answers, String(question.id));
      const chosen = hasAnswer ? result.answers[String(question.id)] : null;
      const correct = chosen === question.correctAnswer;
      return `<article class="review-card">
        <header><span>ข้อ ${question.id} · ชุด ${question.collection} · ${typeLabels[question.type]}</span><span>${correct ? "ตอบถูก" : hasAnswer ? "ตอบผิด" : "ไม่ได้ตอบ"}</span></header>
        <h3>${escapeHTML(question.question)}</h3>
        <div class="review-answer">
          <div class="${correct ? "right" : "wrong"}"><small>คำตอบของผู้เรียน</small>${hasAnswer ? `${String.fromCharCode(65 + chosen)}. ${escapeHTML(question.options[chosen])}` : "— ไม่ได้ตอบ —"}</div>
          <div class="right"><small>คำตอบที่ถูกต้อง</small>${String.fromCharCode(65 + question.correctAnswer)}. ${escapeHTML(question.options[question.correctAnswer])}</div>
        </div>
        <div class="word-breakdown"><span>Prefix: ${escapeHTML(question.prefix)} = ${escapeHTML(question.prefixMeaning)}</span><span>Base: ${escapeHTML(question.baseWord)} = ${escapeHTML(question.baseMeaning)}</span><span>New word: ${escapeHTML(question.newWord)} = ${escapeHTML(question.meaning)}</span></div>
        <p><strong>เหตุผล:</strong> ${escapeHTML(question.explanation)}<br><strong>คำแปล:</strong> ${escapeHTML(question.translation)}</p>
      </article>`;
    }).join("") || `<p>ไม่มีข้อที่ตรงกับตัวกรองนี้</p>`;
  }

  function bindResultActions() {
    $$('[data-review-filter]').forEach(button => button.addEventListener("click", () => {
      reviewFilter = button.dataset.reviewFilter;
      $$('[data-review-filter]').forEach(item => item.classList.toggle("is-active", item === button));
      renderReview(readJSON(STORAGE.latest, null));
    }));
    $$('[data-result-action]').forEach(button => button.addEventListener("click", () => handleResultAction(button.dataset.resultAction)));
  }

  async function handleResultAction(action) {
    if (action === "go-quiz") return routeTo("quiz");
    if (action === "learn") return routeTo("learn");
    if (action === "print") return window.print();
    if (action === "csv") return downloadCSV();
    if (action === "history") return showHistory();
    if (action === "retake") {
      quiz = null;
      localStorage.removeItem(STORAGE.quiz);
      routeTo("quiz");
      return;
    }
    if (action === "clear-history") {
      const confirmed = await askModal({ eyebrow: "CLEAR HISTORY", title: "ล้างประวัติข้อสอบหรือไม่", body: "ผลย้อนหลังทั้งหมดจะถูกลบ แต่ผลล่าสุดและข้อมูลผู้เรียนยังคงอยู่", cancelLabel: "ยกเลิก", confirmLabel: "ล้างประวัติ" });
      if (confirmed) { localStorage.removeItem(STORAGE.history); toast("ล้างประวัติข้อสอบแล้ว"); }
      return;
    }
    if (action === "clear-all") {
      const confirmed = await askModal({ eyebrow: "CLEAR ALL DATA", title: "ล้างข้อมูลการเรียนทั้งหมด", body: "ข้อมูลผู้เรียน คำตอบ คะแนน การตั้งค่า และประวัติในอุปกรณ์นี้จะถูกลบทั้งหมด", cancelLabel: "ยกเลิก", confirmLabel: "ล้างข้อมูลทั้งหมด" });
      if (confirmed) {
        Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
        profile = null;
        quiz = null;
        toast("ล้างข้อมูลการเรียนทั้งหมดแล้ว");
        window.setTimeout(() => location.reload(), 450);
      }
    }
  }

  function showHistory() {
    const history = readJSON(STORAGE.history, []);
    const rows = Array.isArray(history) && history.length
      ? history.map((item, index) => `<div style="display:grid;grid-template-columns:30px 1fr auto;gap:10px;padding:10px 0;border-bottom:1px solid var(--line)"><span>${index + 1}</span><span>${new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.submittedAt))}</span><strong>${item.score}/60</strong></div>`).join("")
      : "ยังไม่มีประวัติการทำแบบทดสอบ";
    askModal({ eyebrow: "RECENT RESULTS", title: "ประวัติย้อนหลัง 5 ครั้ง", body: rows, cancelLabel: "ปิด", confirmLabel: "ตกลง", hideCancel: true });
  }

  function downloadCSV() {
    const result = readJSON(STORAGE.latest, null);
    if (!result) return;
    const rows = [
      ["Wordloom Prefix Studio"],
      ["ชื่อ", result.profile?.name || ""],
      ["ชั้น", result.profile?.className || ""],
      ["เลขที่", result.profile?.number || ""],
      ["คะแนน", `${result.score}/60`],
      ["เปอร์เซ็นต์", `${result.percent}%`],
      [],
      ["ข้อ", "ชุด", "คำศัพท์", "คำตอบผู้เรียน", "คำตอบถูก", "ผล", "คำอธิบาย"]
    ];
    questions.forEach(question => {
      const has = Object.prototype.hasOwnProperty.call(result.answers, String(question.id));
      const chosen = has ? result.answers[String(question.id)] : null;
      rows.push([
        question.id,
        question.collectionName,
        question.newWord,
        has ? question.options[chosen] : "ไม่ได้ตอบ",
        question.options[question.correctAnswer],
        chosen === question.correctAnswer ? "ถูก" : "ผิด",
        question.explanation
      ]);
    });
    const csv = "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `wordloom-result-${new Date(result.submittedAt).toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("ดาวน์โหลดผลคะแนน CSV แล้ว");
  }

  function getLevel(score) {
    if (score === 60) return { title: "Perfect Weave", note: "วิเคราะห์โครงสร้างคำได้ครบทุกข้ออย่างแม่นยำ" };
    if (score >= 55) return { title: "Word Architect", note: "เข้าใจ Prefix และใช้บริบทวิเคราะห์คำได้ดีเยี่ยม" };
    if (score >= 48) return { title: "Wordloom Graduate", note: "ผ่านเกณฑ์และมีพื้นฐานการวิเคราะห์คำที่มั่นคง" };
    if (score >= 36) return { title: "Growing Lexicon", note: "มีความเข้าใจหลายส่วนแล้ว ลองทบทวนชุดที่คะแนนยังไม่เต็ม" };
    return { title: "Keep Exploring", note: "กลับไปอ่านสมุดบทเรียน แล้วค่อยลองประกอบความหมายอีกครั้ง" };
  }

  function handleKeyboard(event) {
    const target = event.target;
    if (target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
    const quizVisible = $("#view-quiz").classList.contains("is-active") && !$("#quizWorkspace").classList.contains("hidden");
    if (!quizVisible || !quiz?.active || quiz.submitted) return;
    if (["1", "2", "3", "4"].includes(event.key)) {
      event.preventDefault();
      selectAnswer(Number(event.key) - 1);
    }
    if (event.key === "ArrowLeft") { event.preventDefault(); moveQuestion(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); moveQuestion(1); }
    if (event.key.toLowerCase() === "m") { event.preventDefault(); toggleMark(); }
  }

  function normalizeQuiz(value) {
    if (!value || typeof value !== "object") return null;
    const answers = value.answers && typeof value.answers === "object" ? value.answers : {};
    const cleanedAnswers = {};
    Object.entries(answers).forEach(([id, answer]) => {
      const question = questions.find(item => item.id === Number(id));
      if (question && Number.isInteger(answer) && answer >= 0 && answer < question.options.length) cleanedAnswers[id] = answer;
    });
    return {
      ...value,
      index: Math.max(0, Math.min(questions.length - 1, Number(value.index) || 0)),
      answers: cleanedAnswers,
      marked: Array.isArray(value.marked) ? value.marked.filter(id => questions.some(question => question.id === id)) : []
    };
  }

  function saveQuiz() {
    if (!quiz) return;
    try {
      localStorage.setItem(STORAGE.quiz, JSON.stringify(quiz));
    } catch (error) {
      console.warn("Unable to save quiz progress", error);
      toast("อุปกรณ์นี้ไม่สามารถบันทึกความคืบหน้าได้");
    }
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(key);
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { console.warn(`Unable to save ${key}`, error); }
  }

  function askModal({ eyebrow, title, body, cancelLabel = "ยกเลิก", confirmLabel = "ยืนยัน", hideCancel = false }) {
    const dialog = $("#customModal");
    $("#modalEyebrow").textContent = eyebrow;
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = body;
    $("#modalCancel").textContent = cancelLabel;
    $("#modalConfirm").textContent = confirmLabel;
    $("#modalCancel").classList.toggle("hidden", hideCancel);
    return new Promise(resolve => {
      const onClose = () => {
        dialog.removeEventListener("close", onClose);
        $("#modalCancel").classList.remove("hidden");
        resolve(dialog.returnValue === "confirm");
      };
      dialog.addEventListener("close", onClose);
      dialog.showModal();
    });
  }

  function toggleTheme() {
    settings.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = settings.theme;
    saveJSON(STORAGE.settings, settings);
    tone(560, .04);
  }

  let toastTimer = null;
  function toast(message) {
    const element = $("#toast");
    element.textContent = message;
    element.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => element.classList.remove("is-visible"), 2600);
  }

  function tone(frequency, duration) {
    if (!settings.sound || !window.AudioContext && !window.webkitAudioContext) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      const context = tone.context || (tone.context = new Audio());
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch { /* Sound is optional. */ }
  }

  function launchConfetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#8da58d", "#c86f52", "#526ca8", "#d7b85b"];
    for (let index = 0; index < 48; index += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * .7}s`;
      piece.style.setProperty("--drift", `${Math.round((Math.random() - .5) * 220)}px`);
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 3600);
    }
  }

  function shuffled(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const random = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[random]] = [copy[random], copy[index]];
    }
    return copy;
  }

  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  }

  function csvCell(value) {
    return `"${String(value ?? "").replaceAll('"', '""')}"`;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  }

  if (questions.length !== 60) {
    console.error(`Wordloom expected 60 questions but received ${questions.length}.`);
  }
  init();
})();
