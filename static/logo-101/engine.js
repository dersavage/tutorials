(function () {
"use strict";
const $ = (s, r) => (r || document).querySelector(s);
const SECS = window.LOGO101;
const KEY = "logo101-progress-v1";
let prog = {};
try { prog = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(prog)); } catch (e) {} };
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- syntax highlighting ---------- */
const LOGO_CMDS = new Set(("print pr type show make thing first butfirst bf last butlast bl sum difference minus product quotient " +
 "word sentence se list fput lput array listtoarray arraytolist setitem count item member memberp emptyp wordp numberp listp arrayp " +
 "equalp notequalp namep output op stop to end run if ifelse not and or repeat for while until foreach map filter reduce apply " +
 "local localmake erase po pots plist pprop gprop remprop procedurep int round sqrt power remainder modulo random rerandom " +
 "reverse uppercase lowercase ascii char readword readlist readchar iseq rseq trace untrace beforep substringp memberp pick " +
 "bye load save sort dequeue queue push pop copydef text error catch throw wait ignore count make make 'name" ).split(/\s+/));
function hlLogo(src) {
  let out = "", i = 0; const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (ch === ";") { let j = src.indexOf("\n", i); if (j < 0) j = n; out += '<span class="tk-com">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (ch === '"') { let j = i + 1; while (j < n && !/[\s()\[\]]/.test(src[j])) j++; out += '<span class="tk-q">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (ch === ":") { let j = i + 1; while (j < n && !/[\s()\[\]]/.test(src[j])) j++; out += '<span class="tk-var">' + esc(src.slice(i, j)) + "</span>"; i = j; continue; }
    if (/[0-9]/.test(ch) && (i === 0 || /[\s(\[]/.test(src[i - 1]))) { let j = i; while (j < n && /[0-9.]/.test(src[j])) j++; out += '<span class="tk-num">' + src.slice(i, j) + "</span>"; i = j; continue; }
    if (/[A-Za-z.?!_]/.test(ch)) { let j = i; while (j < n && /[A-Za-z0-9.?!_]/.test(src[j])) j++; const w = src.slice(i, j); out += LOGO_CMDS.has(w.toLowerCase()) ? '<span class="tk-cmd">' + w + "</span>" : esc(w); i = j; continue; }
    if ("[]()".includes(ch)) { out += '<span class="tk-br">' + ch + "</span>"; i++; continue; }
    out += esc(ch); i++;
  }
  return out;
}
const PYKW = "def return if elif else for while in not and or is None True False class import from as with try except finally raise lambda pass break continue yield del global nonlocal assert".split(" ");
const PYBI = "print len range sum min max sorted reversed list dict set tuple str int float bool input map filter enumerate zip abs round isinstance open".split(" ");
const RKKW = "my our sub method class role is does has if elsif else unless for while until loop given when default return gather take last next redo do and or not xor orelse andthen state use need module multi proto only where of with without".split(" ");
const RKBI = "say put print note join map grep sort reduce first reverse elems chars uc lc tc flip words lines split comb substr index sum min max abs sqrt floor ceiling round rand pick roll head tail push pop shift unshift Str Int Num Bool List Array Hash Range Seq so defined".split(" ");
function hlGeneric(src, kw, bi, com, varRe) {
  const re = new RegExp("(" + [com, '"(?:\\\\.|[^"\\\\])*"', "'(?:\\\\.|[^'\\\\])*'", varRe, "\\b\\d+(?:\\.\\d+)?\\b", "[A-Za-z_][\\w\\-]*"].filter(Boolean).join("|") + ")", "g");
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const t = m[0]; let cls = "";
    if (t[0] === "#") cls = "tk-com";
    else if (t[0] === '"' || t[0] === "'") cls = "tk-q";
    else if (varRe && /^[$@%&]/.test(t)) cls = "tk-var";
    else if (/^\d/.test(t)) cls = "tk-num";
    else if (kw.includes(t)) cls = "tk-kw";
    else if (bi.includes(t)) cls = "tk-cmd";
    out += cls ? '<span class="' + cls + '">' + esc(t) + "</span>" : esc(t);
    last = m.index + t.length;
  }
  return out + esc(src.slice(last));
}
const hlPy = s => hlGeneric(s, PYKW, PYBI, "#[^\\n]*", "");
const hlRaku = s => hlGeneric(s, RKKW, RKBI, "#[^\\n]*", "[$@%&][*!.^]?[A-Za-z_][\\w\\-]*");

/* ---------- block renderers ---------- */
let sess = null;           // shared Logo interpreter for the current section
let ranUpTo = -1;
function resetSession() { sess = LogoRun.session(); ranUpTo = -1; }
function showOut(el, lines) {
  el.innerHTML = lines.filter(l => l.kind !== "info").map(l => '<pre class="' + (l.kind === "err" ? "err" : "") + '">' + esc(l.text) + "</pre>").join("");
}
function logoBlock(b, idx, blocks) {
  const d = document.createElement("div"); d.className = "code logo";
  d.innerHTML = '<div class="lab"><span>UCBLogo</span><button class="run" type="button">Run ▶</button></div><pre>' + hlLogo(b.code) + '</pre><div class="con"></div>';
  d.querySelector(".run").addEventListener("click", () => {
    if (!sess) resetSession();
    for (let k = ranUpTo + 1; k < idx; k++) if (blocks[k].t === "logo") sess.run(blocks[k].code);
    const lines = sess.run(b.code);
    ranUpTo = Math.max(ranUpTo, idx);
    showOut(d.querySelector(".con"), lines);
  });
  return d;
}
function cmpBlock(b, cls, label, hl) {
  const d = document.createElement("div"); d.className = "code " + cls;
  d.innerHTML = '<div class="lab"><span>' + label + '</span></div><pre>' + hl(b.code) + "</pre>";
  return d;
}

/* ---------- exercises ---------- */
const TAGS = { choice: "Multiple choice", predict: "Predict the output", fill: "Fill in the blank", write: "Write the code" };
function exercise(ex, key, onDone) {
  const card = document.createElement("div"); card.className = "ex" + (prog[key] ? " done" : "");
  let fails = 0;
  const n = key.split("-e")[1];
  let h = '<h3>Exercise ' + n + ' <span class="tag">' + TAGS[ex.type] + "</span>" + (prog[key] ? " ✓" : "") + '</h3><div class="q">' + ex.q + "</div>";
  if (ex.type === "choice") {
    h += ex.options.map((o, i) => '<label><input type="radio" name="' + key + '" value="' + i + '"> ' + o + "</label>").join("");
  } else {
    if (ex.before && ex.type !== "predict") h += '<div class="code"><div class="lab"><span>Already defined</span></div><pre>' + hlLogo(ex.before) + "</pre></div>";
    if (ex.type === "predict") h += '<div class="code"><div class="lab"><span>UCBLogo</span></div><pre>' + hlLogo((ex.before ? ex.before + "\n" : "") + ex.code) + "</pre></div><p>Type exactly what Logo prints, one line per line. (This one is <em>not</em> run for you.)</p><textarea spellcheck=\"false\"></textarea>";
    if (ex.type === "fill") h += '<div class="code"><div class="lab"><span>Complete the code: replace ___</span></div><pre>' + hlLogo(ex.template) + '</pre></div><input type="text" spellcheck="false" autocapitalize="off" placeholder="what goes in the blank?">';
    if (ex.type === "write") h += (ex.after ? '<div class="code"><div class="lab"><span>Afterwards this will be run</span></div><pre>' + hlLogo(ex.after) + "</pre></div>" : "") + '<textarea spellcheck="false" autocapitalize="off">' + esc(ex.starter || "") + "</textarea>";
  }
  h += '<div class="btns"><button class="check" type="button">Check</button><button class="ghost hint" type="button">Hint</button><button class="ghost show" type="button" hidden>Show answer</button></div><div class="fb" hidden></div>';
  card.innerHTML = h;
  const fb = card.querySelector(".fb");
  const say = (ok, msg, why) => { fb.hidden = false; fb.className = "fb " + (ok ? "ok" : "no"); fb.innerHTML = msg + (why ? '<div class="why">' + why + "</div>" : ""); };
  const input = () => {
    if (ex.type === "choice") { const r = card.querySelector("input:checked"); return r ? r.value : null; }
    return (card.querySelector("textarea") || card.querySelector("input[type=text]")).value;
  };
  card.querySelector(".hint").addEventListener("click", () => say(true, "Hint: " + (ex.hint || "Re-read the section above and try again.")));
  card.querySelector(".show").addEventListener("click", () => {
    const a = ex.type === "choice" ? ex.options[ex.answer] : (ex.type === "predict" ? "<pre>" + esc(ex.answer) + "</pre>" : "<pre>" + esc(ex.type === "fill" ? ex.answer : ex.solution) + "</pre>");
    say(false, "One answer that works:", a + (ex.explain ? "<p>" + ex.explain + "</p>" : ""));
  });
  card.querySelector(".check").addEventListener("click", () => {
    const v = input();
    if (v === null || String(v).trim() === "") { say(false, "Give it a go first."); return; }
    const r = LogoRun.judge(ex, v);
    if (r.ok) {
      say(true, "Correct.", ex.explain);
      if (!prog[key]) { prog[key] = 1; save(); card.classList.add("done"); onDone(); }
    } else {
      fails++;
      let msg = "Not quite.";
      if (r.got !== undefined && ex.type !== "predict") msg += " Your code printed:<pre>" + esc(r.got || "(nothing)") + "</pre> I wanted:<pre>" + esc(ex.expect) + "</pre>";
      say(false, msg);
      if (fails >= 2) card.querySelector(".show").hidden = false;
    }
  });
  return card;
}

/* ---------- pages ---------- */
const app = $("#app"), sel = $("#jump"), meter = $("#meter");
const secDone = s => s.ex.every((_, i) => prog["s" + s.id + "-e" + (i + 1)]);
function updateMeter() {
  const total = SECS.reduce((a, s) => a + s.ex.length, 0);
  const done = Object.keys(prog).filter(k => /^s\d+-e\d+$/.test(k)).length;
  meter.style.width = (100 * done / total) + "%";
}
function home() {
  document.title = "Logo 101";
  let h = '<div class="kicker">A beginner course</div><h1>Logo 101</h1><p class="tagline">Thirty short lessons that teach programming through UCBLogo</p>' +
    '<p>Logo is where I think programming should start. This course uses <strong>UCBLogo</strong> (Berkeley Logo), the version of Logo written by Brian Harvey and his students at the University of California, Berkeley. Everything you type here runs in a UCBLogo-compatible interpreter that lives in this page, so there is nothing to install.</p>' +
    '<p>Each lesson goes the same way: a small piece of Logo, a plain explanation, then how the same idea looks in <strong>Python</strong> and in <strong>Raku</strong>. At the end there are five exercises. Some are multiple choice; most make you type an answer or write code, and your answer is checked right here in the browser.</p>' +
    '<p>Code is lowercase, the way Logo is normally written. Press <strong>Run ▶</strong> on any Logo snippet to execute it, and use the playground at the bottom of each lesson to experiment.</p>' +
    '<h2>Lessons</h2><ul class="index">' + SECS.map(s => '<li><span class="tick">' + (secDone(s) ? "✓" : "") + '</span><a href="#s' + s.id + '">' + s.id + ". " + s.title + "</a></li>").join("") + "</ul>" +
    '<p><a href="#s1"><strong>Start with lesson 1 →</strong></a></p>';
  app.innerHTML = h; sel.value = "";
}
function section(id) {
  const i = SECS.findIndex(s => s.id === id); if (i < 0) return home();
  const s = SECS[i]; resetSession();
  document.title = s.id + ". " + s.title + " · Logo 101";
  sel.value = "s" + s.id;
  app.innerHTML = '<div class="kicker">Lesson ' + s.id + " of " + SECS.length + "</div><h1>" + s.title + '</h1><p class="tagline">' + s.tagline + "</p>";
  s.blocks.forEach((b, k) => {
    if (b.t === "p") { const d = document.createElement("div"); d.innerHTML = "<p>" + b.html + "</p>"; while (d.firstChild) app.appendChild(d.firstChild); }
    else if (b.t === "note") { const d = document.createElement("div"); d.className = "note"; d.innerHTML = "<p>" + b.html + "</p>"; app.appendChild(d); }
    else if (b.t === "logo") app.appendChild(logoBlock(b, k, s.blocks));
    else if (b.t === "py") app.appendChild(cmpBlock(b, "py", "Python", hlPy));
    else if (b.t === "raku") app.appendChild(cmpBlock(b, "raku", "Raku", hlRaku));
  });
  if (s.fn && s.fn.length) { const f = document.createElement("div"); f.className = "fn"; f.innerHTML = "<h2>Footnotes</h2><ol>" + s.fn.map(t => "<li>" + t + "</li>").join("") + "</ol>"; app.appendChild(f); }
  const h = document.createElement("h2"); h.textContent = "Check your understanding"; app.appendChild(h);
  s.ex.forEach((e, k) => app.appendChild(exercise(e, "s" + s.id + "-e" + (k + 1), updateMeter)));
  const pg = document.createElement("details"); pg.className = "play";
  pg.innerHTML = '<summary>Playground: try your own Logo</summary><div class="code"><textarea spellcheck="false" autocapitalize="off" style="width:100%;min-height:90px;border:0;padding:10px 14px;font:14.5px ui-monospace,Menlo,monospace;background:transparent;color:inherit" placeholder="type Logo here"></textarea><div class="lab"><button class="run" type="button">Run ▶</button></div><div class="con"></div></div>';
  pg.querySelector(".run").addEventListener("click", () => {
    if (!sess) resetSession();
    showOut(pg.querySelector(".con"), sess.run(pg.querySelector("textarea").value));
  });
  app.appendChild(pg);
  const nav = document.createElement("div"); nav.className = "nav";
  nav.innerHTML = (i > 0 ? '<a href="#s' + SECS[i - 1].id + '">← ' + SECS[i - 1].title + "</a>" : '<a href="#">← Contents</a>') +
    (i < SECS.length - 1 ? '<a href="#s' + SECS[i + 1].id + '">' + SECS[i + 1].title + " →</a>" : '<a href="#">Contents →</a>');
  app.appendChild(nav);
  window.scrollTo(0, 0);
}
function route() {
  const m = /^#s(\d+)$/.exec(location.hash);
  if (m) section(Number(m[1])); else home();
  updateMeter();
}
sel.innerHTML = '<option value="">Contents</option>' + SECS.map(s => '<option value="s' + s.id + '">' + s.id + ". " + s.title + "</option>").join("");
sel.addEventListener("change", () => { location.hash = sel.value; });
$("#theme").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
});
window.addEventListener("hashchange", route);
route();
})();
