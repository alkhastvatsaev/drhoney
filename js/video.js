/**
 * Background video play / fallback (progressive enhancement).
 * @param {HTMLVideoElement|null} bgVideo
 */
export function initBackgroundVideo(bgVideo) {
  if (!bgVideo) return;

  function startBackgroundVideo() {
    bgVideo.muted = true;
    bgVideo.setAttribute("playsinline", "");
    bgVideo.setAttribute("webkit-playsinline", "");
    const reveal = () => bgVideo.classList.add("is-ready");
    const playPromise = bgVideo.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(reveal)
        .catch(() => {
          const retry = () => {
            bgVideo.play().then(reveal).catch(() => {});
          };
          bgVideo.addEventListener("canplay", retry, { once: true });
          bgVideo.addEventListener("loadeddata", retry, { once: true });
          window.setTimeout(reveal, 2500);
        });
    } else {
      reveal();
    }
  }

  if (bgVideo.readyState >= 2) {
    startBackgroundVideo();
  } else {
    bgVideo.addEventListener("loadeddata", startBackgroundVideo, { once: true });
    bgVideo.addEventListener("canplay", startBackgroundVideo, { once: true });
    bgVideo.addEventListener(
      "error",
      () => {
        bgVideo.style.display = "none";
      },
      { once: true }
    );
    window.setTimeout(() => {
      if (!bgVideo.classList.contains("is-ready")) startBackgroundVideo();
    }, 1500);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && bgVideo.paused) startBackgroundVideo();
  });
  document.addEventListener(
    "touchstart",
    () => {
      if (bgVideo.paused) startBackgroundVideo();
    },
    { once: true, passive: true }
  );
  document.addEventListener(
    "click",
    () => {
      if (bgVideo.paused) startBackgroundVideo();
    },
    { once: true }
  );
}
