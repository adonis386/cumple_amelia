gsap.registerPlugin(ScrollTrigger);

const introOverlay = document.getElementById("introOverlay");
const siteShell = document.getElementById("siteShell");

function runLandingAnimations() {
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  timeline
    .from(".hero-title-wrap", { y: 24, opacity: 0, duration: 0.9 })
    .from(".eyebrow", { y: 18, opacity: 0, duration: 0.6 }, "-=0.7")
    .from("h1", { y: 20, opacity: 0, duration: 0.7 }, "-=0.45")
    .from(".girl-name", { scale: 0.84, opacity: 0, duration: 0.6 }, "-=0.4")
    .from(".hero-photo-frame", { y: 28, opacity: 0, duration: 0.8 }, "-=0.45")
    .from(".hero-copy", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
    .from(".btn-primary", { y: 14, opacity: 0, duration: 0.5 }, "-=0.3");

  gsap.utils.toArray(".reveal").forEach((section) => {
    gsap.from(section, {
      y: 56,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });
  });

  gsap.utils.toArray(".memory-item, .bee-video-wrap").forEach((item, index) => {
    gsap.from(item, {
      y: 24,
      opacity: 0,
      scale: 0.96,
      duration: 0.75,
      delay: index * 0.06,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        once: true,
      },
    });

    gsap.to(item, {
      y: index % 2 === 0 ? -6 : -3,
      duration: 2.3 + index * 0.12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}

function startMagicalIntro() {
  if (!introOverlay || !siteShell) {
    gsap.set(".site-shell", { autoAlpha: 1 });
    runLandingAnimations();
    return;
  }

  gsap.set(siteShell, { autoAlpha: 0 });

  gsap.to(".intro-star", {
    scale: 1.35,
    opacity: 1,
    duration: 0.55,
    yoyo: true,
    repeat: 2,
    stagger: 0.08,
    ease: "sine.inOut",
  });

  gsap
    .timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        gsap.set(introOverlay, { display: "none" });
        runLandingAnimations();
      },
    })
    .fromTo(".intro-glow", { scale: 0.45, opacity: 0.25 }, { scale: 1.25, opacity: 1, duration: 1.05 })
    .to(".intro-glow", { scale: 2.2, opacity: 0, duration: 0.75 }, "-=0.05")
    .to(introOverlay, { autoAlpha: 0, duration: 0.45 }, "-=0.2")
    .to(siteShell, { autoAlpha: 1, duration: 0.6 }, "-=0.3");
}

gsap.utils.toArray(".petal").forEach((petal, index) => {
  gsap.to(petal, {
    y: "105vh",
    x: `${(index % 2 === 0 ? 1 : -1) * (50 + index * 6)}`,
    rotation: 220 + index * 22,
    duration: 10 + index * 1.3,
    repeat: -1,
    ease: "none",
    delay: index * 0.65,
  });

  gsap.to(petal, {
    x: `+=${index % 2 === 0 ? 24 : -24}`,
    duration: 2 + index * 0.3,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
});

const eventDate = new Date(2026, 2, 28, 15, 0, 0).getTime();

function updateCounter() {
  const now = Date.now();
  const distance = eventDate - now;

  if (distance <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCounter();
setInterval(updateCounter, 1000);

const inviteAudio = document.getElementById("inviteAudio");
const audioToggle = document.getElementById("audioToggle");
const AUDIO_CLIP_END_SECONDS = 35;

function setAudioVisualState(isPlaying) {
  if (!audioToggle) {
    return;
  }
  audioToggle.classList.toggle("is-off", !isPlaying);
  audioToggle.setAttribute("aria-label", isPlaying ? "Desactivar musica" : "Activar musica");
}

if (inviteAudio && audioToggle) {
  const tryPlayAudio = () =>
    inviteAudio.play().then(() => setAudioVisualState(true)).catch(() => setAudioVisualState(false));

  inviteAudio.addEventListener("timeupdate", () => {
    if (inviteAudio.currentTime >= AUDIO_CLIP_END_SECONDS) {
      inviteAudio.currentTime = 0;
      if (!inviteAudio.paused) {
        inviteAudio.play().catch(() => {});
      }
    }
  });

  tryPlayAudio();

  const startAudioOnInteraction = () => {
    if (inviteAudio.paused) {
      tryPlayAudio();
    }
  };

  window.addEventListener("click", startAudioOnInteraction, { once: true });
  window.addEventListener("touchstart", startAudioOnInteraction, { once: true });
  window.addEventListener("keydown", startAudioOnInteraction, { once: true });

  audioToggle.addEventListener("click", () => {
    if (inviteAudio.paused) {
      tryPlayAudio();
    } else {
      inviteAudio.pause();
      setAudioVisualState(false);
    }
  });
}

window.addEventListener("load", startMagicalIntro);
