/**
 * 一度読み込んだあと、通信が弱くてもアプリを開けるようにする。
 *
 * 守っていること:
 *  1. **保存領域(localStorage)には一切触らない。** 触れる口すら持たない。
 *     版が変わっても社長の学習記録は残る。
 *  2. **勝手に切り替わらない。** 新しい版が来ても、いま開いている画面は
 *     そのまま。学習の途中で入れ替わると、どこまで進んだか分からなくなる。
 *     切り替えるのは、アプリ側が「更新があります」を押されたときだけ。
 *  3. 配るのはこの置き場の中のものだけ。外部への通信は素通しにする。
 *
 * 手で編集しない。build-standalone.js が置き場へ写す。
 */

// 中身が変わるたびに上げる。古い保管庫はここを見て捨てる
const CACHE = 'mn90-v62';

// 最初に取り込むもの。1枚のHTMLに全部入っているので、これだけで動く
const SHELL = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  // すぐには入れ替わらない。待機したまま、アプリ側の合図を待つ
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

// アプリ側から「切り替えてよい」と言われたときだけ入れ替わる
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // 外部は素通し
  if (!url.pathname.startsWith(new URL('./', self.location).pathname)) return;

  // 画面そのものは「まず保管庫」。通信が弱くても即座に開く。
  // 裏で新しいものを取りに行き、次に開いたときに反映する
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') cache.put(req, res.clone()).catch(() => {});
      return res;
    }).catch(() => null);
    if (hit) { network; return hit; }
    const res = await network;
    if (res) return res;
    // 保管庫にも通信にも無い。画面の要求なら、入口のHTMLを返して真っ白を避ける
    if (req.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    return new Response('', { status: 504, statusText: 'offline' });
  })());
});
