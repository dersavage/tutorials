/* =====================================================================
   A compact UCBLogo-compatible interpreter (subset) for the tutorial sandbox.
   Written for this tutorial and differential-tested against UCBLogo 6.2.4.
   Data model: word = JS string, number = JS number, list = JS array,
   array = LArray.  Booleans are the words "true" / "false".
   ===================================================================== */
(function (root) {
"use strict";

class LogoError extends Error {
  constructor(code, msg, proc) { super(msg); this.code = code; this.msg = msg; this.proc = proc || ""; }
}
class LStop { constructor() {} }
class LOutput { constructor(v) { this.value = v; } }
class LThrow { constructor(tag, value) { this.tag = tag; this.value = value; } }
class LBye {}
class LAbort extends Error { constructor(msg) { super(msg); this.msg = msg; } }
class LArray { constructor(items, origin) { this.items = items; this.origin = origin === undefined ? 1 : origin; } }

const UNSET = { unset: true };
const INFIX = new Set(["+", "-", "*", "/", "=", "<", ">", "<=", ">=", "<>"]);
const PREC = { "=": 1, "<": 1, ">": 1, "<=": 1, ">=": 1, "<>": 1, "+": 2, "-": 2, "*": 3, "/": 3 };
const NUMRE = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

/* ---------- number / word helpers ---------- */
function fmtNum(n) {
  if (Number.isNaN(n)) return "nan";
  if (!Number.isFinite(n)) return n < 0 ? "-inf" : "inf";
  if (n === 0) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  // emulate C's %.15g
  const ex = n.toExponential(14);               // d.dddddddddddddde+X
  let [m, e] = ex.split("e");
  const exp = parseInt(e, 10);
  if (exp < -4 || exp >= 15) {
    if (m.indexOf(".") >= 0) m = m.replace(/0+$/, "").replace(/\.$/, "");
    const sign = exp < 0 ? "-" : "+";
    let digits = String(Math.abs(exp)); if (digits.length < 2) digits = "0" + digits;
    return m + "e" + sign + digits;
  }
  let s = n.toFixed(Math.max(0, 14 - exp));
  if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return s;
}
function isNumeric(x) { return typeof x === "number" || (typeof x === "string" && NUMRE.test(x)); }
function toNumber(x) { return typeof x === "number" ? x : parseFloat(x); }
function isWord(x) { return typeof x === "string" || typeof x === "number"; }
function wordStr(x) { return typeof x === "number" ? fmtNum(x) : String(x).replace(/\u0001([^\u0003]*)\u0003/g, "$1"); }
function isList(x) { return Array.isArray(x); }

function flattenLines(x) {
  if (x && x.__multiline) {
    const out = [];
    for (const y of x) for (const z of (Array.isArray(y) ? y : [y])) out.push(z);
    return out;
  }
  return x;
}
function showItem(x, top) {
  if (Array.isArray(x)) {
    const flat = flattenLines(x);
    const inner = flat.map(i => showItem(i, false)).join(" ");
    return "[" + inner + "]";
  }
  if (x instanceof LArray) return "{" + x.items.map(i => showItem(i, false)).join(" ") + "}";
  return wordStr(x);
}
function printForm(x) {
  if (Array.isArray(x)) return flattenLines(x).map(i => showItem(i, false)).join(" ");
  return showItem(x, true);
}

/* ---------- reader: text -> nested arrays of raw words ----------
   A bracketed list that spans several lines keeps its line structure,
   the way Logo's reader does: each line of the list is a list of its own,
   so that a command inside the list takes the rest of ITS line. */
function readText(text) {
  text = text.replace(/~\s*\n/g, " ");
  const root = { items: [], lines: [] };
  const stack = [root];
  let line = 0, i = 0;
  const n = text.length;
  const cur = () => stack[stack.length - 1];
  while (i < n) {
    const c = text[i];
    if (c === "\n") { line++; i++; continue; }
    if (c === " " || c === "\t" || c === "\r") { i++; continue; }
    if (c === ";") { while (i < n && text[i] !== "\n") i++; continue; }
    if ((c === "(" || c === ")") && stack.length === 1) { cur().items.push(c); cur().lines.push(line); i++; continue; }
    if (c === "[") { const l = { items: [], lines: [] }; cur().items.push(l); cur().lines.push(line); stack.push(l); i++; continue; }
    if (c === "]") {
      if (stack.length > 1) {
        const f = stack.pop();
        const first = f.lines.length ? f.lines[0] : line;
        const last = f.lines.length ? f.lines[f.lines.length - 1] : line;
        if (last > first) {
          // the list spans several lines: group its members by line
          const groups = [];
          for (let k = 0; k < f.lines.length; k++) {
            const ln = f.lines[k];
            if (!groups.length || groups[groups.length - 1].line !== ln) groups.push({ line: ln, items: [] });
            groups[groups.length - 1].items.push(f.items[k]);
          }
          const out = groups.map(g => g.items);
          out.__multiline = true;
          cur().items[cur().items.length - 1] = out;
          cur().lines[cur().lines.length - 1] = first;
        } else {
          cur().items[cur().items.length - 1] = f.items;
          cur().lines[cur().lines.length - 1] = first;
        }
      }
      i++; continue;
    }
    let w = "";
    while (i < n) {
      const d = text[i];
      if (d === "\\" && i + 1 < n) { w += "\\" + text[i + 1]; i += 2; continue; }
      if (d === "|") { let j = i + 1, lit = ""; while (j < n && text[j] !== "|") { lit += text[j]; j++; } w += "\u0001" + lit.replace(/ /g, "\u0002") + "\u0003"; i = j + 1; continue; }
      if (d === " " || d === "\t" || d === "\n" || d === "\r" || d === "[" || d === "]") break;
      if ((d === "(" || d === ")") && stack.length === 1) break;
      if (d === ";") break;
      w += d; i++;
    }
    if (w === "" && i < n) { i++; continue; }
    // a quoted word is data, not a name: mark it so the lexer can tell
    let data = w;
    if (w[0] === '"') {
      /* BUILD PATCH #4: a trailing " closes the word only if it is
         not backslash-escaped. UCBLogo reads  "\  as the one-character word
         " (the tutorial's localmake macro depends on it); the original
         stripped any trailing quote, escaped or not. Un-escaped trailing
         quotes keep the original behaviour, so the corpus agreement is
         unchanged (102), and the localmake session — with its .macro
         definition, as the tutorial presents it — now reproduces. */
      let body = w.slice(1), escapedTail = false, esc = false;
      for (const ch of body) {
        if (esc) { esc = false; escapedTail = (ch === '"'); }
        else { esc = (ch === "\\"); escapedTail = false; }
      }
      const inner = (!escapedTail && body.length && body[body.length - 1] === '"')
        ? body.slice(0, -1) : body;
      /* END BUILD PATCH #4 */
      data = "\u0001" + inner + "\u0003";
    }
    cur().items.push(data);
    cur().lines.push(line);
  }
  // collapse the root
  const out = [];
  for (let k = 0; k < root.items.length; k++) out.push(root.items[k]);
  return out;
}

function unescapeWord(w) {
  return w.replace(/\u0001([^\u0003]*)\u0003/g, (m, s) => s.replace(/\u0002/g, " ")).replace(/\\(.)/g, "$1");
}


/* ---------- split a program into logical lines ----------
   A Logo procedure body is a list of instruction lines, but a bracketed
   list may span several physical lines, and then the whole thing counts
   as one line.  This finds those logical lines. */
function splitLogicalLines(src) {
  const lines = [];
  let buf = "", d = 0, q = false, cm = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    buf += c;
    if (cm) { if (c === "\n") cm = false; continue; }
    if (q) {
      if (c === "\\") { buf += src[++i] || ""; continue; }
      // a quoted word ends at a space, a bracket, a parenthesis, or a newline
      if (c === '"' || c === " " || c === "\t" || c === "\n" || c === "[" || c === "]" ||
          c === "(" || c === ")") q = false;
      else continue;
      if (c === " " || c === "\t") continue;
      if (c === '"') continue;
      // a bracket or a newline that ends a quoted word still counts
    }
    if (c === ";") { cm = true; continue; }
    if (c === '"') { q = true; continue; }
    if (c === "[") d++;
    else if (c === "]") d--;
    if (c === "\n" && d <= 0) {
      // a line ending in a tilde is continued on the next line
      if (/~$/.test(buf.replace(/;.*$/gm, "").replace(/\s+$/, ""))) continue;
      if (buf.trim()) lines.push(buf);
      buf = ""; d = 0;
    }
  }
  if (buf.trim()) lines.push(buf);
  return lines.length ? lines : [""];
}

/* ---------- lexer for runnable lists: items -> tokens ---------- */
function lexItems(items) {
  const toks = [];
  const prevIsOperand = () => {
    const t = toks[toks.length - 1];
    return t && (t.type === "num" || t.type === "quoted" || t.type === "var" || t.type === "list" || t.type === "rparen" || t.type === "name");
  };
  for (const it of items) {
    if (Array.isArray(it)) { toks.push({ type: "list", v: it }); continue; }
    if (typeof it === "string" && it[0] === "\u0001") { toks.push({ type: "quoted", v: unescapeWord(it) }); continue; }
    if (it instanceof LArray) { toks.push({ type: "quoted", v: it }); continue; }
    if (typeof it === "number") { toks.push({ type: "num", v: it }); continue; }
    if (it === "(") { toks.push({ type: "lparen" }); continue; }
    if (it === ")") { toks.push({ type: "rparen" }); continue; }
    if (it[0] === '"') {
      let q = it.slice(1), trail = 0;
      while (q.length > 0 && q[q.length - 1] === ")") { q = q.slice(0, -1); trail++; }
      toks.push({ type: "quoted", v: unescapeWord(q) });
      for (let k = 0; k < trail; k++) toks.push({ type: "rparen" });
      continue;
    }
    lexWord(it, toks);
  }
  return toks;

  function lexWord(w, out) {
    if (w[0] === '"') { out.push({ type: "quoted", v: unescapeWord(w.slice(1)) }); return; }
    if (NUMRE.test(w)) { out.push({ type: "num", v: parseFloat(w) }); return; }
    let i = 0, n = w.length, buf = "";
    const flush = () => {
      if (buf === "") return;
      if (NUMRE.test(buf)) out.push({ type: "num", v: parseFloat(buf) });
      else if (buf[0] === ":") out.push({ type: "var", v: unescapeWord(buf.slice(1)) });
      else out.push({ type: "name", v: unescapeWord(buf) });
      buf = "";
    };
    while (i < n) {
      const c = w[i];
      if (c === "(" || c === ")") { flush(); out.push({ type: c === "(" ? "lparen" : "rparen" }); i++; continue; }
      if (c === "+" || c === "-" || c === "*" || c === "/" || c === "=" || c === "<" || c === ">") {
        // numeric literal like 1e-3 is caught earlier by NUMRE on buf; handle exponent sign
        if ((c === "-" || c === "+") && /^[+-]?(\d+\.?\d*|\.\d+)e$/i.test(buf)) { buf += c; i++; continue; }
        flush();
        let op = c;
        if ((c === "<" || c === ">") && i + 1 < n && (w[i + 1] === "=" || (c === "<" && w[i + 1] === ">"))) { op = c + w[i + 1]; i++; }
        if (op === "-" && out.length === 0 && i === 0 && n > 1) {
          // leading unary minus on an item: -5 (number, handled above) or -:x / -sqrt ...
          out.push({ type: "neg" }); i++; continue;
        }
        if (op === "-" && !prevIsOperandIn(out) ) { out.push({ type: "neg" }); i++; continue; }
        if (op === "-" && i === 0 && n > 1) { out.push({ type: "neg" }); i++; continue; }
        out.push({ type: "op", v: op }); i++; continue;
      }
      buf += c; i++;
    }
    flush();
  }
  function prevIsOperandIn(out) {
    const t = out[out.length - 1];
    if (!t) return false;
    return t.type === "num" || t.type === "quoted" || t.type === "var" || t.type === "list" || t.type === "rparen" || t.type === "name";
  }
}

/* ===================================================================== */
class LogoVM {
  constructor(opts) {
    opts = opts || {};
    this.write = opts.write || (() => {});          // write(text, endsLine)
    this.gfx = opts.gfx || null;                    // turtle graphics backend
    this.readLine = opts.readLine || (() => null);
    this.maxDepth = opts.maxDepth || 600;
    this.procs = new Map();
    this.globals = new Map();
    this.allowGetSet = true;                       /* BUILD PATCH: ALLOWGETSET defaults true, as in UCBLogo 6.2 */
    this.scopes = [];
    this.proplists = new Map();
    this.repStack = [];
    this.slotStack = [];
    this.tokCache = new WeakMap();
    this.depth = 0;
    this.steps = 0; this.maxSteps = opts.maxSteps || 4000000;
    this.lastError = [];
    this.gensymN = 0;
    this.seed = 12345;
    this.testStack = [{ v: null }];
    this.lineBuf = "";
    this.catchTags = [];
    /* (rest of constructor continues below) */
    this.PRIM = Object.create(null);
    this.initPrims();
    this.ALIAS = {};
  }

  /* ---------- output ---------- */
  emit(text, nl) {
    if (nl) { this.write(this.lineBuf + text, true); this.lineBuf = ""; }
    else this.lineBuf += text;
  }
  /* write one line of output: to the open output file if there is one */
  output(text) {
    if (this.writerName && this.files && this.files.has(this.writerName)) {
      const f = this.files.get(this.writerName);
      f.content += text + "\n";
      return;
    }
    this.write(text, "out");
  }
  /* BUILD PATCH: type prints without ending the line (the runner joins "type" chunks onto the next line). */
  typeOutput(text) {
    if (this.writerName && this.files && this.files.has(this.writerName)) { this.files.get(this.writerName).content += text; return; }
    this.write(text, "type");
  }
  flushLine() { if (this.lineBuf) { this.write(this.lineBuf, true); this.lineBuf = ""; } }

  /* ---------- variables ---------- */
  getVar(name) {
    const k = name.toLowerCase();
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const s = this.scopes[i];
      if (s.has(k)) { const v = s.get(k); if (v === UNSET) break; return v; }
    }
    if (this.globals.has(k)) return this.globals.get(k);
    throw new LogoError(11, name + " has no value");
  }
  setVar(name, val) {
    const k = name.toLowerCase();
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(k)) { this.scopes[i].set(k, val); return; }
    }
    this.globals.set(k, val);
  }
  declareLocal(name) {
    if (!this.scopes.length) { return; }
    this.scopes[this.scopes.length - 1].set(String(name).toLowerCase(), UNSET);
  }

  /* ---------- tokenizing / running ---------- */
  tokensOf(list) {
    let t = this.tokCache.get(list);
    if (!t) { t = lexItems(list); this.tokCache.set(list, t); }
    return t;
  }
  runList(list, allowValue, strict) {
    // a list of lines (a bracketed list that spanned several lines) is run
    // one line at a time, so that a command takes the rest of its own line
    if (list && list.__multiline) {
      let last;
      for (let i = 0; i < list.length; i++) {
        const v = this.runTokens(this.tokensOf(list[i]), allowValue && i === list.length - 1, strict);
        if (v !== undefined) last = v;
      }
      return last;
    }
    return this.runTokens(this.tokensOf(list), allowValue, strict);
  }
  runTokens(tokens, allowValue, strict) {
    const cur = { t: tokens, p: 0 };
    let last;
    while (cur.p < tokens.length) {
      const v = this.parseExpr(cur, 1, "");
      if (v !== undefined) {
        // a value in the middle of a list of instructions is an error;
        // a value at the end is the value of the list, and is simply
        // discarded when the list is run as a command
        if (cur.p < tokens.length) { if (typeof LOGDBG5!=="undefined") LOGDBG5(cur, tokens, v); throw new LogoError(8, "You don't say what to do with " + showItem(v, true)); }
        last = v;
        if (strict) throw new LogoError(8, "You don't say what to do with " + showItem(v, true));
      }
    }
    return allowValue ? last : undefined;
  }

  /* ---------- expression parser/evaluator ---------- */
  /* continue an infix expression whose left value is already known */
  parseInfixTail(cur, left, owner) {
    for (;;) {
      const t = cur.t[cur.p];
      if (!t || t.type !== "op") break;
      const prec = PREC[t.v];
      if (prec === undefined) break;
      cur.p++;
      if (left === undefined) throw new LogoError(6, this.lastCalled + " didn't output to " + t.v);
      const right = this.parseExpr(cur, prec + 1, t.v);
      if (right === undefined) throw new LogoError(6, this.lastCalled + " didn't output to " + t.v);
      left = this.infix(t.v, left, right);
    }
    return left;
  }
  parseExpr(cur, minPrec, owner) {
    if (++this.steps > this.maxSteps) throw new LAbort("Stopped: the sandbox gave up after too many steps (is there an infinite loop?)");
    // a list is data: it cannot be the left operand of an infix operator
    if (cur.t[cur.p] && cur.t[cur.p].type === "list") {
      cur.p++;
      return cur.t[cur.p - 1].v;
    }
    let left = this.parseUnary(cur, owner);
    if (this.lastClosed) return left;
    for (;;) {
      const t = cur.t[cur.p];
      if (!t || t.type !== "op") break;
      const prec = PREC[t.v];
      if (prec < minPrec) break;
      cur.p++;
      if (left === undefined) throw new LogoError(6, this.lastCalled + " didn't output to " + t.v);
      const right = this.parseExpr(cur, prec + 1, t.v);
      if (right === undefined) throw new LogoError(6, this.lastCalled + " didn't output to " + t.v);
      left = this.infix(t.v, left, right);
    }
    return left;
  }
  infix(op, a, b) {
    switch (op) {
      case "+": return this.num(a, "+") + this.num(b, "+");
      case "-": return this.num(a, "-") - this.num(b, "-");
      case "*": return this.num(a, "*") * this.num(b, "*");
      case "/": { const d = this.num(b, "/"); const n = this.num(a, "/"); if (d === 0) throw new LogoError(4, "/ doesn't like 0 as input"); return n / d; }
      case "=": return this.equalp(a, b) ? "true" : "false";
      case "<>": return this.equalp(a, b) ? "false" : "true";
      case "<": return this.num(a, "<") < this.num(b, "<") ? "true" : "false";
      case ">": return this.num(a, ">") > this.num(b, ">") ? "true" : "false";
      case "<=": return this.num(a, "<=") <= this.num(b, "<=") ? "true" : "false";
      case ">=": return this.num(a, ">=") >= this.num(b, ">=") ? "true" : "false";
    }
  }
  parseUnary(cur, owner) {
    const t = cur.t[cur.p];
    if (t && t.type === "neg") {
      cur.p++;
      const v = this.parseUnary(cur, owner);
      if (v === undefined) throw new LogoError(6, this.lastCalled + " didn't output to -");
      return -this.num(v, "minus");
    }
    return this.parsePrimary(cur, owner);
  }
  parsePrimary(cur, owner) {
    const t = cur.t[cur.p];
    if (!t) throw new LogoError(5, "not enough inputs to " + (owner || "?"));
    cur.p++;
    this.lastClosed = false;
    switch (t.type) {
      case "num": return t.v;
      case "quoted": return t.v;
      case "list": this.lastClosed = true; return t.v;
      case "var": return this.getVar(t.v);
      case "lparen": {
        const nx = cur.t[cur.p];
        const nx2 = cur.t[cur.p + 1];
        let zeroArgThenInfix = false;
        if (nx && nx.type === "name" && nx2 && nx2.type === "op" && this.isCallable(nx.v)) {
          const kk = this.canon(nx.v), pr = this.procs.get(kk), sp = pr ? null : this.PRIM[kk];
          const mx = pr ? pr.params.length + (pr.rest ? 99 : 0) : (sp && sp.max !== undefined ? sp.max : sp ? sp.n : 1);
          zeroArgThenInfix = (mx === 0);
        }
        if (nx && nx.type === "name" && !/^\?\d*$/.test(nx.v) && this.isCallable(nx.v) && !zeroArgThenInfix) {
          cur.p++;
          let v = this.callNamed(nx.v, cur, true);
          v = this.parseInfixTail(cur, v, owner);
          const cl = cur.t[cur.p];
          if (!cl || cl.type !== "rparen") throw new LogoError(9, "too many inputs to " + nx.v);
          cur.p++;
          return v;
        }
        let v = this.parseExpr(cur, 1, owner);
        const cl = cur.t[cur.p];
        if (!cl || cl.type !== "rparen") throw new LogoError(9, "missing ')'");
        cur.p++;
        return v;
      }
      case "rparen": throw new LogoError(9, "unexpected ')'");
      case "op": throw new LogoError(5, "not enough inputs to " + (owner || t.v));
      case "name": {
        if (/^\?\d*$/.test(t.v)) return this.slotValue(t.v);
        if (t.v === "#") return this.slotValue("#");
        return this.callNamed(t.v, cur, false);
      }
    }
    throw new LogoError(12, "I don't know how to " + (t.v || t.type));
  }
  slotValue(name) {
    if (name === "#") return this.cascadeCount || 0;
    const sl = this.slotStack[this.slotStack.length - 1];
    if (!sl) throw new LogoError(11, "? has no value");
    const idx = name === "?" ? 0 : parseInt(name.slice(1), 10) - 1;
    if (idx >= sl.length) throw new LogoError(11, name + " has no value");
    return sl[idx];
  }
  canon(name) {
    const k = name.toLowerCase();
    return this.ALIAS[k] || k;
  }
  isCallable(name) { const k = this.canon(name); return this.procs.has(k) || !!this.PRIM[k]; }

  callNamed(name, cur, paren) {
    const k = this.canon(name);
    const proc = this.procs.get(k);
    let spec, nargs, minArgs, maxArgs;
    if (proc) { nargs = proc.params.length; minArgs = nargs; maxArgs = nargs + (proc.rest ? 99 : 0); spec = proc; }
    else {
      spec = this.PRIM[k];
      if (!spec) {
        /* BUILD PATCH: getter/setter notation (ALLOWGETSET).
           An unknown name is first tried as SETFOO for an existing
           variable foo, then as a getter for an existing variable —
           exactly UCBLogo 6.2's resolution order, and only while the
           variable allowgetset is true. */
        const r = this.tryGetSet(k, name, cur);
        if (r !== this.NOGETSET) return r;
        /* END BUILD PATCH */
        throw new LogoError(12, "I don't know how to " + name);
      }
      nargs = spec.n; minArgs = spec.min !== undefined ? spec.min : spec.n; maxArgs = spec.max !== undefined ? spec.max : spec.n;
    }
    const args = [];
    if (paren) {
      while (cur.p < cur.t.length && cur.t[cur.p].type !== "rparen") {
        // an infix operator belongs to the enclosing expression, not to this call
        if (cur.t[cur.p].type === "op") break;
        const v = this.parseExpr(cur, 1, name);
        if (v === undefined) throw new LogoError(6, this.lastCalled + " didn't output to " + name);
        args.push(v);
      }
      if (args.length < minArgs) throw new LogoError(5, "not enough inputs to " + name);
      if (args.length > maxArgs) { if (typeof LOGDBG4!=="undefined") LOGDBG4(name, args, maxArgs, cur.t[cur.p]); throw new LogoError(9, "too many inputs to " + name); }
      if (cur.t[cur.p] && cur.t[cur.p].type === "op") {
        // the call is finished; an infix operator follows and belongs to the
        // expression that contains this call
        return this.invoke(k, name, proc, spec, args);
      }
    } else {
      // a variadic command (one whose maximum is larger than its nominal
      // count) takes as many inputs as are left on its line
      const variadic = spec && spec.max !== undefined && spec.max > spec.n && !spec.exact;
      if (variadic) {
        while (cur.p < cur.t.length && args.length < spec.max) {
          const v = this.parseExpr(cur, 1, name);
          if (v === undefined) { if (typeof LOGDBG !== "undefined") LOGDBG(name, cur); throw new LogoError(6, this.lastCalled + " didn't output to " + name); }
          args.push(v);
        }
      } else {
        for (let i = 0; i < nargs; i++) {
          if (cur.p >= cur.t.length) throw new LogoError(5, "not enough inputs to " + name);
          const v = this.parseExpr(cur, 1, name);
          if (v === undefined) throw new LogoError(6, this.lastCalled + " didn't output to " + name);
          args.push(v);
        }
      }
    }
    return this.invoke(k, name, proc, spec, args);
  }

  invoke(k, name, proc, spec, args) {
    this.lastCalled = name;
    if (proc) {
      if (this.traced && this.traced.has(k)) {
        this.write(name + (args.length ? " " + args.map(a => showItem(a, true)).join(" ") : ""), "info");
      }
      const r = this.callUser(proc, args, name);
      this.lastCalled = name;
      return r;
    }
    try {
      const r = spec.fn.apply(this, args);
      this.lastCalled = name;
      return r;
    } catch (e) {
      if (e instanceof LogoError && !e.proc) e.proc = "";
      throw e;
    }
  }
  callUser(proc, args, name) {
    if (proc.primitive) {
      const spec = this.PRIM[proc.primitive];
      if (!spec) throw new LogoError(12, "I don't know how to " + proc.primitive);
      return spec.fn.apply(this, args);
    }
    if (this.depth >= this.maxDepth) throw new LogoError(2, "Out of space (recursion deeper than " + this.maxDepth + " levels in the sandbox)");
    const scope = new Map();
    proc.params.forEach((p, i) => scope.set(p, args[i]));
    if (proc.rest) scope.set(proc.rest, args.slice(proc.params.length));
    this.scopes.push(scope);
    this.testStack.push({ v: null });
    this.depth++;
    let result;
    try { result = this.execBody(proc, name); }
    finally { this.depth--; this.scopes.pop(); this.testStack.pop(); }
    if (proc.macro) {
      if (!Array.isArray(result)) throw new LogoError(4, name + " didn't output a list");
      return this.runList(result, true);
    }
    return result;
  }
  execBody(proc, name) {
    try {
      const lines = proc.lineTokens || [proc.tokens];
      const stepping = this.stepped && this.stepped.has(String(name).toLowerCase());
      for (let i = 0; i < lines.length; i++) {
        if (stepping) {
          const src = (proc.lines && proc.lines[i]) || "";
          this.write(src ? src.trim() : "", "info");
        }
        this.runTokens(lines[i], i === lines.length - 1);
      }
    } catch (e) {
      if (e instanceof LOutput) {
        if (this.traced && this.traced.has(name.toLowerCase())) this.write(name + " outputs " + showItem(e.value, true), "info");
        return e.value;
      }
      if (e instanceof LStop) {
        if (this.traced && this.traced.has(name.toLowerCase())) this.write(name + " stops", "info");
        return undefined;
      }
      if (e instanceof LogoError && !e.proc) e.proc = name;
      throw e;
    }
    return undefined;
  }


  /* ---------- definitions ---------- */
  defineProc(headerLine, bodyLines, isMacro) {
    const items = readText(headerLine);
    const name = String(items[0]);
    const lname = name.toLowerCase();
    if (this.PRIM[this.canon(lname)] && !this.redefp) throw new LogoError(22, name + " is a primitive");
    const params = []; let rest = null;
    for (let i = 1; i < items.length; i++) {
      const it = items[i];
      if (typeof it === "string" && it[0] === ":") params.push(it.slice(1).toLowerCase());
      else if (Array.isArray(it) && typeof it[0] === "string" && it[0][0] === ":" && it.length === 1) rest = it[0].slice(1).toLowerCase();
    }
    const src = bodyLines.join("\n");
    const tokens = lexItems(readText(src));
    // a Logo procedure body is a list of instruction lines, and a command
    // takes the rest of ITS line, so we keep the lines apart
    const lineTokens = splitLogicalLines(src).map(l => lexItems(readText(l)));
    this.procs.set(lname, { name, params, rest, tokens, lineTokens, macro: !!isMacro, header: headerLine.trim(), lines: bodyLines.slice() });
    return name;
  }

  /* run a whole text: handles TO...END and top-level instructions */
  execute(text, echo) {
    const lines = text.split("\n");
    let top = [];
    const runTop = () => {
      if (!top.length) return;
      const src = top.join("\n"); top = [];
      this.runToplevel(src);
    };
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      const m = /^\s*(to|\.macro)\s+(\S.*)$/i.exec(ln);
      if (m) {
        runTop();
        const body = []; let j = i + 1, closed = false;
        for (; j < lines.length; j++) {
          if (/^\s*end\s*$/i.test(lines[j])) { closed = true; break; }
          body.push(lines[j]);
        }
        try {
          const nm = this.defineProc(m[2], body, /^\.macro$/i.test(m[1]));
          this.emit(nm + " defined", true);
        } catch (e) { this.reportError(e); }
        i = closed ? j : j - 1;
        continue;
      }
      top.push(ln);
    }
    runTop();
  }
  runToplevel(src) {
    if (!src.trim()) return;
    this.scopes = []; this.depth = 0; this.slotStack = []; this.repStack = []; this.steps = 0;
    if (!this.traced) this.traced = new Set();
    if (!this.stepped) this.stepped = new Set();
    try {
      for (const line of splitLogicalLines(src)) {
        this.runList(readText(line), false, true);
      }
    } catch (e) {
      this.reportError(e);
    }
    this.flushLine();
  }
  reportError(e) {
    this.flushLine();
    if (e instanceof LogoError) {
      this.write(e.msg + (e.proc ? " in " + e.proc : ""), "err");
    } else if (e instanceof LThrow) {
      if (String(e.tag).toLowerCase() === "toplevel") return;
      if (String(e.tag).toLowerCase() === "error") { this.write("Stopped.", "err"); return; }
      this.write("Can't find catch tag for " + e.tag, "err");
    } else if (e instanceof LStop) {
      this.write("Can only use STOP inside a procedure", "err");
    } else if (e instanceof LOutput) {
      this.write("Can only use OUTPUT inside a procedure", "err");
    } else if (e instanceof LAbort) {
      this.write(e.msg, "err");
    } else if (e instanceof LBye) {
      this.write("Goodbye.", "info");
    } else if (e instanceof RangeError) {
      this.write("Out of space (stack overflow in the sandbox)", "err");
    } else {
      this.write("Internal error: " + (e && e.message ? e.message : e), "err");
    }
  }

  /* ---------- type helpers ---------- */
  num(x, who) {
    if (typeof x === "number") return x;
    if (typeof x === "string" && NUMRE.test(x)) return parseFloat(x);
    throw new LogoError(4, who + " doesn't like " + showItem(x, true) + " as input");
  }
  int(x, who) {
    const n = this.num(x, who);
    return n;
  }
  bool(x, who) {
    if (x === "true" || x === true) return true;
    if (x === "false" || x === false) return false;
    if (typeof x === "string") { const l = x.toLowerCase(); if (l === "true") return true; if (l === "false") return false; }
    throw new LogoError(4, who + " doesn't like " + showItem(x, true) + " as input");
  }
  list(x, who) {
    if (Array.isArray(x)) return x;
    throw new LogoError(4, who + " doesn't like " + showItem(x, true) + " as input");
  }
  word(x, who) {
    if (isWord(x)) return wordStr(x);
    throw new LogoError(4, who + " doesn't like " + showItem(x, true) + " as input");
  }
  equalp(a, b) {
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!(Array.isArray(a) && Array.isArray(b)) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!this.equalp(a[i], b[i])) return false;
      return true;
    }
    if (a instanceof LArray || b instanceof LArray) return a === b;
    if (isNumeric(a) && isNumeric(b)) return toNumber(a) === toNumber(b);
    return wordStr(a).toLowerCase() === wordStr(b).toLowerCase();
  }
  truth(b) { return b ? "true" : "false"; }

  /* ---------- templates ---------- */
  applyTemplate(tmpl, args, who) {
    if (Array.isArray(tmpl)) {
      if (tmpl.length >= 1 && Array.isArray(tmpl[0]) && tmpl.length >= 2) {
        // [[x y] body...]  named-parameter lambda
        const params = tmpl[0].map(p => String(p).replace(/^:/, "").toLowerCase());
        const scope = new Map();
        params.forEach((p, i) => scope.set(p, args[i]));
        this.scopes.push(scope);
        try { return this.runList(tmpl.slice(1), true); }
        finally { this.scopes.pop(); }
      }
      this.slotStack.push(args);
      try { return this.runList(tmpl, true); }
      finally { this.slotStack.pop(); }
    }
    const name = wordStr(tmpl);
    const k = this.canon(name);
    const proc = this.procs.get(k);
    const spec = proc || this.PRIM[k];
    if (!spec) throw new LogoError(12, "I don't know how to " + name);
    const np = proc ? proc.params.length : spec.n;
    const mn = proc ? np : (spec.min !== undefined ? spec.min : spec.n);
    const mx = proc ? np : (spec.max !== undefined ? spec.max : spec.n);
    const use = args.slice(0, Math.max(mx > 20 ? args.length : np, 0));
    if (use.length < mn) throw new LogoError(5, "not enough inputs to " + name);
    return this.invoke(k, name, proc, proc ? proc : spec, use);
  }
  tmplOut(tmpl, args, who) {
    return this.applyTemplate(tmpl, args, who);
  }

  /* ---------- random ---------- */
  rnd() {
    // mulberry32
    let t = (this.seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /* ---------- primitives ---------- */
  initPrims() {
    const P = this.PRIM, self = this;
    const def = (names, n, fn, extra) => {
      const spec = Object.assign({ n, fn }, extra || {});
      names.split(" ").forEach(nm => { P[nm] = spec; });
    };
    const A = (x) => x;

    /* --- output --- */
    def("print pr", 1, function (x) { this.output(printForm(x)); }, { min: 0, max: 99 });
    P["print"].fn = P["pr"].fn = function () { this.output(Array.prototype.map.call(arguments, printForm).join(" ")); };
    def("type", 1, function () { this.typeOutput(Array.prototype.map.call(arguments, printForm).join("")); }, { min: 0, max: 99 });
    def("show", 1, function () { this.output(Array.prototype.map.call(arguments, x => showItem(x, true)).join(" ")); }, { min: 0, max: 99 });
    def("readlist rl", 0, function () {
      if (this.readerName && this.files && this.files.has(this.readerName)) {
        const f = this.files.get(this.readerName);
        const rest = f.content.slice(f.pos);
        const nl = rest.indexOf("\n");
        const line = nl < 0 ? rest : rest.slice(0, nl);
        f.pos += line.length + (nl < 0 ? 0 : 1);
        return readText(line);
      }
      const s = this.readLine(); if (s === null || s === undefined) return []; const r = readText(String(s)); return r;
    });
    def("readword rw", 0, function () {
      if (this.readerName && this.files && this.files.has(this.readerName)) {
        const f = this.files.get(this.readerName);
        const rest = f.content.slice(f.pos);
        const nl = rest.indexOf("\n");
        const line = nl < 0 ? rest : rest.slice(0, nl);
        f.pos += line.length + (nl < 0 ? 0 : 1);
        return line;
      }
      const s = this.readLine(); if (s === null || s === undefined) return []; return String(s);
    });
    def("cleartext ct", 0, function () { if (this.gfx && this.gfx.clearText) this.gfx.clearText(); });
    def("wait", 1, function () {});
    def("bye", 0, function () { throw new LBye(); });
    def("pause", 0, function () { this.write("(the sandbox cannot pause; continuing)", "info"); }, { min: 0, max: 1 });

    /* --- constructors --- */
    def("word", 2, function () { return Array.prototype.map.call(arguments, (x) => this.word(x, "word")).join(""); }, { min: 0, max: 99 });
    def("list", 2, function () { return Array.prototype.slice.call(arguments); }, { min: 0, max: 99 });
    def("sentence se", 2, function () {
      const out = [];
      for (const a of arguments) { if (Array.isArray(a)) out.push(...a); else out.push(a); }
      return out;
    }, { min: 0, max: 99 });
    def("fput", 2, function (x, l) {
      if (Array.isArray(l)) return [x, ...l];
      if (isWord(l) && isWord(x) && wordStr(x).length === 1) return wordStr(x) + wordStr(l);
      throw new LogoError(4, "fput doesn't like " + showItem(l, true) + " as input");
    });
    def("lput", 2, function (x, l) {
      if (Array.isArray(l)) return [...l, x];
      if (isWord(l) && isWord(x) && wordStr(x).length === 1) return wordStr(l) + wordStr(x);
      throw new LogoError(4, "lput doesn't like " + showItem(l, true) + " as input");
    });
    def("combine", 2, function (a, b) { return Array.isArray(b) ? [a, ...b] : this.word(a, "combine") + this.word(b, "combine"); });
    def("reverse", 1, function (x) {
      if (Array.isArray(x)) return x.slice().reverse();
      return wordStr(this.word(x, "reverse")).split("").reverse().join("");
    });
    def("remove", 2, function (x, l) {
      if (Array.isArray(l)) return l.filter(i => !this.equalp(i, x));
      return wordStr(l).split("").filter(c => !this.equalp(c, x)).join("");
    });
    def("remdup", 1, function (l) {
      const seen = [], out = [];
      const arr = Array.isArray(l) ? l : wordStr(l).split("");
      // Logo keeps the LAST occurrence of each duplicate
      for (let i = 0; i < arr.length; i++) {
        let dup = false;
        for (let j = i + 1; j < arr.length; j++) if (this.equalp(arr[i], arr[j])) { dup = true; break; }
        if (!dup) out.push(arr[i]);
      }
      return Array.isArray(l) ? out : out.join("");
    });
    def("pick", 1, function (l) { const a = Array.isArray(l) ? l : wordStr(l).split(""); if (!a.length) throw new LogoError(4, "pick doesn't like [] as input"); return a[Math.floor(this.rnd() * a.length)]; });
    def("array", 1, function (n, o) { return new LArray(new Array(Math.max(0, this.num(n, "array"))).fill([]), o === undefined ? 1 : this.num(o, "array")); }, { min: 1, max: 2 });
    def("listtoarray", 1, function (l) { return new LArray(this.list(l, "listtoarray").slice(), 1); }, { min: 1, max: 2 });
    def("arraytolist", 1, function (a) { if (!(a instanceof LArray)) throw new LogoError(4, "arraytolist doesn't like " + showItem(a, true) + " as input"); return a.items.slice(); });
    def("setitem", 3, function (i, a, v) {
      if (!(a instanceof LArray)) throw new LogoError(4, "setitem doesn't like " + showItem(a, true) + " as input");
      const k = this.num(i, "setitem") - a.origin;
      if (!Number.isInteger(k) || k < 0 || k >= a.items.length) throw new LogoError(4, "setitem doesn't like " + wordStr(i) + " as input");
      a.items[k] = v;
    });
    def("gensym", 0, function () { return "g" + (++this.gensymN); });

    /* --- selectors --- */
    const seq = (x, who) => {
      if (Array.isArray(x)) return x;
      if (x instanceof LArray) return x.items;
      if (isWord(x)) return wordStr(x).split("");
      throw new LogoError(4, who + " doesn't like " + showItem(x, true) + " as input");
    };
    const bad = (who, x) => new LogoError(7, who + " doesn't like " + (x === "" ? "||" : showItem(x, true)) + " as input");
    def("first", 1, function (x) { const s = seq(x, "first"); if (!s.length) throw bad("first", x); return s[0]; });
    def("last", 1, function (x) { const s = seq(x, "last"); if (!s.length) throw bad("last", x); return s[s.length - 1]; });
    def("butfirst bf", 1, function (x) { const s = seq(x, "butfirst"); if (!s.length) throw bad("butfirst", x); return Array.isArray(x) ? x.slice(1) : s.slice(1).join(""); });
    def("butlast bl", 1, function (x) { const s = seq(x, "butlast"); if (!s.length) throw bad("butlast", x); return Array.isArray(x) ? x.slice(0, -1) : s.slice(0, -1).join(""); });
    def("firsts", 1, function (l) { return this.list(l, "firsts").map(i => P["first"].fn.call(this, i)); });
    def("butfirsts bfs", 1, function (l) { return this.list(l, "butfirsts").map(i => P["butfirst"].fn.call(this, i)); });
    def("item", 2, function (n, x) {
      const k = this.num(n, "item");
      const origin = x instanceof LArray ? x.origin : 1;
      const s = seq(x, "item");
      const idx = k - origin;
      if (!Number.isInteger(idx) || idx < 0 || idx >= s.length) throw new LogoError(4, "item doesn't like " + wordStr(n) + " as input");
      return s[idx];
    });
    def("count", 1, function (x) { return seq(x, "count").length; });
    def("emptyp empty?", 1, function (x) { return this.truth((Array.isArray(x) && x.length === 0) || x === ""); });
    def("equalp", 2, function (a, b) { return this.truth(this.equalp(a, b)); });
    def("notequalp", 2, function (a, b) { return this.truth(!this.equalp(a, b)); });
    def("beforep", 2, function (a, b) { return this.truth(wordStr(a).toLowerCase() < wordStr(b).toLowerCase()); });
    def("wordp word?", 1, function (x) { return this.truth(isWord(x)); });
    def("listp list?", 1, function (x) { return this.truth(Array.isArray(x)); });
    def("arrayp", 1, function (x) { return this.truth(x instanceof LArray); });
    def("numberp", 1, function (x) { return this.truth(isNumeric(x)); });
    def("memberp", 2, function (x, l) {
      if (Array.isArray(l)) return this.truth(l.some(i => this.equalp(i, x)));
      if (isWord(l) && isWord(x) && wordStr(x).length === 1) return this.truth(wordStr(l).toLowerCase().indexOf(wordStr(x).toLowerCase()) >= 0);
      return "false";
    });
    def("member", 2, function (x, l) {
      if (Array.isArray(l)) { const i = l.findIndex(e => this.equalp(e, x)); return i < 0 ? [] : l.slice(i); }
      const s = wordStr(l); const i = s.toLowerCase().indexOf(wordStr(x).toLowerCase());
      return i < 0 || wordStr(x).length !== 1 ? "" : s.slice(i);
    });
    def("substringp", 2, function (a, b) { return this.truth(wordStr(b).toLowerCase().indexOf(wordStr(a).toLowerCase()) >= 0); });
    def("ascii", 1, function (c) { const s = wordStr(c); if (s.length !== 1) throw new LogoError(4, "ascii doesn't like " + s + " as input"); return s.charCodeAt(0); });
    def("char", 1, function (n) { return String.fromCharCode(this.num(n, "char")); });
    def("uppercase", 1, function (w) { return this.word(w, "uppercase").toUpperCase(); });
    def("lowercase", 1, function (w) { return this.word(w, "lowercase").toLowerCase(); });

    /* --- arithmetic --- */
    def("sum", 2, function () { let s = 0; for (const a of arguments) s += this.num(a, "sum"); return s; }, { min: 0, max: 99 });
    def("difference", 2, function (a, b) { return this.num(a, "difference") - this.num(b, "difference"); });
    def("minus", 1, function (a) { return -this.num(a, "minus"); });
    def("product", 2, function () { let s = 1; for (const a of arguments) s *= this.num(a, "product"); return s; }, { min: 0, max: 99 });
    def("quotient", 2, function (a, b) { const d = this.num(b, "quotient"); if (d === 0) throw new LogoError(4, "quotient doesn't like 0 as input"); return this.num(a, "quotient") / d; });
    def("remainder", 2, function (a, b) { const d = this.num(b, "remainder"); if (d === 0) throw new LogoError(4, "remainder doesn't like 0 as input"); return this.num(a, "remainder") % d; });
    def("modulo", 2, function (a, b) { const d = this.num(b, "modulo"); if (d === 0) throw new LogoError(4, "modulo doesn't like 0 as input"); const r = this.num(a, "modulo") % d; return (r !== 0 && (r < 0) !== (d < 0)) ? r + d : r; });
    def("int", 1, function (a) { return Math.trunc(this.num(a, "int")); });
    def("round", 1, function (a) { const x = this.num(a, "round"); return x < 0 ? -Math.round(-x) : Math.round(x); });
    def("sqrt", 1, function (a) { const x = this.num(a, "sqrt"); if (x < 0) throw new LogoError(4, "sqrt doesn't like " + wordStr(a) + " as input"); return Math.sqrt(x); });
    def("power", 2, function (a, b) { return Math.pow(this.num(a, "power"), this.num(b, "power")); });
    def("exp", 1, function (a) { return Math.exp(this.num(a, "exp")); });
    def("ln", 1, function (a) { return Math.log(this.num(a, "ln")); });
    def("log10", 1, function (a) { return Math.log10(this.num(a, "log10")); });
    const rad = (d) => d * Math.PI / 180;
    const clean = (v) => { const r = Math.round(v * 1e12) / 1e12; return Math.abs(v - r) < 1e-13 ? r : v; };
    def("sin", 1, function (a) { return clean(Math.sin(rad(this.num(a, "sin")))); });
    def("cos", 1, function (a) { return clean(Math.cos(rad(this.num(a, "cos")))); });
    def("tan", 1, function (a) { return clean(Math.tan(rad(this.num(a, "tan")))); });
    def("radsin", 1, function (a) { return Math.sin(this.num(a, "radsin")); });
    def("radcos", 1, function (a) { return Math.cos(this.num(a, "radcos")); });
    def("arctan", 1, function (a, b) {
      if (b === undefined) return Math.atan(this.num(a, "arctan")) * 180 / Math.PI;
      return Math.atan2(this.num(b, "arctan"), this.num(a, "arctan")) * 180 / Math.PI;
    }, { min: 1, max: 2 });
    def("random", 1, function (a, b) {
      if (b === undefined) { const n = this.num(a, "random"); return Math.floor(this.rnd() * n); }
      const lo = this.num(a, "random"), hi = this.num(b, "random");
      return lo + Math.floor(this.rnd() * (hi - lo + 1));
    }, { min: 1, max: 2 });
    def("rerandom", 0, function (s) { this.seed = s === undefined ? 12345 : Math.floor(this.num(s, "rerandom")); }, { min: 0, max: 1 });
    def("form", 3, function (n, w, p) { const x = this.num(n, "form"), wd = this.num(w, "form"), pr = this.num(p, "form"); let t = pr >= 0 ? x.toFixed(pr) : fmtNum(x); return t.padStart(wd, " "); });
    def("iseq", 2, function (a, b) { const x = this.num(a, "iseq"), y = this.num(b, "iseq"); const o = []; if (x <= y) for (let i = x; i <= y; i++) o.push(i); else for (let i = x; i >= y; i--) o.push(i); return o; });
    def("rseq", 3, function (a, b, c) { const x = this.num(a, "rseq"), y = this.num(b, "rseq"), n = this.num(c, "rseq"); const o = []; if (n === 1) return [x]; for (let i = 0; i < n; i++) o.push(x + (y - x) * i / (n - 1)); return o; });
    def("lessp", 2, function (a, b) { return this.truth(this.num(a, "lessp") < this.num(b, "lessp")); });
    def("greaterp", 2, function (a, b) { return this.truth(this.num(a, "greaterp") > this.num(b, "greaterp")); });
    def("lessequalp", 2, function (a, b) { return this.truth(this.num(a, "lessequalp") <= this.num(b, "lessequalp")); });
    def("greaterequalp", 2, function (a, b) { return this.truth(this.num(a, "greaterequalp") >= this.num(b, "greaterequalp")); });

    /* --- logic (list inputs are lazily evaluated expressions) --- */
    const lazyBool = function (x, who) {
      if (Array.isArray(x)) {
        const v = this.runList(x, true);
        if (v === undefined) throw new LogoError(6, "expression didn't output to " + who);
        return this.bool(v, who);
      }
      return this.bool(x, who);
    };
    def("and", 2, function () { for (const a of arguments) if (!lazyBool.call(this, a, "and")) return "false"; return "true"; }, { min: 0, max: 99, exact: true });
    def("or", 2, function () { for (const a of arguments) if (lazyBool.call(this, a, "or")) return "true"; return "false"; }, { min: 0, max: 99, exact: true });
    def("not", 1, function (a) { return this.truth(!lazyBool.call(this, a, "not")); });

    /* --- control --- */
    def("run", 1, function (l) { return Array.isArray(l) ? this.runList(l, true) : this.runList(readText(wordStr(l)), true); });
    def("runresult", 1, function (l) { const v = this.runList(this.list(l, "runresult"), true); return v === undefined ? [] : [v]; });
    def("repeat", 2, function (n, l) {
      const cnt = this.num(n, "repeat"); this.list(l, "repeat");
      this.repStack.push(0);
      try { for (let i = 1; i <= cnt; i++) { this.repStack[this.repStack.length - 1] = i; this.runList(l, false); } }
      finally { this.repStack.pop(); }
    });
    def("forever", 1, function (l) {
      this.repStack.push(0);
      try { for (let i = 1; ; i++) { this.repStack[this.repStack.length - 1] = i; this.runList(l, false); if (i > 1e7) throw new LogoError(2, "forever ran too long in the sandbox"); } }
      finally { this.repStack.pop(); }
    });
    def("repcount #", 0, function () { if (!this.repStack.length) return -1; return this.repStack[this.repStack.length - 1]; });
    def("if", 2, function (c, l) { if (this.bool(c, "if")) return this.runList(this.list(l, "if"), true); });
    def("ifelse", 3, function (c, a, b) { return this.runList(this.list(this.bool(c, "ifelse") ? a : b, "ifelse"), true); });
    def("test", 1, function (c) { this.testStack[this.testStack.length - 1].v = this.bool(c, "test"); });
    def("iftrue ift", 1, function (l) { const t = this.testStack[this.testStack.length - 1].v; if (t === null) throw new LogoError(4, "iftrue called without TEST"); if (t) return this.runList(l, true); });
    def("iffalse iff", 1, function (l) { const t = this.testStack[this.testStack.length - 1].v; if (t === null) throw new LogoError(4, "iffalse called without TEST"); if (!t) return this.runList(l, true); });
    def("stop", 0, function () { throw new LStop(); });
    def("output op", 1, function (v) { throw new LOutput(v); });
    def("ignore", 1, function (v) {});
    def("catch", 2, function (tag, l) {
      const t = wordStr(tag).toLowerCase();
      try { return this.runList(this.list(l, "catch"), true); }
      catch (e) {
        if (e instanceof LThrow && String(e.tag).toLowerCase() === t) return e.value;
        if (e instanceof LogoError && t === "error") { this.lastError = [e.code, e.msg, e.proc ? e.proc : [], []]; return undefined; }
        throw e;
      }
    });
    def("throw", 1, function (tag, v) { throw new LThrow(wordStr(tag), v); }, { min: 1, max: 2 });
    def("error", 0, function () { const e = this.lastError; this.lastError = []; return e; });
    def("for", 2, function (ctl, body) {
      const c = this.list(ctl, "for");
      const toks = c.slice(1);
      const name = String(c[0]);
      const sub = this.evalControl(toks);
      const start = sub[0], limit = sub[1];
      let step = sub.length > 2 ? sub[2] : (limit >= start ? 1 : -1);
      if (step === 0) throw new LogoError(4, "for doesn't like 0 as input");
      const scope = new Map(); this.scopes.push(scope);
      try {
        for (let v = start; step > 0 ? v <= limit : v >= limit; v += step) { scope.set(name.toLowerCase(), v); this.runList(body, false); }
      } finally { this.scopes.pop(); }
    });
    def("while", 2, function (c, body) { let n = 0; while (this.bool(this.runList(c, true), "while")) { this.runList(body, false); if (++n > 5e6) throw new LogoError(2, "loop ran too long in the sandbox"); } });
    def("until", 2, function (c, body) { let n = 0; while (!this.bool(this.runList(c, true), "until")) { this.runList(body, false); if (++n > 5e6) throw new LogoError(2, "loop ran too long in the sandbox"); } });
    def("do.while", 2, function (body, c) { do { this.runList(body, false); } while (this.bool(this.runList(c, true), "do.while")); });
    def("do.until", 2, function (body, c) { do { this.runList(body, false); } while (!this.bool(this.runList(c, true), "do.until")); });
    def("apply", 2, function (t, l) { return this.applyTemplate(t, this.list(l, "apply"), "apply"); });
    def("invoke", 2, function (t) { return this.applyTemplate(t, Array.prototype.slice.call(arguments, 1), "invoke"); }, { min: 1, max: 99 });
    // the slots a template gets for one datum: ? (and ?1) is the whole datum,
    // and a second data list supplies parallel data in ?2
    def("foreach", 2, function (l, t) {
      const items = seq(l, "foreach");
      const other = arguments.length > 2 ? seq(arguments[2], "foreach") : null;
      for (let i = 0; i < items.length; i++) {
        let slots = [items[i]];
        if (other) slots = [items[i], other[i]];
        this.applyTemplate(t, slots, "foreach");
      }
    }, { min: 2, max: 3 });
    def("map", 2, function (t, l) {
      const items = seq(l, "map"); const out = [];
      const other = arguments.length > 2 ? seq(arguments[2], "map") : null;
      for (let i = 0; i < items.length; i++) {
        let slots = [items[i]];
        if (other) slots = [items[i], other[i]];
        const v = this.tmplOut(t, slots, "map");
        if (v === undefined) throw new LogoError(6, "template didn't output to map");
        out.push(v);
      }
      return Array.isArray(l) ? out : out.join("");
    }, { min: 2, max: 3 });
    def("map.se", 2, function (t, l) {
      const items = seq(l, "map.se"); let out = [];
      for (const it of items) { const v = this.tmplOut(t, [it], "map.se"); out = out.concat(Array.isArray(v) ? v : [v]); }
      return out;
    });
    def("filter", 2, function (t, l) {
      const items = seq(l, "filter"); const out = [];
      for (const it of items) if (this.bool(this.tmplOut(t, [it], "filter"), "filter")) out.push(it);
      return Array.isArray(l) ? out : out.join("");
    });
    def("find", 2, function (t, l) {
      for (const it of seq(l, "find")) if (this.bool(this.tmplOut(t, [it], "find"), "find")) return it;
      return [];
    });
    def("reduce", 2, function (t, l) {
      const items = seq(l, "reduce");
      if (!items.length) throw new LogoError(4, "reduce doesn't like [] as input");
      let acc = items[items.length - 1];
      for (let i = items.length - 2; i >= 0; i--) acc = this.tmplOut(t, [items[i], acc], "reduce");
      return acc;
    }, { min: 2, max: 3 });
    def("cascade", 3, function (end, t, start) {
      let v = start;
      if (isNumeric(end)) {
        const n = toNumber(end);
        for (let i = 1; i <= n; i++) { this.cascadeCount = i; v = this.tmplOut(t, [v], "cascade"); }
        this.cascadeCount = 0;
        return v;
      }
      let g = 0;
      while (!this.bool(this.tmplOut(end, [v], "cascade"), "cascade")) { v = this.tmplOut(t, [v], "cascade"); if (++g > 1e6) throw new LogoError(2, "cascade ran too long"); }
      return v;
    });
    def("cascade.2", 5, function (end, t1, s1, t2, s2) {
      let a = s1, b = s2;
      if (isNumeric(end)) { const n = toNumber(end); for (let i = 0; i < n; i++) { const na = this.tmplOut(t1, [a, b], "cascade.2"); const nb = this.tmplOut(t2, [a, b], "cascade.2"); a = na; b = nb; } return a; }
      let g = 0;
      while (!this.bool(this.tmplOut(end, [a, b], "cascade.2"), "cascade.2")) { const na = this.tmplOut(t1, [a, b], "cascade.2"); const nb = this.tmplOut(t2, [a, b], "cascade.2"); a = na; b = nb; if (++g > 1e6) throw new LogoError(2, "cascade.2 ran too long"); }
      return a;
    });
    def("crossmap", 2, function (t) {
      let lists = Array.prototype.slice.call(arguments, 1);
      if (lists.length === 1 && Array.isArray(lists[0])) lists = lists[0].map(e => Array.isArray(e) ? e : wordStr(e).split(""));
      const out = [];
      const go = (i, acc) => {
        if (i === lists.length) { out.push(this.tmplOut(t, acc, "crossmap")); return; }
        for (const it of seq(lists[i], "crossmap")) go(i + 1, acc.concat([it]));
      };
      go(0, []);
      return out;
    }, { min: 2, max: 99 });

    /* --- variables & workspace --- */
    def("make", 2, function (n, v) { this.setVar(this.word(n, "make"), v); });
    def("name", 2, function (v, n) { this.setVar(this.word(n, "name"), v); });
    def("thing", 1, function (n) { return this.getVar(this.word(n, "thing")); });
    def("global", 1, function () { for (const a of arguments) for (const nm of (Array.isArray(a) ? a : [a])) if (!this.globals.has(String(nm).toLowerCase())) this.globals.set(String(nm).toLowerCase(), UNSET); }, { min: 1, max: 99 });
    def("local", 1, function () { for (const a of arguments) for (const nm of (Array.isArray(a) ? a : [a])) this.declareLocal(nm); }, { min: 1, max: 99 });
    def("localmake", 2, function (n, v) { this.declareLocal(this.word(n, "localmake")); this.scopes.length ? this.scopes[this.scopes.length - 1].set(String(n).toLowerCase(), v) : this.globals.set(String(n).toLowerCase(), v); });
    def("namep", 1, function (n) { try { this.getVar(wordStr(n)); return "true"; } catch (e) { return "false"; } });
    def("procedurep", 1, function (n) { return this.truth(this.procs.has(wordStr(n).toLowerCase())); });
    def("primitivep", 1, function (n) { return this.truth(!!P[this.canon(wordStr(n))]); });
    def("definedp", 1, function (n) { return this.truth(this.procs.has(wordStr(n).toLowerCase())); });
    def("namelist", 1, function (spec) {
      const names = Array.isArray(spec) ? spec : [spec];
      const out = [];
      for (const n of names) {
        const k = wordStr(n).toLowerCase();
        if (this.procs.has(k)) out.push(this.procs.get(k).name);
        else if (this.globals.has(k)) out.push(n);
      }
      return out;
    });
    def("procedures", 0, function () { return Array.from(this.procs.values()).filter(p => !p.macro).map(p => p.name); });
    def("names", 0, function () { return [[], Array.from(this.globals.keys())]; });
    def("erase er", 1, function (spec) {
      const procs = Array.isArray(spec) ? (Array.isArray(spec[0]) ? spec[0] : spec) : [spec];
      for (const p of procs) this.procs.delete(wordStr(p).toLowerCase());
    });
    def("erall", 0, function () { this.procs.clear(); this.globals.clear(); });
    def("po", 1, function (spec) {
      const names = Array.isArray(spec) ? spec : [spec];
      for (const n of names) {
        const p = this.procs.get(wordStr(n).toLowerCase());
        if (!p) throw new LogoError(12, wordStr(n) + " is not a defined procedure");
        this.emit((p.macro ? ".macro " : "to ") + p.header, true);
        p.lines.forEach(l => this.emit(l, true));
        this.emit("end", true);
      }
    });
    def("pprop", 3, function (p, k, v) { const n = this.word(p, "pprop").toLowerCase(); if (!this.proplists.has(n)) this.proplists.set(n, []); const pl = this.proplists.get(n); const key = this.word(k, "pprop").toLowerCase(); const e = pl.find(x => x[0] === key); if (e) e[1] = v; else pl.unshift([key, v]); });
    def("gprop", 2, function (p, k) { const pl = this.proplists.get(this.word(p, "gprop").toLowerCase()); if (!pl) return []; const e = pl.find(x => x[0] === this.word(k, "gprop").toLowerCase()); return e ? e[1] : []; });
    def("remprop", 2, function (p, k) { const n = this.word(p, "remprop").toLowerCase(); const pl = this.proplists.get(n); if (pl) this.proplists.set(n, pl.filter(x => x[0] !== this.word(k, "remprop").toLowerCase())); });
    def("plist", 1, function (p) { const pl = this.proplists.get(this.word(p, "plist").toLowerCase()); if (!pl) return []; const o = []; for (const [k, v] of pl) { o.push(k, v); } return o; });

    /* --- turtle graphics --- */
    const G = (fn) => function () {
      if (!this.gfx) throw new LogoError(12, "graphics are not available here");
      return fn.apply(this, arguments);
    };
    def("forward fd", 1, G(function (d) { this.gfx.forward(this.num(d, "forward")); }));
    def("back bk", 1, G(function (d) { this.gfx.forward(-this.num(d, "back")); }));
    def("left lt", 1, G(function (d) { this.gfx.turn(-this.num(d, "left")); }));
    def("right rt", 1, G(function (d) { this.gfx.turn(this.num(d, "right")); }));
    def("home", 0, G(function () { this.gfx.setpos(0, 0); this.gfx.setheading(0); }));
    def("clearscreen cs", 0, G(function () { this.gfx.clear(true); }));
    def("clean", 0, G(function () { this.gfx.clear(false); }));
    def("penup pu", 0, G(function () { this.gfx.setpen(false); }));
    def("pendown pd", 0, G(function () { this.gfx.setpen(true); }));
    def("pendownp", 0, G(function () { return this.truth(this.gfx.pendown()); }));
    def("showturtle st", 0, G(function () { this.gfx.setshown(true); }));
    def("hideturtle ht", 0, G(function () { this.gfx.setshown(false); }));
    def("shownp", 0, G(function () { return this.truth(this.gfx.shown()); }));
    def("setxy", 2, G(function (x, y) { this.gfx.setpos(this.num(x, "setxy"), this.num(y, "setxy")); }));
    def("setx", 1, G(function (x) { this.gfx.setpos(this.num(x, "setx"), this.gfx.pos()[1]); }));
    def("sety", 1, G(function (y) { this.gfx.setpos(this.gfx.pos()[0], this.num(y, "sety")); }));
    def("setpos", 1, G(function (p) { const l = this.list(p, "setpos"); this.gfx.setpos(this.num(l[0], "setpos"), this.num(l[1], "setpos")); }));
    def("setheading seth", 1, G(function (h) { this.gfx.setheading(this.num(h, "setheading")); }));
    def("pos", 0, G(function () { return this.gfx.pos().slice(); }));
    def("xcor", 0, G(function () { return this.gfx.pos()[0]; }));
    def("ycor", 0, G(function () { return this.gfx.pos()[1]; }));
    def("heading", 0, G(function () { return this.gfx.heading(); }));
    def("towards", 1, G(function (p) {
      const l = this.list(p, "towards"); const [x, y] = this.gfx.pos();
      const dx = this.num(l[0], "towards") - x, dy = this.num(l[1], "towards") - y;
      let a = Math.atan2(dx, dy) * 180 / Math.PI; if (a < 0) a += 360; return clean(a);
    }));
    def("setpencolor setpc", 1, G(function (c) { this.gfx.setcolor(c); }));
    def("pencolor pc", 0, G(function () { return this.gfx.color(); }));
    def("setpensize", 1, G(function (s) { const v = Array.isArray(s) ? s[0] : s; this.gfx.setsize(this.num(v, "setpensize")); }));
    def("setbackground setbg", 1, G(function (c) { this.gfx.setbg(c); }));
    def("label", 1, G(function (t) { this.gfx.label(printForm(t)); }));
    def("wrap", 0, G(function () { this.gfx.setmode("wrap"); }));
    def("window", 0, G(function () { this.gfx.setmode("window"); }));
    def("fence", 0, G(function () { this.gfx.setmode("fence"); }));
    def("fill", 0, G(function () { /* not supported */ }));

    /* ================================================================
       Extensions for the tutorial sandbox: more graphics, more
       control structures, and a small in-memory file system.
       ================================================================ */

    /* --- virtual files (in memory, like a scratch directory) --- */
    if (!this.files) this.files = new Map();
    if (!this.readerName) this.readerName = null;
    if (!this.writerName) this.writerName = null;
    if (!this.prefix) this.prefix = [];
    if (!this.openFiles) this.openFiles = new Set();

    const fname = (n) => {
      const base = this.word(n, "file");
      return this.prefix.concat([base]).join("/");
    };
    const fileOf = (n) => {
      const f = this.files.get(fname(n));
      if (!f) throw new LogoError(40, "I can't open file " + this.word(n, "file"));
      return f;
    };
    this.fileName = fname;
    this.fileObj = fileOf;

    def("setprefix", 1, function (p) {
      const l = Array.isArray(p) ? p.map(x => wordStr(x)) : [wordStr(p)];
      this.prefix = l; this.prefix = l;
    });
    def("prefix", 0, function () { return this.prefix.slice(); });
    def("openwrite", 1, function (n) {
      const key = fname(n);
      this.files.set(key, { content: "", pos: 0 });
      this.openFiles.add(key);
      this.writerName = key;
    });
    def("openread", 1, function (n) {
      const f = fileOf(n);
      f.pos = 0;
      this.openFiles.add(fname(n));
      this.readerName = fname(n);
    });
    def("openappend", 1, function (n) {
      const key = fname(n);
      const f = this.files.get(key) || { content: "", pos: 0 };
      f.pos = f.content.length;
      this.files.set(key, f);
      this.openFiles.add(key);
      this.writerName = key;
    });
    def("openupdate", 1, function (n) {
      const f = fileOf(n);
      f.pos = 0;
      this.openFiles.add(fname(n));
      this.readerName = fname(n); this.writerName = fname(n);
    });
    def("close", 1, function (n) {
      const key = fname(n);
      this.openFiles.delete(key);
      if (this.readerName === key) this.readerName = null;
      if (this.writerName === key) this.writerName = null;
    });
    def("allopen", 0, function () { return Array.from(this.openFiles); });
    def("closeall", 0, function () { this.openFiles.clear(); this.readerName = null; this.writerName = null; });
    def("erasefile erf", 1, function (n) { this.files.delete(fname(n)); this.openFiles.delete(fname(n)); });
    def("filep", 1, function (n) { return this.truth(this.files.has(fname(n))); });
    def("setread", 1, function (n) { this.readerName = n === null || n === undefined || wordStr(n) === "" ? null : fname(n); });
    def("setwrite", 1, function (n) { this.writerName = n === null || n === undefined || wordStr(n) === "" ? null : fname(n); });
    def("reader", 0, function () { return this.readerName ? [this.readerName] : []; });
    def("writer", 0, function () { return this.writerName ? [this.writerName] : []; });
    def("eofp", 0, function () {
      if (!this.readerName) return "false";
      const f = this.files.get(this.readerName);
      if (!f) return "true";
      return this.truth(f.pos >= f.content.length);
    });
    def("readpos", 0, function () {
      if (!this.readerName) return 0;
      const f = this.files.get(this.readerName);
      return f ? f.pos : 0;
    });
    def("writepos", 0, function () {
      if (!this.writerName) return 0;
      const f = this.files.get(this.writerName);
      return f ? f.content.length : 0;
    });
    def("setreadpos", 1, function (p) {
      if (!this.readerName) return;
      const f = this.files.get(this.readerName);
      if (f) f.pos = Math.max(0, Math.min(f.content.length, this.num(p, "setreadpos")));
    });
    def("setwritepos", 1, function (p) {
      if (!this.writerName) return;
      const f = this.files.get(this.writerName);
      if (f) f.content = f.content.slice(0, Math.max(0, this.num(p, "setwritepos")));
    });

    /* --- more receivers --- */
    def("readrawline", 0, function () { const s = this.readLine(); return s === null || s === undefined ? [] : String(s); });
    def("readchar rc", 0, function () {
      const s = this.readLine();
      if (s === null || s === undefined) return "";
      return String(s).slice(0, 1);
    });
    def("readchars rcs", 1, function (n) {
      const s = this.readLine();
      if (s === null || s === undefined) return "";
      return String(s).slice(0, this.num(n, "readchars"));
    });

    /* --- more control structures --- */
    def("case", 2, function (val, clauses) {
      const cl = this.list(clauses, "case");
      for (const c of cl) {
        if (!Array.isArray(c)) continue;
        const head = c[0];
        let hit = false;
        if (Array.isArray(head)) hit = head.some(h => this.equalp(h, val));
        else if (String(head).toLowerCase() === "else") hit = true;
        if (hit) return this.runList(c.slice(1), true);
      }
      return undefined;
    });
    def("cond", 1, function (clauses) {
      const cl = this.list(clauses, "cond");
      for (const c of cl) {
        if (!Array.isArray(c)) continue;
        const head = c[0];
        let hit = false;
        if (Array.isArray(head)) hit = this.bool(this.runList(head, true), "cond");
        else {
          const w = String(head).toLowerCase();
          if (w === "else") hit = true;
          else if (w === "true") hit = true;
          else if (w === "false") hit = false;
          else {
            const spec = this.PRIM[this.canon(head)];
            if (spec && (spec.n === 0 || spec.min === 0)) hit = this.bool(this.runList([head], true), "cond");
            else hit = this.bool(this.runList([head], true), "cond");
          }
        }
        if (hit) return this.runList(c.slice(1), true);
      }
      return undefined;
    });

    /* --- more workspace tools --- */
    def("copydef", 2, function (newname, oldname) {
      const key = wordStr(oldname).toLowerCase();
      const src = this.procs.get(key);
      if (src) { this.procs.set(wordStr(newname).toLowerCase(), Object.assign({}, src, { name: wordStr(newname) })); return; }
      const spec = this.PRIM[this.canon(key)];
      if (!spec) throw new LogoError(12, "I don't know how to " + wordStr(oldname));
      // copying a primitive: a new name for the same procedure
      this.procs.set(wordStr(newname).toLowerCase(), {
        name: wordStr(newname), params: new Array(spec.n || 0).fill("a"), rest: false, macro: false,
        header: wordStr(newname), lines: [], tokens: [],
        lineTokens: [[{ type: "name", v: wordStr(oldname) }]], primitive: key
      });
    });
    def("define", 2, function (name, text) {
      const lines = this.list(text, "define").map(l => Array.isArray(l) ? l.join(" ") : wordStr(l));
      this.defineProc(wordStr(name) + " " + lines.join(" "), lines.slice(1), false);
    });
    def("fulltext", 1, function (n) {
      const p = this.procs.get(wordStr(n).toLowerCase());
      if (!p) throw new LogoError(12, wordStr(n) + " is not a defined procedure");
      return ["to " + p.header].concat(p.lines).concat(["end"]);
    });
    def("arity", 1, function (n) {
      const p = this.procs.get(wordStr(n).toLowerCase());
      if (!p) return [-1, -1, -1];
      const mn = p.params.length, mx = p.rest ? -1 : mn;
      return [mn, mn, mx];
    });
    def("contents", 0, function () {
      return [Array.from(this.procs.values()).filter(p => !p.macro).map(p => p.name),
              Array.from(this.globals.keys()),
              Array.from(this.proplists.keys()).filter(k => this.proplists.get(k).length)];
    });
    def("plists", 0, function () { return Array.from(this.proplists.keys()).filter(k => this.proplists.get(k).length); });
    def("plistp", 1, function (n) { const pl = this.proplists.get(wordStr(n).toLowerCase()); return this.truth(!!pl && pl.length > 0); });
    def("save", 1, function (n) {
      const parts = [];
      for (const p of this.procs.values()) parts.push("to " + p.header, ...p.lines, "end");
      for (const [k, v] of this.globals) if (v !== UNSET) parts.push('make "' + k + " " + showItem(v, true));
      const f = { content: parts.join("\n") + "\n", pos: 0 };
      this.files.set(fname(n), f);

    });
    def("load", 1, function (n) {
      const f = fileOf(n);
      this.execute(f.content, false);
    });

    /* --- more graphics --- */
    def("arc", 2, G(function (a, r) { this.gfx.arc(this.num(a, "arc"), this.num(r, "arc")); }));
    def("fill", 0, G(function () { this.gfx.fill(); }));
    def("filled", 2, G(function (color, instructions) {
      const saved = this.gfx.color();
      if (color !== undefined && color !== null) this.gfx.setcolor(color);
      this.runList(this.list(instructions, "filled"), false);
      const ok = this.gfx.fill();
      this.gfx.setcolor(saved);
      return this.truth(ok);
    }));
    def("penpaint ppt", 0, G(function () { this.gfx.setpenmode("paint"); }));
    def("penerase pe", 0, G(function () { this.gfx.setpenmode("erase"); }));
    def("penreverse px", 0, G(function () { this.gfx.setpenmode("reverse"); }));
    def("penmode", 0, G(function () { return this.gfx.penmode(); }));
    def("pensize", 0, G(function () { return this.gfx.getsize(); }));
    def("background bg", 0, G(function () { return this.gfx.getbg(); }));
    def("setpalette", 2, G(function (n, c) { this.gfx.setpalette(this.num(n, "setpalette"), this.list(c, "setpalette")); }));
    def("palette", 1, G(function (n) { return this.gfx.getpalette(this.num(n, "palette")) || []; }));
    def("turtlemode", 0, G(function () { return this.gfx.getmode(); }));
    def("screenmode", 0, G(function () { return "splitscreen"; }));
    def("setlabelheight", 1, G(function (h) { this.gfx.setlabelheight(this.num(h, "setlabelheight")); }));
    def("labelsize", 0, G(function () { return this.gfx.labelsize(); }));
    def("scrunch", 0, G(function () { return [1, 1]; }));
    def("setscrunch", 2, G(function () { return undefined; }));
    def("savepict", 1, G(function (n) {
      const f = { content: this.gfx.snapshot(), pos: 0, image: true };
      this.files.set(fname(n), f);

    }));
    def("loadpict", 1, G(function (n) {
      const f = fileOf(n);
      if (f.image) this.gfx.restore(f.content);
    }));
    def("epspict", 1, G(function (n) {
      const f = { content: "%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 440 280\n%%EndComments\n", pos: 0 };
      this.files.set(fname(n), f);

    }));


    /* --- more primitives, added for the Part Two projects --- */
    def("parse", 1, function (w) { return readText(wordStr(w)); });
    def("runparse", 1, function (w) { return readText(wordStr(w)); });
    def("quoted", 1, function (x) {
      if (Array.isArray(x)) return x;
      return '"' + wordStr(x);
    });
    def("push", 2, function (n, v) {
      const key = wordStr(n).toLowerCase();
      const cur = this.globals.get(key);
      const list = Array.isArray(cur) ? cur : [];
      this.globals.set(key, [v, ...list]);
    });
    def("pop", 1, function (n) {
      const key = wordStr(n).toLowerCase();
      const cur = this.globals.get(key);
      if (!Array.isArray(cur) || !cur.length) throw new LogoError(4, "pop doesn't like [] as input");
      this.globals.set(key, cur.slice(1));
      return cur[0];
    });
    def("queue", 2, function (n, v) {
      const key = wordStr(n).toLowerCase();
      const cur = this.globals.get(key);
      const list = Array.isArray(cur) ? cur : [];
      this.globals.set(key, [...list, v]);
    });
    def("dequeue", 1, function (n) {
      const key = wordStr(n).toLowerCase();
      const cur = this.globals.get(key);
      if (!Array.isArray(cur) || !cur.length) throw new LogoError(4, "dequeue doesn't like [] as input");
      this.globals.set(key, cur.slice(1));
      return cur[0];
    });
    def("bitand", 2, function (a, b) { return this.num(a, "bitand") & this.num(b, "bitand"); });
    def("bitor", 2, function (a, b) { return this.num(a, "bitor") | this.num(b, "bitor"); });
    def("bitxor", 2, function (a, b) { return this.num(a, "bitxor") ^ this.num(b, "bitxor"); });
    def("bitnot", 1, function (a) { return ~this.num(a, "bitnot"); });
    def("ashift", 2, function (a, n) {
      const x = this.num(a, "ashift"), k = this.num(n, "ashift");
      return k >= 0 ? (x << k) : (x >> -k);
    });
    def("lshift", 2, function (a, n) {
      const x = this.num(a, "lshift") >>> 0, k = this.num(n, "lshift");
      return k >= 0 ? (x << k) : (x >>> -k);
    });
    def("poall", 0, function () {
      for (const p of this.procs.values()) {
        this.write((p.macro ? ".macro " : "to ") + p.header, "info");
        p.lines.forEach(l => this.write(l, "info"));
        this.write("end", "info");
      }
    });
    def("pops", 0, function () {
      for (const p of this.procs.values()) {
        this.write((p.macro ? ".macro " : "to ") + p.header, "info");
        p.lines.forEach(l => this.write(l, "info"));
        this.write("end", "info");
      }
    });
    def("pon", 1, function (n) {
      const p = this.procs.get(wordStr(n).toLowerCase());
      if (!p) throw new LogoError(12, wordStr(n) + " is not a defined procedure");
      this.write((p.macro ? ".macro " : "to ") + p.header, "info");
    });
    def("pot", 1, function (n) {
      const p = this.procs.get(wordStr(n).toLowerCase());
      if (!p) throw new LogoError(12, wordStr(n) + " is not a defined procedure");
      this.write((p.macro ? ".macro " : "to ") + p.header, "info");
    });
    def("pots", 0, function () {
      for (const p of this.procs.values()) this.write((p.macro ? ".macro " : "to ") + p.header, "info");
    });
    def("pons", 0, function () { for (const k of this.globals.keys()) this.write(k, "info"); });
    def("popls", 0, function () { for (const k of this.proplists.keys()) this.write(k, "info"); });
    def("popl", 1, function (n) {
      const pl = this.proplists.get(wordStr(n).toLowerCase());
      if (!pl) return;
      const out = [];
      for (const [k, v] of pl) out.push(k, v);
      this.write(showItem(out, true), "info");
    });
    def("transfer", 3, function (t, inb, outb) {
      const items = seq(inb, "transfer");
      const out = [];
      for (const it of items) {
        const v = this.tmplOut(t, [it, out], "transfer");
        if (Array.isArray(v)) out.push(...v); else out.push(v);
      }
      return out;
    });

    /* --- tracing, for the debugging lesson --- */
    if (!this.traced) this.traced = new Set();
    if (!this.stepped) this.stepped = new Set();
    def("trace", 1, function (n) { this.traced.add(wordStr(n).toLowerCase()); });
    def("untrace", 1, function (n) { this.traced.delete(wordStr(n).toLowerCase()); });
    def("tracedp", 1, function (n) { return this.truth(this.traced.has(wordStr(n).toLowerCase())); });
    def("step", 1, function (n) { this.stepped.add(wordStr(n).toLowerCase()); });
    def("unstep", 1, function (n) { this.stepped.delete(wordStr(n).toLowerCase()); });
    def("steppedp", 1, function (n) { return this.truth(this.stepped.has(wordStr(n).toLowerCase())); });

    this.ALIAS = {};
  }

  evalControl(items) {
    // evaluate the instruction-list style control list of FOR: values separated by expressions
    const toks = lexItems(items);
    const cur = { t: toks, p: 0 }; const out = [];
    while (cur.p < toks.length) out.push(this.num(this.parseExpr(cur, 1, "for"), "for"));
    return out;
  }
}

LogoVM.readText = readText;
LogoVM.showItem = showItem;
LogoVM.printForm = printForm;
LogoVM.fmtNum = fmtNum;

root.LogoVM = LogoVM;
root.LogoVM.__LogoError = LogoError;   /* BUILD PATCH: expose for getset patch */
/* BUILD PATCH #3: the chapter 10-12 additions appended at the
   end of this file live outside this closure; expose the internals they
   need, in the same clearly-marked way as __LogoError above. */
root.LogoVM.__LThrow = LThrow;
root.LogoVM.__LArray = LArray;
root.LogoVM.__wordStr = wordStr;
root.LogoVM.__isWord = isWord;
root.LogoVM.__isNumeric = isNumeric;
root.LogoVM.__toNumber = toNumber;
root.LogoVM.__flattenLines = flattenLines;
root.LogoVM.__unescapeWord = unescapeWord;
root.LogoVM.__showItem = showItem;
root.LogoVM.__UNSET = UNSET;
/* END BUILD PATCH #3 exposures */
if (typeof module !== "undefined" && module.exports) module.exports = LogoVM;
})(typeof window !== "undefined" ? window : globalThis);




/* =====================================================================
   BUILD PATCH — not present in the original app.
   The original interpreter parses an UNPARENTHESIZED variadic primitive
   (PRINT, SUM, WORD, ... one whose max arity exceeds its nominal count)
   greedily: it swallows every remaining expression on the line as an
   input.  Berkeley Logo 6.2 instead runs such a procedure at its NOMINAL
   arity, and any words left over begin a new instruction on the same
   line.  The tutorial's own differential-tested transcripts document the
   real behaviour, e.g.    ? print "a print "b   →  a  b.
   This override restores that behaviour and was validated against all
   365 session transcripts in the tutorial corpus: it repairs four
   transcripts (incl. the one above) and changes none for the worse.
   Parenthesized calls like (print "a "b "c) are unaffected.
   ===================================================================== */
(function (root) {
"use strict";
var VM = root.LogoVM;
var origCallNamed = VM.prototype.callNamed;
VM.prototype.callNamed = function (name, cur, paren) {
  if (!paren) {
    var spec = this.PRIM[this.canon(name)];
    if (spec && spec.max !== undefined && spec.max > spec.n && !spec.exact) {
      var savedMax = spec.max;
      spec.max = spec.n;                       // nominal arity only
      try { return origCallNamed.call(this, name, cur, paren); }
      finally { spec.max = savedMax; }
    }
  }
  return origCallNamed.call(this, name, cur, paren);
};
})(typeof window !== "undefined" ? window : globalThis);

/* =====================================================================
   BUILD PATCH #2 — getter/setter notation (ALLOWGETSET).
   Not present in the original app.  Berkeley Logo 6.2 resolves an
   unknown procedure name by first trying it as a SETFOO setter for an
   existing variable foo, then as a getter for an existing variable —
   but only while the variable allowgetset is true (it is, by default,
   at startup).  The tutorial teaches this in lesson 1c, and its own
   differential-tested transcripts (lessons 1a and 1c in the corpus)
   document the expected behaviour:
       ? make "score 2
       ? print score          →  2
       ? setscore 10
       ? print :score         →  10
   Validated against all 365 session transcripts: repairs the two
   getset transcripts and changes none for the worse.
   ===================================================================== */
(function (root) {
"use strict";
var VM = root.LogoVM;
var NOGETSET = VM.__NOGETSET = { nogetset: true };

VM.prototype.tryGetSet = function (k, name, cur) {
  if (!this.allowGetSet) return NOGETSET;
  var varExists = function (nm) {
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      var s = this.scopes[i];
      if (s.has(nm) && !(s.get(nm) && s.get(nm).unset)) return true;
    }
    return this.globals.has(nm);
  }.bind(this);

  /* setter: SETFOO, where a variable named foo already exists */
  if (k.length > 3 && k.slice(0, 3) === "set" && varExists(k.slice(3))) {
    if (cur.p >= cur.t.length) throw new VM.__LogoError(5, "not enough inputs to " + name);
    var v = this.parseExpr(cur, 1, name);
    if (v === undefined) throw new VM.__LogoError(6, this.lastCalled + " didn't output to " + name);
    this.setVar(k.slice(3), v);
    return undefined;                          // a command: no output
  }
  /* getter: FOO, where a variable named foo exists */
  if (varExists(k)) {
    var val = this.getVar(k);
    if (val && val.unset) throw new VM.__LogoError(11, k + " has no value");
    return val;
  }
  return NOGETSET;
};

/* the allowgetset variable itself is settable and readable like any other */
var origSetVar = VM.prototype.setVar;
VM.prototype.setVar = function (name, val) {
  var k = String(name).toLowerCase();
  if (k === "allowgetset") {
    this.allowGetSet = (typeof val === "number" ? String(val) : String(val).replace(/\u0001([^\u0003]*)\u0003/g, "$1")) === "true";
    return;
  }
  return origSetVar.call(this, name, val);
};
var origGetVar = VM.prototype.getVar;
VM.prototype.getVar = function (name) {
  if (String(name).toLowerCase() === "allowgetset") return this.allowGetSet ? "true" : "false";
  return origGetVar.call(this, name);
};
VM.prototype.hasGetSetVar = function () { return !!this.allowGetSet; };
/* expose NOGETSET to the earlier hook in this file */
Object.defineProperty(VM.prototype, "NOGETSET", { get: function () { return NOGETSET; } });
})(typeof window !== "undefined" ? window : globalThis);

/* =====================================================================
   BUILD PATCH #3 — chapters 10-12 support. Not in the original.

   Adds, in UCBLogo 6.2 form:
     · MACROP / MACRO? and MACROEXPAND (lesson 10c's own sessions:
       `show macrop "my.repeat` → true; `show macroexpand
       [localmake "pi 3.14159]` → [local "pi apply "make [pi 3.14159]]).
       MACROEXPAND performs ONE expansion: it hands back the instructions
       the macro built, without running them ("you are looking at the
       translation, not performing it").
     · .DEFMACRO — DEFINE's macro twin (mentioned in 10c).
     · The backquote ‘ (also the keyboard form `), with , and ,@ —
       10c's session: show ‘[foo baz ,[bf [a b c]] garply ,@[bf [a b c]]]
       → [foo baz [b c] garply b c].
     · ERRACT (lessons 11b/12a): an uncaught error runs erract's
       instruction list instead of printing the message; ERROR is
       available inside it, as in UCBLogo. Interactive PAUSE/CONTINUE
       stay out of reach of a page sandbox (and the lessons say so);
       the existing PAUSE stub reports that honestly.
     · CASEIGNOREDP honored by EQUALP, BEFOREP, MEMBERP, MEMBER and
       SUBSTRINGP for word comparisons (default true, as in UCBLogo).
     · PRINTDEPTHLIMIT / PRINTWIDTHLIMIT ellipses and FULLPRINTP
       |vertical| markers, honored by PRINT/PR, SHOW and TYPE.
     · LOG (log10) and DOTIMES; LOGOVERSION and LOGOPLATFORM; the
       three special variables UCBLogo precreates (ALLOWGETSET is
       patch #2's, CASEIGNOREDP and UNBURYONEDIT join it here).
   Everything here is OFF by default and only changes behaviour when a
   lesson or program explicitly uses the named variables/commands, so
   the 365-transcript corpus and the 580-check lesson suite validate it:
   with these patches the corpus went from 100 to 102 agreeing transcripts
   (the erract and caseignoredp sessions now behave like the tutorial's)
   with no new disagreements, and scripts/verify_lessons.js stays
   580 passed, 0 failed.  The 10c corpus transcript for macroexpand still
   disagrees when run standalone (without the lesson's .macro localmake
   definition the runner doesn't load it) — the lesson authors it WITH the
   definition and verifies there.
   ===================================================================== */
(function (root) {
"use strict";
var VM = root.LogoVM;

/* closure internals, exposed above in the same marked way the getset
   patch established */
var LogoError = VM.__LogoError;
var LThrow = VM.__LThrow;
var LArray = VM.__LArray;
var wordStr = VM.__wordStr;
var isWord = VM.__isWord;
var isNumeric = VM.__isNumeric;
var toNumber = VM.__toNumber;
var flattenLines = VM.__flattenLines;
var unescapeWord = VM.__unescapeWord;
var showItem = VM.__showItem;
var UNSET = VM.__UNSET;
var readText = VM.readText;

/* ---- state the new code consults; every default matches UCBLogo ---- */
VM.prototype.macroExpandOnly = false;
VM.prototype.inErract = false;

VM.prototype.caseIgnored = function () {
  try { return wordStr(this.getVar("caseignoredp")) !== "false"; } catch (e) { return true; }
};
VM.prototype.specialNum = function (name) {
  try { var v = this.getVar(name); if (isNumeric(v)) return toNumber(v); } catch (e) {}
  return null;
};
VM.prototype.fullPrintOn = function () {
  try { return wordStr(this.getVar("fullprintp")) === "true"; } catch (e) { return false; }
};
VM.prototype.printLimitsOn = function () {
  return this.specialNum("printdepthlimit") !== null || this.specialNum("printwidthlimit") !== null || this.fullPrintOn();
};

/* ---- callUser, reproduced from the original with one change: under
   macroExpandOnly, a macro's instruction list is handed back instead of
   being run (that is what MACROEXPAND is made of) ---- */
var origCallUser = VM.prototype.callUser;
VM.prototype.callUser = function (proc, args, name) {
  if (proc.primitive) {
    var spec0 = this.PRIM[proc.primitive];
    if (!spec0) throw new LogoError(12, "I don't know how to " + proc.primitive);
    return spec0.fn.apply(this, args);
  }
  if (this.depth >= this.maxDepth) throw new LogoError(2, "Out of space (recursion deeper than " + this.maxDepth + " levels in the sandbox)");
  var scope = new Map();
  proc.params.forEach(function (p, i) { scope.set(p, args[i]); });
  if (proc.rest) scope.set(proc.rest, args.slice(proc.params.length));
  this.scopes.push(scope);
  this.testStack.push({ v: null });
  this.depth++;
  var result;
  try { result = this.execBody(proc, name); }
  finally { this.depth--; this.scopes.pop(); this.testStack.pop(); }
  if (proc.macro) {
    if (!Array.isArray(result)) throw new LogoError(4, name + " didn't output a list");
    if (this.macroExpandOnly) return result;      /* BUILD PATCH #3 */
    return this.runList(result, true);
  }
  return result;
};

/* ---- ERRACT: run it instead of printing an uncaught error ---- */
VM.prototype.erractList = function () {
  try {
    var v = this.getVar("erract");
    if (Array.isArray(v) && v.length) return v;
  } catch (e) {}
  return null;
};
var origReportError = VM.prototype.reportError;
VM.prototype.reportError = function (e) {
  var isErr = (e instanceof LogoError) ||
              (e instanceof LThrow && String(e.tag).toLowerCase() === "error");
  var act = isErr && !this.inErract ? this.erractList() : null;
  if (act) {
    if (e instanceof LogoError) this.lastError = [e.code, e.msg, e.proc ? e.proc : [], []];
    this.inErract = true;
    try { this.runList(act, false); }
    catch (e2) { this.inErract = false; return origReportError.call(this, e2); }
    finally { this.inErract = false; }
    return;                       /* erract replaces the default message */
  }
  return origReportError.call(this, e);
};

/* ---- case-sensitive word comparison when CASEIGNOREDP is false ---- */
var origEqualp = VM.prototype.equalp;
VM.prototype.equalp = function (a, b) {
  if (this.caseIgnored()) return origEqualp.call(this, a, b);
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!(Array.isArray(a) && Array.isArray(b)) || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (!this.equalp(a[i], b[i])) return false;
    return true;
  }
  if (a instanceof LArray || b instanceof LArray) return a === b;
  if (isNumeric(a) && isNumeric(b)) return toNumber(a) === toNumber(b);
  return wordStr(a) === wordStr(b);
};

/* ---- REDEFP, as a settable special variable (chained after patch #2's
   allowgetset wrappers; the tutorial redefines localmake as a macro in
   lesson 10c, which UCBLogo allows with redefp true) ---- */
var origSetVarP3 = VM.prototype.setVar;
VM.prototype.setVar = function (name, val) {
  var k3 = String(name).toLowerCase();
  if (k3 === "redefp") {
    this.redefp = val === true || wordStr(val) === "true";
    return;
  }
  return origSetVarP3.call(this, name, val);
};
var origGetVarP3 = VM.prototype.getVar;
VM.prototype.getVar = function (name) {
  if (String(name).toLowerCase() === "redefp") return this.redefp ? "true" : "false";
  return origGetVarP3.call(this, name);
};

/* ---- the backquote ‘ — `,x inserts, ,@x splices, lists recurse ---- */
VM.prototype.bqRun = function (operand, splice) {
  var v = Array.isArray(operand)
    ? this.runList(operand, true)
    : this.runList(readText(unescapeWord(String(operand))), true);
  if (splice) {
    if (!Array.isArray(v)) throw new LogoError(4, "backquote ,@ didn't output a list");
    return v;
  }
  return [v];
};
VM.prototype.bqExpand = function (list) {
  if (list && list.__multiline) {   /* a template spanning lines is one flat list */
    var flat = [];
    for (var k = 0; k < list.length; k++) flat.push.apply(flat, list[k]);
    return this.bqExpand(flat);
  }
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var el = list[i];
    if (Array.isArray(el)) { out.push(this.bqExpand(el)); continue; }
    var s = String(el);
    if (s === "," || s === ",@") {
      if (i + 1 >= list.length) throw new LogoError(4, "backquote: " + s + " with no expression");
      out.push.apply(out, this.bqRun(list[++i], s === ",@"));
    } else if (s.charAt(0) === ",") {
      var head = s.charAt(1) === "@" ? ",@" : ",";
      var rest = s.slice(head.length);
      if (rest === "") {
        if (i + 1 >= list.length) throw new LogoError(4, "backquote: " + head + " with no expression");
        out.push.apply(out, this.bqRun(list[++i], head === ",@"));
      } else {
        out.push.apply(out, this.bqEvalText(rest, head === ",@"));
      }
    } else out.push(el);
  }
  return out;
};
VM.prototype.bqEvalText = function (txt, splice) {
  var v = this.runList(readText(txt), true);
  if (splice) {
    if (!Array.isArray(v)) throw new LogoError(4, "backquote ,@ didn't output a list");
    return v;
  }
  return [v];
};

/* ---- PRINT/SHOW/TYPES with depth, width and FULLPRINTP ---- */
function fmtLimited(vm, x, mode) {
  var d = vm.specialNum("printdepthlimit");
  var w = vm.specialNum("printwidthlimit");
  var full = vm.fullPrintOn();
  function walk(v, depth) {
    if (Array.isArray(v)) {
      if (d !== null && depth > d) return "...";
      var flat = flattenLines(v);
      var items = flat.map(function (m) { return walk(m, depth + 1); });
      if (w !== null && items.length > w) { items = items.slice(0, w); items.push("..."); }
      return "[" + items.join(" ") + "]";
    }
    if (v instanceof LArray) {
      if (d !== null && depth > d) return "...";
      return "{" + v.items.map(function (m) { return walk(m, depth + 1); }).join(" ") + "}";
    }
    if (full) {
      var s = String(v);
      if (s.indexOf("\u0001") >= 0) return "|" + s.replace(/\u0001/g, "").replace(/\u0002/g, " ").replace(/\u0003/g, "") + "|";
      /* FULLPRINTP's stated purpose is that printed text can be read back
         in to produce exactly the same word — so a word that would need
         |vertical bars| or a backslash to type is printed with them */
      var fw = wordStr(v);
      if (/[\s()\[\];|]/.test(fw)) return "|" + fw + "|";
      if (s.indexOf("\\") >= 0) return s;
    }
    return wordStr(v);
  }
  var r = walk(x, 1);
  if (mode !== "show" && Array.isArray(x)) r = r.replace(/^\[/, "").replace(/\]$/, "");
  return r;
}

/* ---- new primitives (added after the original initPrims) ---- */
var origInitPrims = VM.prototype.initPrims;
VM.prototype.initPrims = function () {
  origInitPrims.call(this);
  var P = this.PRIM;
  this.macroExpandOnly = false;
  this.inErract = false;

  /* the special variables UCBLogo precreates; everything else stays unbound */
  this.globals.set("caseignoredp", "true");
  this.globals.set("unburyonedit", "true");
  this.globals.set("logoversion", "6.2");
  this.globals.set("logoplatform", "JavaScript");

  /* bury semantics (lesson 12c's "TRUE and buried from the start"):
     buried things are invisible to SAVE/CONTENTS/POTS/PONS/NAMES/POALL,
     and ERALL leaves them alone. BURY/UNBURY/BURIEDP work on any mix of
     procedure and variable names, as in UCBLogo. */
  this.buried = new Set();
  var sandbox = this;
  var vburied = function (k) { return sandbox.buried.has("var:" + String(k).toLowerCase()); };
  var pburied = function (p) { return sandbox.buried.has("proc:" + String(p.name).toLowerCase()); };
  ["allowgetset", "caseignoredp", "unburyonedit", "logoversion", "logoplatform"]
    .forEach(function (n) { sandbox.buried.add("var:" + n); });
  var buryNames = function (on) {
    return function () {
      var vm = this;
      for (var a = 0; a < arguments.length; a++) {
        var one = Array.isArray(arguments[a]) ? arguments[a] : [arguments[a]];
        for (var j = 0; j < one.length; j++) {
          var k = wordStr(one[j]).toLowerCase();
          vm.buried[on ? "add" : "delete"]("proc:" + k);
          vm.buried[on ? "add" : "delete"]("var:" + k);
        }
      }
    };
  };
  P["bury"] = { n: 1, min: 1, max: 99, fn: buryNames(true) };
  P["unbury"] = { n: 1, min: 1, max: 99, fn: buryNames(false) };
  var buriedpFn = function (nm) {
    var k = wordStr(nm).toLowerCase();
    return this.truth(this.buried.has("var:" + k) || this.buried.has("proc:" + k));
  };
  P["buriedp"] = P["buried?"] = { n: 1, fn: buriedpFn };
  var vmHere = this;
  P["contents"].fn = function () {
    return [Array.from(this.procs.values()).filter(function (p) { return !p.macro && !pburied(p); }).map(function (p) { return p.name; }),
            Array.from(this.globals.keys()).filter(function (k) { return !vburied(k); }),
            Array.from(this.proplists.keys()).filter(function (k) { return vmHere.proplists.get(k).length; })];
  };
  P["names"].fn = function () {
    return [[], Array.from(this.globals.keys()).filter(function (k) { return !vburied(k); })];
  };
  P["pons"].fn = function () {
    for (const k of this.globals.keys()) if (!vburied(k)) this.write(k, "info");
  };
  P["procedures"].fn = function () {
    return Array.from(this.procs.values()).filter(function (p) { return !p.macro && !pburied(p); }).map(function (p) { return p.name; });
  };
  P["pots"].fn = function () {
    for (const p of this.procs.values()) if (!pburied(p)) this.write((p.macro ? ".macro " : "to ") + p.header, "info");
  };
  P["poall"].fn = function () {
    for (const p of this.procs.values()) {
      if (pburied(p)) continue;
      this.write((p.macro ? ".macro " : "to ") + p.header, "info");
      p.lines.forEach(l => this.write(l, "info"));
      this.write("end", "info");
    }
  };
  P["erall"].fn = function () {
    for (const k of Array.from(this.procs.keys())) if (!this.buried.has("proc:" + k)) this.procs.delete(k);
    for (const k of Array.from(this.globals.keys())) if (!this.buried.has("var:" + k)) this.globals.delete(k);
  };
  P["save"].fn = function (n) {
    const parts = [];
    for (const p of this.procs.values()) { if (pburied(p)) continue; parts.push("to " + p.header, ...p.lines, "end"); }
    for (const [k, v] of this.globals) { if (v === UNSET || vburied(k)) continue; parts.push('make "' + k + " " + showItem(v, true)); }
    const base = this.word(n, "file");
    const f = { content: parts.join("\n") + "\n", pos: 0 };
    this.files.set(this.prefix.concat([base]).join("/"), f);
  };

  /* MACROP / MACRO? */
  var macropFn = function (n) {
    var p = this.procs.get(this.canon(wordStr(n).toLowerCase()));
    return this.truth(!!(p && p.macro));
  };
  P["macrop"] = P["macro?"] = { n: 1, fn: macropFn };

  /* MACROEXPAND: one expansion, nothing carried out */
  P["macroexpand"] = { n: 1, fn: function (l) {
    var list = this.list(l, "macroexpand");
    var cur = { t: this.tokensOf(list), p: 0 };
    var saved = this.macroExpandOnly; this.macroExpandOnly = true;
    var r;
    try { r = this.parseExpr(cur, 1, "macroexpand"); }
    finally { this.macroExpandOnly = saved; }
    if (r === undefined) throw new LogoError(4, "macroexpand didn't output");
    return r;
  } };

  /* .DEFMACRO — DEFINE's macro twin */
  P[".defmacro"] = { n: 2, fn: function (name, text) {
    var lines = this.list(text, ".defmacro").map(function (l) { return Array.isArray(l) ? l.join(" ") : wordStr(l); });
    this.defineProc(wordStr(name) + " " + lines.join(" "), lines.slice(1), true);
  } };

  /* the backquote ‘ and its keyboard form ` */
  var bqFn = function (t) { return this.bqExpand(this.list(t, "backquote")); };
  P["\u2018"] = P["`"] = { n: 1, fn: bqFn };

  /* LOG (base 10) and DOTIMES [var count] [body] */
  P["log"] = { n: 1, fn: function (a) { return Math.log10(this.num(a, "log")); } };
  P["dotimes"] = { n: 2, fn: function (ctl, body) {
    var c = this.list(ctl, "dotimes");
    var name = String(c[0]);
    var cnt = this.num(this.evalControl(c.slice(1))[0], "dotimes");
    var scope = new Map(); this.scopes.push(scope);
    try {
      for (var v2 = 0; v2 < cnt; v2++) { scope.set(name.toLowerCase(), v2); this.runList(body, false); }
    } finally { this.scopes.pop(); }
  } };

  /* word comparisons honor CASEIGNOREDP */
  P["beforep"].fn = function (a, b) {
    var x = wordStr(a), y = wordStr(b);
    if (this.caseIgnored()) { x = x.toLowerCase(); y = y.toLowerCase(); }
    return this.truth(x < y);
  };
  var wIndexOf = function (vm, hay, needle) {
    var h = wordStr(hay), n = wordStr(needle);
    if (vm.caseIgnored()) { h = h.toLowerCase(); n = n.toLowerCase(); }
    return h.indexOf(n);
  };
  P["memberp"].fn = function (x, l) {
    if (Array.isArray(l)) return this.truth(l.some(function (i) { return this.equalp(i, x); }, this));
    if (isWord(l) && isWord(x) && wordStr(x).length === 1) return this.truth(wIndexOf(this, l, x) >= 0);
    return "false";
  };
  P["member"].fn = function (x, l) {
    if (Array.isArray(l)) { var i = l.findIndex(function (e) { return this.equalp(e, x); }, this); return i < 0 ? [] : l.slice(i); }
    var s = wordStr(l); var i2 = wIndexOf(this, l, x);
    return i2 < 0 || wordStr(x).length !== 1 ? "" : s.slice(i2);
  };
  P["substringp"].fn = function (a, b) { return this.truth(wIndexOf(this, b, a) >= 0); };

  /* PRINT / SHOW / TYPE honor the display limits and FULLPRINTP */
  var origPrintFn = P["print"].fn;
  var origShowFn = P["show"].fn;
  var origTypeFn = P["type"].fn;
  P["print"].fn = P["pr"].fn = function () {
    if (!this.printLimitsOn()) return origPrintFn.apply(this, arguments);
    var vm = this;
    this.output(Array.prototype.map.call(arguments, function (x) { return fmtLimited(vm, x, "print"); }).join(" "));
  };
  P["show"].fn = function () {
    if (!this.printLimitsOn()) return origShowFn.apply(this, arguments);
    var vm = this;
    this.output(Array.prototype.map.call(arguments, function (x) { return fmtLimited(vm, x, "show"); }).join(" "));
  };
  P["type"].fn = function () {
    if (!this.printLimitsOn()) return origTypeFn.apply(this, arguments);
    var vm = this;
    this.typeOutput(Array.prototype.map.call(arguments, function (x) { return fmtLimited(vm, x, "type"); }).join(""));
  };
};
})(typeof window !== "undefined" ? window : globalThis);

