/* =========================================================
   Prefix Planet — Searchable vocabulary library and flashcards
   ========================================================= */
(function () {
  'use strict';

  const PP = window.PrefixPlanet;
  if (!PP) return;

  const vocabulary = [
    { id: 'unhappy', prefix: 'un-', prefixMeaning: 'not / ไม่', base: 'happy', baseMeaning: 'มีความสุข', word: 'unhappy', meaning: 'ไม่มีความสุข', pos: 'adjective', group: 'negative', example: 'She was unhappy with the final decision.', translation: 'เธอไม่พอใจกับการตัดสินใจครั้งสุดท้าย' },
    { id: 'unfair', prefix: 'un-', prefixMeaning: 'not / ไม่', base: 'fair', baseMeaning: 'ยุติธรรม', word: 'unfair', meaning: 'ไม่ยุติธรรม', pos: 'adjective', group: 'negative', example: 'The new rule seems unfair to beginners.', translation: 'กฎใหม่ดูไม่ยุติธรรมต่อผู้เริ่มต้น' },
    { id: 'rewrite', prefix: 're-', prefixMeaning: 'again / อีกครั้ง', base: 'write', baseMeaning: 'เขียน', word: 'rewrite', meaning: 'เขียนใหม่', pos: 'verb', group: 'time', example: 'Please rewrite the paragraph more clearly.', translation: 'กรุณาเขียนย่อหน้านี้ใหม่ให้ชัดเจนขึ้น' },
    { id: 'rebuild', prefix: 're-', prefixMeaning: 'again / อีกครั้ง', base: 'build', baseMeaning: 'สร้าง', word: 'rebuild', meaning: 'สร้างใหม่', pos: 'verb', group: 'time', example: 'The community plans to rebuild the bridge.', translation: 'ชุมชนวางแผนสร้างสะพานขึ้นใหม่' },
    { id: 'preview', prefix: 'pre-', prefixMeaning: 'before / ก่อน', base: 'view', baseMeaning: 'ดู', word: 'preview', meaning: 'ดูตัวอย่างล่วงหน้า', pos: 'noun / verb', group: 'time', example: 'We watched a preview of the new documentary.', translation: 'พวกเราดูตัวอย่างสารคดีเรื่องใหม่' },
    { id: 'preheat', prefix: 'pre-', prefixMeaning: 'before / ก่อน', base: 'heat', baseMeaning: 'ทำให้ร้อน', word: 'preheat', meaning: 'อุ่นล่วงหน้า', pos: 'verb', group: 'time', example: 'Preheat the oven to 180 degrees.', translation: 'อุ่นเตาอบล่วงหน้าที่ 180 องศา' },
    { id: 'disagree', prefix: 'dis-', prefixMeaning: 'not / opposite / ไม่หรือตรงข้าม', base: 'agree', baseMeaning: 'เห็นด้วย', word: 'disagree', meaning: 'ไม่เห็นด้วย', pos: 'verb', group: 'negative', example: 'I disagree with that conclusion.', translation: 'ฉันไม่เห็นด้วยกับข้อสรุปนั้น' },
    { id: 'disconnect', prefix: 'dis-', prefixMeaning: 'apart / opposite / แยกออก', base: 'connect', baseMeaning: 'เชื่อมต่อ', word: 'disconnect', meaning: 'ตัดการเชื่อมต่อ', pos: 'verb', group: 'negative', example: 'Disconnect the charger when the battery is full.', translation: 'ถอดที่ชาร์จเมื่อแบตเตอรี่เต็ม' },
    { id: 'misunderstand', prefix: 'mis-', prefixMeaning: 'wrongly / ผิด', base: 'understand', baseMeaning: 'เข้าใจ', word: 'misunderstand', meaning: 'เข้าใจผิด', pos: 'verb', group: 'negative', example: 'Do not misunderstand the purpose of the activity.', translation: 'อย่าเข้าใจจุดประสงค์ของกิจกรรมผิด' },
    { id: 'misspell', prefix: 'mis-', prefixMeaning: 'wrongly / ผิด', base: 'spell', baseMeaning: 'สะกด', word: 'misspell', meaning: 'สะกดผิด', pos: 'verb', group: 'negative', example: 'Students sometimes misspell this word.', translation: 'บางครั้งนักเรียนสะกดคำนี้ผิด' },
    { id: 'inactive', prefix: 'in-', prefixMeaning: 'not / ไม่', base: 'active', baseMeaning: 'กระตือรือร้น', word: 'inactive', meaning: 'ไม่เคลื่อนไหวหรือไม่กระตือรือร้น', pos: 'adjective', group: 'negative', example: 'The account becomes inactive after one year.', translation: 'บัญชีจะไม่เปิดใช้งานหลังจากหนึ่งปี' },
    { id: 'incomplete', prefix: 'in-', prefixMeaning: 'not / ไม่', base: 'complete', baseMeaning: 'สมบูรณ์', word: 'incomplete', meaning: 'ไม่สมบูรณ์', pos: 'adjective', group: 'negative', example: 'Your application is still incomplete.', translation: 'ใบสมัครของคุณยังไม่สมบูรณ์' },
    { id: 'impossible', prefix: 'im-', prefixMeaning: 'not / ไม่', base: 'possible', baseMeaning: 'เป็นไปได้', word: 'impossible', meaning: 'เป็นไปไม่ได้', pos: 'adjective', group: 'negative', example: 'The challenge is difficult, but not impossible.', translation: 'ความท้าทายนี้ยาก แต่ไม่ใช่ว่าจะเป็นไปไม่ได้' },
    { id: 'immature', prefix: 'im-', prefixMeaning: 'not / ไม่', base: 'mature', baseMeaning: 'เป็นผู้ใหญ่', word: 'immature', meaning: 'ยังไม่เป็นผู้ใหญ่', pos: 'adjective', group: 'negative', example: 'His reaction was immature.', translation: 'ปฏิกิริยาของเขายังไม่เป็นผู้ใหญ่' },
    { id: 'illegal', prefix: 'il-', prefixMeaning: 'not / ไม่', base: 'legal', baseMeaning: 'ถูกกฎหมาย', word: 'illegal', meaning: 'ผิดกฎหมาย', pos: 'adjective', group: 'negative', example: 'It is illegal to use someone else’s identity.', translation: 'การใช้ตัวตนของผู้อื่นเป็นสิ่งผิดกฎหมาย' },
    { id: 'illogical', prefix: 'il-', prefixMeaning: 'not / ไม่', base: 'logical', baseMeaning: 'สมเหตุสมผล', word: 'illogical', meaning: 'ไม่สมเหตุสมผล', pos: 'adjective', group: 'negative', example: 'That argument is illogical.', translation: 'ข้อโต้แย้งนั้นไม่สมเหตุสมผล' },
    { id: 'irregular', prefix: 'ir-', prefixMeaning: 'not / ไม่', base: 'regular', baseMeaning: 'สม่ำเสมอ / เป็นไปตามกฎ', word: 'irregular', meaning: 'ไม่สม่ำเสมอหรือไม่เป็นไปตามกฎ', pos: 'adjective', group: 'negative', example: '“Went” is an irregular past form.', translation: '“Went” เป็นรูปอดีตที่ไม่เป็นไปตามกฎ' },
    { id: 'irresponsible', prefix: 'ir-', prefixMeaning: 'not / ไม่', base: 'responsible', baseMeaning: 'รับผิดชอบ', word: 'irresponsible', meaning: 'ไม่มีความรับผิดชอบ', pos: 'adjective', group: 'negative', example: 'Leaving the door unlocked was irresponsible.', translation: 'การปล่อยประตูไว้โดยไม่ล็อกเป็นการกระทำที่ไม่มีความรับผิดชอบ' },
    { id: 'overcook', prefix: 'over-', prefixMeaning: 'too much / มากเกินไป', base: 'cook', baseMeaning: 'ทำให้สุก', word: 'overcook', meaning: 'ทำให้สุกเกินไป', pos: 'verb', group: 'degree', example: 'Do not overcook the vegetables.', translation: 'อย่าปรุงผักให้สุกเกินไป' },
    { id: 'overestimate', prefix: 'over-', prefixMeaning: 'too much / มากเกินไป', base: 'estimate', baseMeaning: 'ประเมิน', word: 'overestimate', meaning: 'ประเมินสูงเกินไป', pos: 'verb', group: 'degree', example: 'We overestimated the number of visitors.', translation: 'พวกเราประเมินจำนวนผู้เข้าชมสูงเกินไป' },
    { id: 'underpaid', prefix: 'under-', prefixMeaning: 'too little / น้อยเกินไป', base: 'paid', baseMeaning: 'ได้รับค่าจ้าง', word: 'underpaid', meaning: 'ได้รับค่าจ้างต่ำเกินไป', pos: 'adjective', group: 'degree', example: 'Many workers feel underpaid.', translation: 'คนงานจำนวนมากรู้สึกว่าได้รับค่าจ้างต่ำเกินไป' },
    { id: 'underground', prefix: 'under-', prefixMeaning: 'below / ใต้', base: 'ground', baseMeaning: 'พื้นดิน', word: 'underground', meaning: 'ใต้ดิน', pos: 'adjective / adverb', group: 'position', example: 'The cables run underground.', translation: 'สายเคเบิลพาดอยู่ใต้ดิน' },
    { id: 'submarine', prefix: 'sub-', prefixMeaning: 'under / ใต้', base: 'marine', baseMeaning: 'เกี่ยวกับทะเล', word: 'submarine', meaning: 'เรือดำน้ำ', pos: 'noun', group: 'position', example: 'The submarine moved silently below the surface.', translation: 'เรือดำน้ำเคลื่อนที่อย่างเงียบ ๆ ใต้ผิวน้ำ' },
    { id: 'substandard', prefix: 'sub-', prefixMeaning: 'below / ต่ำกว่า', base: 'standard', baseMeaning: 'มาตรฐาน', word: 'substandard', meaning: 'ต่ำกว่ามาตรฐาน', pos: 'adjective', group: 'degree', example: 'The product was rejected as substandard.', translation: 'สินค้าถูกปฏิเสธเพราะต่ำกว่ามาตรฐาน' },
    { id: 'international', prefix: 'inter-', prefixMeaning: 'between / ระหว่าง', base: 'national', baseMeaning: 'ระดับชาติ', word: 'international', meaning: 'ระหว่างประเทศ', pos: 'adjective', group: 'relationship', example: 'The school hosted an international conference.', translation: 'โรงเรียนเป็นเจ้าภาพการประชุมนานาชาติ' },
    { id: 'interact', prefix: 'inter-', prefixMeaning: 'between / ระหว่างกัน', base: 'act', baseMeaning: 'กระทำ', word: 'interact', meaning: 'มีปฏิสัมพันธ์กัน', pos: 'verb', group: 'relationship', example: 'Students interact during group work.', translation: 'นักเรียนมีปฏิสัมพันธ์กันระหว่างทำงานกลุ่ม' },
    { id: 'transform', prefix: 'trans-', prefixMeaning: 'across / เปลี่ยนข้ามรูป', base: 'form', baseMeaning: 'รูปแบบ', word: 'transform', meaning: 'เปลี่ยนรูปหรือเปลี่ยนสภาพ', pos: 'verb', group: 'position', example: 'Technology can transform education.', translation: 'เทคโนโลยีสามารถเปลี่ยนแปลงการศึกษาได้' },
    { id: 'transcontinental', prefix: 'trans-', prefixMeaning: 'across / ข้าม', base: 'continental', baseMeaning: 'เกี่ยวกับทวีป', word: 'transcontinental', meaning: 'ข้ามทวีป', pos: 'adjective', group: 'position', example: 'They completed a transcontinental journey.', translation: 'พวกเขาเดินทางข้ามทวีปสำเร็จ' },
    { id: 'antivirus', prefix: 'anti-', prefixMeaning: 'against / ต่อต้าน', base: 'virus', baseMeaning: 'ไวรัส', word: 'antivirus', meaning: 'โปรแกรมป้องกันไวรัส', pos: 'noun / adjective', group: 'negative', example: 'Install reliable antivirus software.', translation: 'ติดตั้งซอฟต์แวร์ป้องกันไวรัสที่เชื่อถือได้' },
    { id: 'antiwar', prefix: 'anti-', prefixMeaning: 'against / ต่อต้าน', base: 'war', baseMeaning: 'สงคราม', word: 'antiwar', meaning: 'ต่อต้านสงคราม', pos: 'adjective', group: 'negative', example: 'They organized an antiwar campaign.', translation: 'พวกเขาจัดกิจกรรมรณรงค์ต่อต้านสงคราม' },
    { id: 'cooperate', prefix: 'co-', prefixMeaning: 'together / ร่วมกัน', base: 'operate', baseMeaning: 'ดำเนินการ', word: 'cooperate', meaning: 'ร่วมมือกัน', pos: 'verb', group: 'relationship', example: 'Both teams agreed to cooperate.', translation: 'ทั้งสองทีมตกลงที่จะร่วมมือกัน' },
    { id: 'coauthor', prefix: 'co-', prefixMeaning: 'together / ร่วมกัน', base: 'author', baseMeaning: 'ผู้เขียน', word: 'coauthor', meaning: 'ผู้เขียนร่วม', pos: 'noun / verb', group: 'relationship', example: 'She will coauthor the research paper.', translation: 'เธอจะร่วมเขียนบทความวิจัย' },
    { id: 'bilingual', prefix: 'bi-', prefixMeaning: 'two / สอง', base: 'lingual', baseMeaning: 'เกี่ยวกับภาษา', word: 'bilingual', meaning: 'ใช้ได้สองภาษา', pos: 'adjective', group: 'number', example: 'The signs are bilingual.', translation: 'ป้ายต่าง ๆ ใช้สองภาษา' },
    { id: 'bicycle', prefix: 'bi-', prefixMeaning: 'two / สอง', base: 'cycle', baseMeaning: 'วงล้อหรือการหมุน', word: 'bicycle', meaning: 'จักรยานสองล้อ', pos: 'noun', group: 'number', example: 'He rides a bicycle to school.', translation: 'เขาขี่จักรยานไปโรงเรียน' },
    { id: 'triangle', prefix: 'tri-', prefixMeaning: 'three / สาม', base: 'angle', baseMeaning: 'มุม', word: 'triangle', meaning: 'รูปสามเหลี่ยม', pos: 'noun', group: 'number', example: 'A triangle has three angles.', translation: 'รูปสามเหลี่ยมมีสามมุม' },
    { id: 'tricycle', prefix: 'tri-', prefixMeaning: 'three / สาม', base: 'cycle', baseMeaning: 'วงล้อหรือการหมุน', word: 'tricycle', meaning: 'รถสามล้อ', pos: 'noun', group: 'number', example: 'The child learned to ride a tricycle.', translation: 'เด็กเรียนรู้การขี่รถสามล้อ' },
    { id: 'monologue', prefix: 'mono-', prefixMeaning: 'one / หนึ่ง', base: 'logue', baseMeaning: 'คำพูด', word: 'monologue', meaning: 'บทพูดคนเดียว', pos: 'noun', group: 'number', example: 'The actor delivered a powerful monologue.', translation: 'นักแสดงกล่าวบทพูดคนเดียวอย่างทรงพลัง' },
    { id: 'monolingual', prefix: 'mono-', prefixMeaning: 'one / หนึ่ง', base: 'lingual', baseMeaning: 'เกี่ยวกับภาษา', word: 'monolingual', meaning: 'ใช้ภาษาเดียว', pos: 'adjective', group: 'number', example: 'This dictionary is monolingual.', translation: 'พจนานุกรมเล่มนี้ใช้ภาษาเดียว' },
    { id: 'multicultural', prefix: 'multi-', prefixMeaning: 'many / หลาย', base: 'cultural', baseMeaning: 'เกี่ยวกับวัฒนธรรม', word: 'multicultural', meaning: 'หลากหลายวัฒนธรรม', pos: 'adjective', group: 'number', example: 'We live in a multicultural society.', translation: 'พวกเราอยู่ในสังคมที่มีความหลากหลายทางวัฒนธรรม' },
    { id: 'multitask', prefix: 'multi-', prefixMeaning: 'many / หลาย', base: 'task', baseMeaning: 'งาน', word: 'multitask', meaning: 'ทำหลายงานพร้อมกัน', pos: 'verb', group: 'number', example: 'It is hard to multitask effectively.', translation: 'การทำหลายงานพร้อมกันอย่างมีประสิทธิภาพเป็นเรื่องยาก' },
    { id: 'semicircle', prefix: 'semi-', prefixMeaning: 'half / ครึ่ง', base: 'circle', baseMeaning: 'วงกลม', word: 'semicircle', meaning: 'ครึ่งวงกลม', pos: 'noun', group: 'number', example: 'The students sat in a semicircle.', translation: 'นักเรียนนั่งเป็นรูปครึ่งวงกลม' },
    { id: 'semifinal', prefix: 'semi-', prefixMeaning: 'partly / รอบก่อนชิง', base: 'final', baseMeaning: 'รอบสุดท้าย', word: 'semifinal', meaning: 'รอบรองชนะเลิศ', pos: 'noun', group: 'time', example: 'Our team reached the semifinal.', translation: 'ทีมของเราเข้าสู่รอบรองชนะเลิศ' },
    { id: 'superhuman', prefix: 'super-', prefixMeaning: 'above / เหนือกว่า', base: 'human', baseMeaning: 'มนุษย์', word: 'superhuman', meaning: 'เหนือความสามารถมนุษย์ทั่วไป', pos: 'adjective', group: 'degree', example: 'The rescue required superhuman strength.', translation: 'การช่วยเหลือต้องใช้พละกำลังเหนือมนุษย์ทั่วไป' },
    { id: 'superstar', prefix: 'super-', prefixMeaning: 'above / โดดเด่นมาก', base: 'star', baseMeaning: 'ดาวหรือคนดัง', word: 'superstar', meaning: 'ดาราหรือผู้มีชื่อเสียงมาก', pos: 'noun', group: 'degree', example: 'The young athlete became a superstar.', translation: 'นักกีฬาหนุ่มกลายเป็นผู้มีชื่อเสียงโด่งดัง' },
    { id: 'postgraduate', prefix: 'post-', prefixMeaning: 'after / หลัง', base: 'graduate', baseMeaning: 'ผู้สำเร็จการศึกษา', word: 'postgraduate', meaning: 'ระดับหลังปริญญาตรี', pos: 'noun / adjective', group: 'time', example: 'She is a postgraduate student.', translation: 'เธอเป็นนักศึกษาระดับบัณฑิตศึกษา' },
    { id: 'postwar', prefix: 'post-', prefixMeaning: 'after / หลัง', base: 'war', baseMeaning: 'สงคราม', word: 'postwar', meaning: 'หลังสงคราม', pos: 'adjective', group: 'time', example: 'The city grew rapidly in the postwar period.', translation: 'เมืองเติบโตอย่างรวดเร็วในช่วงหลังสงคราม' }
  ];

  let favoritesOnly = false;
  let currentList = [...vocabulary];

  const favoriteIds = () => {
    const value = PP.read(PP.KEYS.favorites, []);
    return Array.isArray(value) ? value : [];
  };

  function toggleFavorite(id) {
    const favorites = favoriteIds();
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    PP.write(PP.KEYS.favorites, next);
    PP.playTone(next.includes(id) ? 'crystal' : 'click');
    PP.toast(next.includes(id) ? 'เพิ่มในรายการโปรดแล้ว' : 'นำออกจากรายการโปรดแล้ว');
    render();
  }

  function populatePrefixFilter() {
    const select = document.getElementById('prefix-filter');
    const prefixes = [...new Set(vocabulary.map((item) => item.prefix))].sort();
    select.insertAdjacentHTML('beforeend', prefixes.map((prefix) => `<option value="${prefix}">${prefix}</option>`).join(''));
  }

  function getFiltered() {
    const search = document.getElementById('vocab-search').value.trim().toLowerCase();
    const prefix = document.getElementById('prefix-filter').value;
    const group = document.getElementById('group-filter').value;
    const sort = document.getElementById('vocab-sort').value;
    const favorites = favoriteIds();
    let list = vocabulary.filter((item) => {
      const haystack = Object.values(item).join(' ').toLowerCase();
      return (!search || haystack.includes(search))
        && (prefix === 'all' || item.prefix === prefix)
        && (group === 'all' || item.group === group)
        && (!favoritesOnly || favorites.includes(item.id));
    });
    list.sort((a, b) => {
      if (sort === 'za') return b.word.localeCompare(a.word);
      if (sort === 'prefix') return a.prefix.localeCompare(b.prefix) || a.word.localeCompare(b.word);
      return a.word.localeCompare(b.word);
    });
    return list;
  }

  function render() {
    const grid = document.getElementById('vocab-grid');
    if (!grid) return;
    currentList = getFiltered();
    const favorites = favoriteIds();
    document.getElementById('vocab-count').textContent = `พบ ${currentList.length} คำ`;
    const favoriteButton = document.getElementById('favorite-filter');
    favoriteButton.setAttribute('aria-pressed', String(favoritesOnly));
    favoriteButton.innerHTML = favoritesOnly ? '♥ แสดงทั้งหมด' : '♡ แสดงรายการโปรด';
    if (!currentList.length) {
      grid.innerHTML = '<div class="empty-state card"><div style="font-size:3rem">🔭</div><h2>ยังไม่พบคำศัพท์</h2><p class="muted">ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองเพื่อสำรวจคำอื่น</p></div>';
      return;
    }
    grid.innerHTML = currentList.map((item) => `
      <article class="vocab-card card">
        <button class="icon-btn favorite-btn" type="button" data-favorite="${item.id}" aria-label="${favorites.includes(item.id) ? 'นำ' : 'เพิ่ม'} ${item.word} ${favorites.includes(item.id) ? 'ออกจาก' : 'ใน'}รายการโปรด">${favorites.includes(item.id) ? '♥' : '♡'}</button>
        <div class="vocab-equation"><span class="part-prefix">${item.prefix}</span> + <span class="part-base">${item.base}</span></div>
        <div><h3>${item.word}</h3><span class="chip">${item.pos}</span></div>
        <p><strong>${item.meaning}</strong><br><span class="muted">${item.prefix} = ${item.prefixMeaning}</span></p>
        <p class="vocab-example en">${item.example}</p>
        <div class="vocab-card-footer">
          <button class="btn btn-secondary btn-sm" type="button" data-speak="${item.word}" aria-label="ฟังการออกเสียง ${item.word}">🔊 ฟังเสียง</button>
          <button class="btn btn-sm" type="button" data-detail="${item.id}">ดูรายละเอียด</button>
        </div>
      </article>`).join('');
    grid.querySelectorAll('[data-favorite]').forEach((button) => button.addEventListener('click', () => toggleFavorite(button.dataset.favorite)));
    grid.querySelectorAll('[data-detail]').forEach((button) => button.addEventListener('click', () => openDetail(button.dataset.detail)));
  }

  function openDetail(id) {
    const item = vocabulary.find((entry) => entry.id === id);
    if (!item) return;
    PP.openModal({
      title: item.word,
      body: `
        <div class="formula-box" style="margin-top:8px"><span class="part-prefix">${item.prefix}</span><span>+</span><span class="part-base">${item.base}</span><span>=</span><span class="part-new">${item.word}</span></div>
        <div class="word-breakdown">
          <div class="breakdown-part"><small>Prefix</small><strong class="part-prefix en">${item.prefix}</strong><br>${item.prefixMeaning}</div>
          <div class="breakdown-part"><small>Base Word</small><strong class="part-base en">${item.base}</strong><br>${item.baseMeaning}</div>
          <div class="breakdown-part"><small>New Word</small><strong class="part-new en">${item.word}</strong><br>${item.pos}</div>
          <div class="breakdown-part"><small>Meaning</small><strong class="part-meaning">${item.meaning}</strong></div>
        </div>
        <div class="soft-panel"><p class="en" style="margin-bottom:4px">${item.example}</p><p class="muted" style="margin:0">${item.translation}</p></div>`,
      actions: [
        { label: '🔊 ฟังการออกเสียง', className: 'btn btn-secondary', close: false, onClick: () => PP.speak(item.word) },
        { label: 'ปิด', className: 'btn btn-secondary' }
      ]
    });
  }

  function openFlashcards() {
    const deck = currentList.length ? [...currentList] : [...vocabulary];
    let index = 0;
    PP.openModal({
      title: 'Prefix Flashcards',
      body: '<div id="flashcard-host"></div>',
      actions: [{ label: 'ปิด Flashcard', className: 'btn btn-secondary' }],
      onOpen: () => {
        const host = document.getElementById('flashcard-host');
        const draw = () => {
          const item = deck[index];
          host.innerHTML = `
            <p style="text-align:center">ใบที่ ${index + 1} จาก ${deck.length} · แตะการ์ดเพื่อดูคำตอบ</p>
            <div class="flashcard-stage">
              <div class="flashcard" id="active-flashcard" tabindex="0" role="button" aria-label="พลิก Flashcard คำว่า ${item.word}">
                <div class="flash-face flash-front"><div><div class="flash-main">${item.word}</div><p class="muted">Prefix ใด? Base Word ใด? หมายความว่าอะไร?</p></div></div>
                <div class="flash-face flash-back"><div><div class="word-equation" style="justify-content:center"><span class="part-prefix">${item.prefix}</span> + <span class="part-base">${item.base}</span></div><h2>${item.meaning}</h2><p class="en">${item.example}</p><p class="muted">${item.translation}</p></div></div>
              </div>
            </div>
            <div class="question-actions"><button class="btn btn-secondary" id="flash-prev" type="button" ${index === 0 ? 'disabled' : ''}>← ก่อนหน้า</button><button class="btn btn-secondary" id="flash-speak" type="button">🔊 ฟังเสียง</button><button class="btn" id="flash-next" type="button">${index === deck.length - 1 ? 'เริ่มใหม่ ↻' : 'ถัดไป →'}</button></div>`;
          const card = document.getElementById('active-flashcard');
          const flip = () => card.classList.toggle('flipped');
          card.addEventListener('click', flip);
          card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flip(); } });
          document.getElementById('flash-prev').addEventListener('click', () => { index = Math.max(0, index - 1); draw(); });
          document.getElementById('flash-next').addEventListener('click', () => { index = index === deck.length - 1 ? 0 : index + 1; draw(); });
          document.getElementById('flash-speak').addEventListener('click', () => PP.speak(item.word));
        };
        draw();
      }
    });
  }

  function init() {
    if (!document.getElementById('vocab-grid')) return;
    populatePrefixFilter();
    ['vocab-search', 'prefix-filter', 'group-filter', 'vocab-sort'].forEach((id) => {
      document.getElementById(id).addEventListener(id === 'vocab-search' ? 'input' : 'change', render);
    });
    document.getElementById('favorite-filter').addEventListener('click', () => { favoritesOnly = !favoritesOnly; render(); });
    document.getElementById('random-word').addEventListener('click', () => {
      const list = currentList.length ? currentList : vocabulary;
      openDetail(list[Math.floor(Math.random() * list.length)].id);
    });
    document.getElementById('flashcard-mode').addEventListener('click', openFlashcards);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
