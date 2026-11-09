(function () {
  "use strict";

  var projectOrder = [
    "ue5-individual-game",
    "ue5-environment-systems",
    "directx12-graphics",
    "advanced-graphics",
    "games-engineering",
    "programming-algorithms"
  ];
  var orderIndex = projectOrder.reduce(function (index, projectId, position) {
    index[projectId] = position;
    return index;
  }, {});
  var projects = (window.PORTFOLIO_PROJECTS || []).slice().sort(function (a, b) {
    var aIndex = orderIndex[a.id];
    var bIndex = orderIndex[b.id];
    return (aIndex === undefined ? 999 : aIndex) - (bIndex === undefined ? 999 : bIndex);
  });
  projects.forEach(function (project, index) {
    var number = index + 1;
    project.number = number < 10 ? "0" + number : String(number);
  });
  var translations = window.PORTFOLIO_TRANSLATIONS || {};
  var projectGrid = document.getElementById("project-grid");
  var modal = document.getElementById("project-modal");
  var modalContent = document.getElementById("modal-content");
  var modalClose = document.getElementById("modal-close");
  var videoModal = document.getElementById("video-modal");
  var videoClose = document.getElementById("video-close");
  var gameplayVideo = document.getElementById("gameplay-video");
  var languageOptions = document.querySelectorAll("[data-language]");
  var activeTrigger = null;
  var activeVideoTrigger = null;
  var currentLanguage = "en";

  function translate(key) {
    var language = translations[currentLanguage] || {};
    var fallback = translations.en || {};
    return (language.ui && language.ui[key]) || (fallback.ui && fallback.ui[key]) || key;
  }

  function localizeProject(project) {
    var language = translations[currentLanguage] || {};
    var translatedProject = (language.projects && language.projects[project.id]) || {};
    var localized = Object.assign({}, project, translatedProject);

    localized.images = project.images.map(function (image, index) {
      return Object.assign({}, image, {
        label:
          (translatedProject.images && translatedProject.images[index]) ||
          image.label
      });
    });

    localized.links = project.links.map(function (link) {
      return Object.assign({}, link, {
        label: (language.linkLabels && language.linkLabels[link.label]) || link.label
      });
    });

    return localized;
  }

  function usesTechnicalContributionLabel(project) {
    return project.id === "ue5-environment-systems";
  }

  function getCardContributionLabel(project) {
    if (project.id === "ue5-individual-game") return translate("card.coreDesign");
    return translate(
      usesTechnicalContributionLabel(project)
        ? "card.contribution"
        : "card.appliedTechnologies"
    );
  }

  function getModalContributionTitle(project) {
    return translate(
      usesTechnicalContributionLabel(project)
        ? "modal.implemented"
        : "modal.technologiesApplied"
    );
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
    document.title = translate("meta.title");

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = translate(element.getAttribute("data-i18n"));
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
      element.innerHTML = translate(element.getAttribute("data-i18n-html"));
    });

    modalClose.setAttribute("aria-label", translate("modal.close"));

    languageOptions.forEach(function (option) {
      var isActive = option.getAttribute("data-language") === currentLanguage;
      option.setAttribute("aria-pressed", String(isActive));
      option.classList.toggle("is-active", isActive);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderTags(items, limit) {
    return items
      .slice(0, limit || items.length)
      .map(function (item) {
        return '<span class="tag">' + escapeHtml(item) + "</span>";
      })
      .join("");
  }

  function renderVisual(image, className) {
    var visualClass = "project-visual " + (className || "");
    if (image && image.src) {
      return (
        '<div class="' +
        visualClass +
        '"><img src="' +
        escapeHtml(image.src) +
        '" alt="' +
        escapeHtml(image.label || translate("visual.projectScreenshot")) +
        '" onerror="this.parentNode.classList.add(\'is-placeholder\'); this.remove();" />' +
        '<span class="visual-label">' +
        escapeHtml(image.label || translate("visual.projectScreenshot")) +
        "</span></div>"
      );
    }

    return (
      '<div class="' +
      visualClass +
      ' is-placeholder"><span class="placeholder-cross" aria-hidden="true"></span>' +
      '<span class="visual-label">' +
      escapeHtml((image && image.label) || translate("visual.screenshotPlaceholder")) +
      "</span></div>"
    );
  }

  function renderProjects() {
    projectGrid.innerHTML = projects
      .map(localizeProject)
      .map(function (project) {
        return (
          '<article class="project-card">' +
          '<div class="project-card-media">' +
          renderVisual(project.images[0], "card-visual") +
          '<span class="project-number">' +
          escapeHtml(project.number) +
          "</span>" +
          '<span class="discipline">' +
          escapeHtml(project.discipline) +
          "</span>" +
          "</div>" +
          '<div class="project-card-body">' +
          '<p class="project-type">' +
          escapeHtml(project.type) +
          "</p>" +
          "<h3>" +
          escapeHtml(project.title) +
          "</h3>" +
          '<p class="project-summary">' +
          escapeHtml(project.summary) +
          "</p>" +
          '<p class="contribution-label">' +
          escapeHtml(getCardContributionLabel(project)) +
          "</p>" +
          '<div class="tag-list">' +
          renderTags(project.highlights, 4) +
          "</div>" +
          '<button class="details-button" type="button" data-project-id="' +
          escapeHtml(project.id) +
          '">' +
          escapeHtml(translate("card.details")) +
          ' <span aria-hidden="true">+</span></button>' +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderLinks(links) {
    return links
      .map(function (link) {
        if (link.video) {
          return (
            '<button class="resource-link" type="button" data-video-src="' +
            escapeHtml(link.video) +
            '">' +
            escapeHtml(link.label) +
            '<span aria-hidden="true">&#9658;</span></button>'
          );
        }

        if (link.href) {
          return (
            '<a class="resource-link" href="' +
            escapeHtml(link.href) +
            '" target="_blank" rel="noreferrer">' +
            escapeHtml(link.label) +
            '<span aria-hidden="true">&#8599;</span></a>'
          );
        }

        return (
          '<button class="resource-link is-disabled" type="button" disabled title="' +
          escapeHtml(link.placeholder) +
          '">' +
          escapeHtml(link.label) +
          "<small>" +
          escapeHtml(translate("link.comingSoon")) +
          "</small></button>"
        );
      })
      .join("");
  }

  function renderContributionGroups(project) {
    if (project.contributionGroups) {
      return project.contributionGroups
        .map(function (group) {
          return (
            '<section class="contribution-group"><h4>' +
            escapeHtml(group.title) +
            '</h4><ul class="contribution-list">' +
            group.items
              .map(function (item) {
                return "<li>" + escapeHtml(item) + "</li>";
              })
              .join("") +
            "</ul></section>"
          );
        })
        .join("");
    }

    return (
      '<ul class="contribution-list">' +
      project.contributions
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function renderGalleryNote(images) {
    var hasPlaceholder = images.some(function (image) {
      return !image.src;
    });

    if (!hasPlaceholder) {
      return "";
    }

    return (
      '<p class="gallery-note">' +
      translate("modal.replaceImages") +
      "</p>"
    );
  }

  function openProject(projectId, trigger) {
    var project = projects.find(function (item) {
      return item.id === projectId;
    });

    if (!project) {
      return;
    }

    project = localizeProject(project);
    activeTrigger = trigger;
    if (project.id === "ue5-environment-systems" || project.id === "ue5-individual-game") {
      var isBrokenThrone = project.id === "ue5-individual-game";
      window.SkyfireReader.open({ modal: modal, content: modalContent,
        links: renderLinks(isBrokenThrone ? project.links.filter(function (link) { return !link.video; }) : project.links),
        videoLinks: isBrokenThrone ? renderLinks(project.links.filter(function (link) { return link.video; })) : "",
        document: project.id === "ue5-individual-game" ? window.BROKEN_THRONE_DOCUMENT : window.SKYFIRE_DOCUMENT });
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      modalClose.focus();
      return;
    }
    modalContent.innerHTML =
      '<div class="modal-hero">' +
      '<p class="project-type">' +
      escapeHtml(project.type) +
      "</p>" +
      '<p class="modal-number">' +
      escapeHtml(project.number) +
      "</p>" +
      '<h2 id="modal-title">' +
      escapeHtml(project.title) +
      "</h2>" +
      '<p class="modal-description">' +
      escapeHtml(project.description) +
      "</p>" +
      '<div class="resource-list">' +
      renderLinks(project.links) +
      "</div>" +
      "</div>" +
      '<div class="modal-grid">' +
      '<div class="modal-main">' +
      '<section class="modal-section"><h3>' +
      escapeHtml(getModalContributionTitle(project)) +
      "</h3>" +
      renderContributionGroups(project) +
      "</section>" +
      '<section class="modal-section"><h3>' +
      escapeHtml(translate("modal.gallery")) +
      "</h3>" +
      renderGalleryNote(project.images) +
      '<div class="gallery-grid gallery-count-' +
      project.images.length +
      '">' +
      project.images
        .map(function (image) {
          return renderVisual(image, "gallery-visual");
        })
        .join("") +
      "</div></section>" +
      "</div>" +
      '<aside class="modal-sidebar">' +
      '<section><p class="section-kicker">' +
      escapeHtml(translate("modal.highlights")) +
      '</p><div class="tag-list">' +
      renderTags(project.highlights) +
      "</div></section>" +
      '<section><p class="section-kicker">' +
      escapeHtml(translate("modal.technologies")) +
      '</p><div class="tag-list">' +
      renderTags(project.technologies) +
      "</div></section>" +
      "</aside>" +
      "</div>";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalClose.focus();
  }

  function closeModal() {
    window.SkyfireReader.close();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (activeTrigger) {
      activeTrigger.focus();
    }
  }

  function openGameplayVideo(videoSrc, trigger) {
    if (!videoSrc) {
      return;
    }

    activeVideoTrigger = trigger;
    gameplayVideo.setAttribute("src", videoSrc);
    gameplayVideo.load();
    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    videoClose.focus();

    var playPromise = gameplayVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        // Some browsers block autoplay even after a click; controls remain available.
      });
    }
  }

  function closeGameplayVideo() {
    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    gameplayVideo.pause();
    try {
      gameplayVideo.currentTime = 0;
    } catch (error) {
      // Reset can fail before metadata loads on some file:// browsers.
    }
    gameplayVideo.removeAttribute("src");
    gameplayVideo.load();

    if (!modal.classList.contains("is-open")) {
      document.body.classList.remove("modal-open");
    }

    if (activeVideoTrigger) {
      activeVideoTrigger.focus();
    }
  }

  projectGrid.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-project-id]");
    if (trigger) {
      openProject(trigger.getAttribute("data-project-id"), trigger);
    }
  });

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  modalContent.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-video-src]");
    if (trigger) {
      openGameplayVideo(trigger.getAttribute("data-video-src"), trigger);
    }
  });

  videoClose.addEventListener("click", closeGameplayVideo);

  videoModal.addEventListener("click", function (event) {
    if (event.target === videoModal) {
      closeGameplayVideo();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && videoModal.classList.contains("is-open")) {
      closeGameplayVideo();
      return;
    }

    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  languageOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      setLanguage(option.getAttribute("data-language"));
    });
  });

  function setLanguage(language) {
    if (language !== "en" && language !== "zh") {
      return;
    }

    if (modal.classList.contains("is-open")) {
      closeModal();
    }

    if (videoModal.classList.contains("is-open")) {
      closeGameplayVideo();
    }

    currentLanguage = language;

    try {
      window.localStorage.setItem("portfolio-language", language);
    } catch (error) {
      // Local storage can be unavailable for some file:// browser settings.
    }

    applyStaticTranslations();
    renderProjects();
  }

  function getInitialLanguage() {
    try {
      return window.localStorage.getItem("portfolio-language") || "en";
    } catch (error) {
      return "en";
    }
  }

  setLanguage(getInitialLanguage());
})();
