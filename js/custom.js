 // Optional graceful fallback for broken images
    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => {
        if (img.classList.contains("my-card-image")) {
          img.replaceWith(createPlaceholder(img.alt || "image"));
        }

        if (img.classList.contains("title-calligraphy")) {
          const fallback = document.createElement("div");
          fallback.textContent = "수상한 외국인";
          fallback.style.fontSize = "56px";
          fallback.style.fontWeight = "800";
          fallback.style.lineHeight = "1";
          fallback.style.color = "#fff";
          fallback.style.marginBottom = "20px";
          img.replaceWith(fallback);
        }

        if (img.classList.contains("header-logo")) {
          const fallbackLogo = document.createElement("div");
          fallbackLogo.textContent = "HILARY";
          fallbackLogo.style.width = "100px";
          fallbackLogo.style.height = "32px";
          fallbackLogo.style.display = "flex";
          fallbackLogo.style.alignItems = "center";
          fallbackLogo.style.justifyContent = "flex-start";
          fallbackLogo.style.color = "#E50914";
          fallbackLogo.style.fontSize = "20px";
          fallbackLogo.style.fontWeight = "900";
          fallbackLogo.style.letterSpacing = "0.04em";
          img.replaceWith(fallbackLogo);
        }

        if (img.classList.contains("profile-pic")) {
          const fallbackProfile = document.createElement("div");
          fallbackProfile.className = "profile-pic";
          fallbackProfile.style.display = "flex";
          fallbackProfile.style.alignItems = "center";
          fallbackProfile.style.justifyContent = "center";
          fallbackProfile.style.background = "#333";
          fallbackProfile.style.color = "#fff";
          fallbackProfile.style.fontSize = "12px";
          fallbackProfile.textContent = "USER";
          img.replaceWith(fallbackProfile);
        }
      });
    });

    function createPlaceholder(label) {
      const div = document.createElement("div");
      div.className = "my-card-image placeholder";
      div.textContent = label;
      return div;
    }



document.addEventListener("DOMContentLoaded", () => {
  initDetailOverlay();
  initProfileMenu();
});

function initDetailOverlay() {
  const detailOverlay = document.getElementById("detailOverlay");
  const detailClose = document.getElementById("detailClose");
  const detailImage = document.getElementById("detailImage");
  const detailScroll = document.getElementById("detailScroll");
  const myCards = document.querySelectorAll(".my-card");

  if (!detailOverlay || !detailClose || !detailImage || !detailScroll || !myCards.length) {
    return;
  }

  function updateDetailEndState() {
    const threshold = 2;
    const isAtEnd =
      detailScroll.scrollTop + detailScroll.clientHeight >= detailScroll.scrollHeight - threshold;

    detailScroll.classList.toggle("at-end", isAtEnd);
  }

  function openDetailOverlay(imageSrc) {
    detailOverlay.classList.add("is-open");
    detailOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    detailScroll.scrollTop = 0;
    detailScroll.classList.remove("at-end");
    detailImage.src = imageSrc;

    detailImage.onload = () => {
      updateDetailEndState();
    };
  }

  function closeDetailOverlay() {
    detailOverlay.classList.remove("is-open");
    detailOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    detailScroll.classList.remove("at-end");
    detailScroll.scrollTop = 0;
    detailImage.src = "";
  }

  myCards.forEach((card) => {
    card.addEventListener("click", () => {
      const imageSrc = card.dataset.detailImage;
      if (imageSrc) openDetailOverlay(imageSrc);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const imageSrc = card.dataset.detailImage;
        if (imageSrc) openDetailOverlay(imageSrc);
      }
    });

    card.addEventListener("mouseenter", () => {
      const imageSrc = card.dataset.detailImage;
      if (imageSrc) {
        const preloadImg = new Image();
        preloadImg.src = imageSrc;
      }
    });
  });

  detailScroll.addEventListener("scroll", updateDetailEndState);
  window.addEventListener("resize", updateDetailEndState);

  detailClose.addEventListener("click", (event) => {
    event.stopPropagation();
    closeDetailOverlay();
  });

  detailOverlay.addEventListener("click", (event) => {
    if (event.target === detailOverlay) {
      closeDetailOverlay();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && detailOverlay.classList.contains("is-open")) {
      closeDetailOverlay();
    }
  });
}

function initProfileMenu() {
  const currentProfileImage = document.getElementById("currentProfileImage");
  const currentProfileName = document.getElementById("currentProfileName");
  const profileMenu = document.getElementById("profileMenu");
  const profileTrigger = document.getElementById("profileTrigger");
  const dropdownProfileItems = document.querySelectorAll(".dropdown-profile-item");
  const signOutButton = document.getElementById("signOutButton");

  if (!profileMenu || !profileTrigger) {
    return;
  }

  function getSelectedProfile() {
    const savedProfile = localStorage.getItem("selectedProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  }

  function setSelectedProfile(profile) {
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
  }

  function applySelectedProfile() {
    const profile = getSelectedProfile();
    if (!profile) return;

    if (currentProfileImage) {
      currentProfileImage.src = profile.image;
      currentProfileImage.alt = profile.name;
    }

    if (currentProfileName) {
      currentProfileName.textContent = profile.name;
    }

    dropdownProfileItems.forEach((item) => {
      const isActive = item.dataset.switchName === profile.name;
      item.classList.toggle("active", isActive);
    });
  }

  function openProfileMenu() {
    profileMenu.classList.add("open");
    profileTrigger.setAttribute("aria-expanded", "true");
  }

  function closeProfileMenu() {
    profileMenu.classList.remove("open");
    profileTrigger.setAttribute("aria-expanded", "false");
  }

  function toggleProfileMenu() {
    profileMenu.classList.contains("open") ? closeProfileMenu() : openProfileMenu();
  }

  profileTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleProfileMenu();
  });

  document.addEventListener("click", (event) => {
    if (!profileMenu.contains(event.target)) {
      closeProfileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && profileMenu.classList.contains("open")) {
      closeProfileMenu();
    }
  });

  dropdownProfileItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const nextProfile = {
        name: item.dataset.switchName,
        image: item.dataset.switchImage
      };

      setSelectedProfile(nextProfile);
      applySelectedProfile();
      closeProfileMenu();

      const targetPage = item.dataset.switchLink || item.getAttribute("href");
      if (targetPage && !window.location.pathname.endsWith(targetPage)) {
        window.location.href = targetPage;
      }
    });
  });

  if (signOutButton) {
    signOutButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      localStorage.removeItem("selectedProfile");
      window.location.href = "index.html";
    });
  }

  applySelectedProfile();
}




  document.getElementById("homeBtn").addEventListener("click", (e) => {
    e.preventDefault();

    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html"; // fallback
    }
  });


    window.addEventListener("DOMContentLoaded", () => {
    const motivationFrame = document.getElementById("motivationFrame");

    setTimeout(() => {
      motivationFrame.classList.add("show");
      motivationFrame.setAttribute("aria-hidden", "false");
    }, 3000);
  });

  const motivationFrame = document.getElementById("motivationFrame");

  if (motivationFrame) {
    setTimeout(() => {
      motivationFrame.style.animation = "spinInOnce 1.2s ease forwards";
    }, 3000);
  }

  console.log("frame found:", motivationFrame);
console.log("show class added");