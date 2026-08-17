const WEDDING_DATE = new Date("2027-01-26T18:00:00");

const preloader = document.getElementById("preloader");
const enterBtn = document.getElementById("enterBtn");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

if (enterBtn && preloader) {
  enterBtn.addEventListener("click", () => {
    preloader.classList.add("hidden");
    document.body.classList.add("site-entered");

    // Music is optional. A missing/blocked audio file must never stop the page.
    if (bgMusic) {
      bgMusic.volume = 0.25;
      const playPromise = bgMusic.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => musicBtn && musicBtn.classList.add("playing"))
          .catch(() => {});
      }
    }
  });
}

if (musicBtn && bgMusic) {
  musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      const playPromise = bgMusic.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => musicBtn.classList.add("playing"))
          .catch(() => {});
      }
    } else {
      bgMusic.pause();
      musicBtn.classList.remove("playing");
    }
  });
}

// Reveal elements as they enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Countdown to the wedding date.
function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    document.getElementById("countdownMessage").textContent =
      "Today is the day! We are so happy to celebrate with you.";
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Create subtle floating petals.
function createPetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.textContent = Math.random() > 0.5 ? "❀" : "✿";
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.fontSize = `${10 + Math.random() * 14}px`;
  petal.style.color = Math.random() > 0.5 ? "#a95163" : "#8d9c79";
  petal.style.setProperty("--drift", `${-100 + Math.random() * 200}px`);
  petal.style.animationDuration = `${7 + Math.random() * 7}s`;
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 15000);
}

setInterval(createPetal, 1200);



// Calendar download for the confirmed wedding date.
// Time is intentionally omitted because the wedding time was not provided.
function addWeddingToCalendar() {
  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SubhasishAndIpshitaWedding//EN
BEGIN:VEVENT
UID:subhasish-ipshita-wedding-20270126@example.com
DTSTAMP:20260815T000000Z
DTSTART;VALUE=DATE:20270126
DTEND;VALUE=DATE:20270127
SUMMARY:Wedding — Subhasish & Ipshita
LOCATION:Rajwada Banquet
DESCRIPTION:Wedding celebration of Subhasish & Ipshita.
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "subhasish-ipshita-wedding-26-january-2027.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}


// Protect photos from normal drag, right-click and double-click actions.
document.querySelectorAll("img").forEach(img => {
  img.setAttribute("draggable", "false");
  img.addEventListener("dragstart", event => event.preventDefault());
});

document.addEventListener("contextmenu", event => {
  if (event.target.closest("img, .gallery-card, .hero, .floral-banner")) {
    event.preventDefault();
  }
});

document.addEventListener("dblclick", event => {
  if (event.target.closest("img, .gallery-card, .hero")) {
    event.preventDefault();
  }
});


// =========================================================
// RESPONSIVE WEDDING PHOTO GALLERY
// Auto-scrolls once, then becomes manually scrollable.
// Works with laptop mouse/trackpad and mobile touch.
// =========================================================

const galleryWrapper = document.querySelector(".gallery-scroll-wrapper");
const galleryScroll = document.querySelector(".gallery-scroll");

if (galleryWrapper && galleryScroll) {
  let autoScrollFinished = false;
  let pointerDown = false;
  let startX = 0;
  let startScroll = 0;

  // After the single automatic cycle, freeze the animation.
  galleryScroll.addEventListener("animationend", () => {
    autoScrollFinished = true;
    galleryScroll.style.animation = "none";
    galleryScroll.style.transform = "none";
    galleryScroll.classList.add("manual-scroll-ready");
  });

  // Laptop/desktop: mouse wheel scrolls horizontally after auto-scroll.
  galleryWrapper.addEventListener("wheel", event => {
    if (!autoScrollFinished) return;

    const vertical = Math.abs(event.deltaY);
    const horizontal = Math.abs(event.deltaX);

    if (vertical > horizontal) {
      event.preventDefault();
      galleryWrapper.scrollLeft += event.deltaY;
    }
  }, { passive: false });

  // Laptop/desktop: click-drag after auto-scroll.
  galleryWrapper.addEventListener("pointerdown", event => {
    if (!autoScrollFinished) return;
    if (event.pointerType === "touch") return;

    pointerDown = true;
    startX = event.clientX;
    startScroll = galleryWrapper.scrollLeft;
    galleryWrapper.classList.add("dragging");

    try {
      galleryWrapper.setPointerCapture(event.pointerId);
    } catch (_) {}
  });

  galleryWrapper.addEventListener("pointermove", event => {
    if (!pointerDown) return;

    const distance = event.clientX - startX;
    galleryWrapper.scrollLeft = startScroll - distance;
  });

  const endPointerDrag = () => {
    pointerDown = false;
    galleryWrapper.classList.remove("dragging");
  };

  galleryWrapper.addEventListener("pointerup", endPointerDrag);
  galleryWrapper.addEventListener("pointercancel", endPointerDrag);
  galleryWrapper.addEventListener("mouseleave", endPointerDrag);

  // Mobile: native horizontal touch scrolling works naturally.
  // If the user touches during/after the automatic animation,
  // do not restart the animation.
  galleryWrapper.addEventListener("touchstart", () => {
    if (autoScrollFinished) {
      galleryScroll.style.animation = "none";
      galleryScroll.style.transform = "none";
    }
  }, { passive: true });
}
