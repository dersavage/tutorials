// Offline validator: node validate.js [section-file ...]
// Runs every exercise solution through the real interpreter, checks Python snippets parse.
const fs = require("fs"), vm = require("vm"), path = require("path"), cp = require("child_process");
const dir = path.join(__dirname, "static/logo-101");
const ctx = { console }; ctx.globalThis = ctx; vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(f, "utf8") + "\n;this.LogoVM=LogoVM;", ctx, { filename: f });
load(path.join(dir, "logo-vm.js")); load(path.join(dir, "core.js"));
let files = process.argv.slice(2);
if (!files.length) files = fs.readdirSync(path.join(dir, "course")).filter(f => f.endsWith(".js")).map(f => path.join(dir, "course", f));
files.forEach(f => vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }));
const C = ctx.COURSE, core = ctx.LogoCore;
let bad = 0, nEx = 0, nPy = 0;
const err = (id, m) => { bad++; console.log("FAIL " + id + ": " + m); };
for (const s of C.sections) {
  const id = s.id;
  const kinds = {};
  if (!s.blocks || s.blocks.length < 6) err(id, "needs >= 6 blocks");
  const seq = s.blocks.map(b => b.t).join(",");
  if (!/logo,py,raku/.test(seq)) err(id, "needs logo,py,raku order");
  if ((seq.match(/logo/g) || []).length < 2) err(id, "needs >= 2 logo snippets");
  // run logo blocks in one VM, flag errors in snippets unless block.err
  const logoCodes = s.blocks.filter(b => b.t === "logo");
  const outs = core.runPieces(logoCodes.map(b => b.code));
  outs.forEach((o, i) => { if (o.some(l => l.kind === "err") && !logoCodes[i].err) err(id, "logo snippet #" + (i + 1) + " errors: " + o.filter(l=>l.kind==="err").map(l=>l.text).join(" | ")); });
  s.blocks.filter(b => b.t === "py").forEach(b => {
    nPy++;
    const r = cp.spawnSync("python3", ["-I", "-c", "import ast,sys;ast.parse(sys.stdin.read())"], { input: b.code });
    if (r.status !== 0) err(id, "python snippet does not parse: " + b.code.slice(0, 50));
  });
  if (!s.exercises || s.exercises.length !== 5) { err(id, "needs exactly 5 exercises"); continue; }
  const types = s.exercises.map(e => e.type);
  if (types.filter(t => t !== "mc").length < 1) err(id, "needs a typed exercise");
  if (types.filter(t => t === "mc").length !== 2 || !types.includes("predict") || !types.includes("fill") || !types.includes("write")) err(id, "expected mix mc,mc,predict,fill,write; got " + types);
  s.exercises.forEach((e, k) => {
    nEx++; const tag = id + " ex" + (k + 1) + "(" + e.type + ")";
    if (!e.explain || !e.hint && e.type !== "mc") err(tag, "needs explain (and hint for typed)");
    if (e.type === "mc") {
      if (!Array.isArray(e.options) || e.options.length < 3 || !(e.answer >= 0 && e.answer < e.options.length)) err(tag, "bad options/answer");
      return;
    }
    const r = core.judge(e, e.solution);
    if (e.type === "predict") { if (!r.ok) err(tag, "solution != real output. real: " + JSON.stringify(core.normOut(r.lines))); }
    else if (!r.ok) err(tag, "solution output " + JSON.stringify(core.normOut(r.lines)) + " != expected " + JSON.stringify(e.expected));
    if (e.type !== "predict" && r.lines.some(l => l.kind === "err") && !/error|don't|doesn't|not enough|too/i.test(e.expected)) err(tag, "solution raised an error");
    // a blank answer must not pass
    if (e.type !== "predict") { const b = core.judge(e, ""); if (b.ok) err(tag, "empty answer passes!"); }
  });
}
console.log((bad ? "\n" + bad + " problem(s). " : "OK. ") + C.sections.length + " sections, " + nEx + " exercises, " + nPy + " python snippets checked.");
process.exit(bad ? 1 : 0);
