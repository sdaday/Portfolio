(function () {
  "use strict";

  var cleanup = null;
  var imageDialog = null;
  var escape = function (text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  function closeImage() {
    if (!imageDialog) return false;
    imageDialog.close();
    imageDialog.remove();
    imageDialog = null;
    return true;
  }

  function showImage(button) {
    closeImage();
    var figure = button.closest("figure") || button.parentElement.nextElementSibling;
    var caption = figure ? figure.textContent.trim() : "";
    if (!caption || caption.length > 180) caption = "策划案原始图片";
    imageDialog = document.createElement("dialog");
    imageDialog.className = "plan-lightbox";
    imageDialog.setAttribute("aria-label", "图片放大预览");
    imageDialog.innerHTML = '<div class="plan-lightbox-tools"><span>' + escape(caption) +
      '</span><button type="button" data-image-size>原始尺寸</button><button type="button" data-image-close aria-label="关闭图片">×</button></div>' +
      '<div class="plan-lightbox-scroll"><img alt="' + escape(caption) + '" src="' + escape(button.dataset.planImage) + '"></div>';
    document.body.appendChild(imageDialog);
    imageDialog.addEventListener("click", function (event) {
      if (event.target === imageDialog || event.target.closest("[data-image-close]")) closeImage();
      else if (event.target.closest("[data-image-size]")) {
        var full = imageDialog.classList.toggle("is-original-size");
        event.target.textContent = full ? "适应窗口" : "原始尺寸";
      }
    });
    imageDialog.addEventListener("cancel", function (event) { event.preventDefault(); closeImage(); });
    imageDialog.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeImage(); }
    });
    imageDialog.showModal();
  }

  function navigation(headings) {
    var roots = [], stack = [];
    headings.forEach(function (h) {
      var node = Object.assign({ children: [] }, h);
      while (stack.length && stack[stack.length - 1].level >= h.level) stack.pop();
      if (stack.length) stack[stack.length - 1].children.push(node);
      else roots.push(node);
      stack.push(node);
    });
    function items(nodes) {
      return '<ul>' + nodes.map(function (node) {
        return '<li><div class="plan-nav-row"><button type="button" class="plan-nav-link level-' + node.level + '" data-section="' + node.id + '">' + escape(node.title) + '</button></div>' + (node.children.length ? items(node.children) : '') + '</li>';
      }).join("") + '</ul>';
    }
    return items(roots);
  }

  function open(options) {
    if (cleanup) cleanup();
    var content = options.content;
    var outer = options.modal;
    var panel = outer.querySelector(".project-modal");
    var data = options.document || window.SKYFIRE_DOCUMENT;
    var info = data.info || {
      toolbar: "02 / SKYFIRE UPRISING", tocId: "skyfire-toc", bodyLabel: "海战策划案正文",
      title: "海战游戏环境表现与战斗玩法策划案", gameName: "Skyfire Uprising", gameType: "FPS、TPS",
      summary: "本游戏共七个关卡，玩家将作为人类反抗力量的一员，逐步突破外星敌人的封锁，最终阻止外星势力的入侵。",
      cover: "assets/images/skyfire/gameplay-21.png", coverLabel: "第三关海战实机画面"
    };
    var controller = new AbortController();
    var signal = controller.signal;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.classList.add("is-plan-reader");
    outer.classList.add("has-plan-reader");
    content.innerHTML = '<div class="plan-toolbar"><button class="plan-toc-button" type="button" aria-expanded="false" aria-controls="' + escape(info.tocId) + '">☰ 目录</button><span>' + escape(info.toolbar) + '</span><span class="plan-language-note">中文策划案 · ' + data.headings.length + ' 个章节</span></div>' +
      '<div class="plan-workspace"><button type="button" class="plan-drawer-shade" aria-label="关闭目录"></button><nav class="plan-toc" id="' + escape(info.tocId) + '" aria-label="策划案章节目录"><h3>章节目录</h3>' + navigation(data.headings) + '</nav>' +
      '<div class="plan-scroll" tabindex="0" aria-label="' + escape(info.bodyLabel) + '"><div class="plan-introduction">' +
      '<h2 id="modal-title">' + escape(info.title) + '</h2>' +
      '<table class="project-info-table" aria-label="游戏基本信息"><colgroup><col><col></colgroup><tbody>' +
      '<tr><td>游戏名称</td><td>' + escape(info.gameName) + '</td></tr>' +
      '<tr><td>游戏类型</td><td>' + escape(info.gameType) + '</td></tr>' +
      '<tr><td>游戏简介</td><td>' + escape(info.summary) + '</td></tr>' +
      '<tr><td>面向平台</td><td>PC</td></tr>' +
      '<tr><td>工具</td><td>Unreal Engine 5</td></tr>' +
      '<tr><td>项目开发周期</td><td>约4周</td></tr>' +
      '<tr><td>项目链接</td><td><div class="resource-list">' + options.links + '</div></td></tr>' +
      (options.videoLinks ? '<tr><td>玩法视频</td><td><div class="resource-list">' + options.videoLinks + '</div></td></tr>' : '') +
      '</tbody></table><figure class="plan-cover"><button type="button" class="plan-image" data-plan-image="' + escape(info.cover) + '" aria-label="' + (data.info ? '放大图片' : '放大海战实机画面') + '"><img src="' + escape(info.cover) + '" alt="' + escape(info.coverLabel) + '" decoding="async"></button><figcaption class="plan-caption">' + escape(info.coverLabel) + '</figcaption></figure>' +
      '</div><article class="plan-document" lang="zh-CN">' +
      data.blocks.slice(data.blocks.findIndex(function (block) {
        return block.kind === "heading";
      })).map(function (block) {
        if (block.kind === "heading") {
          var tag = "h" + (block.level + 2);
          return '<' + tag + ' id="' + block.id + '" data-plan-heading="' + block.level + '">' + escape(block.title) + '</' + tag + '>';
        }
        return block.html;
      }).join("") + '</article></div></div>';
    var root = content.querySelector(".plan-scroll");
    var nav = content.querySelector(".plan-toc");
    var drawer = content.querySelector(".plan-toc-button");
    var headings = Array.from(content.querySelectorAll("[data-plan-heading]"));
    var links = Array.from(nav.querySelectorAll("[data-section]"));
    var current = "";
    var frame = null;
    function setDrawer(value) {
      content.classList.toggle("toc-open", value);
      drawer.setAttribute("aria-expanded", String(value));
    }
    function activate(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (link) {
        var active = link.dataset.section === id;
        link.classList.toggle("is-current", active);
        if (active) {
          link.setAttribute("aria-current", "location");
          var box = link.getBoundingClientRect(), viewport = nav.getBoundingClientRect();
          if (box.top < viewport.top + 45 || box.bottom > viewport.bottom - 12) {
            nav.scrollTop += box.top - viewport.top - viewport.height / 2;
          }
        } else link.removeAttribute("aria-current");
      });
    }
    function sync() {
      frame = null;
      var top = root.getBoundingClientRect().top + 65;
      var active = headings[0];
      headings.forEach(function (h) { if (h.getBoundingClientRect().top <= top) active = h; });
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 3) active = headings[headings.length - 1];
      if (active) activate(active.id);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(sync); }
    var observer = new IntersectionObserver(schedule, { root: root, rootMargin: "0px 0px -70% 0px", threshold: [0, 1] });
    headings.forEach(function (h) { observer.observe(h); });
    root.addEventListener("scroll", schedule, { passive: true, signal: signal });
    // Lazy images can change heading positions while the reader stays still.
    root.addEventListener("load", schedule, { capture: true, signal: signal });
    content.addEventListener("click", function (event) {
      var link = event.target.closest("[data-section]");
      var image = event.target.closest("[data-plan-image]");
      if (link) {
        var heading = document.getElementById(link.dataset.section);
        root.scrollTo({ top: heading.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 24, behavior: reduced ? "instant" : "smooth" });
        activate(heading.id);
        setDrawer(false);
        root.focus({ preventScroll: true });
      } else if (image) showImage(image);
      else if (event.target === drawer || event.target.closest(".plan-toc-button")) setDrawer(!content.classList.contains("toc-open"));
      else if (event.target.closest(".plan-drawer-shade")) setDrawer(false);
    }, { signal: signal });
    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && content.classList.contains("toc-open")) {
        event.preventDefault(); event.stopPropagation(); setDrawer(false); drawer.focus();
      }
      if (event.key === "Tab") {
        var focusable = Array.from(panel.querySelectorAll('button, a[href], [tabindex="0"]')).filter(function (el) { return el.getClientRects().length; });
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }, { signal: signal });
    root.scrollTop = 0;
    outer.scrollTop = 0;
    activate(headings[0].id);
    cleanup = function () {
      controller.abort(); observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      closeImage();
      panel.classList.remove("is-plan-reader"); outer.classList.remove("has-plan-reader");
      cleanup = null;
    };
  }

  window.SkyfireReader = {
    open: open,
    close: function () { if (cleanup) cleanup(); },
    closeImage: closeImage
  };
})();
