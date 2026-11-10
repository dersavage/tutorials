/* Content helpers shared by the browser engine and the offline verifier.
   Section files call S({...}) with blocks and exercises built from these. */
(function (root) {
  "use strict";
  root.LOGO101 = root.LOGO101 || [];
  /* blocks */
  root.P  = html => ({ t: "p", html });                                   // prose (HTML)
  root.L  = (code, o) => Object.assign({ t: "logo", code }, o || {});     // runnable Logo; o.expect = output, o.error = true if it should fail
  root.PY = code => ({ t: "py", code });                                  // Python comparison
  root.RK = code => ({ t: "raku", code });                                // Raku comparison
  root.N  = html => ({ t: "note", html });                                // aside / callout
  /* exercises */
  root.MC = (q, options, answer, explain) => ({ type: "choice", q, options, answer, explain });
  root.PR = (q, o) => Object.assign({ type: "predict", q }, o);           // {before, code, answer, hint, explain}
  root.FI = (q, o) => Object.assign({ type: "fill", q }, o);              // {before, template (with ___), answer, expect, hint, explain}
  root.WR = (q, o) => Object.assign({ type: "write", q }, o);             // {before, starter, after, expect, solution, hint, explain}
  root.S  = sec => { root.LOGO101.push(sec); };
})(typeof window !== "undefined" ? window : globalThis);
