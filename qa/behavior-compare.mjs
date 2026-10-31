// Сравнение двух снимков поведения. Любое отличие поведения/текста — в отчёт; код выхода 1.
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
let diffs = 0;
const say = (...x) => { diffs++; console.log('✗', ...x); };
const strip = s => s.replace(/\s+/g, '');
const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);
for (const k of Object.keys(a)) {
  if (k === 'meta') continue;
  if (k === 'pages') {
    for (const pk of Object.keys(a.pages)) {
      const x = a.pages[pk], y = b.pages[pk];
      if (!y) { say(pk, 'нет в новом'); continue; }
      const tx = strip(x.lines.join('')), ty = strip(y.lines.join(''));
      if (tx !== ty) {
        const sx = new Set(x.lines.map(strip)), sy = new Set(y.lines.map(strip));
        const lost = x.lines.filter(l => !sy.has(strip(l))), added = y.lines.filter(l => !sx.has(strip(l)));
        if (!lost.length && !added.length && [...x.lines].map(strip).sort().join() === [...y.lines].map(strip).sort().join()) say(pk, 'тот же текст, другой порядок');
        else say(pk, 'ТЕКСТ отличается; пропало:', JSON.stringify(lost.slice(0, 3)), 'добавилось:', JSON.stringify(added.slice(0, 3)));
      }
      if (!same(x.links, y.links)) say(pk, 'ССЫЛКИ отличаются', JSON.stringify(x.links.filter(l => !y.links.includes(l))), JSON.stringify(y.links.filter(l => !x.links.includes(l))));
      if (!same(x.controls, y.controls)) say(pk, 'ПОЛЯ/КНОПКИ отличаются');
      if (x.images !== y.images) say(pk, `число картинок ${x.images} → ${y.images}`);
      if (x.hash !== y.hash) say(pk, 'хэш текста отличается');
    }
  } else if (k.startsWith('calc')) {
    for (const c of Object.keys(a[k])) {
      const x = a[k][c], y = b[k]?.[c];
      if (!y) { say(k, c, 'нет'); continue; }
      if (!same(x.controls, y.controls)) say(k, c, 'ЗНАЧЕНИЯ полей', JSON.stringify(x.controls.filter(v => !y.controls.includes(v))), '→', JSON.stringify(y.controls.filter(v => !x.controls.includes(v))));
      if (!same(x.errors, y.errors)) say(k, c, 'ОШИБКИ', JSON.stringify(x.errors), '→', JSON.stringify(y.errors));
      if (x.text !== y.text) say(k, c, 'ТЕКСТ результата отличается');
      if ((x.monthly == null) !== (y.monthly == null)) say(k, c, 'платёж есть только в одном снимке', x.monthly, y.monthly);
      else if (x.monthly != null && Math.abs(x.monthly - y.monthly) / x.monthly > 0.01) say(k, c, `ПЛАТЁЖ ${x.monthly} → ${y.monthly} (отличие больше 1%; в самом приложении он плавает ≈0,2%)`);
    }
  } else if (k.startsWith('contact submit')) {
    const miss = v => v?.requests?.length === 0 && v?.errors?.some(e => /CAPTCHA/i.test(e));
    if (miss(a[k]) || miss(b[k])) console.log('~', k, 'капча Google не пройдена в одном из прогонов — не сравнивается');
    else if (!same(a[k], b[k])) say(k, 'отличается');
  } else if (!same(a[k], b[k])) say(k, 'отличается');
}
console.log(diffs ? `\nОТЛИЧИЙ: ${diffs}` : '\n✓ Поведение и тексты идентичны');
process.exit(diffs ? 1 : 0);
