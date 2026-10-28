import { useEffect, useRef } from "react";
import "../../styles/TrendingMusic.css";


export default function TrendingMusic() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.innerHTML = `<div class="ambient" aria-hidden="true">
    <img id="amb-a" src alt="" />
    <img id="amb-b" alt="" />
  </div>
  <div class="vignette"></div>

  <main class="stage">
    <div class="brand">Trending</div>

    <div class="carousel-wrap" id="wrap">
      <div class="carousel is-playing" id="carousel" aria-label="Trending albums"></div>
      <p class="hint" id="hint">Click a cover or swipe to browse</p>
    </div>

    <div class="player-wrap">
      <div class="player playing" id="player" role="region" aria-label="Now playing">
        <div class="transport">
          <button type="button" id="prev-btn" aria-label="Previous track">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.5 18.25V5.75L3.2 12l8.3 6.25zm9.3 0V5.75L12.5 12l8.3 6.25z"/></svg>
          </button>
          <button type="button" class="play-btn" id="play-btn" aria-label="Pause">
            <span class="icon-play">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.2v13.6l11-6.8-11-6.8z"/></svg>
            </span>
            <span class="icon-pause">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6.4 5h3.4v14H6.4zm7.8 0h3.4v14h-3.4z"/></svg>
            </span>
          </button>
          <button type="button" id="next-btn" aria-label="Next track">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.5 5.75v12.5L20.8 12l-8.3-6.25zM3.2 5.75v12.5L11.5 12 3.2 5.75z"/></svg>
          </button>
        </div>

        <div class="track-pill">
          <img class="mini" id="mini-cover" alt="" />
          <div class="track-copy">
            <strong id="mini-title">Blinding Lights</strong>
            <span id="mini-artist">The Weeknd</span>
          </div>
          <div class="eq" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="pill-actions">
            <button type="button" id="cast-btn" aria-label="AirPlay">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="4.5" width="17" height="12" rx="2"/><path d="M8 19.5h8M12 16.5v3"/></svg>
            </button>
            <button type="button" id="more-btn" aria-label="More">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
            </button>
          </div>
        </div>

        <div class="extras">
          <button type="button" id="lyrics-btn" class="hide-sm" aria-label="Lyrics">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 15.5c0 1.4 1.3 2.5 3 2.5H8l2.2 2.4c.2.2.6.05.6-.25V18h3.3c1.7 0 3-1.1 3-2.5v-1"/><path d="M7.5 6.5h9c1.7 0 3 1.1 3 2.5v4c0 1.4-1.3 2.5-3 2.5H14l-2.2 2.4c-.2.2-.6.05-.6-.25V15.5H7.5c-1.7 0-3-1.1-3-2.5v-4c0-1.4 1.3-2.5 3-2.5z"/></svg>
          </button>
          <button type="button" id="queue-btn" aria-label="Queue">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
          </button>
          <button type="button" id="vol-btn" aria-label="Volume">
            <svg id="vol-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h3.2L12 18V6L7.2 10H4z"/><path d="M16 9.2a4 4 0 0 1 0 5.6M18.5 7a7 7 0 0 1 0 10"/></svg>
          </button>

          <div class="vol-pop" id="vol-pop">
            <button type="button" id="mute-btn" aria-label="Mute">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10v4h3.2L12 18V6L7.2 10H4z"/></svg>
            </button>
            <input type="range" id="vol-range" min="0" max="100" value="80" aria-label="Volume level" />
            <span class="vol-label" id="vol-label">80</span>
          </div>

          <div class="more-menu" id="more-menu" role="menu">
            <button type="button" data-act="love">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z"/></svg>
              Love
            </button>
            <button type="button" data-act="library">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>
              Add to Library
            </button>
            <button type="button" data-act="share">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="M8.2 13.1 15.8 17.4M15.8 6.6 8.2 10.9"/></svg>
              Share Song
            </button>
            <button type="button" data-act="album">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2"/></svg>
              View Album
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div class="overlay" id="overlay"></div>

  <aside class="sheet" id="queue-sheet" aria-label="Up next">
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <h2>Up Next</h2>
      <button type="button" class="close" data-close="queue" aria-label="Close queue">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="sheet-body" id="queue-body"></div>
  </aside>

  <aside class="sheet" id="lyrics-sheet" aria-label="Lyrics">
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <h2 id="lyrics-heading">Lyrics</h2>
      <button type="button" class="close" data-close="lyrics" aria-label="Close lyrics">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="sheet-body" id="lyrics-body"></div>
  </aside>

  <div class="toast" id="toast" role="status"></div>`;

    const script = document.createElement("script");
    script.textContent = `const songs = [
      {
        title: "Heat Waves",
        artist: "Glass Animals",
        cover: "/assets/images/cosignblack.jpg",
        color: "#e07c3c",
        lyrics: [
          "Summer never asked to stay this long",
          "Windows down, the city hums along",
          "I keep your name in the afterglow",
          "Heat on the glass, don't let me go",
          "Call me when the night forgets the day"
        ]
      },
      {
        title: "Levitating",
        artist: "Dua Lipa",
        cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&h=600&q=80",
        color: "#7b5ea7",
        lyrics: [
          "Disco moons above a velvet floor",
          "You took my hand, we left the ground",
          "Glitter in the bloodstream, wanting more",
          "If this is flying, don't come down"
        ]
      },
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&h=600&q=80",
        color: "#e8943a",
        lyrics: [
          "Neon rivers down the avenue",
          "Heartbeat syncing with the bass",
          "Don't you fade, don't you fade",
          "We're alive in the afterglow",
          "City never sleeps, and neither do I"
        ]
      },
      {
        title: "As It Was",
        artist: "Harry Styles",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&h=600&q=80",
        color: "#3d9b8f",
        lyrics: [
          "Hold the frame, the world keeps turning",
          "Same old street, a different sky",
          "Tell me we can pause the burning",
          "Leave it just as it was tonight"
        ]
      },
      {
        title: "Stay",
        artist: "The Kid LAROI",
        cover: "https://images.unsplash.com/photo-1459749411177-04ef7967844e?auto=format&fit=crop&w=600&h=600&q=80",
        color: "#c45c6a",
        lyrics: [
          "I know the door is half-way open",
          "I know the morning wants you gone",
          "Stay until the record's broken",
          "Stay until we write the song"
        ]
      },
      {
        title: "Anti-Hero",
        artist: "Taylor Swift",
        cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80",
        color: "#d44c4c",
        lyrics: [
          "Mirror talks in someone else's voice",
          "I show up late to my own life",
          "If I'm the problem, that's a choice",
          "I'll still dance through the static night"
        ]
      },
      {
        title: "About Damn Time",
        artist: "Lizzo",
        cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=600&h=600&q=80",
        color: "#d4a017",
        lyrics: [
          "Felt the sun remember my name",
          "Took the long way back to joy",
          "If the world was waiting, I became",
          "The reason that I make this noise"
        ]
      }
    ];

    const n = songs.length;
    let current = 2;
    let isPlaying = true;
    let volume = 80;
    let muted = false;
    let toastTimer = 0;
    let lyricTimer = 0;
    let lyricIndex = 0;

    const carousel = document.getElementById("carousel");
    const player = document.getElementById("player");
    const wrap = document.getElementById("wrap");
    const miniCover = document.getElementById("mini-cover");
    const miniTitle = document.getElementById("mini-title");
    const miniArtist = document.getElementById("mini-artist");
    const playBtn = document.getElementById("play-btn");
    const ambA = document.getElementById("amb-a");
    const ambB = document.getElementById("amb-b");
    const hint = document.getElementById("hint");
    const overlay = document.getElementById("overlay");
    const queueSheet = document.getElementById("queue-sheet");
    const lyricsSheet = document.getElementById("lyrics-sheet");
    const queueBody = document.getElementById("queue-body");
    const lyricsBody = document.getElementById("lyrics-body");
    const volPop = document.getElementById("vol-pop");
    const moreMenu = document.getElementById("more-menu");
    const volRange = document.getElementById("vol-range");
    const volLabel = document.getElementById("vol-label");
    const toastEl = document.getElementById("toast");

    function initials(title) {
      return title.split(/+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
    }

    function wrappedOffset(i, cur, len) {
      let o = i - cur;
      const half = len / 2;
      if (o > half) o -= len;
      if (o < -half) o += len;
      return o;
    }

    songs.forEach((song, i) => {
      const card = document.createElement("article");
      card.className = "album-card";
      card.dataset.index = String(i);
      card.style.setProperty("--card-color", song.color);
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", song.title + " by " + song.artist);
      card.innerHTML =
        '<img class="cover" alt="" />' +
        '<div class="fallback">' + initials(song.title) + "</div>" +
        '<div class="meta"><div class="title"></div><div class="artist"></div></div>';
      const img = card.querySelector("img");
      img.alt = song.title;
      img.src = song.cover;
      img.addEventListener("error", () => {
        img.style.display = "none";
        card.querySelector(".fallback").style.display = "flex";
      });
      card.querySelector(".title").textContent = song.title;
      card.querySelector(".artist").textContent = song.artist;
      carousel.appendChild(card);
    });

    const cards = Array.from(carousel.querySelectorAll(".album-card"));

    function renderCards() {
      cards.forEach((card, i) => {
        const o = wrappedOffset(i, current, n);
        card.dataset.offset = String(o);
        card.classList.toggle("is-away", Math.abs(o) > 2);
      });
    }

    function setAmbient(url) {
      const incoming = ambA.classList.contains("on") ? ambB : ambA;
      const outgoing = incoming === ambA ? ambB : ambA;
      const reveal = () => {
        incoming.classList.add("on");
        outgoing.classList.remove("on");
        incoming.removeEventListener("load", reveal);
      };
      incoming.addEventListener("load", reveal);
      incoming.src = url;
      if (incoming.complete && incoming.src) reveal();
    }

    function renderQueue() {
      queueBody.innerHTML = songs.map((s, i) => {
        const cur = i === current ? " current" : "";
        return (
          '<button type="button" class="q-item' + cur + '" data-go="' + i + '">' +
            '<img src="' + s.cover + '" alt="" />' +
            '<div class="q-meta"><strong>' + s.title + "</strong><span>" + s.artist + "</span></div>" +
            (i === current && isPlaying
              ? '<div class="eq" style="display:flex"><i></i><i></i><i></i></div>'
              : "") +
          "</button>"
        );
      }).join("");
    }

    function renderLyrics() {
      const s = songs[current];
      document.getElementById("lyrics-heading").textContent = s.title;
      lyricsBody.innerHTML = s.lyrics
        .map((line, i) => '<p class="lyrics-line' + (i === lyricIndex ? " on" : "") + '">' + line + "</p>")
        .join("");
    }

    function tickLyrics() {
      const lines = lyricsBody.querySelectorAll(".lyrics-line");
      if (!lines.length) return;
      lines.forEach(el => el.classList.remove("on"));
      lyricIndex = (lyricIndex + 1) % lines.length;
      lines[lyricIndex].classList.add("on");
      lines[lyricIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function updatePlayer() {
      const s = songs[current];
      miniCover.src = s.cover;
      miniTitle.textContent = s.title;
      miniArtist.textContent = s.artist;
      document.documentElement.style.setProperty("--accent", s.color);
      setAmbient(s.cover);
      player.classList.toggle("playing", isPlaying);
      carousel.classList.toggle("is-playing", isPlaying);
      playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
      renderQueue();
      lyricIndex = 0;
      renderLyrics();
    }

    function goTo(index) {
      current = ((index % n) + n) % n;
      renderCards();
      updatePlayer();
      hideHint();
    }

    function togglePlay() {
      isPlaying = !isPlaying;
      player.classList.toggle("playing", isPlaying);
      carousel.classList.toggle("is-playing", isPlaying);
      playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
      renderQueue();
      if (isPlaying) startLyrics();
      else stopLyrics();
    }

    function startLyrics() {
      stopLyrics();
      lyricTimer = setInterval(tickLyrics, 2800);
    }
    function stopLyrics() { clearInterval(lyricTimer); }

    function hideHint() {
      hint.classList.add("hide");
    }

    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
    }

    function closePops() {
      volPop.classList.remove("open");
      moreMenu.classList.remove("open");
      document.getElementById("vol-btn").classList.remove("active");
      document.getElementById("more-btn").classList.remove("active");
    }

    function closeSheets() {
      queueSheet.classList.remove("open");
      lyricsSheet.classList.remove("open");
      overlay.classList.remove("show");
      document.getElementById("queue-btn").classList.remove("active");
      document.getElementById("lyrics-btn").classList.remove("active");
    }

    function openSheet(which) {
      closePops();
      const isQueue = which === "queue";
      const sheet = isQueue ? queueSheet : lyricsSheet;
      const other = isQueue ? lyricsSheet : queueSheet;
      other.classList.remove("open");
      sheet.classList.add("open");
      overlay.classList.add("show");
      document.getElementById("queue-btn").classList.toggle("active", isQueue);
      document.getElementById("lyrics-btn").classList.toggle("active", !isQueue);
    }

    let startX = 0;
    let dragging = false;
    let suppressClick = false;

    wrap.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      dragging = false;
    });
    wrap.addEventListener("pointermove", (e) => {
      if (Math.abs(e.clientX - startX) > 10) dragging = true;
    });
    wrap.addEventListener("pointerup", (e) => {
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) {
        const steps = Math.round(dx / 130) || (dx > 0 ? 1 : -1);
        goTo(current - steps);
        suppressClick = true;
      }
    });

    carousel.addEventListener("click", (e) => {
      if (suppressClick) { suppressClick = false; return; }
      const card = e.target.closest(".album-card");
      if (!card) return;
      const i = Number(card.dataset.index);
      if (i === current) togglePlay();
      else goTo(i);
    });

    document.getElementById("prev-btn").addEventListener("click", () => goTo(current - 1));
    document.getElementById("next-btn").addEventListener("click", () => goTo(current + 1));
    playBtn.addEventListener("click", togglePlay);

    document.getElementById("cast-btn").addEventListener("click", () => {
      closePops();
      toast("Searching for nearby displays…");
    });

    document.getElementById("more-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !moreMenu.classList.contains("open");
      closePops();
      if (open) {
        moreMenu.classList.add("open");
        document.getElementById("more-btn").classList.add("active");
      }
    });

    moreMenu.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const act = btn.dataset.act;
      const s = songs[current];
      const messages = {
        love: "Loved “" + s.title + "”",
        library: "Added to Library",
        share: "Link copied for “" + s.title + "”",
        album: "Opening album…"
      };
      toast(messages[act] || "Done");
      closePops();
    });

    document.getElementById("vol-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !volPop.classList.contains("open");
      closePops();
      if (open) {
        volPop.classList.add("open");
        document.getElementById("vol-btn").classList.add("active");
      }
    });

    document.getElementById("mute-btn").addEventListener("click", () => {
      muted = !muted;
      volRange.value = muted ? 0 : volume;
      volLabel.textContent = muted ? "0" : String(volume);
      toast(muted ? "Muted" : "Volume " + volume + "%");
    });

    volRange.addEventListener("input", () => {
      volume = Number(volRange.value);
      muted = volume === 0;
      volLabel.textContent = String(volume);
    });

    document.getElementById("queue-btn").addEventListener("click", () => {
      if (queueSheet.classList.contains("open")) closeSheets();
      else openSheet("queue");
    });
    document.getElementById("lyrics-btn").addEventListener("click", () => {
      if (lyricsSheet.classList.contains("open")) closeSheets();
      else openSheet("lyrics");
    });

    overlay.addEventListener("click", closeSheets);
    document.querySelectorAll("[data-close]").forEach(btn => {
      btn.addEventListener("click", closeSheets);
    });

    queueBody.addEventListener("click", (e) => {
      const item = e.target.closest("[data-go]");
      if (!item) return;
      const i = Number(item.dataset.go);
      if (!isPlaying) togglePlay();
      goTo(i);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".extras") && !e.target.closest(".pill-actions")) closePops();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closePops(); closeSheets(); return; }
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === " " || e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.key === "l" || e.key === "L") openSheet("lyrics");
      if (e.key === "q" || e.key === "Q") openSheet("queue");
    });

    setTimeout(hideHint, 5000);

    ambA.src = songs[current].cover;
    ambA.classList.add("on");
    renderCards();
    updatePlayer();
    startLyrics();`;
    root.appendChild(script);

    return () => {
      script.remove();
      root.replaceChildren();
    };
  }, []);

  return <div ref={rootRef} className="trending-music-root" />;
}
