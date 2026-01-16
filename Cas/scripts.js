(() => {
  const body = document.body;
  let lightbox = document.querySelector(".lightbox");
  let lightboxImg;

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = '<img alt="Vergrote foto">';
    document.body.appendChild(lightbox);
    lightboxImg = lightbox.querySelector("img");
  } else {
    lightboxImg = lightbox.querySelector("img");
  }

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    body.classList.remove("no-scroll");
    lightboxImg.src = "";
  };

  const openLightbox = (img) => {
    const src = img.getAttribute("src");
    if (!src) {
      return;
    }
    lightboxImg.src = src;
    lightboxImg.alt = img.getAttribute("alt") || "Vergrote foto";
    lightbox.classList.add("is-open");
    body.classList.add("no-scroll");
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement) {
      if (target.closest(".weather-row")) {
        return;
      }
      openLightbox(target);
      return;
    }
    if (target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
})();
