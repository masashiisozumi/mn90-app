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
const CACHE = 'mn90-v93';

// 最初に取り込むもの。1枚のHTMLに全部入っているので、これだけで動く
const SHELL = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png'];

// モンゴル語の音声。**ここは build-standalone.js が書き換える。手で足さない。**
// 運転中に電波が切れる場所へ入っても止まらないよう、最初にまとめて取り込む。
// SHELL と分けているのは、addAll が1件でも失敗すると全部が入らないため。
// 音は1件ずつ入れ、落ちたものはあとで普通に取りに行けばよい。
const AUDIO = [
  './audio/adv_here.mp3',
  './audio/adv_there.mp3',
  './audio/c_black.mp3',
  './audio/c_red.mp3',
  './audio/c_white.mp3',
  './audio/g_hello.mp3',
  './audio/g_no.mp3',
  './audio/g_thanks.mp3',
  './audio/g_yes.mp3',
  './audio/n_accident.mp3',
  './audio/n_airport.mp3',
  './audio/n_bank.mp3',
  './audio/n_businesscard.mp3',
  './audio/n_car.mp3',
  './audio/n_child.mp3',
  './audio/n_city.mp3',
  './audio/n_color.mp3',
  './audio/n_company.mp3',
  './audio/n_country.mp3',
  './audio/n_customs.mp3',
  './audio/n_day.mp3',
  './audio/n_document.mp3',
  './audio/n_dollar.mp3',
  './audio/n_engine.mp3',
  './audio/n_evening.mp3',
  './audio/n_family.mp3',
  './audio/n_food.mp3',
  './audio/n_hotel.mp3',
  './audio/n_house.mp3',
  './audio/n_japan.mp3',
  './audio/n_km.mp3',
  './audio/n_language.mp3',
  './audio/n_market.mp3',
  './audio/n_meeting.mp3',
  './audio/n_money.mp3',
  './audio/n_mongolia.mp3',
  './audio/n_month.mp3',
  './audio/n_morning.mp3',
  './audio/n_name.mp3',
  './audio/n_office.mp3',
  './audio/n_part.mp3',
  './audio/n_partner.mp3',
  './audio/n_person.mp3',
  './audio/n_phone.mp3',
  './audio/n_photo.mp3',
  './audio/n_port.mp3',
  './audio/n_price.mp3',
  './audio/n_restaurant.mp3',
  './audio/n_road.mp3',
  './audio/n_shop.mp3',
  './audio/n_time.mp3',
  './audio/n_today.mp3',
  './audio/n_tomorrow.mp3',
  './audio/n_ub.mp3',
  './audio/n_usedcar.mp3',
  './audio/n_water.mp3',
  './audio/n_wife.mp3',
  './audio/n_work.mp3',
  './audio/n_year.mp3',
  './audio/num_1.mp3',
  './audio/num_10.mp3',
  './audio/num_100.mp3',
  './audio/num_1000.mp3',
  './audio/num_2.mp3',
  './audio/num_3.mp3',
  './audio/num_4.mp3',
  './audio/num_5.mp3',
  './audio/num_6.mp3',
  './audio/num_7.mp3',
  './audio/num_8.mp3',
  './audio/num_9.mp3',
  './audio/p_he_she.mp3',
  './audio/p_i.mp3',
  './audio/p_we.mp3',
  './audio/p_you_casual.mp3',
  './audio/p_you_pol.mp3',
  './audio/pn_that.mp3',
  './audio/pn_this.mp3',
  './audio/q_how.mp3',
  './audio/q_howmany.mp3',
  './audio/q_what.mp3',
  './audio/q_when.mp3',
  './audio/q_where.mp3',
  './audio/q_whichmodel.mp3',
  './audio/q_who.mp3',
  './audio/s_are_you_ok.mp3',
  './audio/s_can_i_contact.mp3',
  './audio/s_card_exchange.mp3',
  './audio/s_do_you_have.mp3',
  './audio/s_do_you_speak_en.mp3',
  './audio/s_goodbye.mp3',
  './audio/s_how_many_km.mp3',
  './audio/s_how_much.mp3',
  './audio/s_i_am_in_ub.mp3',
  './audio/s_i_buy_this.mp3',
  './audio/s_i_dont_get.mp3',
  './audio/s_i_dont_have.mp3',
  './audio/s_i_have_car.mp3',
  './audio/s_i_have_family.mp3',
  './audio/s_i_sell_cars.mp3',
  './audio/s_i_sell_this.mp3',
  './audio/s_iam_from_jp.mp3',
  './audio/s_ill_contact.mp3',
  './audio/s_ill_send_quote.mp3',
  './audio/s_is_this_ok.mp3',
  './audio/s_lets_meet_here.mp3',
  './audio/s_lets_work_together.mp3',
  './audio/s_my_name_is.mp3',
  './audio/s_nice_to_meet.mp3',
  './audio/s_no_accident.mp3',
  './audio/s_please_wait.mp3',
  './audio/s_say_again.mp3',
  './audio/s_see_you.mp3',
  './audio/s_send_to_you.mp3',
  './audio/s_show_me.mp3',
  './audio/s_slowly.mp3',
  './audio/s_sorry.mp3',
  './audio/s_thank_you_today.mp3',
  './audio/s_thanks_much.mp3',
  './audio/s_thanks_time.mp3',
  './audio/s_what_year.mp3',
  './audio/s_whats_this.mp3',
  './audio/s_where_is.mp3',
  './audio/s_where_is_toilet.mp3',
  './audio/v_be_now.mp3',
  './audio/v_buy.mp3',
  './audio/v_come.mp3',
  './audio/v_contact.mp3',
  './audio/v_do.mp3',
  './audio/v_find.mp3',
  './audio/v_give.mp3',
  './audio/v_go.mp3',
  './audio/v_know.mp3',
  './audio/v_look_for.mp3',
  './audio/v_see.mp3',
  './audio/v_sell.mp3',
  './audio/v_send.mp3',
  './audio/v_speak.mp3',
  './audio/v_take.mp3',
  './audio/v_understand.mp3',
];  /* AUDIO-LIST */

self.addEventListener('install', (e) => {
  // すぐには入れ替わらない。待機したまま、アプリ側の合図を待つ
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    try { await c.addAll(SHELL); } catch (err) { /* 通信が弱いときは次に開いたときへ回す */ }
    // 音は1件ずつ。**1件の失敗で全部を落とさない**
    await Promise.all(AUDIO.map((u) => c.add(u).catch(() => {})));
  })());
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
