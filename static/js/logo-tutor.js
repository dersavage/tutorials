/* Logo 101 helpers: syntax highlighting, runnable snippets and the exercise engine.
   Uses the Logo interpreter in logo-vm.js (a UCBLogo-compatible subset). */
(function (root) {
"use strict";

const PRIMS = new Set(("print pr type show make thing first butfirst bf last butlast bl " +
  "sum difference minus product quotient word sentence se list fput lput array mdarray " +
  "listtoarray arraytolist count item member emptyp wordp numberp listp arrayp equalp " +
  "notequalp namep thingp output op stop to end run if ifelse test iftrue iffalse not and or " +
  "repeat for forever while until do.while do.until map map.se foreach filter reduce apply " +
  "case cond catch throw error erract local localmake global erase po pots pf plist pprop " +
  "gprop remprop copydef procedurep definedp primitivep text bye load save readword readlist " +
  "readrawline readchar readquote char ascii uppercase lowercase form int round sqrt power " +
  "exp log10 ln sin cos atan arctan bitand bitor bitxor bitnot bitshift random rerandom " +
  "abs sign quotient remainder modulo push pop queue dequeue reverse rotate left right " +
  "fd bk forward back rt lt right left setpos setxy setx sety setheading home pos heading " +
  "towards xcor ycor pendown penup pu pd pe penpaint penerase penreverse setpen setpenmode " +
  "penmode setpencolor setpc setbackground setbg setpalette setpensize setscrunch " +
  "shown hideturtle st ht showturtle fills fill clean clearscreen cs wraps window fence " +
  "label setlabelheight labelfont snapshot restore savescreen loadscreen setcursorsize " +
  "cleartext ct standout settextcolor setcursor textscreen splitscreen fullscreen " +
  "freshline keyp seteditor").split(/\s+/));

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function hl(src) {
  let out = "", i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (ch === ";") {                                   // comment to end of line
      let j = src.indexOf("\n", i); if (j < 0) j = n;
      out += '<span class="tk-comment">' + esc(src.slice(i, j)) + "</span>"; i = j; continue;
    }
    if (ch === '"') {                                   // quoted word — data
      let j = i + 1;
      while (j < n && !/[\s()\[\]]/.test(src[j])) {
        if (src[j] === "\\") j++;                       // backslash keeps next char
        j++;
      }
      out += '<span class="tk-quote">' + esc(src.slice(i, j)) + "</span>"; i = j; continue;
    }
    if (ch === "|") {                                   // |vertical bars word|
      let j = src.indexOf("|", i + 1);
      j = j < 0 ? n : j + 1;
      out += '<span class="tk-quote">' + esc(src.slice(i, j)) + "</span>"; i = j; continue;
    }
    if (ch === ":") {                                   // :variable
      let j = i + 1;
      while (j < n && !/[\s()\[\]]/.test(src[j])) j++;
      out += '<span class="tk-colon">' + esc(src.slice(i, j)) + "</span>"; i = j; continue;
    }
    if (/[0-9]/.test(ch) && (i === 0 || /[\s(\[;]/.test(src[i - 1]))) {
      let j = i;
      while (j < n && /[0-9.]/.test(src[j])) j++;
      out += '<span class="tk-num">' + esc(src.slice(i, j)) + "</span>"; i = j; continue;
    }
    if (/[A-Za-z.?!*_]/.test(ch)) {                     // a word: primitive or plain
      let j = i;
      while (j < n && /[A-Za-z0-9.?!*_\-]/.test(src[j])) j++;
      const w = src.slice(i, j);
      out += PRIMS.has(w.toLowerCase()) ? '<span class="tk-cmd">' + esc(w) + "</span>" : esc(w);
      i = j; continue;
    }
    if (ch === "[" || ch === "]" || ch === "(" || ch === ")") {
      out += '<span class="tk-bracket">' + ch + "</span>"; i++; continue;
    }
    out += esc(ch); i++;
  }
  return out;
}

/* ---------------- running Logo ---------------- */
function newTurtle(real) {
  if (typeof LogoTurtle === "undefined") return null;
  if (!real) return new LogoTurtle(null, null);
  const d = document.createElement("canvas"), s = document.createElement("canvas");
  d.width = d.height = s.width = s.height = 300;
  d.className = "turtle-canvas"; s.className = "turtle-canvas turtle-overlay";
  return new LogoTurtle(d, s);
}
/* Run several pieces of code in ONE interpreter; returns one array of lines per piece. */
function runPieces(pieces, turtle) {
  const per = pieces.map(() => []);
  let cur = 0, pending = "";
  let vm;
  try {
    vm = new LogoVM({ gfx: turtle || null, readLine: () => null, write: (t, k) => {
      if (k === "type") { pending += String(t); return; }               /* type: no newline yet */
      if (k === "err" && pending) { per[cur].push({ text: pending, kind: "out" }); pending = ""; }
      per[cur].push({ text: pending + String(t), kind: k }); pending = "";
    } });
  } catch (e) { per[0].push({ text: "Internal error: " + e.message, kind: "err" }); return per; }
  pieces.forEach((code, i) => {
    cur = i;
    try { vm.execute(code, false); } catch (e) { per[i].push({ text: "Internal error: " + (e && e.message || e), kind: "err" }); }
    if (pending) { per[i].push({ text: pending, kind: "out" }); pending = ""; }
  });
  return per;
}
const clean = lines => lines.filter(l => l.kind !== "info").map(l => l.text.replace(/[ \t]+$/g, ""));
const noDefined = ls => ls.filter(l => !/^\S+ defined$/.test(l));
const textNorm = s => { const a = String(s).split("\n").map(l => l.trim()); while (a.length && a[0] === "") a.shift(); while (a.length && a[a.length - 1] === "") a.pop(); return a.join("\n"); };

/* ---------------- exercise parsing and judging ---------------- */
const MULTI = { o: 1, "o*": 1, pre: 1, code: 1, expect: 1, solution: 1, test: 1 };
function parseQuiz(text) {
  return text.split(/^===\s*$/m).map(b => {
    const ex = { opts: [], correct: -1 };
    b.split("\n").forEach(line => {
      const m = /^(o\*|[a-z]+):[ ]?(.*)$/.exec(line);
      if (!m) return;
      const k = m[1], v = m[2];
      if (k === "o" || k === "o*") { ex.opts.push(v); if (k === "o*") ex.correct = ex.opts.length - 1; }
      else if (MULTI[k]) ex[k] = ex[k] === undefined ? v : ex[k] + "\n" + v;
      else ex[k] = v;
    });
    return ex;
  }).filter(e => e.type);
}
/* Predict: expected output is what the real interpreter prints. */
function expectedFor(ex) {
  if (ex.type === "predict") {
    const per = runPieces([ex.pre || "", ex.code], newTurtle(false));
    return textNorm(noDefined(clean(per[1])).join("\n"));
  }
  return textNorm(ex.expect || "");
}
function judge(ex, answer) {
  if (ex.type === "choice") return { ok: Number(answer) === ex.correct, lines: [] };
  const pieces = ex.type === "predict" ? [ex.pre || "", ex.code] : [ex.pre || "", answer, ex.test || ""];
  const per = runPieces(pieces, newTurtle(false));
  if (ex.type === "predict") {
    const real = textNorm(noDefined(clean(per[1])).join("\n"));
    return { ok: textNorm(answer) === real, lines: per[1], expected: real };
  }
  const lines = per[1].concat(per[2]);
  const got = textNorm(noDefined(clean(lines)).join("\n"));
  return { ok: got === textNorm(ex.expect || ""), lines: lines, got: got };
}
root.LogoTutorCore = { parseQuiz, expectedFor, judge, runPieces, hl, textNorm };
if (typeof document === "undefined") return;

/* ---------------- page behaviour ---------------- */
const $ = (s, r) => (r || document).querySelector(s);
const fmt = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const consoleHTML = lines => lines.length
  ? lines.map(l => '<span class="c-line' + (l.kind === "err" ? " c-err" : "") + '">' + esc(l.text) + "</span>").join("")
  : '<span class="c-line c-info">(nothing printed)</span>';
const TURTLE_RE = /\b(fd|forward|bk|back|rt|right|lt|left|setpos|setxy|setx|sety|seth|setheading|home|pu|pd|penup|pendown|setpc|setpencolor|setpensize)\b/i;

function initSnippets() {
  const blocks = [];
  document.querySelectorAll(".book-article pre code").forEach(code => {
    const lang = (code.getAttribute("data-lang") || (/language-(\S+)/.exec(code.className) || [])[1] || "").toLowerCase();
    if (lang !== "logo" && lang !== "logoc") return;
    const src = code.textContent.replace(/\n$/, "");
    code.innerHTML = hl(src);
    const pre = code.closest("pre"), holder = pre.closest(".highlight") || pre;
    holder.classList.add("logo-block");
    if (lang === "logo") blocks.push({ src, holder });
  });
  blocks.forEach((b, idx) => {
    const bar = document.createElement("div");
    bar.className = "run-bar";
    bar.innerHTML = '<button type="button" class="run-btn">Run &#9654;</button><span class="run-note">UCBLogo, running in your browser</span>';
    const out = document.createElement("div");
    out.className = "run-out"; out.hidden = true;
    b.holder.after(bar); bar.after(out);
    bar.querySelector("button").addEventListener("click", () => {
      const prior = blocks.slice(0, idx).map(x => x.src);
      const wantsTurtle = TURTLE_RE.test(b.src);
      const turtle = newTurtle(true);
      const per = runPieces(prior.concat([b.src]), turtle);
      /* Earlier snippets on the page (definitions, variables) are replayed silently first. */
      const lines = per[per.length - 1];
      let html = '<div class="console">' + consoleHTML(lines) + "</div>";
      out.innerHTML = html; out.hidden = false;
      if (wantsTurtle && turtle) {
        const frame = document.createElement("div");
        frame.className = "turtle-frame";
        const rerun = newTurtle(true);
        /* draw only this snippet's lines on a clean canvas */
        const vmPieces = prior.concat([b.src]);
        const t2 = rerun;
        let vm = new LogoVM({ gfx: t2, write: () => {}, readLine: () => null });
        vmPieces.forEach((p, i) => { if (i === vmPieces.length - 1) t2.clear(true); try { vm.execute(p, false); } catch (e) {} });
        frame.appendChild(t2.dc); frame.appendChild(t2.tc);
        out.appendChild(frame);
      }
    });
  });
}

function initQuiz() {
  const holder = $("script[type='text/x-quiz']");
  if (!holder) return;
  const section = holder.closest(".quiz");
  const exs = parseQuiz(holder.textContent);
  if (!exs.length) return;
  const KEY = "logo101:" + location.pathname;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} };
  let idx = 0;
  const first = exs.findIndex((_, i) => !(saved[i] && saved[i].passed));
  idx = first < 0 ? 0 : first;

  const box = document.createElement("div");
  section.appendChild(box);

  function stepper() {
    return '<div class="q-steps">' + exs.map((_, i) => {
      const r = saved[i] || {};
      const cls = (i === idx ? "now " : "") + (r.passed ? (r.shown ? "shown" : "done") : "");
      return '<button type="button" class="q-dot ' + cls + '" data-i="' + i + '" aria-label="Exercise ' + (i + 1) + '">' + (i + 1) + "</button>";
    }).join("") + "</div>";
  }
  function summary() {
    const own = exs.filter((_, i) => saved[i] && saved[i].passed && !saved[i].shown).length;
    return own;
  }
  function render() {
    const ex = exs[idx];
    const r = saved[idx] || (saved[idx] = {});
    const typed = ex.type !== "choice";
    let h = stepper();
    h += '<div class="q-card"><p class="q-kind">Exercise ' + (idx + 1) + " of " + exs.length + " &middot; " +
      (ex.type === "choice" ? "Pick one" : ex.type === "predict" ? "Predict the output (type it)" : "Write the code (type it)") + "</p>";
    h += '<p class="q-text">' + fmt(ex.q || "") + "</p>";
    if (ex.pre && ex.pre.trim()) h += '<p class="q-tag">Already defined:</p><pre class="code-block">' + hl(ex.pre) + "</pre>";
    if (ex.type === "predict") h += '<p class="q-tag">Then this runs:</p><pre class="code-block">' + hl(ex.code) + "</pre>";
    if (ex.type === "write" && ex.test) h += '<p class="q-tag">After your code, this runs:</p><pre class="code-block">' + hl(ex.test) + "</pre>";
    if (ex.type === "choice") {
      h += '<div class="q-opts">' + ex.opts.map((o, i) =>
        '<label class="q-opt"><input type="radio" name="opt" value="' + i + '"' + (r.picked === i ? " checked" : "") + (r.passed ? " disabled" : "") + "> <span>" + fmt(o) + "</span></label>").join("") + "</div>";
    } else {
      h += '<textarea class="q-answer" rows="' + (ex.type === "write" ? 3 : Math.max(1, (expectedFor(ex).split("\n").length))) + '" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="' +
        (ex.type === "predict" ? "type exactly what Logo prints" : "type your Logo code here") + '"' + (r.passed ? " disabled" : "") + ">" + esc(r.answer || "") + "</textarea>";
    }
    h += '<div class="q-bar"><button type="button" class="q-check"' + (r.passed ? " hidden" : "") + '>Check</button> ' +
      '<button type="button" class="q-stuck" hidden>I’m stuck, show me</button> ' +
      '<button type="button" class="q-next"' + (r.passed ? "" : " hidden") + ">" + (idx === exs.length - 1 ? "Finish" : "Next exercise &rarr;") + "</button></div>";
    h += '<div class="q-fb" role="status" aria-live="polite"></div></div>';
    box.innerHTML = h;
    const fb = $(".q-fb", box), check = $(".q-check", box), stuck = $(".q-stuck", box), next = $(".q-next", box), ta = $(".q-answer", box);
    if (r.passed) showWhy(true);
    if ((r.attempts || 0) >= 2 && !r.passed) stuck.hidden = false;

    function showWhy() {
      fb.className = "q-fb ok";
      let t = r.shown ? "Answer shown. Read it, and notice why it works." : "Correct.";
      fb.innerHTML = "<strong>" + t + "</strong>" + (ex.why ? "<p>" + fmt(ex.why) + "</p>" : "");
      if (ex.type === "predict") fb.innerHTML += '<div class="console">' + esc(expectedFor(ex)).split("\n").map(l => '<span class="c-line">' + l + "</span>").join("") + "</div>";
    }
    function done(ok) {
      if (ok) { r.passed = true; persist(); render(); return; }
    }
    check.addEventListener("click", doCheck);
    function doCheck() {
      let answer;
      if (ex.type === "choice") {
        const c = box.querySelector("input[name=opt]:checked");
        if (!c) { fb.className = "q-fb bad"; fb.textContent = "Pick an option first."; return; }
        answer = c.value; r.picked = Number(answer);
      } else { answer = ta.value; r.answer = answer; if (!answer.trim()) { fb.className = "q-fb bad"; fb.textContent = "Type an answer first."; return; } }
      const v = judge(ex, answer);
      r.attempts = (r.attempts || 0) + 1;
      if (v.ok) { r.passed = true; persist(); render(); return; }
      persist();
      fb.className = "q-fb bad";
      let m = "<strong>Not quite.</strong>";
      if (r.attempts === 1 && ex.hint) m += "<p>Hint: " + fmt(ex.hint) + "</p>";
      else if (ex.type === "write" && v.lines) m += '<p>Your code printed:</p><div class="console">' + consoleHTML(v.lines) + "</div>";
      else m += "<p>Have another look.</p>";
      fb.innerHTML = m;
      if (r.attempts >= 2) stuck.hidden = false;
    }
    stuck.addEventListener("click", () => {
      r.shown = true; r.passed = true;
      if (ex.type === "choice") r.picked = ex.correct; else r.answer = ex.type === "predict" ? expectedFor(ex) : (ex.solution || "");
      persist(); render();
    });
    next.addEventListener("click", () => {
      if (idx < exs.length - 1) { idx++; render(); } else finish();
    });
    if (ta) ta.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); if (!r.passed) doCheck(); else next.click(); } });
    box.querySelectorAll(".q-dot").forEach(b => b.addEventListener("click", () => { idx = Number(b.dataset.i); render(); }));
  }
  function finish() {
    const own = summary();
    const all = exs.every((_, i) => saved[i] && saved[i].passed);
    box.innerHTML = stepper() + '<div class="q-card q-done"><p class="q-kind">Section finished</p><p class="q-text">' +
      (all ? "You got <strong>" + own + " of " + exs.length + "</strong> on your own." : "Some exercises are still open. Click a numbered dot above.") +
      '</p><div class="q-bar"><button type="button" class="q-again">Start over</button></div></div>';
    box.querySelectorAll(".q-dot").forEach(b => b.addEventListener("click", () => { idx = Number(b.dataset.i); render(); }));
    $(".q-again", box).addEventListener("click", () => { saved = {}; persist(); idx = 0; render(); });
  }
  render();
}

function start() { initSnippets(); initQuiz(); }
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})(typeof window !== "undefined" ? window : globalThis);
