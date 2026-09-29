// Kiểm thử toàn website CDHome bằng Chrome headless (Chrome DevTools Protocol).
// Yêu cầu: dev server đang chạy (npm run dev) và đã cài Google Chrome.
// Chạy:  npm run test:web            (mặc định http://localhost:3000)
//        BASE_URL=http://localhost:3001 npm run test:web
// Kết quả: in bảng ra màn hình và ghi tests/test-results.json

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const PHONE = '0973247076';
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].find((p) => existsSync(p));

const PC = { name: 'PC', w: 1280, h: 900 };
const MOBILE = { name: 'Mobile', w: 430, h: 900 };

// Slugs straight from the seed data so every product/category gets visited
const seed = readFileSync(join(ROOT, 'src/data/initialData.ts'), 'utf8');
const productBlock = seed.slice(seed.indexOf('BASE_PRODUCTS'));
const PRODUCT_SLUGS = [...productBlock.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const catBlock = seed.slice(seed.indexOf('INITIAL_CATEGORIES'), seed.indexOf('BASE_PRODUCTS'));
const CATEGORY_SLUGS = [...catBlock.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);

// ---------- CDP plumbing ----------
if (!CHROME) { console.error('Không tìm thấy Chrome/Edge. Đặt biến CHROME_PATH.'); process.exit(2); }
const PORT = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cdhome-test-'))}`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets = [];
for (let i = 0; i < 60 && !targets.find((t) => t.type === 'page'); i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); } catch { await sleep(250); }
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let msgId = 0; const pending = {}; const events = [];
let jsErrors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') jsErrors.push(m.params.exceptionDetails.exception?.description?.split('\n')[0] || m.params.exceptionDetails.text);
  if (m.method === 'Page.loadEventFired') events.push('load');
};
const send = (method, params = {}) => new Promise((r) => { pending[++msgId] = r; ws.send(JSON.stringify({ id: msgId, method, params })); });

// Helpers available inside the page as T.*; window.open and clipboard are stubbed so nothing leaves the browser
const PRELUDE = `
  window.__opened = []; window.open = (u) => { window.__opened.push(String(u)); return null; };
  window.__clip = [];
  try { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: (t) => { window.__clip.push(t); return Promise.resolve(); } } }); } catch (e) {}
  window.__t = {
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    vis: (el) => { if (!el) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; },
    norm: (s) => (s || '').replace(/\\s+/g, ' ').trim(),
    find: (sel, txt) => [...document.querySelectorAll(sel)].find((el) => window.__t.vis(el) && window.__t.norm(el.textContent).includes(txt)),
    findAll: (sel, txt) => [...document.querySelectorAll(sel)].filter((el) => window.__t.vis(el) && (!txt || window.__t.norm(el.textContent).includes(txt))),
    set: (el, v) => { const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); },
    text: () => document.body.innerText,
    codes: () => (document.body.innerText.match(/CDH-[A-Z]{2}-\\d+/g) || []).length,
    overflowX: () => document.documentElement.scrollWidth - window.innerWidth,
    user: () => JSON.parse(localStorage.getItem('cdhome_current_user_v2') || 'null')
  };`;

await send('Page.enable'); await send('Runtime.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: PRELUDE });

let currentDevice = null;
const device = async (d) => {
  if (currentDevice === d) return;
  currentDevice = d;
  await send('Emulation.setDeviceMetricsOverride', { width: d.w, height: d.h, deviceScaleFactor: 1, mobile: d === MOBILE });
};
const go = async (path) => {
  events.length = 0;
  await send('Page.navigate', { url: BASE + path });
  for (let i = 0; i < 60 && !events.includes('load'); i++) await sleep(100);
  await sleep(900);
};
const ev = async (code) => {
  const r = await send('Runtime.evaluate', { expression: `(async () => { const T = window.__t; ${code} })()`, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description?.split('\n')[0] || 'evaluate error');
  return r.result?.result?.value;
};
const resetStorage = async () => { await go('/'); await ev('localStorage.clear(); sessionStorage.clear();'); };
const loginDemo = async () => ev(`
  T.find('button', 'Đăng nhập').click(); await T.sleep(400);
  T.find('button', 'tài khoản mẫu').click(); await T.sleep(500);
  return !!T.user();`);

// ---------- Test cases ----------
const cases = [];
const tc = (id, group, dev, name, expected, run) => cases.push({ id, group, dev, name, expected, run });
const ok = (pass, actual) => ({ pass, actual });

// 1. Điều hướng & trang
for (const d of [PC, MOBILE]) {
  const p = d.name === 'PC' ? 'PC' : 'MB';
  tc(`NAV-${p}-01`, 'Điều hướng', d, 'Trang chủ tải đầy đủ', 'Có hero + danh mục + sản phẩm', async () => {
    await go('/');
    const r = await ev(`return { hero: T.text().includes('Không Gian Tĩnh Tại'), cats: T.text().includes('Danh Mục Không Gian'), codes: T.codes() }`);
    return ok(r.hero && r.cats && r.codes > 0, `hero=${r.hero}, danh mục=${r.cats}, mã SP hiển thị=${r.codes}`);
  });
  tc(`NAV-${p}-02`, 'Điều hướng', d, `Mở ${CATEGORY_SLUGS.length} trang danh mục`, 'Mọi danh mục có sản phẩm, không 404', async () => {
    const empty = [];
    for (const s of CATEGORY_SLUGS) {
      await go(`/danh-muc/${s}`);
      const r = await ev(`return { codes: T.codes(), nf: /404|Không Tìm Thấy/i.test(T.text()) }`);
      if (r.nf || r.codes === 0) empty.push(s);
    }
    return ok(empty.length === 0, empty.length ? `Trống/404: ${empty.join(', ')}` : `${CATEGORY_SLUGS.length}/${CATEGORY_SLUGS.length} có sản phẩm`);
  });
  tc(`NAV-${p}-03`, 'Điều hướng', d, `Mở ${PRODUCT_SLUGS.length} trang chi tiết sản phẩm`, 'Mọi trang có tên SP + nút báo giá Zalo', async () => {
    const bad = [];
    for (const s of PRODUCT_SLUGS) {
      await go(`/san-pham/${s}`);
      const r = await ev(`return { h1: T.norm(document.querySelector('h1')?.textContent), zalo: !!T.find('button', 'Nhận Báo Giá Qua Zalo') }`);
      if (!r.h1 || !r.zalo) bad.push(s);
    }
    return ok(bad.length === 0, bad.length ? `Lỗi: ${bad.join(', ')}` : `${PRODUCT_SLUGS.length}/${PRODUCT_SLUGS.length} trang OK`);
  });
  tc(`NAV-${p}-04`, 'Điều hướng', d, 'Mobile/PC không tràn ngang ở các trang chính', 'scrollWidth = chiều rộng màn hình', async () => {
    const over = [];
    for (const path of ['/', '/danh-muc/sofa-va-armchair', `/san-pham/${PRODUCT_SLUGS[0]}`, '/showroom', '/yeu-thich', '/tim-kiem?q=sofa']) {
      await go(path);
      const o = await ev('return T.overflowX()');
      if (o > 1) over.push(`${path} (+${o}px)`);
    }
    return ok(over.length === 0, over.length ? `Tràn: ${over.join(', ')}` : '6/6 trang không tràn');
  });
}
tc('IMG-PC-01', 'Hình ảnh', PC, 'Toàn bộ ảnh sản phẩm & danh mục tải được', 'Không ảnh nào lỗi (404)', async () => {
  await go('/');
  const r = await ev(`const m = await import('/src/data/initialData.ts');
    const urls = [...new Set([...m.INITIAL_PRODUCTS.flatMap(p => [...p.images, p.lifestyleImage, ...p.highlights.map(h => h.image)]), ...m.INITIAL_CATEGORIES.map(c => c.image), m.INITIAL_SETTINGS.heroImage, m.INITIAL_SETTINGS.seasonalBannerImage].filter(Boolean))];
    const res = await Promise.all(urls.map(u => new Promise(ok => { const im = new Image(); const t = setTimeout(() => ok([u, 0]), 20000); im.onload = () => { clearTimeout(t); ok([u, im.naturalWidth]); }; im.onerror = () => { clearTimeout(t); ok([u, 0]); }; im.src = u; })));
    return { total: urls.length, broken: res.filter(x => !x[1]).map(x => x[0].split('photo-')[1]?.slice(0, 25) || x[0]) }`);
  return ok(r.broken.length === 0, r.broken.length ? `Hỏng ${r.broken.length}/${r.total}: ${r.broken.join(', ')}` : `${r.total}/${r.total} ảnh tải được`);
});
tc('NAV-PC-05', 'Điều hướng', PC, 'Sản phẩm không tồn tại', 'Hiện trang 404', async () => {
  await go('/san-pham/khong-ton-tai-xyz');
  const t = await ev(`return T.text()`);
  return ok(/404|Không Tìm Thấy/i.test(t), /404|Không Tìm Thấy/i.test(t) ? 'Hiện 404' : 'Không hiện 404');
});
tc('NAV-PC-06', 'Điều hướng', PC, 'Đường dẫn lạ', 'Hiện trang 404', async () => {
  await go('/duong-dan-khong-co');
  const t = await ev(`return T.text()`);
  return ok(/404|Không Tìm Thấy/i.test(t), /404|Không Tìm Thấy/i.test(t) ? 'Hiện 404' : 'Không hiện 404');
});
tc('NAV-PC-07', 'Điều hướng', PC, 'Danh mục không tồn tại', 'Hiện 404 hoặc thông báo không có danh mục', async () => {
  await go('/danh-muc/khong-co-danh-muc');
  const r = await ev(`return { nf: /404|Không Tìm Thấy|không tồn tại/i.test(T.text()), codes: T.codes() }`);
  return ok(r.nf || r.codes === 0, r.nf ? 'Hiện 404/thông báo' : `Không báo lỗi, vẫn hiện ${r.codes} mã SP`);
});
tc('NAV-PC-08', 'Điều hướng', PC, 'Bấm thẻ sản phẩm từ trang chủ', 'Chuyển tới trang chi tiết', async () => {
  await go('/');
  const url = await ev(`const img = [...document.querySelectorAll('img')].find(i => T.vis(i) && i.closest('[class*="cursor-pointer"], a, button') && /CDH-/.test(i.closest('div')?.parentElement?.innerText || '')); (img.closest('a, button, [class*="cursor-pointer"]') || img).click(); await T.sleep(800); return location.pathname`);
  return ok(url.startsWith('/san-pham/'), `URL sau khi bấm: ${url}`);
});

// 2. Tìm kiếm
tc('SEA-PC-01', 'Tìm kiếm', PC, 'Gõ "Mộc" trên Navbar', 'Hiện gợi ý có Giường Mộc Miên', async () => {
  await go('/');
  // textContent, not innerText: the dropdown header is uppercased by CSS
  const r = await ev(`const i = document.querySelector('input[placeholder^="Tìm theo tên"]'); i.dispatchEvent(new FocusEvent('focusin', { bubbles: true })); T.set(i, 'Mộc'); await T.sleep(400); const t = document.querySelector('header').textContent; return t.includes('Gợi ý tác phẩm') && t.includes('Mộc Miên')`);
  return ok(r, r ? 'Có gợi ý' : 'Không có gợi ý');
});
tc('SEA-PC-02', 'Tìm kiếm', PC, 'Nhấn Enter tìm "sofa"', 'Sang /tim-kiem?q=sofa, có kết quả', async () => {
  await go('/');
  const r = await ev(`const i = document.querySelector('input[placeholder^="Tìm theo tên"]'); T.set(i, 'sofa'); i.closest('form').requestSubmit(); await T.sleep(900); return { url: location.pathname + location.search, codes: T.codes() }`);
  return ok(r.url.startsWith('/tim-kiem') && r.codes > 0, `URL=${decodeURIComponent(r.url)}, mã SP=${r.codes}`);
});
tc('SEA-PC-03', 'Tìm kiếm', PC, 'Tìm từ khóa không có ("xyzqw")', 'Thông báo không có kết quả', async () => {
  await go('/tim-kiem?q=xyzqw');
  const r = await ev(`return { codes: T.codes(), msg: /không tìm thấy|không có|0 kết quả/i.test(T.text()) }`);
  return ok(r.msg, `thông báo=${r.msg}, mã SP=${r.codes}`);
});
tc('SEA-PC-04', 'Tìm kiếm', PC, 'Tìm theo mã sản phẩm "CDH-SF-01"', 'Ra Sofa Roma Grand', async () => {
  await go('/tim-kiem?q=CDH-SF-01');
  const t = await ev('return T.text()');
  return ok(t.includes('Roma Grand'), t.includes('Roma Grand') ? 'Có Roma Grand' : 'Không thấy');
});
tc('SEA-MB-01', 'Tìm kiếm', MOBILE, 'Ô tìm kiếm mobile gõ "sofa"', 'Danh sách lọc theo từ khóa', async () => {
  await go('/');
  const r = await ev(`const i = document.querySelector('input[placeholder^="Tìm sofa"]'); T.set(i, 'sofa'); await T.sleep(700); const f = i.closest('form'); if (f) { f.requestSubmit(); await T.sleep(800); } else { i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); await T.sleep(800); } return { url: location.pathname + location.search, sofa: /sofa/i.test(T.text()), codes: T.codes() }`);
  return ok(r.sofa && r.codes > 0, `URL=${decodeURIComponent(r.url)}, mã SP=${r.codes}`);
});

// 3. Tài khoản
const openRegister = `T.find('button', 'Đăng nhập').click(); await T.sleep(400); T.find('button', 'Đăng Ký').click(); await T.sleep(200);`;
const fillRegister = (u, p1, p2) => `
  T.set(document.querySelector('input[placeholder^="Ví dụ"]'), '${u}');
  T.set(document.querySelector('input[placeholder^="Tối thiểu"]'), '${p1}');
  const c = document.getElementById('auth-confirm-password'); if (c) T.set(c, '${p2}');
  await T.sleep(100);
  document.getElementById('auth-confirm-password')?.closest('form')?.requestSubmit() || [...document.querySelectorAll('form')].find(f => f.querySelector('input[placeholder^="Ví dụ"]')).requestSubmit();
  await T.sleep(500);`;
for (const d of [PC, MOBILE]) {
  const p = d.name === 'PC' ? 'PC' : 'MB';
  tc(`AUT-${p}-01`, 'Tài khoản', d, 'Tab Đăng nhập', 'Không có ô "Nhập lại mật khẩu"', async () => {
    await resetStorage(); await go('/');
    const r = await ev(`T.find('button', 'Đăng nhập').click(); await T.sleep(400); return !!document.getElementById('auth-confirm-password')`);
    return ok(!r, r ? 'Có ô xác nhận (sai)' : 'Không có ô xác nhận');
  });
  tc(`AUT-${p}-02`, 'Tài khoản', d, 'Tab Đăng ký', 'Có ô "Nhập lại mật khẩu xác minh"', async () => {
    await go('/');
    const r = await ev(`${openRegister} return T.vis(document.getElementById('auth-confirm-password')) && T.text().includes('Nhập lại mật khẩu xác minh')`);
    return ok(r, r ? 'Có ô xác nhận' : 'Không thấy ô xác nhận');
  });
  tc(`AUT-${p}-03`, 'Tài khoản', d, 'Đăng ký với 2 mật khẩu khác nhau', 'Báo "Mật khẩu xác nhận không khớp", không tạo tài khoản', async () => {
    await resetStorage(); await go('/');
    const r = await ev(`${openRegister} ${fillRegister('khach_moi1', 'matkhau123', 'matkhau999')} return { err: T.text().includes('Mật khẩu xác nhận không khớp'), user: T.user(), users: localStorage.getItem('cdhome_users_v2') || '' }`);
    return ok(r.err && !r.user && !r.users.includes('khach_moi1'), `thông báo lỗi=${r.err}, đã đăng nhập=${!!r.user}`);
  });
}
tc('AUT-PC-04', 'Tài khoản', PC, 'Đăng ký tên không hợp lệ ("a!")', 'Báo lỗi định dạng tên', async () => {
  await resetStorage(); await go('/');
  const r = await ev(`${openRegister} ${fillRegister('a!', 'matkhau123', 'matkhau123')} return { err: T.text().includes('3 đến 20 ký tự') && !!document.querySelector('.bg-red-50'), user: T.user() }`);
  return ok(r.err && !r.user, `báo lỗi=${r.err}, đăng nhập=${!!r.user}`);
});
tc('AUT-PC-05', 'Tài khoản', PC, 'Đăng ký mật khẩu 3 ký tự (khớp)', 'Báo lỗi tối thiểu 6 ký tự', async () => {
  await go('/');
  const r = await ev(`${openRegister} ${fillRegister('khach_ngan', 'abc', 'abc')} return { err: T.text().includes('ít nhất 6 ký tự'), user: T.user() }`);
  return ok(r.err && !r.user, `báo lỗi=${r.err}, đăng nhập=${!!r.user}`);
});
tc('AUT-PC-06', 'Tài khoản', PC, 'Đăng ký trùng tên "hoanganh_decor"', 'Báo tên đã được sử dụng', async () => {
  await go('/');
  const r = await ev(`${openRegister} ${fillRegister('hoanganh_decor', 'matkhau123', 'matkhau123')} return T.text().includes('đã được sử dụng')`);
  return ok(r, r ? 'Có báo trùng' : 'Không báo trùng');
});
tc('AUT-PC-07', 'Tài khoản', PC, 'Đăng ký hợp lệ', 'Tạo tài khoản, tự đăng nhập, Navbar hiện tên', async () => {
  await resetStorage(); await go('/');
  const r = await ev(`${openRegister} ${fillRegister('khach_test01', 'matkhau123', 'matkhau123')} await T.sleep(300); return { user: T.user()?.username, nav: !!T.find('header button', 'khach_test01') }`);
  return ok(r.user === 'khach_test01' && r.nav, `user=${r.user}, Navbar hiện tên=${r.nav}`);
});
tc('AUT-PC-08', 'Tài khoản', PC, 'Đăng xuất', 'Xóa phiên, Navbar hiện lại "Đăng nhập"', async () => {
  const r = await ev(`T.find('header button', 'khach_test01').click(); await T.sleep(300); T.find('button', 'Đăng xuất').click(); await T.sleep(400); return { user: T.user(), btn: !!T.find('header button', 'Đăng nhập') }`);
  return ok(!r.user && r.btn, `phiên=${!!r.user}, nút Đăng nhập=${r.btn}`);
});
tc('AUT-PC-09', 'Tài khoản', PC, 'Đăng nhập tên không tồn tại', 'Báo sai tên/mật khẩu', async () => {
  await go('/');
  const r = await ev(`T.find('button', 'Đăng nhập').click(); await T.sleep(400); T.set(document.querySelector('input[placeholder^="Ví dụ"]'), 'khong_ton_tai'); T.set(document.querySelector('input[placeholder^="Tối thiểu"]'), 'matkhau123'); [...document.querySelectorAll('form')].find(f => f.querySelector('input[placeholder^="Ví dụ"]')).requestSubmit(); await T.sleep(500); return { err: T.text().includes('không chính xác'), user: T.user() }`);
  return ok(r.err && !r.user, `báo lỗi=${r.err}, đăng nhập=${!!r.user}`);
});
tc('AUT-PC-10', 'Tài khoản', PC, 'Đăng nhập đúng tên nhưng SAI mật khẩu', 'Từ chối đăng nhập', async () => {
  await resetStorage(); await go('/');
  const r = await ev(`T.find('button', 'Đăng nhập').click(); await T.sleep(400); T.set(document.querySelector('input[placeholder^="Ví dụ"]'), 'hoanganh_decor'); T.set(document.querySelector('input[placeholder^="Tối thiểu"]'), 'saimatkhau999'); [...document.querySelectorAll('form')].find(f => f.querySelector('input[placeholder^="Ví dụ"]')).requestSubmit(); await T.sleep(500); return T.user()?.username || null`);
  return ok(!r, r ? `Vẫn đăng nhập được vào "${r}" bằng mật khẩu sai` : 'Bị từ chối');
});
tc('AUT-PC-11', 'Tài khoản', PC, 'Chuyển tab Đăng ký → Đăng nhập → Đăng ký', 'Ô xác nhận được xóa trắng', async () => {
  await go('/');
  const r = await ev(`${openRegister} T.set(document.getElementById('auth-confirm-password'), 'abcdef'); T.find('button', 'Đăng Nhập').click(); await T.sleep(150); T.find('button', 'Đăng Ký').click(); await T.sleep(150); return document.getElementById('auth-confirm-password').value`);
  return ok(r === '', r === '' ? 'Đã xóa trắng' : `Còn giá trị "${r}"`);
});

// 4. Yêu thích
tc('FAV-PC-01', 'Yêu thích', PC, 'Khách chưa đăng nhập bấm tim', 'Mở hộp đăng nhập', async () => {
  await resetStorage(); await go(`/san-pham/${PRODUCT_SLUGS[3]}`);
  const r = await ev(`document.querySelector('button[title="Lưu vào yêu thích"]').click(); await T.sleep(400); return T.text().includes('Đăng Nhập Tài Khoản')`);
  return ok(r, r ? 'Mở hộp đăng nhập' : 'Không mở');
});
tc('FAV-PC-02', 'Yêu thích', PC, 'Đăng nhập rồi bấm tim', 'Số yêu thích tăng 1', async () => {
  await resetStorage(); await go(`/san-pham/${PRODUCT_SLUGS[5]}`); await loginDemo();
  const r = await ev(`const count = () => Number(T.findAll('header button[aria-label="Danh sách yêu thích"] span')[0]?.textContent || 0); const before = count(); const b = document.querySelector('button[title="Lưu vào yêu thích"]'); if (!b) return { before, after: before, note: 'đã có trong yêu thích' }; b.click(); await T.sleep(400); return { before, after: count() }`);
  return ok(r.after === r.before + 1, `trước=${r.before}, sau=${r.after}${r.note ? ' (' + r.note + ')' : ''}`);
});
tc('FAV-PC-03', 'Yêu thích', PC, 'Trang Yêu thích sau khi lưu', 'Hiện sản phẩm vừa lưu', async () => {
  await go('/yeu-thich');
  const name = PRODUCT_SLUGS[5];
  const r = await ev(`return { codes: T.codes(), url: location.pathname }`);
  return ok(r.codes > 0, `mã SP hiển thị=${r.codes} (slug vừa lưu: ${name})`);
});
tc('FAV-PC-04', 'Yêu thích', PC, 'Bỏ yêu thích trên trang chi tiết', 'Số yêu thích giảm 1', async () => {
  await go(`/san-pham/${PRODUCT_SLUGS[5]}`);
  const r = await ev(`const count = () => Number(T.findAll('header button[aria-label="Danh sách yêu thích"] span')[0]?.textContent || 0); const before = count(); document.querySelector('button[title="Xóa khỏi yêu thích"]').click(); await T.sleep(400); return { before, after: count() }`);
  return ok(r.after === r.before - 1, `trước=${r.before}, sau=${r.after}`);
});

for (const d of [PC, MOBILE]) {
  const p = d.name === 'PC' ? 'PC' : 'MB';
  tc(`FAV-${p}-05`, 'Yêu thích', d, 'Bấm tim trên thẻ sản phẩm (đã đăng nhập)', 'Lưu được, KHÔNG chuyển sang trang chi tiết', async () => {
    await resetStorage(); await go('/'); await loginDemo(); await go('/danh-muc/ghe');
    const r = await ev(`const count = () => Number(T.findAll('header button[aria-label="Danh sách yêu thích"] span')[0]?.textContent || 0); const before = count(); const btn = T.findAll('button[aria-pressed="false"]').find(b => /Lưu .* vào yêu thích/.test(b.getAttribute('aria-label'))); btn.click(); await T.sleep(600); return { url: location.pathname, before, after: count() }`);
    return ok(r.url === '/danh-muc/ghe' && r.after === r.before + 1, `URL sau khi bấm=${r.url}, yêu thích ${r.before}→${r.after}`);
  });
  tc(`FAV-${p}-06`, 'Yêu thích', d, 'Bấm tim trên thẻ khi chưa đăng nhập', 'Mở hộp đăng nhập, KHÔNG chuyển trang', async () => {
    await resetStorage(); await go('/danh-muc/ban');
    const r = await ev(`T.findAll('button[aria-pressed]')[0].click(); await T.sleep(500); return { url: location.pathname, modal: T.text().includes('Đăng Nhập Tài Khoản') }`);
    return ok(r.url === '/danh-muc/ban' && r.modal, `URL=${r.url}, hộp đăng nhập=${r.modal}`);
  });
}
tc('FAV-PC-07', 'Yêu thích', PC, 'Tim ở "Tác Phẩm Liên Quan" phản ánh đúng trạng thái', 'SP đã lưu hiện tim đỏ; bấm tim không rời trang', async () => {
  await resetStorage(); await go('/'); await loginDemo();
  // hoanganh_decor has prod-001 saved in the seed data; prod-002's related list includes prod-001
  await go('/san-pham/tab-dau-giuong-tinh-duong-an');
  const r = await ev(`const rel = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Tác Phẩm Liên Quan')).closest('div.mt-16'); const pressed = [...rel.querySelectorAll('button[aria-pressed]')].map(b => b.getAttribute('aria-pressed')); const url0 = location.pathname; rel.querySelector('button[aria-pressed]').click(); await T.sleep(500); return { pressed, stay: location.pathname === url0 }`);
  return ok(r.pressed.includes('true') && r.stay, `trạng thái tim=${r.pressed.join(',')}, ở lại trang=${r.stay}`);
});

// 5. Liên hệ
for (const d of [PC, MOBILE]) {
  const p = d.name === 'PC' ? 'PC' : 'MB';
  tc(`CON-${p}-01`, 'Liên hệ', d, 'Mọi link gọi điện trên trang chủ + sản phẩm', `Đều là tel:${PHONE}`, async () => {
    const bad = new Set(); let n = 0;
    for (const path of ['/', `/san-pham/${PRODUCT_SLUGS[3]}`, '/showroom']) {
      await go(path);
      const tels = await ev(`T.find('button', '') ; document.querySelector('button[aria-label="Liên hệ showroom"]')?.click(); await T.sleep(250); return [...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href'))`);
      n += tels.length; tels.filter((t) => t !== `tel:${PHONE}`).forEach((t) => bad.add(t));
    }
    return ok(bad.size === 0 && n > 0, bad.size ? `Sai: ${[...bad].join(', ')}` : `${n} link đều đúng`);
  });
  tc(`CON-${p}-02`, 'Liên hệ', d, 'Bấm tất cả nút Zalo trên trang chủ', `Mở zalo.me/${PHONE} + sao chép tin nhắn`, async () => {
    await go('/');
    const r = await ev(`document.querySelector('button[aria-label="Liên hệ showroom"]')?.click(); await T.sleep(250); const seen = new Set(); const res = []; for (const b of T.findAll('button').filter(b => /zalo/i.test(b.textContent))) { const l = T.norm(b.textContent); if (seen.has(l)) continue; seen.add(l); const o = window.__opened.length, c = window.__clip.length; b.click(); await T.sleep(300); res.push({ l, url: window.__opened[o], msg: window.__clip[c] }); } return res`);
    const bad = r.filter((x) => x.url !== `https://zalo.me/${PHONE}` || !x.msg);
    return ok(r.length > 0 && bad.length === 0, bad.length ? `Lỗi: ${bad.map((b) => b.l).join(', ')}` : `${r.length} nút đúng`);
  });
  tc(`CON-${p}-03`, 'Liên hệ', d, 'Không còn Messenger', 'Không có chữ/link Messenger', async () => {
    const hits = [];
    for (const path of ['/', `/san-pham/${PRODUCT_SLUGS[3]}`, '/showroom']) {
      await go(path);
      const r = await ev(`document.querySelector('button[aria-label="Liên hệ showroom"]')?.click(); await T.sleep(200); return /messenger/i.test(T.text()) || !!document.querySelector('a[href*="m.me"]')`);
      if (r) hits.push(path);
    }
    return ok(hits.length === 0, hits.length ? `Còn ở: ${hits.join(', ')}` : 'Không còn');
  });
}

// 6. Footer
for (const d of [PC, MOBILE]) {
  const p = d.name === 'PC' ? 'PC' : 'MB';
  tc(`FOO-${p}-01`, 'Footer', d, 'Địa chỉ & giờ đón khách', 'Tịnh Khê, Quảng Ngãi · 07:00 - 20:30', async () => {
    await resetStorage(); await go('/');
    const t = await ev(`window.scrollTo(0, document.body.scrollHeight); await T.sleep(200); return document.querySelector('footer').innerText`);
    const a = t.includes('Xã Tịnh Khê, Thành Phố Quảng Ngãi, Tỉnh Quảng Ngãi'); const h = t.includes('07:00 - 20:30 (Thứ 2 - Chủ Nhật)');
    return ok(a && h, `địa chỉ=${a}, giờ=${h}`);
  });
  tc(`FOO-${p}-02`, 'Footer', d, 'Đã xóa dòng thừa & nút Admin', 'Không có "Showroom Catalog • Chế tác…" và nút Quản trị', async () => {
    const t = await ev(`return document.querySelector('footer').innerText`);
    const c = t.includes('Chế tác theo yêu cầu kiến trúc sư'); const a = /Quản Trị Hệ Thống/i.test(t);
    return ok(!c && !a, `dòng thừa=${c}, nút admin=${a}`);
  });
}
tc('FOO-PC-03', 'Footer', PC, 'Trình duyệt còn lưu địa chỉ Thảo Điền cũ', 'Tự đổi sang địa chỉ Quảng Ngãi', async () => {
  await go('/');
  await ev(`localStorage.setItem('cdhome_settings_v2', JSON.stringify({ name: 'CDHome', logo: '', phone: '0988123456', zaloPhone: '0988123456', messengerUsername: 'x', facebookPageUrl: '', email: '', address: '215 Nguyễn Văn Hưởng, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh', openingHours: '09:00 - 20:00 (Thứ 2 - Chủ Nhật)', mapsUrl: '', heroImage: '', heroHeadline: 'H', heroTagline: '', bandQuote: '', seasonalBannerImage: '', seasonalBannerTitle: '', seasonalBannerText: '' }))`);
  await go('/');
  const t = await ev(`return document.querySelector('footer').innerText`);
  const r = t.includes('Tịnh Khê') && t.includes('07:00 - 20:30') && t.includes(PHONE) && !t.includes('Thảo Điền');
  return ok(r, r ? 'Đã tự cập nhật' : 'Vẫn hiện dữ liệu cũ');
});

// 7. Trang chi tiết – Thông số
tc('SPC-PC-01', 'Thông số SP', PC, 'Giường Mộc Miên: 4 tab, bấm từng tab', 'Mỗi tab hiện đúng nội dung', async () => {
  await resetStorage(); await go('/san-pham/giuong-go-tu-nhien-moc-mien');
  const r = await ev(`const tabs = [...document.querySelectorAll('[role=tab]')]; const out = []; for (const t of tabs) { t.click(); await T.sleep(250); out.push(document.querySelector('[role=tabpanel]').innerText.length > 40 && t.getAttribute('aria-selected') === 'true'); } return { n: tabs.length, ok: out.every(Boolean) }`);
  return ok(r.n === 4 && r.ok, `số tab=${r.n}, nội dung OK=${r.ok}`);
});
tc('SPC-PC-02', 'Thông số SP', PC, 'Link "Xem bản vẽ kỹ thuật"', 'Cuộn xuống khu Thông số', async () => {
  const r = await ev(`window.scrollTo(0, 0); await T.sleep(200); T.find('button', 'Xem bản vẽ kỹ thuật').click(); await T.sleep(900); const top = document.getElementById('thong-so').getBoundingClientRect().top; return { y: Math.round(scrollY), top: Math.round(top) }`);
  return ok(r.y > 200 && r.top < 300, `scrollY=${r.y}, vị trí khu Thông số=${r.top}px`);
});
tc('SPC-PC-03', 'Thông số SP', PC, 'Phóng to bản vẽ + phím Esc', 'Mở/đóng được, zoom 2x', async () => {
  const r = await ev(`[...document.querySelectorAll('[role=tab]')][0].click(); await T.sleep(200); document.querySelector('[aria-label^="Phóng to bản vẽ"]').click(); await T.sleep(250); const open = !!document.querySelector('[aria-label="Bản vẽ kỹ thuật"]'); document.querySelector('[aria-label="Phóng to"]').click(); await T.sleep(150); const z = T.text().includes('2x'); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await T.sleep(250); return { open, z, closed: !document.querySelector('[aria-label="Bản vẽ kỹ thuật"]') }`);
  return ok(r.open && r.z && r.closed, `mở=${r.open}, 2x=${r.z}, Esc đóng=${r.closed}`);
});
tc('SPC-PC-04', 'Thông số SP', PC, 'Ảnh bản vẽ SVG tải được', 'Ảnh có kích thước > 0', async () => {
  // Load each drawing with a fresh Image(): loading="lazy" images never decode while off-screen
  const r = await ev(`const srcs = [...document.querySelectorAll('img[src*="/drawings/"]')].map(i => i.src); return Promise.all(srcs.map(s => new Promise(res => { const im = new Image(); im.onload = () => res(im.naturalWidth); im.onerror = () => res(0); im.src = s; })))`);
  return ok(r.length > 0 && r.every((w) => w > 0), `bản vẽ=${r.length}, rộng=${r.join(',')}`);
});
tc('SPC-PC-05', 'Thông số SP', PC, `Cả ${PRODUCT_SLUGS.length} sản phẩm đều có đủ 4 mục thông số`, 'Mỗi trang có 4 tab: Kích thước, Thiết kế, Vật liệu, Công dụng', async () => {
  const bad = [];
  for (const s of PRODUCT_SLUGS) {
    await go(`/san-pham/${s}`);
    const n = await ev(`return document.querySelectorAll('[role=tab]').length`);
    if (n !== 4) bad.push(`${s} (${n})`);
  }
  return ok(bad.length === 0, bad.length ? `Thiếu: ${bad.join(', ')}` : `${PRODUCT_SLUGS.length}/${PRODUCT_SLUGS.length} đủ 4 tab`);
});
tc('SPC-MB-01', 'Thông số SP', MOBILE, 'Accordion mobile: đóng/mở', 'Mục đầu mở sẵn, bấm để đóng/mở mục khác', async () => {
  await go('/san-pham/sofa-bang-da-y-roma-grand');
  const r = await ev(`const hs = [...document.querySelectorAll('#thong-so button[aria-expanded]')]; const first = hs[0].getAttribute('aria-expanded'); hs[1].click(); await T.sleep(350); const second = hs[1].getAttribute('aria-expanded'); hs[0].click(); await T.sleep(350); return { n: hs.length, first, second, firstAfter: hs[0].getAttribute('aria-expanded'), overflow: T.overflowX() }`);
  return ok(r.n === 4 && r.first === 'true' && r.second === 'true' && r.firstAfter === 'false' && r.overflow <= 1, `mục=${r.n}, đầu mở=${r.first}, mở mục 2=${r.second}, đóng mục 1=${r.firstAfter === 'false'}, tràn=${r.overflow}px`);
});
tc('SPC-MB-02', 'Thông số SP', MOBILE, 'Thanh báo giá dính đáy màn hình', 'Có tim, gọi, Zalo', async () => {
  const r = await ev(`const bar = [...document.querySelectorAll('div.fixed')].find(d => T.vis(d) && d.textContent.includes('Nhận Báo Giá Qua Zalo')); return !!bar && !!bar.querySelector('a[href^="tel:"]') && !!bar.querySelector('button[aria-label="Lưu sản phẩm vào yêu thích"]')`);
  return ok(r, r ? 'Đủ 3 nút' : 'Thiếu nút');
});

// 8. Mobile menu
tc('MNU-MB-01', 'Menu mobile', MOBILE, 'Mở menu, bấm danh mục "Bàn"', 'Chuyển sang /danh-muc/ban', async () => {
  await go('/');
  // Category rows in the drawer are clickable <div>s, not buttons
  const r = await ev(`document.querySelector('button[aria-label="Mở menu"]').click(); await T.sleep(500); const row = T.findAll('div.cursor-pointer').find(d => T.norm(d.querySelector('span')?.textContent) === 'Bàn'); if (!row) return 'không thấy mục Bàn'; row.click(); await T.sleep(600); return location.pathname`);
  return ok(String(r).startsWith('/danh-muc/ban'), `URL=${r}`);
});

// 9. Admin
tc('ADM-PC-01', 'Quản trị', PC, 'Vào /admin khi chưa đăng nhập', 'Hiện trang đăng nhập quản trị', async () => {
  await resetStorage(); await go('/admin');
  const r = await ev(`return !!document.querySelector('input[placeholder="Nhập mật khẩu quản trị..."]')`);
  return ok(r, r ? 'Hiện form đăng nhập' : 'Không có form');
});
const adminTry = (email, pass) => `
  T.set(document.querySelector('input[placeholder="admin@cdhome.vn"]'), '${email}');
  T.set(document.querySelector('input[placeholder="Nhập mật khẩu quản trị..."]'), '${pass}');
  document.querySelector('button[type=submit]').click(); await T.sleep(900);
  return { ok: localStorage.getItem('cdhome_admin_authenticated_v2') === 'true', err: T.norm(document.querySelector('.bg-red-50')?.textContent) }`;
tc('ADM-PC-02', 'Quản trị', PC, 'Mật khẩu quản trị ngắn "123"', 'Từ chối', async () => {
  const r = await ev(adminTry('admin@cdhome.vn', '123'));
  return ok(!r.ok, r.ok ? 'Vào được' : `Bị từ chối: ${r.err}`);
});
tc('ADM-PC-03', 'Quản trị', PC, 'Mật khẩu quản trị bất kỳ "zzzzzz"', 'Từ chối (chỉ mật khẩu đúng được vào)', async () => {
  await resetStorage(); await go('/admin');
  const r = await ev(adminTry('admin@cdhome.vn', 'zzzzzz'));
  return ok(!r.ok && /Còn 4 lần/.test(r.err), r.ok ? 'Vào được trang quản trị bằng mật khẩu tùy ý' : `Bị từ chối: ${r.err}`);
});
tc('ADM-PC-07', 'Quản trị', PC, 'Trang đăng nhập không lộ gợi ý mật khẩu', 'Không có chữ "admin123"/"cdhome2025", ô email để trống', async () => {
  await resetStorage(); await go('/admin');
  const r = await ev(`return { leak: /admin123|cdhome2025|Gợi ý mật khẩu/i.test(T.text()), email: document.querySelector('input[placeholder="admin@cdhome.vn"]').value }`);
  return ok(!r.leak && r.email === '', `lộ gợi ý=${r.leak}, email điền sẵn="${r.email}"`);
});
tc('ADM-PC-08', 'Quản trị', PC, 'Sai email, đúng mật khẩu', 'Từ chối', async () => {
  await resetStorage(); await go('/admin');
  const r = await ev(adminTry('ai_do@gmail.com', 'cdhome2025'));
  return ok(!r.ok, r.ok ? 'Vào được' : `Bị từ chối: ${r.err}`);
});
tc('ADM-PC-09', 'Quản trị', PC, 'Đúng email + mật khẩu mặc định', 'Vào được, hiện cảnh báo đổi mật khẩu mặc định', async () => {
  await resetStorage(); await go('/admin');
  const r = await ev(adminTry('admin@cdhome.vn', 'cdhome2025'));
  await sleep(300);
  const warn = await ev(`return T.text().includes('mật khẩu quản trị mặc định')`);
  return ok(r.ok && warn, `đăng nhập=${r.ok}, cảnh báo=${warn}`);
});
tc('ADM-PC-10', 'Quản trị', PC, 'Admin nhập sai 5 lần', 'Tạm khóa 15 phút; nhập đúng trong lúc khóa vẫn bị chặn', async () => {
  await resetStorage(); await go('/admin');
  let last;
  for (let i = 0; i < 5; i++) last = await ev(adminTry('admin@cdhome.vn', `sai${i}matkhau`));
  const during = await ev(adminTry('admin@cdhome.vn', 'cdhome2025'));
  return ok(/tạm khóa 15 phút/i.test(last.err) && !during.ok && /thử lại sau/i.test(during.err), `lần 5: "${last.err}" | nhập đúng khi đang khóa: vào=${during.ok}`);
});
tc('ADM-PC-11', 'Quản trị', PC, 'Đổi mật khẩu quản trị', 'Chặn MK hiện tại sai / yếu / không khớp; đổi xong MK cũ hết hiệu lực, MK mới dùng được', async () => {
  await resetStorage(); await go('/admin');
  await ev(adminTry('admin@cdhome.vn', 'cdhome2025'));
  await go('/admin/cai-dat');
  const change = (cur, nw, cf) => ev(`
    T.set(document.getElementById('admin-current-password'), '${cur}');
    T.set(document.getElementById('admin-new-password'), '${nw}');
    T.set(document.getElementById('admin-confirm-password'), '${cf}');
    document.getElementById('admin-current-password').closest('form').requestSubmit(); await T.sleep(400);
    return T.norm(document.getElementById('admin-current-password').closest('form').querySelector('.bg-red-50')?.textContent) || 'OK'`);
  const wrongCur = await change('sai_hien_tai1', 'MatKhauMoi2026', 'MatKhauMoi2026');
  const weak = await change('cdhome2025', 'abcdefgh', 'abcdefgh');
  const mismatch = await change('cdhome2025', 'MatKhauMoi2026', 'MatKhauKhac2026');
  const done = await change('cdhome2025', 'MatKhauMoi2026', 'MatKhauMoi2026');
  await ev(`localStorage.removeItem('cdhome_admin_authenticated_v2')`);
  await go('/admin');
  const oldPw = await ev(adminTry('admin@cdhome.vn', 'cdhome2025'));
  const newPw = await ev(adminTry('admin@cdhome.vn', 'MatKhauMoi2026'));
  const pass = /không đúng/.test(wrongCur) && /chữ và số/.test(weak) && /không khớp/.test(mismatch) && done === 'OK' && !oldPw.ok && newPw.ok;
  return ok(pass, `sai MK hiện tại="${wrongCur}" | MK yếu="${weak}" | không khớp="${mismatch}" | đổi=${done} | MK cũ vào=${oldPw.ok} | MK mới vào=${newPw.ok}`);
});
tc('ADM-PC-04', 'Quản trị', PC, 'Mở 5 trang quản trị', 'Tổng quan, Sản phẩm, Danh mục, Người dùng, Cài đặt đều hiển thị', async () => {
  await ev(`localStorage.setItem('cdhome_admin_authenticated_v2', 'true')`);
  const bad = [];
  for (const sub of ['', 'san-pham', 'danh-muc', 'nguoi-dung', 'cai-dat', 'san-pham/moi']) {
    await go(`/admin${sub ? '/' + sub : ''}`);
    const len = await ev(`return document.querySelector('main')?.innerText.length || document.body.innerText.length`);
    if (len < 100) bad.push(sub || 'tong-quan');
  }
  return ok(bad.length === 0, bad.length ? `Trống: ${bad.join(', ')}` : '6/6 trang hiển thị');
});
tc('ADM-PC-05', 'Quản trị', PC, 'Cài đặt: không còn Messenger, địa chỉ mới', 'Không có ô Messenger; ô địa chỉ = Quảng Ngãi', async () => {
  await go('/admin/cai-dat');
  const r = await ev(`const vals = [...document.querySelectorAll('input, textarea')].map(i => i.value); return { msg: /messenger/i.test(T.text()), addr: vals.some(v => v.includes('Tịnh Khê')) }`);
  return ok(!r.msg && r.addr, `ô Messenger=${r.msg}, địa chỉ mới=${r.addr}`);
});
tc('ADM-PC-06', 'Quản trị', PC, 'Lưu giờ mở cửa mới trong Cài đặt', 'Footer cửa hàng cập nhật theo', async () => {
  await go('/admin/cai-dat');
  const r = await ev(`const i = [...document.querySelectorAll('input')].find(x => x.value.includes('07:00 - 20:30')); if (!i) return 'không thấy ô giờ'; T.set(i, '08:00 - 21:00 (Thứ 2 - Chủ Nhật)'); await T.sleep(100); (T.find('button', 'Lưu') || document.querySelector('button[type=submit]')).click(); await T.sleep(500); return 'saved'`);
  await go('/');
  const t = await ev(`return document.querySelector('footer').innerText`);
  return ok(r === 'saved' && t.includes('08:00 - 21:00'), `lưu=${r}, footer có giờ mới=${t.includes('08:00 - 21:00')}`);
});

// 10. Bảo mật tài khoản khách
const userLogin = (u, p) => `
  if (!document.getElementById('auth-confirm-password') && !document.querySelector('input[placeholder^="Ví dụ"]')) { T.find('header button', 'Đăng nhập').click(); await T.sleep(400); }
  const tab = T.findAll('button').find(b => T.norm(b.textContent) === 'Đăng Nhập'); if (tab) { tab.click(); await T.sleep(150); }
  T.set(document.querySelector('input[placeholder^="Ví dụ"]'), '${u}');
  T.set(document.querySelector('input[placeholder^="Tối thiểu"]'), '${p}');
  [...document.querySelectorAll('form')].find(f => f.querySelector('input[placeholder^="Ví dụ"]')).requestSubmit();
  await T.sleep(500);
  return { user: T.user()?.username || null, err: T.norm(document.querySelector('.bg-red-50')?.textContent) }`;
const logoutUser = `localStorage.removeItem('cdhome_current_user_v2');`;
for (const d of [PC, MOBILE]) {
  const p = d.name === 'PC' ? 'PC' : 'MB';
  tc(`SEC-${p}-01`, 'Bảo mật', d, 'Đăng nhập đúng mật khẩu', 'Vào được tài khoản', async () => {
    await resetStorage(); await go('/');
    const r = await ev(userLogin('hoanganh_decor', 'admin123'));
    return ok(r.user === 'hoanganh_decor', `user=${r.user} ${r.err}`);
  });
  tc(`SEC-${p}-02`, 'Bảo mật', d, 'Nhập sai mật khẩu 5 lần', 'Lần 1-4 báo số lần còn lại; lần 5 khóa; nhập đúng sau đó vẫn bị chặn', async () => {
    await resetStorage(); await go('/');
    const msgs = [];
    for (let i = 1; i <= 5; i++) msgs.push((await ev(userLogin('thanhhang_villa', `sai_mk_${i}`))).err);
    const after = await ev(userLogin('thanhhang_villa', 'villa2025'));
    const countdown = [4, 3, 2, 1].every((n, i) => msgs[i].includes(`còn ${n} lần`));
    const locked = /bị khóa do nhập sai mật khẩu 5 lần/.test(msgs[4]);
    return ok(countdown && locked && !after.user && /bị khóa/.test(after.err), `lần 1: "${msgs[0]}" | lần 5: "${msgs[4]}" | nhập đúng sau khi khóa: vào=${!!after.user}`);
  });
}
tc('SEC-PC-03', 'Bảo mật', PC, 'Sai 2 lần rồi nhập đúng', 'Vào được và bộ đếm sai reset về 0', async () => {
  await resetStorage(); await go('/');
  await ev(userLogin('hoanganh_decor', 'sai_mk_1')); await ev(userLogin('hoanganh_decor', 'sai_mk_2'));
  const okLogin = await ev(userLogin('hoanganh_decor', 'admin123'));
  await ev(logoutUser); await go('/');
  const next = await ev(userLogin('hoanganh_decor', 'sai_mk_3'));
  return ok(okLogin.user === 'hoanganh_decor' && next.err.includes('còn 4 lần'), `vào=${okLogin.user} | lần sai tiếp theo: "${next.err}"`);
});
tc('SEC-PC-04', 'Bảo mật', PC, 'Admin cấp MK mới cho tài khoản bị khóa', 'Hiện nhãn "Khóa do sai mật khẩu"; sau khi cấp: MK mới vào được, MK cũ bị từ chối', async () => {
  await resetStorage(); await go('/');
  for (let i = 1; i <= 5; i++) await ev(userLogin('thanhhang_villa', `sai_mk_${i}`));
  await ev(`localStorage.setItem('cdhome_admin_authenticated_v2', 'true')`);
  await go('/admin/nguoi-dung');
  const badge = await ev(`return T.text().includes('Khóa do sai mật khẩu')`);
  const saved = await ev(`
    const row = [...document.querySelectorAll('tr')].find(r => r.innerText.includes('thanhhang_villa'));
    [...row.querySelectorAll('button')].find(b => b.textContent.includes('Cấp MK mới')).click(); await T.sleep(300);
    T.set(document.getElementById('reset-new-password'), 'khac123'); T.set(document.getElementById('reset-confirm-password'), 'khac999');
    document.getElementById('reset-new-password').closest('form').requestSubmit(); await T.sleep(250);
    const mismatch = T.text().includes('Mật khẩu xác nhận không khớp');
    T.set(document.getElementById('reset-new-password'), 'MoiCap2026'); T.set(document.getElementById('reset-confirm-password'), 'MoiCap2026');
    document.getElementById('reset-new-password').closest('form').requestSubmit(); await T.sleep(400);
    return { mismatch, closed: !document.getElementById('reset-new-password'), badgeGone: !T.text().includes('Khóa do sai mật khẩu') }`);
  await ev(`localStorage.removeItem('cdhome_admin_authenticated_v2')`); await go('/');
  const oldPw = await ev(userLogin('thanhhang_villa', 'villa2025'));
  await ev(logoutUser); await go('/');
  const newPw = await ev(userLogin('thanhhang_villa', 'MoiCap2026'));
  return ok(badge && saved.mismatch && saved.closed && saved.badgeGone && !oldPw.user && newPw.user === 'thanhhang_villa',
    `nhãn khóa=${badge} | chặn không khớp=${saved.mismatch} | lưu=${saved.closed} | nhãn mất=${saved.badgeGone} | MK cũ vào=${!!oldPw.user} | MK mới vào=${newPw.user}`);
});
tc('SEC-PC-05', 'Bảo mật', PC, 'Đăng ký mới → đăng xuất → đăng nhập lại', 'Đúng MK vào được, sai MK bị từ chối', async () => {
  await resetStorage(); await go('/');
  await ev(`${openRegister} ${fillRegister('khach_baomat', 'BaoMat2026', 'BaoMat2026')}`);
  await ev(logoutUser); await go('/');
  const wrong = await ev(userLogin('khach_baomat', 'saimatkhau'));
  const right = await ev(userLogin('khach_baomat', 'BaoMat2026'));
  return ok(!wrong.user && right.user === 'khach_baomat', `MK sai vào=${!!wrong.user} ("${wrong.err}") | MK đúng vào=${right.user}`);
});
tc('SEC-PC-06', 'Bảo mật', PC, 'Mật khẩu không lưu dạng chữ thường', 'localStorage không chứa mật khẩu gốc', async () => {
  const r = await ev(`const all = Object.keys(localStorage).map(k => localStorage.getItem(k)).join('\\n'); return ['BaoMat2026', 'admin123', 'villa2025', 'cdhome2025'].filter(p => all.includes(p))`);
  return ok(r.length === 0, r.length ? `Lộ: ${r.join(', ')}` : 'Chỉ lưu mã băm');
});
tc('SEC-PC-07', 'Bảo mật', PC, 'Tài khoản cũ chưa có mật khẩu', 'Không cho vào, hướng dẫn liên hệ admin', async () => {
  await resetStorage(); await go('/');
  await ev(`const users = JSON.parse(localStorage.getItem('cdhome_users_v2') || '[]'); users.push({ id: 'usr-legacy', username: 'khach_cu', createdAt: '2025-05-01T00:00:00Z', disabled: false }); localStorage.setItem('cdhome_users_v2', JSON.stringify(users));`);
  await go('/');
  const r = await ev(userLogin('khach_cu', 'batky123'));
  return ok(!r.user && /chưa được thiết lập mật khẩu/.test(r.err), `vào=${!!r.user} | "${r.err}"`);
});

// ---------- Run ----------
// ONLY=SEC,ADM node tests/website-test.mjs  → chỉ chạy các case có mã bắt đầu bằng SEC hoặc ADM
const ONLY = (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean);
const selected = ONLY.length ? cases.filter((c) => ONLY.some((pre) => c.id.startsWith(pre))) : cases;
const results = [];
const started = Date.now();
for (const c of selected) {
  await device(c.dev);
  jsErrors = [];
  let res;
  try {
    res = await Promise.race([
      c.run(),
      sleep(c.id.startsWith('NAV') ? 240000 : 45000).then(() => { throw new Error('quá thời gian chờ'); })
    ]);
  } catch (e) { res = { pass: false, actual: `Lỗi khi chạy test: ${e.message}` }; }
  const errs = [...new Set(jsErrors)];
  const status = errs.length ? 'FAIL' : res.pass ? 'PASS' : 'FAIL';
  const actual = errs.length ? `${res.actual} | Lỗi JS: ${errs.join(' ; ')}` : res.actual;
  results.push({ id: c.id, group: c.group, device: c.dev.name, name: c.name, expected: c.expected, actual, status });
  console.log(`${status === 'PASS' ? '✅' : '❌'} ${c.id.padEnd(11)} ${c.name} → ${actual}`);
}
ws.close(); chrome.kill();

const pass = results.filter((r) => r.status === 'PASS').length;
const summary = { base: BASE, runAt: new Date().toISOString(), durationSec: Math.round((Date.now() - started) / 1000), total: results.length, pass, fail: results.length - pass };
writeFileSync(join(ROOT, 'tests/test-results.json'), JSON.stringify({ summary, results }, null, 2));
console.log(`\nTổng: ${summary.total} | Đạt: ${pass} | Lỗi: ${summary.fail} | ${summary.durationSec}s`);
process.exit(summary.fail ? 1 : 0);
