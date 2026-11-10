/* Offline verifier: node verify.js  -- runs every example/exercise of every lesson through the interpreter. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const dir = path.join(__dirname, "static/logo-101");
const load = f => vm.runInThisContext(fs.readFileSync(path.join(dir, f), "utf8"), { filename: f });
global.window = undefined;
["logo-vm.js", "runner.js", "helpers.js"].forEach(load);
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
fs.readdirSync(path.join(dir, "sections")).sort().filter(f => !only || only.test(f)).forEach(f => load("sections/" + f));
let bad = 0, nex = 0, words = 0;
const fail = (s, m) => { bad++; console.log("FAIL s" + s.id + ": " + m); };
for (const s of LOGO101) {
  const ss = LogoRun.session();
  s.blocks.forEach((b, i) => {
    if (b.html) words += b.html.split(/\s+/).length;
    if (b.t !== "logo") return;
    const lines = ss.run(b.code);
    const got = LogoRun.norm(lines, true), errs = lines.some(l => l.kind === "err");
    if (b.error ? !errs : errs) fail(s, "block " + i + (b.error ? " expected an error" : " errored: " + got));
    if (b.expect !== undefined && LogoRun.textNorm(got.replace(/^\S+ defined\n?/gm, "")) !== LogoRun.textNorm(b.expect)) fail(s, "block " + i + " output mismatch:\n  got:      " + JSON.stringify(got) + "\n  expected: " + JSON.stringify(b.expect));
  });
  if (s.ex.length !== 5) fail(s, "needs exactly 5 exercises, has " + s.ex.length);
  const kinds = s.ex.map(e => e.type);
  if (!kinds.includes("predict") || !kinds.includes("fill") || !kinds.includes("write")) fail(s, "needs predict+fill+write exercises");
  const secs = s.blocks.map(b => b.t).join(",");
  if (!/py/.test(secs) || !/raku/.test(secs)) fail(s, "missing Python/Raku comparisons");
  s.ex.forEach((e, i) => {
    nex++;
    const tag = "ex" + (i + 1) + " (" + e.type + ")";
    if (!e.explain) fail(s, tag + " has no explain");
    if (e.type === "choice") { if (!(e.answer >= 0 && e.answer < e.options.length)) fail(s, tag + " bad answer index"); return; }
    if (e.type === "predict") {
      const x = LogoRun.session(); if (e.before) x.run(e.before);
      const out = LogoRun.norm(x.run(e.code), false);
      if (LogoRun.textNorm(out) !== LogoRun.textNorm(e.answer)) fail(s, tag + " predicted answer wrong.\n  vm:     " + JSON.stringify(out) + "\n  answer: " + JSON.stringify(e.answer));
      return;
    }
    const input = e.type === "fill" ? e.answer : e.solution;
    if (input === undefined) return fail(s, tag + " has no " + (e.type === "fill" ? "answer" : "solution"));
    const r = LogoRun.judge(e, input);
    if (!r.ok) fail(s, tag + " reference answer fails:\n  got:      " + JSON.stringify(r.got) + "\n  expected: " + JSON.stringify(e.expect));
    if (e.type === "write" && e.starter && LogoRun.judge(e, e.starter).ok) fail(s, tag + " starter already passes");
    if (e.type === "write" && LogoRun.judge(e, "").ok) fail(s, tag + " empty input passes");
  });
}
console.log(LOGO101.length + " lessons, " + nex + " exercises, ~" + words + " prose words; " + (bad ? bad + " problems" : "all OK"));
process.exit(bad ? 1 : 0);
