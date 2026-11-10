/*
 * Live photo: heat shimmer, rising steam that a passing hand stirs, glints and a slow "breath"
 * over a still food photo. Plain ES module, no dependencies.
 *
 *   import { mountLivePhoto } from './live-photo.js';
 *   const live = mountLivePhoto(element, { photo: '/img/grill.webp', depth: '/live-photo/depth.jpg' });
 *   live.destroy();   // when the element goes away
 *
 * The depth map is a grey mask of the food (white = food) with the photo's framing.
 * Without WebGL, with "reduce motion" on, or when the photo cannot be read, the plain photo stays.
 */

const DEFAULTS = { width: 1600, height: 1143, alt: '' };

const VS = 'attribute vec2 p; varying vec2 uv; void main(){ uv = vec2(p.x*0.5+0.5, 0.5-p.y*0.5); gl_Position = vec4(p,0.,1.); }';

function noiseSrc(octaves) {
  return [
    'float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }',
    'float vnoise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  f = f*f*(3.0-2.0*f);',
    '  return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x), mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y);',
    '}',
    'float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i=0;i<' + octaves + ';i++){ s += a*vnoise(p); p = p*2.03 + vec2(17.1, 9.7); a *= 0.5; } return s; }'
  ].join('\n');
}

/* ---------- PHOTO: heat shimmer, juiciness, glisten, warm light, vignette ---------- */
const HEAT_FS = [
  'precision highp float;',
  'varying vec2 uv;',
  'uniform sampler2D img; uniform sampler2D mask;',
  'uniform float t;',
  noiseSrc(2),
  'float src(vec2 p){ return smoothstep(0.62, 0.80, texture2D(mask, clamp(p, 0.0, 1.0)).r); }',
  'void main(){',
  '  // column of hot air above the food',
  '  float s = 0.0, ws = 0.0;',
  '  for (int k = 0; k < 5; k++) {',
  '    float fk = float(k);',
  '    float wt = exp(-fk*0.40);',
  '    s += src(vec2(uv.x, uv.y + fk*0.040))*wt; ws += wt;',
  '  }',
  '  float haze = smoothstep(0.05, 0.6, s/ws) * smoothstep(0.82, 0.55, uv.y);',
  '  // light air shimmer',
  '  vec2 n = vec2(vnoise(vec2(uv.x*16.0, uv.y*11.0 - t*0.9)), vnoise(vec2(uv.x*16.0 + 5.0, uv.y*11.0 - t*0.75 + 3.0))) - 0.5;',
  '  vec2 d = n * 0.0021 * haze;',
  '  vec3 col = texture2D(img, uv + d).rgb;',
  '  float food = src(uv);',
  '  // heat flicker: slow warm waves over the food',
  '  float fl = fbm(vec2(uv.x*2.6 + t*0.22, uv.y*2.1 - t*0.17));',
  '  col *= 1.0 + food * (fl - 0.5) * 0.12;',
  '  col += vec3(0.95, 0.42, 0.12) * food * smoothstep(0.52, 0.85, fl) * 0.034;',
  '  // juiciness: richer colour and a touch of contrast on the food',
  '  float l0 = dot(col, vec3(0.299, 0.587, 0.114));',
  '  col = max(mix(vec3(l0), col, 1.0 + food * 0.14), 0.0);',
  '  col = mix(col, col * col * (3.0 - 2.0 * col), food * 0.18);',
  '  float lum = dot(col, vec3(0.299, 0.587, 0.114));',
  '  // glistening: small oily highlights that breathe slowly',
  '  float oil = vnoise(vec2(uv.x * 38.0 + t * 0.35, uv.y * 38.0 - t * 0.25));',
  '  col += vec3(1.0, 0.95, 0.85) * smoothstep(0.62, 0.92, lum) * food * smoothstep(0.55, 0.95, oil) * 0.10;',
  '  // sliding highlight over gloss and sauce',
  '  float c = mix(-0.35, 1.75, fract(t / 17.0));',
  '  float pos = uv.x + uv.y * 0.45;',
  '  float band = exp(-pow((pos - c) / 0.11, 2.0));',
  '  float spec = smoothstep(0.50, 0.95, lum) * (0.35 + 0.65*food);',
  '  col += vec3(1.0, 0.93, 0.80) * band * spec * 0.24;',
  '  // appetite: warm golden light in the highlights',
  '  col *= mix(vec3(1.0), vec3(1.045, 1.0, 0.92), smoothstep(0.25, 0.90, lum));',
  '  // soft vignette: the edges recede, the food takes the eye',
  '  float vg = length((uv - vec2(0.5, 0.55)) * vec2(1.0, 1.15));',
  '  col *= 1.0 - smoothstep(0.35, 0.85, vg) * 0.26 * (1.0 - food * 0.8);',
  '  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);',
  '}'
].join('\n');

/* ---------- STEAM: thin wisps; a passing hand leaves an eddy that rises and fades ---------- */
const NP = 24;                                   // pointer trail length
const TRAIL = 2.1, EMIT = 0.09, RISE = 0.07;     // an eddy lives ~2 s and rises with the steam (uv/s)
const STEAM_FS = [
  'precision highp float;',
  'varying vec2 uv;',
  'uniform sampler2D mask;',
  'uniform float t; uniform float aspect;',
  'uniform vec4 pts[' + NP + '];',     // xy - position (uv), zw - velocity (uv/s)
  'uniform float ages[' + NP + '];',   // 1 - fresh point, 0 - faded
  noiseSrc(3),
  'float src(vec2 p){ return smoothstep(0.62, 0.80, texture2D(mask, clamp(p, 0.0, 1.0)).r); }',
  'void main(){',
  '  vec2 A = vec2(aspect, 1.0);',
  '  vec2 p = uv * A;',
  '  // pointer disturbance: a light drag along the hand, fading in and widening as it rises',
  '  vec2 acc = vec2(0.0); float wAcc = 0.0; float stir = 0.0;',
  '  for (int i = 0; i < ' + NP + '; i++) {',
  '    float ag = ages[i];',
  '    if (ag > 0.001) {',
  '      vec2 d = (uv - pts[i].xy) * A;',
  '      float r2 = 0.016 + 0.040 * (1.0 - ag);',
  '      float f = exp(-dot(d, d) / r2) * ag * ag * smoothstep(1.0, 0.86, ag);',
  '      vec2 v = pts[i].zw * A;',
  '      acc += (v * 0.035 + d * 0.06) * f;',
  '      wAcc += f;',
  '      stir += f * min(1.0, length(v) * 0.7);',
  '    }',
  '  }',
  '  vec2 push = acc / max(wAcc, 1.0);',
  '  stir = clamp(stir / max(wAcc, 1.0) * min(wAcc, 1.0), 0.0, 1.0);',
  '  vec2 pp = p - push;',
  '  // rise + swirls (domain warp)',
  '  vec2 q = pp*1.6; q.y += t*0.11;',
  '  vec2 w = vec2(fbm(q*1.3 + vec2(0.0, t*0.05)), fbm(q*1.3 + vec2(7.3, 2.1 - t*0.04)));',
  '  q += (w - 0.5) * (1.5 + stir*0.45);',
  '  float n = fbm(q * vec2(3.2, 1.6));',
  '  float ridge = 1.0 - abs(2.0*n - 1.0);',
  '  float wisp = pow(ridge, 4.5);',
  '  float fine = pow(1.0 - abs(2.0*vnoise(q*vec2(9.0,4.5)+3.1) - 1.0), 5.0);',
  '  float dens = wisp*0.85 + fine*0.45*wisp;',
  '  // source: food lower in the frame, steam rises up',
  '  vec2 uvd = pp / A;',
  '  float s = 0.0, wsum = 0.0;',
  '  for (int k = 0; k < 8; k++) {',
  '    float fk = float(k);',
  '    float wt = exp(-fk*0.30) * smoothstep(1.0, 3.0, fk);',
  '    vec2 sp = vec2(uvd.x + (w.x - 0.5)*0.07*fk, uvd.y + fk*0.042);',
  '    s += src(sp)*wt; wsum += wt;',
  '  }',
  '  s = s / wsum;',
  '  s = smoothstep(0.03, 0.50, s);',
  '  float onFood = src(uv);',
  '  s *= mix(1.0, 0.35, onFood);',
  '  s *= smoothstep(0.80, 0.50, uv.y);',
  '  float life = 0.55 + 0.45*vnoise(vec2(p.x*2.0, t*0.12));',
  '  float a = clamp(dens * s * life * 1.35, 0.0, 1.0) * 0.42;',
  '  a *= 1.0 - stir * 0.22;',                      // disturbed steam thins out, as real steam does
  '  a = min(a, 0.75);',
  '  vec3 col = vec3(1.0, 0.965, 0.915);',
  '  gl_FragColor = vec4(col * a, a);',
  '}'
].join('\n');

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';               // an image on another host (a CDN) needs CORS headers there
    im.decoding = 'async';
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('Live photo: cannot load ' + src));
    im.src = src;
  });
}

// a canvas refuses the pixels of an image it may not read (another origin without CORS, a file:// page)
function readable(img) {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 1;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0, 1, 1); g.getImageData(0, 0, 1, 1);
    return true;
  } catch (e) { return false; }
}

function compile(gl, fsSrc) {
  function shader(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('Live photo shader: ' + gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, fsSrc));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('Live photo program: ' + gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return prog;
}

function texture(gl, unit, image) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function uniforms(gl, prog, names) {
  const u = {};
  names.forEach((n) => { u[n] = gl.getUniformLocation(prog, n); });
  return u;
}

function makeSprite() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0.00, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  gr.addColorStop(0.70, 'rgba(255,255,255,0.14)');
  gr.addColorStop(1.00, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return c;
}

// bright, pale spots on the food: where the glints twinkle
function findGlints(photo, depth, IW, IH) {
  const S = 4, w = Math.round(IW / S), h = Math.round(IH / S);
  function pixels(img) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, w, h);
    return g.getImageData(0, 0, w, h).data;
  }
  const dp = pixels(depth), pp = pixels(photo);
  const cand = [];
  for (let y = 3; y < h - 3; y++) {
    for (let x = 3; x < w - 3; x++) {
      const i = (y * w + x) * 4;
      if (dp[i] / 255 < 0.72) continue;
      const r = pp[i], g = pp[i + 1], b = pp[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const v = mx / 255, sat = mx ? (mx - mn) / mx : 0;
      if (v > 0.90 && sat < 0.45) cand.push([x, y, v - sat * 0.3]);
    }
  }
  cand.sort((a, b) => b[2] - a[2]);
  const glints = [];
  for (let k = 0; k < cand.length && glints.length < 34; k++) {
    const c = cand[k];
    const near = glints.some((g) => {
      const dx = g.x - c[0] * S, dy = g.y - c[1] * S;
      return dx * dx + dy * dy < 45 * 45;
    });
    if (!near) glints.push({ x: c[0] * S, y: c[1] * S, r: 10 + Math.random() * 14,
      ph: Math.random() * 6.28, sp: 0.5 + Math.random() * 0.9, mx: 0.18 + Math.random() * 0.25 });
  }
  return glints;
}

function fill(el) {
  el.style.position = 'absolute';
  el.style.inset = '0';
  el.style.width = '100%';
  el.style.height = '100%';
  el.style.display = 'block';
  return el;
}

/**
 * Mounts a live photo inside `container` (its content is left alone, the photo is appended).
 * @returns {{ destroy(): void }}
 */
export function mountLivePhoto(container, options) {
  const opts = Object.assign({}, DEFAULTS, options);
  if (!opts.photo || !opts.depth) throw new Error('Live photo: `photo` and `depth` are required');
  const IW = opts.width, IH = opts.height, ASPECT = IW / IH;

  /* ---------- DOM ---------- */
  const stage = document.createElement('div');
  Object.assign(stage.style, { position: 'relative', width: '100%', aspectRatio: IW + ' / ' + IH, overflow: 'hidden',
    background: '#000', touchAction: 'pan-y', direction: 'ltr', webkitTapHighlightColor: 'transparent' });
  const layer = fill(document.createElement('div'));
  layer.style.transformOrigin = '50% 55%';
  layer.style.willChange = 'transform';
  const img = fill(document.createElement('img'));
  img.style.objectFit = 'cover';
  img.alt = opts.alt;
  img.decoding = 'async';
  img.src = opts.photo;
  const heatCanvas = fill(document.createElement('canvas'));
  const stCanvas = fill(document.createElement('canvas'));
  const fxCanvas = fill(document.createElement('canvas'));
  [heatCanvas, stCanvas, fxCanvas].forEach((c) => { c.setAttribute('aria-hidden', 'true'); c.style.pointerEvents = 'none'; });
  layer.append(img, heatCanvas, stCanvas, fxCanvas);
  stage.append(layer);
  container.append(stage);

  let destroyed = false;
  let raf = 0, visible = true, ready = false;
  let heat = null, steam = null;                 // declared before the early return: destroy() reads them
  const cleanups = [];
  function listen(target, type, fn, o) { target.addEventListener(type, fn, o); cleanups.push(() => target.removeEventListener(type, fn, o)); }

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const live = { destroy };
  if (reduce) return live;                       // "reduce motion": just the photo stays

  /* ---------- state ---------- */
  let photoW = IW;
  let glints = [];
  const fx = fxCanvas.getContext('2d');
  const sprite = makeSprite();
  const ptsArr = new Float32Array(NP * 4), agesArr = new Float32Array(NP), born = new Float32Array(NP).fill(-1000), baseY = new Float32Array(NP);
  let head = 0;
  const ptr = { x: 0, y: 0, sx: 0, sy: 0, vx: 0, vy: 0, have: false, active: false, lastEmit: 0, lastT: 0 };

  /* ---------- pointer (mouse and finger) ---------- */
  function onPointer(e) {
    const r = stage.getBoundingClientRect();
    ptr.x = (e.clientX - r.left) / r.width; ptr.y = (e.clientY - r.top) / r.height;
    if (!ptr.have) { ptr.sx = ptr.x; ptr.sy = ptr.y; ptr.vx = ptr.vy = 0; ptr.have = true; ptr.lastT = performance.now(); }
    ptr.active = true;
  }
  function onLeave() { ptr.active = false; ptr.have = false; }
  listen(stage, 'pointermove', onPointer);
  listen(stage, 'pointerdown', onPointer);
  listen(stage, 'pointerleave', onLeave);
  listen(stage, 'pointerup', onLeave);
  listen(stage, 'pointercancel', onLeave);

  function pushPoint(x, y, vx, vy, nowSec) {
    ptsArr[head * 4] = x; ptsArr[head * 4 + 1] = y; ptsArr[head * 4 + 2] = vx; ptsArr[head * 4 + 3] = vy;
    baseY[head] = y; born[head] = nowSec; head = (head + 1) % NP;
  }
  // once per frame: smoothed position, smoothed velocity, a trail point every EMIT seconds
  function updatePointer(nowMs) {
    if (!ptr.active) return;
    const dt = Math.max((nowMs - ptr.lastT) / 1000, 0.001); ptr.lastT = nowMs;
    const nx = ptr.sx + (ptr.x - ptr.sx) * 0.3, ny = ptr.sy + (ptr.y - ptr.sy) * 0.3;
    const vx = (nx - ptr.sx) / dt, vy = (ny - ptr.sy) / dt;
    ptr.sx = nx; ptr.sy = ny;
    ptr.vx += (vx - ptr.vx) * 0.25; ptr.vy += (vy - ptr.vy) * 0.25;
    const sp = Math.hypot(ptr.vx, ptr.vy), cap = 1.0;
    const k = sp > cap ? cap / sp : 1;
    if (sp > 0.06 && nowMs / 1000 - ptr.lastEmit > EMIT) {      // a still cursor leaves the steam alone
      ptr.lastEmit = nowMs / 1000;
      pushPoint(ptr.sx, ptr.sy, ptr.vx * k, ptr.vy * k, ptr.lastEmit);
    }
  }

  /* ---------- sizes and adaptive quality ---------- */
  const QS = [1, 0.8, 0.62];
  let qi = 0;
  function resize() {
    const r = stage.getBoundingClientRect();
    if (!r.width) return;
    const q = QS[qi];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fw = Math.min(Math.round(r.width), 1000);                                // glints are soft: 1x is enough
    fxCanvas.width = fw; fxCanvas.height = Math.round(fw * IH / IW);
    const hw = Math.min(photoW, Math.max(Math.round(r.width * dpr), 900));        // photo: full resolution, never lowered
    heatCanvas.width = hw; heatCanvas.height = Math.round(hw * IH / IW);
    const sw = Math.min(Math.round(r.width * dpr * q), 720);                       // steam is soft: smaller is enough
    stCanvas.width = sw; stCanvas.height = Math.round(sw * IH / IW);
    if (heat) heat.gl.viewport(0, 0, heatCanvas.width, heatCanvas.height);
    if (steam) steam.gl.viewport(0, 0, stCanvas.width, stCanvas.height);
  }
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(resize); ro.observe(stage); cleanups.push(() => ro.disconnect());
  } else {
    listen(window, 'resize', resize);
  }

  /* ---------- loop ---------- */
  const t0 = performance.now(), T_OFFSET = 40;
  let lastNow = 0, ema = 16, lastAdj = 0;
  function frame(now) {
    raf = 0;
    if (destroyed || !ready || !visible || document.hidden) return;
    const fdt = now - lastNow; lastNow = now;
    if (fdt > 0 && fdt < 200) ema += (fdt - ema) * 0.08;
    if (now - lastAdj > 1500 && ema > 24 && qi < QS.length - 1) { qi++; lastAdj = now; resize(); }   // falling behind -> lower the steam resolution
    else if (lastAdj === 0) lastAdj = now;
    const t = (now - t0) / 1000 + T_OFFSET;
    const nowSec = now / 1000;
    updatePointer(now);

    // a slow breath: zoom in and out over 16 s
    const b = 0.5 - 0.5 * Math.cos(Math.PI * t / 16);
    layer.style.transform = 'scale(' + (1 + 0.018 * b) + ') translate3d(' + (-0.3 * b) + '%, ' + (-0.2 * b) + '%, 0)';

    const g1 = heat.gl;
    g1.uniform1f(heat.U.t, t);
    g1.drawArrays(g1.TRIANGLE_STRIP, 0, 4);

    const g2 = steam.gl;
    for (let i = 0; i < NP; i++) {
      const el = nowSec - born[i], a = 1 - el / TRAIL;
      agesArr[i] = a > 0 ? a : 0;
      ptsArr[i * 4 + 1] = baseY[i] - RISE * el;   // carried upward with the steam
    }
    g2.clearColor(0, 0, 0, 0);
    g2.clear(g2.COLOR_BUFFER_BIT);
    g2.uniform1f(steam.U.t, t);
    g2.uniform4fv(steam.U.pts, ptsArr);
    g2.uniform1fv(steam.U.ages, agesArr);
    g2.drawArrays(g2.TRIANGLE_STRIP, 0, 4);

    const k = fxCanvas.width / IW;
    fx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    fx.globalCompositeOperation = 'lighter';
    for (const g of glints) {
      const v = 0.5 + 0.5 * Math.sin(t * g.sp + g.ph);
      const al = g.mx * v * v;
      if (al < 0.02) continue;
      const sz = g.r * (0.8 + 0.5 * v) * 2 * k;
      fx.globalAlpha = al;
      fx.drawImage(sprite, g.x * k - sz / 2, g.y * k - sz / 2, sz, sz);
    }
    fx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function wake() { if (!raf && ready && visible && !document.hidden && !destroyed) raf = requestAnimationFrame(frame); }
  listen(document, 'visibilitychange', wake);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; wake(); });
    io.observe(stage); cleanups.push(() => io.disconnect());
  }

  /* ---------- start ---------- */
  function initGL(canvas, fs, glOpts, names) {
    const gl = canvas.getContext('webgl', glOpts);
    if (!gl) throw new Error('Live photo: WebGL is not available');
    const prog = compile(gl, fs);
    return { gl, U: uniforms(gl, prog, names) };
  }

  Promise.all([loadImage(opts.photo), loadImage(opts.depth)]).then(([photo, depth]) => {
    if (destroyed) return;
    if (!readable(photo) || !readable(depth)) {
      console.warn('Live photo: the browser does not let the page read the images (another host without CORS, or a page opened from disk); the plain photo stays');
      return;
    }
    if (Math.abs(photo.naturalWidth / photo.naturalHeight - ASPECT) > 0.01) {
      console.warn('Live photo: the photo is ' + photo.naturalWidth + 'x' + photo.naturalHeight + ', its framing differs from the depth map (' + IW + 'x' + IH + '): the effects will not line up');
    }
    photoW = photo.naturalWidth;
    glints = findGlints(photo, depth, IW, IH);
    heat = initGL(heatCanvas, HEAT_FS, { alpha: false, antialias: false }, ['img', 'mask', 't']);
    texture(heat.gl, 0, photo); texture(heat.gl, 1, depth);
    heat.gl.uniform1i(heat.U.img, 0); heat.gl.uniform1i(heat.U.mask, 1);
    steam = initGL(stCanvas, STEAM_FS, { alpha: true, premultipliedAlpha: true, antialias: false }, ['mask', 't', 'aspect', 'pts', 'ages']);
    texture(steam.gl, 0, depth);
    steam.gl.uniform1i(steam.U.mask, 0);
    steam.gl.uniform1f(steam.U.aspect, ASPECT);
    steam.gl.enable(steam.gl.BLEND);
    steam.gl.blendFunc(steam.gl.ONE, steam.gl.ONE_MINUS_SRC_ALPHA);
    resize();
    ready = true;
    wake();
  }).catch((e) => {
    if (destroyed) return;
    heatCanvas.style.display = stCanvas.style.display = fxCanvas.style.display = 'none';   // the plain photo stays
    console.warn(e);
  });

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (raf) cancelAnimationFrame(raf);
    cleanups.forEach((fn) => fn());
    [heat, steam].forEach((s) => {
      const ext = s && s.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();                // browsers allow only a few live WebGL contexts per page
    });
    stage.remove();
  }
  return live;
}
