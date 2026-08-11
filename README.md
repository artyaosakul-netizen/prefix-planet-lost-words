# Prefix Planet: The Lost Words

เว็บไซต์สื่อการเรียนรู้วิชาภาษาอังกฤษเรื่อง **Prefixes** สำหรับนักเรียนระดับชั้นมัธยมศึกษาปีที่ 4–6 ในรูปแบบเกมผจญภัยอวกาศ ผู้เรียนรับบทเป็น **Word Explorer** เดินทางกับหุ่นยนต์ **Puffy** เพื่อเรียนรู้การแยก Prefix และ Base Word ฝึกสร้างคำศัพท์ และพิชิตแบบทดสอบหลังเรียน 45 ข้อ

> คำโปรย: **เติมคำหน้า เปลี่ยนความหมาย พิชิตจักรวาลคำศัพท์**

## จุดประสงค์การเรียนรู้

เมื่อเรียนและทำกิจกรรมครบ ผู้เรียนสามารถ:

1. อธิบายความหมายและหน้าที่ของ Prefix ได้
2. แยก Prefix และ Base Word ออกจากกันได้
3. วิเคราะห์การเปลี่ยนแปลงความหมายหลังเติม Prefix ได้
4. สร้างคำศัพท์ใหม่จาก Prefix และ Base Word ได้
5. เลือกใช้คำศัพท์ในประโยคและสถานการณ์ได้ถูกต้อง
6. วิเคราะห์ความหมายของคำศัพท์ที่ไม่คุ้นเคยได้
7. ประเมินผลหลังเรียนผ่านข้อสอบแบบเกม 45 ข้อได้

## รายชื่อไฟล์

| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` | หน้าแรก โปรไฟล์ผู้เรียน Word of the Day และความก้าวหน้า |
| `content.html` | บทเรียน 4 บท Word Builder และเกมฝึกฝน 4 เกม |
| `vocabulary.html` | คลังคำศัพท์ ค้นหา กรอง Favorite และ Flashcard |
| `mission.html` | หน้าเตรียมภารกิจและระบบข้อสอบ 45 ข้อ |
| `result.html` | ผลคะแนน กราฟรายดาว Badge ประวัติ และเฉลย |
| `style.css` | รูปแบบ สี ธีม Animation และองค์ประกอบหลัก |
| `responsive.css` | การแสดงผลบนโทรศัพท์ แท็บเล็ต และหน้าจอขนาดต่าง ๆ |
| `main.js` | เมนู Theme เสียง Web Audio โปรไฟล์ Modal Toast และระบบร่วม |
| `lesson.js` | บทเรียน Word Builder และเกมฝึกฝน |
| `vocabulary.js` | ข้อมูลคำศัพท์ การค้นหา ตัวกรอง Flashcard และ Favorite |
| `questions.js` | คำถามจริง 45 ข้อ ตัวเลือก เฉลย และคำอธิบาย |
| `mission.js` | ระบบข้อสอบ จับเวลา บันทึกคำตอบ Navigator และส่งคำตอบ |
| `result.js` | ตรวจคะแนน เฉลย กราฟ ประวัติ พิมพ์ และดาวน์โหลด CSV |
| `three-scene.js` | ดาวเคราะห์และแผนที่ภารกิจ 3 มิติด้วย Three.js |
| `README.md` | คู่มือโครงการและการเผยแพร่เว็บไซต์ |

ทุกไฟล์ใช้ Relative Path จึงย้ายโฟลเดอร์หรือเผยแพร่ผ่าน GitHub Pages ได้โดยไม่ต้องแก้เส้นทาง

## วิธีเปิดเว็บไซต์ในเครื่อง

### วิธีที่ 1: เปิดโดยตรง

ดับเบิลคลิกไฟล์ `index.html` แล้วเปิดด้วยเว็บเบราว์เซอร์สมัยใหม่ เช่น Chrome, Edge, Firefox หรือ Safari ระบบบทเรียน คลังคำศัพท์ เกม และข้อสอบทำงานได้ตามปกติ หากเบราว์เซอร์ไม่อนุญาตให้โหลด Three.js จากไฟล์ในเครื่อง เว็บไซต์จะแสดงฉากกราฟิก CSS สำรองโดยอัตโนมัติ

### วิธีที่ 2: เปิดด้วย Local Server (แนะนำ)

หากเครื่องมี Python ให้เปิด Terminal ในโฟลเดอร์โครงการแล้วใช้คำสั่ง:

```bash
python -m http.server 8000
```

จากนั้นเปิด `http://localhost:8000` ในเบราว์เซอร์ วิธีนี้ทำให้โมเดล 3 มิติและทุกฟังก์ชันทำงานเหมือนบน GitHub Pages

เว็บไซต์ไม่ต้องติดตั้ง npm ไม่ต้อง Build และไม่มีระบบหลังบ้านหรือฐานข้อมูล

## วิธีสร้าง GitHub Repository

1. เข้าสู่ระบบที่ GitHub
2. กด **New repository**
3. ตั้งชื่อ Repository เช่น `prefix-planet`
4. เลือก **Public** หากต้องการใช้ GitHub Pages ฟรี
5. กด **Create repository**

## วิธี Upload ไฟล์

1. เปิด Repository ที่สร้างไว้
2. กด **Add file → Upload files**
3. ลากไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้นไป โดยให้ `index.html` อยู่ที่ระดับบนสุดของ Repository
4. ตรวจสอบว่าชื่อไฟล์ครบ 15 ไฟล์และไม่มีโฟลเดอร์ซ้อนเกินมา
5. ใส่ข้อความ Commit เช่น `Add Prefix Planet website`
6. กด **Commit changes**

## วิธีเปิด GitHub Pages

1. ใน Repository ไปที่ **Settings**
2. เลือกเมนู **Pages**
3. ในหัวข้อ **Build and deployment** เลือก Source เป็น **Deploy from a branch**
4. เลือก Branch เป็น `main` และ Folder เป็น `/(root)`
5. กด **Save**
6. รอประมาณ 1–3 นาที แล้วรีเฟรชหน้า Pages
7. GitHub จะแสดงลิงก์รูปแบบ `https://username.github.io/prefix-planet/`

หลังแก้ไฟล์และ Commit ใหม่ GitHub Pages จะอัปเดตเว็บไซต์ให้อัตโนมัติ

## วิธีเพิ่มหรือแก้ไขคำศัพท์

เปิดไฟล์ `vocabulary.js` แล้วแก้ไข Array ชื่อ `vocabulary` แต่ละรายการมีโครงสร้างดังนี้:

```javascript
{
  id: 'unhappy',
  prefix: 'un-',
  prefixMeaning: 'not / ไม่',
  base: 'happy',
  baseMeaning: 'มีความสุข',
  word: 'unhappy',
  meaning: 'ไม่มีความสุข',
  pos: 'adjective',
  group: 'negative',
  example: 'She felt unhappy.',
  translation: 'เธอรู้สึกไม่มีความสุข'
}
```

ค่า `id` ต้องไม่ซ้ำกัน และ `group` เลือกได้จาก `negative`, `time`, `number`, `position`, `degree` หรือ `relationship`

Word Builder อยู่ใน Array ชื่อ `builderWords` ภายในไฟล์ `lesson.js` สามารถเพิ่มคำโดยใช้ฟิลด์รูปแบบเดียวกับรายการเดิม

## วิธีเพิ่มหรือแก้ไขข้อสอบ

เปิดไฟล์ `questions.js` ข้อสอบอยู่ใน Array `window.PREFIX_QUESTIONS` แต่ละ Object มีข้อมูลหลักดังนี้:

```javascript
{
  id: 1,
  planet: 1,
  type: 'multiple-choice',
  question: 'What does the prefix “un-” usually mean?',
  options: ['not', 'again', 'before', 'between'],
  correctAnswer: 'not',
  explanation: 'คำอธิบายเหตุผลภาษาไทย',
  prefix: 'un-',
  baseWord: 'happy',
  meaning: 'ไม่มีความสุข',
  difficulty: 'easy'
}
```

ข้อควรตรวจสอบเมื่อแก้ข้อสอบ:

- `id` เรียงตั้งแต่ 1–45 และไม่ซ้ำ
- `planet` เป็น 1–5 ดาวละ 9 ข้อ
- `options` มี 4 ตัวเลือกที่สมเหตุสมผล
- `correctAnswer` ต้องตรงกับข้อความหนึ่งรายการใน `options` ทุกตัวอักษร
- คำถามแต่ละข้อมีคำตอบถูกเพียงคำตอบเดียว
- ประเภทที่รองรับคือ `multiple-choice`, `word-assembly`, `matching`, `sentence-completion` และ `boss-analysis`

## วิธีเปิด–ปิดการจับเวลา

เปิดไฟล์ `mission.js` แล้วค้นหา `CONFIG`:

```javascript
const CONFIG = Object.freeze({
  timerEnabled: true,
  durationSeconds: 45 * 60,
  passingScore: 36
});
```

- ใช้ `timerEnabled: true` เพื่อเปิดเวลา 45 นาที
- ใช้ `timerEnabled: false` เพื่อปิดการจับเวลา
- เปลี่ยน `durationSeconds` หากต้องการกำหนดเวลาใหม่ เช่น 30 นาทีใช้ `30 * 60`

หลังเปลี่ยนค่า ควรเริ่มภารกิจใหม่เพื่อให้เวลาชุดใหม่มีผล

## วิธีเปลี่ยนสีและ Theme

เปิดไฟล์ `style.css` แล้วแก้ CSS Variables ใน `:root` สำหรับ Light Mode และ `[data-theme='dark']` สำหรับ Dark Mode เช่น:

```css
:root {
  --primary: #7557e8;
  --cyan: #5dc8e8;
  --pink: #f47fb2;
  --gold: #f7bd3e;
  --bg: #f8f6ff;
}
```

ควรรักษา Contrast ระหว่าง `--ink` กับ `--bg` และระหว่างข้อความกับปุ่มให้อ่านง่าย

## การบันทึกข้อมูล

เว็บไซต์ใช้ `localStorage` ในเบราว์เซอร์เพื่อเก็บ:

- โปรไฟล์ ชื่อ ชั้น เลขที่ และ Avatar
- Theme และสถานะเสียง
- บทเรียนและเกมที่ผ่าน
- Favorite ในคลังคำศัพท์
- คำตอบ เวลา และข้อที่ทำเครื่องหมายไว้
- คะแนนล่าสุด คะแนนสูงสุด จำนวนครั้ง และ Badge
- ประวัติผลสอบย้อนหลัง 5 ครั้ง

ข้อมูลไม่ถูกส่งไปยัง Server และไม่แชร์ข้ามอุปกรณ์ หากล้างข้อมูลเว็บไซต์ในเบราว์เซอร์ ข้อมูลดังกล่าวจะถูกลบ

## เทคโนโลยีที่ใช้

- HTML5 และ Semantic HTML
- CSS3, CSS Variables, Flexbox, CSS Grid และ Media Queries
- Vanilla JavaScript (ES6+)
- Three.js ผ่าน CDN สำหรับฉาก 3 มิติ
- Web Speech API สำหรับออกเสียงคำศัพท์
- Web Audio API สำหรับสร้างเสียงตอบสนองโดยไม่ใช้ไฟล์เสียงภายนอก
- localStorage สำหรับเก็บข้อมูลในอุปกรณ์
- CSS/SVG สำหรับกราฟผลคะแนน โดยไม่ใช้ไลบรารีกราฟภายนอก

## การรองรับการเข้าถึงและประสิทธิภาพ

- รองรับ Keyboard, Touch และ Mouse
- มี Focus State, ARIA Label, Semantic HTML และข้อความสำหรับ Screen Reader
- ไม่ใช้สีเพียงอย่างเดียวในการบอกสถานะ
- รองรับ `prefers-reduced-motion`
- ลดจำนวนวัตถุ 3 มิติบนหน้าจอเล็ก
- หยุดการเคลื่อนไหวเมื่อแท็บไม่ได้เปิดใช้งาน
- มี CSS Fallback เมื่อ Three.js หรือ WebGL ใช้งานไม่ได้
- ข้อสอบและบทเรียนยังใช้งานได้แม้ฉาก 3 มิติไม่ทำงาน

## หมายเหตุสำหรับครู

เกณฑ์ผ่านตั้งไว้ที่ 36 จาก 45 คะแนน หรือ 80% ตามข้อกำหนด แบบทดสอบไม่เฉลยระหว่างทำ และ Prefix Crystals ระหว่างสอบแสดงเฉพาะความครบถ้วนของคำตอบ เฉลยทั้งหมดจะแสดงหลังผู้เรียนยืนยันส่งคำตอบเท่านั้น
