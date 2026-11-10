/* =========================================================================
   BROWSER TURTLE - a canvas implementation of the Berkeley Logo turtle.
   Turtle coordinates follow the manual: the graphics window shows roughly
   turtle coordinates -100..100, with x to the right and y upward.
   Extracted verbatim from the original app, plus the null-canvas tolerance
   patches marked BUILD PATCH (headless validation).
   ========================================================================= */
class LogoTurtle {
  constructor(drawCanvas, turtleCanvas) {
    this.dc = drawCanvas; this.tc = turtleCanvas;
    /* BUILD PATCH (null-canvas tolerance): when instantiated
       without canvases (headless validation), skip 2D contexts entirely.
       All drawing becomes no-op; position/heading state still tracks. */
    if (drawCanvas && drawCanvas.getContext) {
      this.dctx = drawCanvas.getContext("2d"); this.tctx = turtleCanvas.getContext("2d");
      this.W = drawCanvas.width; this.H = drawCanvas.height;
    } else {
      this.dctx = null; this.tctx = null; this.W = 200; this.H = 200;
    }
    /* END BUILD PATCH */
    this.scale = Math.min(this.W, this.H) / 200;   // turtle units -> pixels
    this.mode = "wrap";
    this.penMode = "paint";
    this.PALETTE = ["#000000","#0000ff","#00aa00","#00cccc","#ee0000","#cc00cc","#e8c800","#ffffff",
                    "#8b4513","#d2b48c","#228b22","#7fffd4","#fa8072","#800080","#ff8c00","#808080"];
    this.userPal = {};
    this.labelHeight = 14;
    this.path = [];
    this.clear(true);
  }
  /* ---- geometry helpers ---- */
  px(x) { return this.W / 2 + x * this.scale; }
  py(y) { return this.H / 2 - y * this.scale; }
  uw() { return this.W / 2 / this.scale; }   // half width in turtle units
  uh() { return this.H / 2 / this.scale; }   // half height in turtle units
  seg(x1, y1, x2, y2) {
    if (!this.dctx) return; /* BUILD PATCH */
    const c = this.dctx; c.save(); c.beginPath();
    c.moveTo(this.px(x1), this.py(y1)); c.lineTo(this.px(x2), this.py(y2));
    c.strokeStyle = this.penMode === "erase" ? this.bg : this.colCss;
    c.lineWidth = this.size; c.lineCap = "round"; c.stroke(); c.restore();
    if (this.penMode === "reverse") {
      // reverse mode paints the background colour over what is already there
      const c2 = this.dctx; c2.save(); c2.beginPath();
      c2.moveTo(this.px(x1), this.py(y1)); c2.lineTo(this.px(x2), this.py(y2));
      c2.strokeStyle = this.bg; c2.lineWidth = this.size; c2.lineCap = "round"; c2.stroke(); c2.restore();
    }
  }
  track(x, y) { this.path.push([x, y]); }
  /* ---- motion ---- */
  forward(d) {
    const r = this.h * Math.PI / 180, dx = Math.sin(r), dy = Math.cos(r);
    if (this.mode === "window") {
      const nx = this.x + d * dx, ny = this.y + d * dy;
      if (this.pen) { this.seg(this.x, this.y, nx, ny); this.track(nx, ny); }
      this.x = nx; this.y = ny;
    } else if (this.mode === "fence") {
      const nx = this.x + d * dx, ny = this.y + d * dy;
      if (Math.abs(nx) > this.uw() || Math.abs(ny) > this.uh()) throw new Error("Turtle out of bounds");
      if (this.pen) { this.seg(this.x, this.y, nx, ny); this.track(nx, ny); }
      this.x = nx; this.y = ny;
    } else { // wrap
      let rem = Math.abs(d), sgn = d < 0 ? -1 : 1, guard = 0;
      const hw = this.uw(), hh = this.uh();
      while (rem > 1e-9 && guard++ < 2000) {
        const vx = sgn * dx, vy = sgn * dy;
        let t = rem;
        if (vx > 1e-12) t = Math.min(t, (hw - this.x) / vx);
        else if (vx < -1e-12) t = Math.min(t, (-hw - this.x) / vx);
        if (vy > 1e-12) t = Math.min(t, (hh - this.y) / vy);
        else if (vy < -1e-12) t = Math.min(t, (-hh - this.y) / vy);
        if (t < 0) t = 0;
        const nx = this.x + vx * t, ny = this.y + vy * t;
        if (this.pen) { this.seg(this.x, this.y, nx, ny); this.track(nx, ny); }
        this.x = nx; this.y = ny; rem -= t;
        if (rem > 1e-9) {
          if (Math.abs(this.x - hw) < 1e-6) this.x = -hw; else if (Math.abs(this.x + hw) < 1e-6) this.x = hw;
          if (Math.abs(this.y - hh) < 1e-6) this.y = -hh; else if (Math.abs(this.y + hh) < 1e-6) this.y = hh;
        }
      }
    }
    this.snap(); this.drawSprite();
  }
  snap() { const c = v => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v); this.x = c(this.x); this.y = c(this.y); }
  turn(a) { this.h = (((this.h + a) % 360) + 360) % 360; this.drawSprite(); }
  setpos(x, y) {
    if (this.pen) { this.seg(this.x, this.y, x, y); this.track(x, y); }
    else { this.path = [[x, y]]; }
    this.x = x; this.y = y; this.drawSprite();
  }
  setheading(a) { this.h = (((a % 360) + 360) % 360); this.drawSprite(); }
  pos() { return [this.x, this.y]; }
  heading() { return this.h; }
  arc(angle, radius) {
    if (!this.dctx) return; /* BUILD PATCH: headless guard */
    const c = this.dctx;
    const r = radius * this.scale;
    const start = (this.h - 90) * Math.PI / 180;   // canvas angle: 0 = east, positive = clockwise
    c.save();
    c.beginPath();
    c.arc(this.px(this.x), this.py(this.y), r, start, start + angle * Math.PI / 180, angle < 0);
    c.strokeStyle = this.penMode === "erase" ? this.bg : this.colCss;
    c.lineWidth = this.size; c.lineCap = "round"; c.stroke();
    c.restore();
    if (this.penMode === "reverse") { /* background already overpainted */ }
  }
  /* ---- pen ---- */
  setpen(v) { this.pen = v; if (!v) this.path = [[this.x, this.y]]; else if (!this.path.length) this.path = [[this.x, this.y]]; }
  pendown() { return this.pen; }
  setpenmode(m) { this.penMode = m; }
  penmode() { return this.penMode; }
  setshown(v) { this.shownFlag = v; this.drawSprite(); }
  shown() { return this.shownFlag; }
  setcolor(c) {
    if (Array.isArray(c)) {
      const k = c.map(v => Math.max(0, Math.min(255, Math.round(parseFloat(v) * 2.55))));
      this.col = c.slice(); this.colCss = `rgb(${k[0]},${k[1]},${k[2]})`;
    } else {
      const n = parseInt(c, 10);
      if (!(n >= 0 && n < 16)) throw new Error("setpencolor doesn't like " + c + " as input");
      this.col = n; this.colCss = this.PALETTE[n];
    }
  }
  color() { return this.col; }
  setpalette(n, c) {
    const k = c.map(v => Math.max(0, Math.min(255, Math.round(parseFloat(v) * 2.55))));
    this.userPal[n] = c.slice();
    this.PALETTE[n] = `rgb(${k[0]},${k[1]},${k[2]})`;
  }
  getpalette(n) { return this.userPal[n] || null; }
  setsize(s) { this.size = Math.max(0.5, s); }
  getsize() { return [this.size, this.size]; }
  getbg() { const i = this.PALETTE.indexOf(this.bg); return i >= 0 ? i : (this.bg.match(/\d+/g) || []).map(v => Math.round(v / 2.55)); }
  setbg(c) {
    if (Array.isArray(c)) { const k = c.map(v => Math.round(parseFloat(v) * 2.55)); this.bg = `rgb(${k[0]},${k[1]},${k[2]})`; }
    else { const n = parseInt(c, 10); if (!(n >= 0 && n < 16)) throw new Error("setbackground doesn't like " + c + " as input"); this.bg = this.PALETTE[n]; }
    if (this.dc && this.dc.style) this.dc.style.background = this.bg; /* BUILD PATCH */
  }
  bg() { return 0; }
  label(t) {
    if (!this.dctx) return; /* BUILD PATCH */
    const c = this.dctx; c.save();
    c.fillStyle = this.penMode === "erase" ? this.bg : this.colCss;
    c.font = this.labelHeight + "px Fira Mono, monospace";
    c.textBaseline = "bottom";
    c.fillText(t, this.px(this.x), this.py(this.y));
    c.restore();
  }
  setlabelheight(h) { this.labelHeight = h; }
  labelsize() { return this.labelHeight; }
  setmode(m) { this.mode = m; }
  getmode() { return this.mode; }
  fill() {
    if (this.path.length < 3) return false;
    if (!this.dctx) return true; /* BUILD PATCH */
    const c = this.dctx; c.save();
    c.beginPath();
    c.moveTo(this.px(this.path[0][0]), this.py(this.path[0][1]));
    for (let i = 1; i < this.path.length; i++) c.lineTo(this.px(this.path[i][0]), this.py(this.path[i][1]));
    c.closePath();
    c.fillStyle = this.penMode === "erase" ? this.bg : this.colCss;
    c.fill();
    c.restore();
    return true;
  }
  clear(home) {
    if (home) {
      this.x = 0; this.y = 0; this.h = 0; this.pen = true; this.shownFlag = true;
      this.col = 0; this.colCss = this.PALETTE[0]; this.size = 1.5; this.bg = "#ffffff";
      this.penMode = "paint"; this.mode = "wrap";
    }
    if (this.dctx) this.dctx.clearRect(0, 0, this.W, this.H); /* BUILD PATCH */
    if (home && this.dc && this.dc.style) this.dc.style.background = this.bg; /* BUILD PATCH */
    this.path = [[this.x, this.y]];
    this.drawSprite();
  }
  /* ---- saving a picture ---- */
  snapshot() { if (!this.dc || !this.dc.toDataURL) return null; return this.dc.toDataURL("image/png"); } /* BUILD PATCH */
  restore(data) {
    if (!this.dctx || typeof Image === "undefined") return; /* BUILD PATCH */
    const img = new Image();
    img.onload = () => { this.dctx.clearRect(0, 0, this.W, this.H); this.dctx.drawImage(img, 0, 0); };
    img.src = data;
  }
  drawSprite() {
    if (!this.tctx) return; /* BUILD PATCH */
    const c = this.tctx; c.clearRect(0, 0, this.W, this.H);
    if (!this.shownFlag) return;
    c.save();
    c.translate(this.px(this.x), this.py(this.y)); c.rotate(this.h * Math.PI / 180);
    const s = Math.max(0.7, this.scale * 0.9);
    c.beginPath(); c.moveTo(0, -9 * s / 1.4); c.lineTo(6 * s / 1.4, 7 * s / 1.4); c.lineTo(-6 * s / 1.4, 7 * s / 1.4); c.closePath();
    c.fillStyle = "rgba(2,132,199,0.28)"; c.strokeStyle = "#0284c7"; c.lineWidth = 1.4; c.fill(); c.stroke(); c.restore();
  }
}

/* make the class reachable in every environment */
(typeof window !== "undefined" ? window : globalThis).LogoTurtle = LogoTurtle;

