/* Shared by the browser app and the build-time verifier (node).
   Runs Logo through the in-page interpreter, judges exercises, renders lesson markup. */
(function (root) {
"use strict";

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

/* Run code pieces one after another in ONE fresh interpreter.
   Returns one array of {text, kind} lines per piece. */
function runPieces(VM, pieces) {
  const per = pieces.map(() => []);
  let cur = 0;
  const vm = new VM({
    gfx: null,
    write: (text, kind) => per[cur].push({ text: String(text), kind: kind }),
    readLine: () => null
  });
  pieces.forEach((code, i) => {
    cur = i;
    try { vm.execute(code, false); }
    catch (e) { per[i].push({ text: "Internal error: " + (e && e.message ? e.message : e), kind: "err" }); }
  });
  return per;
}

/* Lines that count when judging: real output and errors, not "x defined" notices or trace chatter. */
function normOut(lines) {
  return lines
    .filter(l => l.kind !== "info" && l.kind !== true)
    .map(l => l.text.replace(/[ \t]+$/g, ""))
    .join("\n").replace(/\n+$/g, "");
}
function textNorm(s) {
  const ls = String(s).replace(/\r/g, "").split("\n").map(l => l.trim());
  while (ls.length && ls[0] === "") ls.shift();
  while (ls.length && ls[ls.length - 1] === "") ls.pop();
  return ls.join("\n");
}

/* The output an exercise expects. */
function expectedOf(VM, q) {
  if (q.expected !== undefined) return q.expected;
  if (q.type === "predict") return normOut(runPieces(VM, [q.before || "", q.code])[1]);
  const mine = q.type === "fill" ? (q.pre || "") + q.solution + (q.post || "") : q.solution;
  return normOut(runPieces(VM, [q.before || "", mine])[1]);
}
function assemble(q, answer) {
  return q.type === "fill" ? (q.pre || "") + answer + (q.post || "") : answer;
}
/* Judge one answer. Returns {ok, lines, got}. */
function judge(VM, q, answer, expected) {
  if (q.type === "predict") {
    return { ok: textNorm(answer) === textNorm(expected), lines: null, got: answer };
  }
  const per = runPieces(VM, [q.before || "", assemble(q, answer)]);
  const got = normOut(per[1]);
  return { ok: textNorm(got) === textNorm(expected) && answer.trim() !== "", lines: per[1], got: got };
}

/* ---------- lesson markup ----------
   Blocks are separated by blank lines.
   @run / @logo / @py / @raku / @out ... @end   fenced code (run = Logo that executes, with output)
   - item                                         bullet list
   > text                                         side note
   ### text                                       sub-heading
   Inline: {{code}}  **bold**  *italic*  */
function inline(s) {
  const spans = [];
  s = s.replace(/\{\{([\s\S]+?)\}\}/g, (m, c) => { spans.push("<code>" + esc(c) + "</code>"); return "\u0001" + (spans.length - 1) + "\u0001"; });
  s = esc(s);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return s.replace(/\u0001(\d+)\u0001/g, (m, i) => spans[+i]);
}
function parseMarkup(src) {
  const lines = String(src).replace(/\r/g, "").replace(/^\n+|\n+$/g, "").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    const f = ln.match(/^@(run|logo|py|raku|out)\s*$/);
    if (f) {
      const body = [];
      i++;
      while (i < lines.length && !/^@end\s*$/.test(lines[i])) { body.push(lines[i]); i++; }
      i++;
      blocks.push({ t: f[1], code: body.join("\n") });
      continue;
    }
    if (/^\s*$/.test(ln)) { i++; continue; }
    if (/^### /.test(ln)) { blocks.push({ t: "h", s: ln.slice(4) }); i++; continue; }
    if (/^- /.test(ln)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) { items.push(lines[i].slice(2)); i++; }
      blocks.push({ t: "ul", items: items });
      continue;
    }
    if (/^> /.test(ln)) {
      const t = [];
      while (i < lines.length && /^> ?/.test(lines[i]) && lines[i].trim() !== "") { t.push(lines[i].replace(/^> ?/, "")); i++; }
      blocks.push({ t: "note", s: t.join(" ") });
      continue;
    }
    const p = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^@(run|logo|py|raku|out)\s*$/.test(lines[i]) && !/^- /.test(lines[i]) && !/^> /.test(lines[i]) && !/^### /.test(lines[i])) { p.push(lines[i]); i++; }
    blocks.push({ t: "p", s: p.join(" ") });
  }
  return blocks;
}

root.LogoCore = { esc, runPieces, normOut, textNorm, expectedOf, assemble, judge, inline, parseMarkup };
if (typeof module !== "undefined" && module.exports) module.exports = root.LogoCore;
})(typeof window !== "undefined" ? window : globalThis);
