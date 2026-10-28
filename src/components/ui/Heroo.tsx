import { useEffect, useRef } from "react";
import bwSrc from "../../../public/assets/images/manat o x.png";
import chromeSrc from  "../../../public/assets/images/manat o x ic.png";
import "../../styles/Hero.css";

type HeroProps = {
  headline?: string;
  blurb?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Photo that sits in front. */
  frontSrc?: string;
  /** Glossy chrome image that sits behind and shows through the lens. */
  backSrc?: string;
  alt?: string;
};

type Box = { x: number; y: number; w: number; h: number };

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
};

const INK = "#131313";
const TAU = Math.PI * 2;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Where the portrait sits inside the hero. Wide screens: right side, full height. Narrow: top. */
function layout(W: number, H: number, ratio: number): Box {
  if (W / H > 0.95) {
    const h = H;
    const w = h * ratio;
    return { x: Math.max(0, W - w - W * 0.05), y: 0, w, h };
  }
  const h = Math.min((W * 1.1) / ratio, H * 0.72);
  const w = h * ratio;
  return { x: (W - w) / 2, y: 0, w, h };
}

/** Soft closed blob. Wobbles over time and stretches a little along its direction of travel. */
function blobPath(
  cx: number,
  cy: number,
  R: number,
  t: number,
  vx: number,
  vy: number
): Path2D {
  const N = 64;
  const pts: Array<[number, number]> = [];
  const speed = Math.hypot(vx, vy);
  const ux = speed > 1 ? vx / speed : 0;
  const uy = speed > 1 ? vy / speed : 0;
  const stretch = Math.min(0.28, speed / 2600);

  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU;
    const k =
      1 +
      0.07 * Math.sin(2 * a + t * 1.1 + 1.3) +
      0.05 * Math.sin(3 * a - t * 1.6) +
      0.035 * Math.sin(5 * a + t * 2.2 + 0.7) +
      0.02 * Math.sin(7 * a - t * 2.9);
    let x = Math.cos(a) * R * k;
    let y = Math.sin(a) * R * k;
    const along = x * ux + y * uy;
    x += ux * along * stretch;
    y += uy * along * stretch;
    pts.push([cx + x, cy + y]);
  }

  const path = new Path2D();
  const last = pts[N - 1];
  path.moveTo((last[0] + pts[0][0]) / 2, (last[1] + pts[0][1]) / 2);
  for (let i = 0; i < N; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % N];
    path.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
  }
  path.closePath();
  return path;
}

export default function Heroo({
  headline = "Be the Next Lyrikali",
  blurb = "Get playlist placements, boost your streams, and get your music heard by new a audience.",
  ctaLabel = "Tap In",
  ctaHref = "artists",
  frontSrc = bwSrc,
  backSrc = chromeSrc,
  alt = "Black and white portrait of a person in a cap. A chrome version of the same portrait shows through where you move the pointer.",
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    if (!hero || !back || !front) return;
    const bctx = back.getContext("2d");
    const fctx = front.getContext("2d");
    if (!bctx || !fctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let raf = 0;
    let visible = true;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let box: Box = { x: 0, y: 0, w: 0, h: 0 };
    let baseR = 80;
    let frontLayer: HTMLCanvasElement | null = null;

    // lens state
    let lx = 0;
    let ly = 0;
    let vx = 0;
    let vy = 0;
    let press = 0;
    let started = false;
    let t0 = 0;
    let last = 0;
    const sparks: Spark[] = [];

    const ptr = {
      x: 0,
      y: 0,
      active: false,
      down: false,
      holdUntil: 0,
      mouse: false,
      overLink: false,
    };

    const frontImg = new Image();
    const backImg = new Image();
    const load = (img: HTMLImageElement, src: string) =>
      new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Could not load ${src}`));
        img.src = src;
      });

    /* ---------- sizing + static layers ---------- */
    const resize = () => {
      W = hero.clientWidth;
      H = hero.clientHeight;
      if (!W || !H || !frontImg.naturalWidth) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      for (const c of [back, front]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }

      box = layout(W, H, frontImg.naturalWidth / frontImg.naturalHeight);
      baseR = Math.max(58, box.w * 0.14);

      // chrome portrait, behind
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, W, H);
      bctx.drawImage(backImg, box.x, box.y, box.w, box.h);

      // photo with feathered edges, flattened onto the ink so nothing behind it ghosts through
      const photo = document.createElement("canvas");
      photo.width = front.width;
      photo.height = front.height;
      const pctx = photo.getContext("2d");
      const layer = document.createElement("canvas");
      layer.width = front.width;
      layer.height = front.height;
      const lctx = layer.getContext("2d");
      if (!pctx || !lctx) return;

      pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pctx.drawImage(frontImg, box.x, box.y, box.w, box.h);
      pctx.globalCompositeOperation = "destination-in";

      const fx = (box.w * 0.1) / box.w;
      const ft = (box.h * 0.04) / box.h;
      const fb = (box.h * 0.12) / box.h;

      let g = pctx.createLinearGradient(box.x, 0, box.x + box.w, 0);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(fx, "#000");
      g.addColorStop(1 - fx, "#000");
      g.addColorStop(1, "rgba(0,0,0,0)");
      pctx.fillStyle = g;
      pctx.fillRect(0, 0, W, H);

      g = pctx.createLinearGradient(0, box.y, 0, box.y + box.h);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(ft, "#000");
      g.addColorStop(1 - fb, "#000");
      g.addColorStop(1, "rgba(0,0,0,0)");
      pctx.fillStyle = g;
      pctx.fillRect(0, 0, W, H);

      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.fillStyle = INK;
      lctx.fillRect(0, 0, W, H);
      lctx.drawImage(photo, 0, 0, W, H);
      frontLayer = layer;

      if (!started) {
        lx = box.x + box.w * 0.5;
        ly = box.y + box.h * 0.5;
      }
    };

    /* ---------- the burning edge ---------- */
    const drawBurn = (path: Path2D, t: number) => {
      const ctx = fctx;

      // warm bleed just inside the hole
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.clip(path);
      const rg = ctx.createRadialGradient(lx, ly, 0, lx, ly, currentR * 1.08);
      rg.addColorStop(0, "rgba(255,110,20,0)");
      rg.addColorStop(0.7, "rgba(255,110,20,0)");
      rg.addColorStop(1, "rgba(255,110,20,0.26)");
      ctx.fillStyle = rg;
      ctx.fillRect(lx - currentR * 1.3, ly - currentR * 1.3, currentR * 2.6, currentR * 2.6);
      ctx.restore();

      // char ring, outside the hole only
      ctx.save();
      const outside = new Path2D();
      outside.rect(0, 0, W, H);
      outside.addPath(path);
      ctx.clip(outside, "evenodd");
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(18,6,0,0.6)";
      ctx.lineWidth = 22;
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 18 * dpr;
      ctx.stroke(path);
      ctx.restore();

      // ember glow
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(255,110,10,0.22)";
      ctx.lineWidth = 10;
      ctx.shadowColor = "rgba(255,120,20,0.9)";
      ctx.shadowBlur = 22 * dpr;
      ctx.stroke(path);
      ctx.restore();

      // uneven ember line: hot and dim stretches that slowly rotate
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.6;
      if (typeof ctx.createConicGradient === "function") {
        const cg = ctx.createConicGradient(reduced ? 0 : t * 0.6, lx, ly);
        cg.addColorStop(0, "#ffe4a0");
        cg.addColorStop(0.14, "#ff9528");
        cg.addColorStop(0.3, "#c85a10");
        cg.addColorStop(0.46, "#ff8a1f");
        cg.addColorStop(0.62, "#ffd98a");
        cg.addColorStop(0.8, "#e8741a");
        cg.addColorStop(1, "#ffe4a0");
        ctx.strokeStyle = cg;
      } else {
        ctx.strokeStyle = "#ffa03a";
      }
      ctx.stroke(path);
      ctx.restore();

      // thin hot core
      ctx.save();
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(255,244,214,0.8)";
      ctx.lineWidth = 0.9;
      ctx.stroke(path);
      ctx.restore();
    };

    const spawnSparks = (dt: number, intro: boolean) => {
      if (reduced) return;
      const rate = intro ? 160 : 55;
      let n = dt * rate;
      while (n > 0) {
        if (n < 1 && Math.random() > n) break;
        n -= 1;
        if (sparks.length > 140) break;
        const a = Math.random() * TAU;
        const r = currentR * (1 + (Math.random() - 0.3) * 0.06);
        sparks.push({
          x: lx + Math.cos(a) * r,
          y: ly + Math.sin(a) * r,
          vx: (Math.random() - 0.5) * 36 - vx * 0.08,
          vy: -(14 + Math.random() * 46) - vy * 0.08,
          age: 0,
          life: 0.5 + Math.random() * 0.9,
          size: 0.7 + Math.random() * 1.5,
        });
      }
    };

    const drawSparks = (dt: number) => {
      const ctx = fctx;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.985;
        const k = 1 - s.age / s.life;
        ctx.fillStyle = `rgba(255,${Math.round(150 + 90 * k)},${Math.round(40 + 70 * k)},${(
          0.9 * k
        ).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (0.4 + 0.6 * k), 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawCross = () => {
      if (!ptr.mouse || !ptr.active || ptr.overLink) return;
      const ctx = fctx;
      const { x, y } = ptr;
      ctx.save();
      ctx.lineCap = "butt";
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 9, y);
      ctx.lineTo(x + 9, y);
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x, y + 9);
      ctx.stroke();
      ctx.strokeStyle = "rgba(170,230,255,0.95)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    /* ---------- frame loop ---------- */
    let currentR = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!frontLayer || !visible) return;
      if (!started) {
        started = true;
        t0 = now;
        last = now;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const t = (now - t0) / 1000;

      const faceX = box.x + box.w * 0.5;
      const faceY = box.y + box.h * 0.5;
      const introDone = reduced || t > 2.4;
      const live = ptr.active || now < ptr.holdUntil;

      let tx = faceX;
      let ty = faceY;
      if (introDone) {
        if (live) {
          tx = ptr.x;
          ty = ptr.y;
        } else if (!reduced) {
          tx = faceX + Math.cos(t * 0.7) * box.w * 0.2;
          ty = faceY + Math.sin(t * 0.9) * box.h * 0.14;
        }
      }

      const k = reduced ? 1 : 1 - Math.exp(-dt * 7);
      const px = lx;
      const py = ly;
      lx += (tx - lx) * k;
      ly += (ty - ly) * k;
      vx += ((lx - px) / dt - vx) * 0.2;
      vy += ((ly - py) / dt - vy) * 0.2;
      press += ((ptr.down ? 1 : 0) - press) * (1 - Math.exp(-dt * 10));

      // one orchestrated moment: the frame burns open, then closes down to a lens
      const peak = Math.min(box.w * 0.62, Math.hypot(W, H) * 0.5);
      let R: number;
      if (reduced) R = baseR;
      else if (t < 0.3) R = 0;
      else if (t < 1.3) R = peak * easeOutCubic((t - 0.3) / 1.0);
      else if (t < 1.7) R = peak;
      else if (t < 2.8) R = peak + (baseR - peak) * easeInOutCubic((t - 1.7) / 1.1);
      else R = baseR;
      if (introDone) R *= 1 + 0.55 * press;
      currentR = R;

      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.globalCompositeOperation = "source-over";
      fctx.shadowBlur = 0;
      fctx.clearRect(0, 0, W, H);
      fctx.drawImage(frontLayer, 0, 0, W, H);

      if (R > 1) {
        const path = blobPath(lx, ly, R, reduced ? 0 : t, vx, vy);
        fctx.globalCompositeOperation = "destination-out";
        fctx.fill(path);
        fctx.globalCompositeOperation = "source-over";
        drawBurn(path, t);
        spawnSparks(dt, !introDone);
      }
      drawSparks(dt);
      drawCross();
    };

    /* ---------- input ---------- */
    const local = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.mouse = e.pointerType === "mouse";
      ptr.overLink = !!(e.target as Element | null)?.closest?.("a,button");
    };
    const onMove = (e: PointerEvent) => {
      local(e);
      ptr.active = true;
    };
    const onDown = (e: PointerEvent) => {
      local(e);
      ptr.active = true;
      ptr.down = true;
    };
    const onUp = (e: PointerEvent) => {
      ptr.down = false;
      if (e.pointerType !== "mouse") {
        ptr.holdUntil = performance.now() + 1600;
        ptr.active = false;
      }
    };
    const onLeave = () => {
      ptr.active = false;
      ptr.down = false;
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerdown", onDown);
    hero.addEventListener("pointerup", onUp);
    hero.addEventListener("pointercancel", onUp);
    hero.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => resize());
    ro.observe(hero);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) last = performance.now();
    });
    io.observe(hero);

    Promise.all([load(frontImg, frontSrc), load(backImg, backSrc)])
      .then(() => {
        if (cancelled) return;
        resize();
        raf = requestAnimationFrame(frame);
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onDown);
      hero.removeEventListener("pointerup", onUp);
      hero.removeEventListener("pointercancel", onUp);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [frontSrc, backSrc]);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__stage" role="img" aria-label={alt}>
        <canvas ref={backRef} className="hero__canvas" aria-hidden="true" />
        <canvas ref={frontRef} className="hero__canvas" aria-hidden="true" />
      </div>

      <div className="hero__copy">
        <h1 className="hero__title">{headline}</h1>
        <p className="hero__blurb">{blurb}</p>
        <a className="btn-grad" href={ctaHref}>
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
