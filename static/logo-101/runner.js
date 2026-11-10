/* Runs Logo code and judges exercise answers. Used by the page and by verify.js. */
(function (root) {
  "use strict";
  const DEFINED = /^\S+ defined$/;
  function session(readInputs) {
    let cur = [];
    const inputs = (readInputs || []).slice();
    const vm = new root.LogoVM({
      gfx: null,
      write: (text, kind) => cur.push({ text: String(text), kind }),
      readLine: () => (inputs.length ? inputs.shift() : null)
    });
    return {
      vm,
      run(code) {
        cur = [];
        try { vm.execute(code, false); if (vm.flushLine) vm.flushLine(); }
        catch (e) { cur.push({ text: "Internal error: " + (e && e.message ? e.message : e), kind: "err" }); }
        return cur;
      }
    };
  }
  const norm = (lines, keepDefined) => lines
    .filter(l => l.kind !== "info" && (keepDefined || !DEFINED.test(l.text.trim())))
    .map(l => l.text.replace(/[ \t]+$/g, "")).join("\n").replace(/\n+$/g, "");
  const textNorm = s => {
    const ls = String(s).replace(/\r/g, "").split("\n").map(l => l.trim());
    while (ls.length && ls[0] === "") ls.shift();
    while (ls.length && ls[ls.length - 1] === "") ls.pop();
    return ls.join("\n");
  };
  /* returns {ok, got} */
  function judge(ex, input) {
    if (ex.type === "choice") return { ok: Number(input) === ex.answer };
    if (ex.type === "predict") return { ok: textNorm(input) === textNorm(ex.answer), got: input };
    const s = session(ex.inputs);
    if (ex.before) s.run(ex.before);
    let lines;
    if (ex.type === "fill") {
      lines = s.run(ex.template.replace("___", () => input));
    } else {
      lines = s.run(input).concat(ex.after ? s.run(ex.after) : []);
    }
    const got = norm(lines);
    return { ok: textNorm(got) === textNorm(ex.expect), got };
  }
  root.LogoRun = { session, norm, textNorm, judge };
})(typeof window !== "undefined" ? window : globalThis);
