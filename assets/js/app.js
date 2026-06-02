(function () {
  "use strict";

  var projects = window.PORTFOLIO_PROJECTS || [];
  var skills = window.PORTFOLIO_SKILLS || [];
  var translations = window.PORTFOLIO_TRANSLATIONS || {};
  var projectGrid = document.getElementById("project-grid");
  var skillsGrid = document.getElementById("skills-grid");
  var modal = document.getElementById("project-modal");
  var modalContent = document.getElementById("modal-content");
  var modalClose = document.getElementById("modal-close");
  var languageOptions = document.querySelectorAll("[data-language]");
  var activeTrigger = null;
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

  function localizeSkill(category) {
    var language = translations[currentLanguage] || {};
    var translatedSkill = (language.skills && language.skills[category.code]) || {};
    return Object.assign({}, category, translatedSkill);
  }

  function usesTechnicalContributionLabel(project) {
    return project.id === "ue5-environment-systems";
  }

  function getCardContributionLabel(project) {
    return translate(
      usesTechnicalContributionLabel(project)
        ? "card.contribution"
        : "card.appliedTechnologies"
    );
  }

  function getModalContributionLabel(project) {
    return translate(
      usesTechnicalContributionLabel(project)
        ? "modal.contribution"
        : "modal.appliedTechnologies"
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

  function renderSkills() {
    skillsGrid.innerHTML = skills
      .map(localizeSkill)
      .map(function (category) {
        return (
          '<article class="skill-card">' +
          '<div class="skill-card-heading"><span>' +
          escapeHtml(category.code) +
          "</span><h3>" +
          escapeHtml(category.title) +
          "</h3></div>" +
          '<div class="skill-items">' +
          renderTags(category.items) +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderLinks(links) {
    return links
      .map(function (link) {
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
      '<section class="modal-section"><p class="section-kicker">' +
      escapeHtml(getModalContributionLabel(project)) +
      "</p><h3>" +
      escapeHtml(getModalContributionTitle(project)) +
      "</h3>" +
      renderContributionGroups(project) +
      "</section>" +
      '<section class="modal-section"><p class="section-kicker">' +
      escapeHtml(translate("modal.gallery")) +
      "</p><h3>" +
      escapeHtml(translate("modal.screenshots")) +
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
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (activeTrigger) {
      activeTrigger.focus();
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

  document.addEventListener("keydown", function (event) {
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

    currentLanguage = language;

    try {
      window.localStorage.setItem("portfolio-language", language);
    } catch (error) {
      // Local storage can be unavailable for some file:// browser settings.
    }

    applyStaticTranslations();
    renderProjects();
    renderSkills();
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
