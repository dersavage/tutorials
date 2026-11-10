/* Logo 101: lesson player. Screen-by-screen lessons, typed exercises judged by a real (subset) UCBLogo interpreter. */
(function () {
"use strict";
const C = window.LogoCore, VM = window.LogoVM, esc = C.esc;
const $ = (s, r) => (r || document).querySelector(s);
const app = $("#app");

/* ---------------- course data ---------------- */
const LESSONS = (window.LESSONS || []).slice().sort((a, b) => a.id - b.id);
const byId = {}; LESSONS.forEach(L => { byId[L.id] = L; });
const qCount = L => L.screens.filter(s => s.kind === "q").length;

/* ---------------- state ---------------- */
const KEY = "logo101-v1";
let state = { theme: null, lessons: {} };
try { const raw = localStorage.getItem(KEY); if (raw) state = Object.assign(state, JSON.parse(raw)); } catch (e) {}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
function ls(id) {
  if (!state.lessons[id]) state.lessons[id] = { idx: 0, max: 0, res: {}, done: false };
  return state.lessons[id];
}
let activeId = null;                 // null = home
function applyTheme() {
  const t = state.theme || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", t);
}
$("#theme-toggle").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  state.theme = cur === "dark" ? "light" : "dark"; save(); applyTheme();
});
applyTheme();

/* ---------------- syntax highlighting ---------------- */
const LOGO_PRIMS = new Set(("print pr type show make thing first butfirst bf last butlast bl sum difference minus product " +
  "quotient word sentence se list fput lput array listtoarray arraytolist count item member memberp emptyp wordp numberp listp " +
  "arrayp equalp notequalp namep output op stop to end run runresult if ifelse test iftrue iffalse ift iff not and or repeat for " +
  "while until do.while do.until map filter reduce apply foreach local localmake global erase po pots pprop gprop plist remprop " +
  "erpl pplist plistp bye readword readlist readchars readrawline openread openwrite setread setwrite close eofp load save " +
  "char ascii uppercase lowercase int round sqrt power exp ln log10 sin cos arctan random rerandom abs remainder modulo " +
  "setitem mdarray trace untrace catch throw error ignore wait item reverse before after beforep afterp substringp " +
  "numbers count rawascii charp name dribble nodribble erall printout ern ern name? name erns pons contents procedurep definedp " +
  "text define ? # sentence? first? form windex shuffle cascade fput ").split(/\s+/));
function hlLogo(src) {
  let out = "", i = 0; const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (ch === ";") { let j = src.indexOf("\n", i); if (j < 0) j = n; out += '<span class="t-com">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (ch === '"') { let j = i + 1; while (j < n && !/[\s()\[\]]/.test(src[j])) j++; out += '<span class="t-str">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (ch === ":") { let j = i + 1; while (j < n && !/[\s()\[\]]/.test(src[j])) j++; out += '<span class="t-var">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (/[0-9]/.test(ch) && (i === 0 || /[\s(\[;]/.test(src[i - 1]))) { let j = i; while (j < n && /[0-9.]/.test(src[j])) j++; out += '<span class="t-num">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (/[A-Za-z.?!_]/.test(ch)) {
      let j = i; while (j < n && /[A-Za-z0-9.?!_]/.test(src[j])) j++;
      const w = src.slice(i, j);
      out += LOGO_PRIMS.has(w.toLowerCase()) ? '<span class="t-kw">' + esc(w) + "</span>" : esc(w); i = j; continue;
    }
    if ("[]()".indexOf(ch) >= 0) { out += '<span class="t-br">' + ch + "</span>"; i++; continue; }
    out += esc(ch); i++;
  }
  return out;
}
const PY_KW = new Set("def return if elif else for while in not and or is None True False import from as with class lambda pass break continue global nonlocal try except finally raise yield".split(" "));
const PY_BI = new Set("print len range sum map filter list dict set tuple str int float input open sorted reversed enumerate zip min max abs round isinstance type".split(" "));
const RK_KW = new Set("sub my our state constant if elsif else unless for while until loop given when default return say put print gather take last next redo multi proto class method has is does with without orwith and or not so Int Str Num Rat Bool List Array Hash Seq Any".split(" "));
function hlGeneric(src, kw, bi, raku) {
  let out = "", i = 0; const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (ch === "#") { let j = src.indexOf("\n", i); if (j < 0) j = n; out += '<span class="t-com">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (ch === '"' || ch === "'") {
      let j = i + 1; while (j < n && src[j] !== ch && src[j] !== "\n") { if (src[j] === "\\") j++; j++; }
      j = Math.min(n, j + 1); out += '<span class="t-str">' + esc(src.slice(i, j)) + "</span>"; i = j; continue;
    }
    if (raku && /[$@%&]/.test(ch) && /[A-Za-z_*!.^]/.test(src[i + 1] || "")) {
      let j = i + 1; while (j < n && /[A-Za-z0-9_\-*!.^]/.test(src[j])) j++;
      out += '<span class="t-var">' + esc(src.slice(i, j)) + "</span>"; i = j; continue;
    }
    if (/[0-9]/.test(ch) && !/[A-Za-z_]/.test(src[i - 1] || "")) { let j = i; while (j < n && /[0-9._]/.test(src[j])) j++; out += '<span class="t-num">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i; while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      if (raku) while (j < n && src[j] === "-" && /[A-Za-z]/.test(src[j + 1] || "")) { j++; while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++; }
      const w = src.slice(i, j);
      out += kw.has(w) ? '<span class="t-kw2">' + esc(w) + "</span>" : bi.has(w) ? '<span class="t-kw">' + esc(w) + "</span>" : esc(w); i = j; continue;
    }
    out += esc(ch); i++;
  }
  return out;
}
const hlPy = s => hlGeneric(s, PY_KW, PY_BI, false);
const hlRaku = s => hlGeneric(s, RK_KW, new Set(), true);
const LABEL = { run: "Logo", logo: "Logo", py: "Python", raku: "Raku" };
const HL = { run: hlLogo, logo: hlLogo, py: hlPy, raku: hlRaku };

/* ---------------- rendering blocks ---------------- */
function consoleHtml(lines) {
  if (!lines.length) return '<div class="console"><span class="c-dim">(no output)</span></div>';
  return '<div class="console">' + lines.map(l => {
    const cls = l.kind === "err" ? "c-err" : (l.kind === "info" || l.kind === true) ? "c-info" : "";
    return '<div class="' + cls + '">' + (esc(l.text) || "&nbsp;") + "</div>";
  }).join("") + "</div>";
}
function codeFigure(kind, code, extra) {
  return '<figure class="code lang-' + kind + '"><figcaption>' + LABEL[kind] + "</figcaption><pre>" + HL[kind](code) + "</pre>" + (extra || "") + "</figure>";
}
function renderBody(src) {
  const blocks = C.parseMarkup(src);
  const runs = blocks.filter(b => b.t === "run").map(b => b.code);
  const outs = runs.length ? C.runPieces(VM, runs) : [];
  let r = 0;
  return blocks.map(b => {
    switch (b.t) {
      case "p": return "<p>" + C.inline(b.s) + "</p>";
      case "h": return "<h3>" + C.inline(b.s) + "</h3>";
      case "ul": return "<ul>" + b.items.map(x => "<li>" + C.inline(x) + "</li>").join("") + "</ul>";
      case "note": return '<aside class="note">' + C.inline(b.s) + "</aside>";
      case "out": return '<div class="console static">' + b.code.split("\n").map(l => "<div>" + (esc(l) || "&nbsp;") + "</div>").join("") + "</div>";
      case "run": return codeFigure("run", b.code, '<div class="runlabel">Output</div>' + consoleHtml(outs[r++]));
      default: return codeFigure(b.t, b.code);
    }
  }).join("\n");
}

/* ---------------- views ---------------- */
function setView(id) { activeId = id; render(); window.scrollTo(0, 0); }
$("#brand").addEventListener("click", e => { e.preventDefault(); setView(null); });

function renderHeader() {
  const done = LESSONS.filter(L => ls(L.id).done).length;
  $("#progress").textContent = activeId ? "" : done + " / " + LESSONS.length + " sections";
  const nav = $("#stepper"); nav.innerHTML = "";
  if (activeId) {
    const L = byId[activeId], S = ls(activeId);
    L.screens.concat([{ title: "Done" }]).forEach((s, i) => {
      const d = document.createElement("button");
      d.type = "button"; d.className = "dot"; d.title = s.title || "";
      if (i < S.max || S.done) d.classList.add("seen");
      if (s.kind === "q") d.classList.add("qd");
      if (i === S.idx) d.classList.add("cur");
      d.addEventListener("click", () => { if (i <= S.max) { S.idx = i; save(); render(); } });
      nav.appendChild(d);
    });
  }
}
function renderHome() {
  const parts = []; LESSONS.forEach(L => { let p = parts[parts.length - 1]; if (!p || p.label !== L.part) { p = { label: L.part, items: [] }; parts.push(p); } p.items.push(L); });
  const done = LESSONS.filter(L => ls(L.id).done).length;
  let h = '<section class="hero"><h1>Logo 101</h1>' +
    '<p class="lede">Thirty short lessons that teach you to program using <strong>UCBLogo</strong> (Berkeley Logo), and show, side by side, how the same ideas look in Python and in Raku.</p>' +
    '<p class="small">Every lesson has a few screens of explanation and five exercises. You type the answers, and a real Logo interpreter running in this page checks them. Progress is saved in this browser.</p>' +
    '<aside class="note"><strong>About the dialect.</strong> The Logo in this course is UCBLogo, written by Brian Harvey and his students at Berkeley: lists are the main data structure, procedures are defined with {{to ... end}}, and the prompt is {{?}}. Other Logos (MSWLogo, FMSLogo, NetLogo, Logo Writer) differ in details. The interpreter in this page is a compact re-implementation covering what this course needs, so expect it to agree with UCBLogo on everything shown here, but not to be a full replacement.</aside></section>';
  h += '<div class="meter"><span style="width:' + Math.round(100 * done / LESSONS.length) + '%"></span></div>';
  parts.forEach(p => {
    h += '<h2 class="part">' + esc(p.label) + '</h2><div class="grid">';
    p.items.forEach(L => {
      const S = ls(L.id);
      const st = S.done ? "done" : (S.max > 0 ? "going" : "");
      h += '<button class="lcard ' + st + '" data-id="' + L.id + '"><span class="num">' + L.id + '</span><span class="lt"><b>' + esc(L.title) + '</b><small>' + esc(L.tagline || "") + '</small></span><span class="st">' + (S.done ? "✓" : S.max > 0 ? "…" : "") + "</span></button>";
    });
    h += "</div>";
  });
  app.innerHTML = h;
  app.querySelectorAll(".lcard").forEach(b => b.addEventListener("click", () => {
    const id = +b.dataset.id; const S = ls(id); if (S.done) { S.idx = 0; } setView(id);
  }));
}

function renderLesson() {
  const L = byId[activeId], S = ls(activeId);
  if (S.idx > L.screens.length) S.idx = 0;
  if (S.idx >= L.screens.length) return renderDone(L, S);
  const s = L.screens[S.idx];
  if (S.idx > S.max) S.max = S.idx;
  const kicker = "Section " + L.id + " · " + esc(L.title);
  if (s.kind === "q") return renderQuestion(L, S, s, kicker);
  app.innerHTML = '<article class="card"><div class="kicker">' + kicker + "</div><h2>" + esc(s.title) + "</h2>" + renderBody(s.body) + "</article>" + navBar(L, S, true);
  wireNav(L, S);
}
function navBar(L, S, canGo) {
  const last = S.idx >= L.screens.length - 1;
  return '<nav class="navbar"><button class="btn ghost" id="back"' + (S.idx === 0 ? " disabled" : "") + '>← Back</button>' +
    '<button class="btn primary" id="next"' + (canGo ? "" : " disabled") + ">" + (last ? "Finish section →" : "Continue →") + "</button></nav>";
}
function wireNav(L, S) {
  const b = $("#back"), n = $("#next");
  if (b) b.addEventListener("click", () => { S.idx = Math.max(0, S.idx - 1); save(); render(); window.scrollTo(0, 0); });
  if (n) n.addEventListener("click", () => { if (n.disabled) return; S.idx++; if (S.idx > S.max) S.max = S.idx; save(); render(); window.scrollTo(0, 0); });
}

const KIND = { predict: "Predict the output", fill: "Fill in the blank", write: "Write the code" };
function renderQuestion(L, S, q, kicker) {
  const qi = L.screens.slice(0, S.idx + 1).filter(x => x.kind === "q").length;
  const R = S.res[S.idx] || (S.res[S.idx] = { attempts: 0, passed: false, shown: false, answer: "" });
  const expected = C.expectedOf(VM, q);
  let h = '<article class="card q"><div class="kicker">' + kicker + " · Exercise " + qi + " of " + qCount(L) + " · " + KIND[q.type] + "</div><h2>" + esc(q.title) + "</h2>" + renderBody(q.body);
  if (q.before) h += '<div class="given">Already defined for you:</div>' + codeFigure("logo", q.before);
  if (q.type === "predict") {
    h += codeFigure("logo", q.code) + '<label class="ans-l" for="ans">What does the console print? One line per line of output.</label><textarea id="ans" rows="' + Math.max(2, expected.split("\n").length + 1) + '" spellcheck="false" autocomplete="off"></textarea>';
  } else if (q.type === "fill") {
    h += '<figure class="code lang-logo"><figcaption>Logo</figcaption><pre>' + hlLogo(q.pre || "") + '<input id="ans" class="blank" spellcheck="false" autocomplete="off" size="' + Math.max(8, Math.min(40, q.solution.length + 2)) + '">' + hlLogo(q.post || "") + "</pre></figure>";
  } else {
    h += '<label class="ans-l" for="ans">Your code:</label><textarea id="ans" class="codein" rows="' + (q.rows || 5) + '" spellcheck="false" autocomplete="off" autocapitalize="off"></textarea>';
  }
  if (q.type !== "predict") h += '<div class="runlabel">The console should show</div>' + consoleHtml(expected ? expected.split("\n").map(t => ({ text: t, kind: "out" })) : []);
  h += '<div class="actions"><button class="btn primary" id="check">Check answer</button><span class="small">Ctrl/⌘ + Enter</span></div><div id="fb" aria-live="polite"></div></article>' + navBar(L, S, R.passed || R.shown);
  app.innerHTML = h;
  const ans = $("#ans"); ans.value = R.answer || "";
  wireNav(L, S);
  function feedback(html, cls) { $("#fb").innerHTML = '<div class="fb ' + cls + '">' + html + "</div>"; }
  function reveal(sol) {
    R.shown = true; save();
    feedback("<strong>Here is one answer.</strong>" + codeFigure("logo", sol) + (q.explain ? "<p>" + C.inline(q.explain) + "</p>" : ""), "info");
    $("#next").disabled = false;
  }
  function check() {
    const a = ans.value; R.answer = a;
    if (!a.trim()) { feedback("Type an answer first.", "bad"); return; }
    R.attempts++;
    const r = C.judge(VM, q, a, expected);
    if (r.ok) {
      R.passed = true; save();
      feedback("<strong>Correct.</strong> " + (q.explain ? C.inline(q.explain) : ""), "good");
      $("#next").disabled = false;
      return;
    }
    save();
    let msg = "<strong>Not quite.</strong> ";
    if (q.type !== "predict") {
      msg += "Your code printed:" + consoleHtml(r.lines.filter(l => l.kind !== true).length ? r.lines.filter(l => l.kind !== true) : []);
    } else msg += "That doesn't match what the interpreter prints.";
    if (q.hint && R.attempts >= 1) msg += '<p class="hint">Hint: ' + C.inline(q.hint) + "</p>";
    if (R.attempts >= 2) msg += '<p><button class="btn ghost" id="stuck">I\'m stuck, show me</button></p>';
    feedback(msg, "bad");
    const st = $("#stuck"); if (st) st.addEventListener("click", () => reveal(q.type === "predict" ? expected : q.solution));
  }
  $("#check").addEventListener("click", check);
  ans.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); check(); }
    else if (e.key === "Enter" && q.type === "fill") { e.preventDefault(); check(); }
    else if (e.key === "Tab" && q.type === "write") { e.preventDefault(); const p = ans.selectionStart; ans.value = ans.value.slice(0, p) + "  " + ans.value.slice(ans.selectionEnd); ans.selectionStart = ans.selectionEnd = p + 2; }
  });
  if (R.passed) feedback("<strong>Correct.</strong> " + (q.explain ? C.inline(q.explain) : ""), "good");
  ans.focus();
}

function renderDone(L, S) {
  S.done = true; if (S.idx > S.max) S.max = S.idx; save();
  const qs = Object.keys(S.res).map(k => S.res[k]);
  const first = qs.filter(r => r.passed && r.attempts <= 1).length, shown = qs.filter(r => r.shown).length;
  const next = byId[L.id + 1];
  app.innerHTML = '<article class="card done"><div class="kicker">Section ' + L.id + " complete</div><h2>" + esc(L.title) + ": done</h2>" +
    "<p>You answered <strong>" + first + " of " + qCount(L) + "</strong> exercises on the first try" + (shown ? " and asked to see " + shown + " answer" + (shown > 1 ? "s" : "") : "") + ". Anything you missed is worth another look: use the dots above to go back.</p>" +
    '<div class="actions">' + (next ? '<button class="btn primary" id="nextlesson">Next: ' + esc(next.title) + ' →</button>' : '<span>That is the whole course. Well done.</span>') + '<button class="btn ghost" id="home">All sections</button></div></article>';
  const n = $("#nextlesson"); if (n) n.addEventListener("click", () => { ls(next.id).idx = Math.min(ls(next.id).idx, next.screens.length - 1); setView(next.id); });
  $("#home").addEventListener("click", () => setView(null));
}

function render() { renderHeader(); if (activeId) renderLesson(); else renderHome(); renderHeader(); }

/* ---------------- playground ---------------- */
let pgVM = null;
function pgOut(t, k) { const o = $("#pg-out"); const d = document.createElement("div"); d.textContent = t; if (k === "err") d.className = "c-err"; else if (k === "info" || k === true) d.className = "c-info"; o.appendChild(d); o.scrollTop = o.scrollHeight; }
function pgReset() { pgVM = new VM({ gfx: null, write: pgOut, readLine: () => null }); $("#pg-out").innerHTML = ""; }
$("#pg-toggle").addEventListener("click", () => {
  const p = $("#pg"); const open = p.hidden; p.hidden = !open; $("#pg-toggle").setAttribute("aria-expanded", open);
  if (open && !pgVM) pgReset();
  if (open) $("#pg-in").focus();
});
$("#pg-run").addEventListener("click", () => { if (!pgVM) pgReset(); try { pgVM.execute($("#pg-in").value, false); } catch (e) { pgOut(String(e.message || e), "err"); } });
$("#pg-reset").addEventListener("click", pgReset);
$("#pg-in").addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); $("#pg-run").click(); } });

render();
})();
