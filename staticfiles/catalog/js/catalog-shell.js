(function () {
  "use strict";

  var cfg = document.getElementById("app-config");
  if (!cfg) return;

  var indexPath = cfg.getAttribute("data-catalog-index") || "/";
  var partialPath = cfg.getAttribute("data-catalog-partial") || "/";
  var suggestPath = cfg.getAttribute("data-search-suggest") || "/";

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  function getCookie(name) {
    var m = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return m ? decodeURIComponent(m[2]) : "";
  }

  function buildIndexUrl(params) {
    var u = new URL(window.location.origin + indexPath);
    params.forEach(function (v, k) {
      u.searchParams.append(k, v);
    });
    return u.pathname + u.search;
  }

  function buildPartialUrl(params) {
    var u = new URL(window.location.origin + partialPath);
    params.forEach(function (v, k) {
      u.searchParams.append(k, v);
    });
    return u.toString();
  }

  function buildSkeletonGrid() {
    var cards = "";
    for (var i = 0; i < 6; i++) {
      cards +=
        '<div class="col-12 col-sm-6 col-xl-4 catalog-tool-slot">' +
        '<article class="tool-skeleton-card card-glass overflow-hidden h-100">' +
        '<div class="skeleton-shimmer tool-skeleton-thumb"></div>' +
        '<div class="p-3">' +
        '<div class="skeleton-shimmer skeleton-line lg mb-2"></div>' +
        '<div class="skeleton-shimmer skeleton-line sm mb-2"></div>' +
        '<div class="skeleton-shimmer skeleton-line md"></div>' +
        "</div></article></div>";
    }
    return '<div class="row g-3 view-grid catalog-skeleton-wrap" id="tools-container">' + cards + "</div>";
  }

  function showCatalogSkeleton() {
    var dyn = document.getElementById("catalog-dynamic");
    var main = document.getElementById("catalog-main");
    if (dyn) {
      dyn.innerHTML = buildSkeletonGrid();
      if (!reduceMotion) {
        dyn.classList.remove("catalog-fade-in");
        void dyn.offsetWidth;
        dyn.classList.add("catalog-fade-in");
      }
    }
    if (main) main.classList.add("is-catalog-fetching");
  }

  function replaceCatalogFromHtml(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var next = doc.getElementById("catalog-main");
    var cur = document.getElementById("catalog-main");
    var main = document.getElementById("catalog-main");
    if (main) main.classList.remove("is-catalog-fetching");
    if (next && cur) {
      cur.replaceWith(next);
      bindCatalogUi();
      return true;
    }
    return false;
  }

  function syncNavFormFromUrl() {
    var form = document.getElementById("nav-catalog-search");
    var navInput = document.getElementById("nav-search-input");
    if (!form) return;
    var u = new URL(window.location.href);
    form.querySelectorAll('input[type="hidden"]').forEach(function (i) {
      i.remove();
    });
    u.searchParams.forEach(function (v, k) {
      if (k === "q") return;
      var inp = document.createElement("input");
      inp.type = "hidden";
      inp.name = k;
      inp.value = v;
      form.appendChild(inp);
    });
    var qv = u.searchParams.get("q") || "";
    if (navInput) navInput.value = qv;
    var mq = document.getElementById("mq");
    if (mq) mq.value = qv;
  }

  function fetchCatalogFromParams(params) {
    var purl = buildPartialUrl(params);
    var push = buildIndexUrl(params);
    if (document.getElementById("catalog-dynamic")) {
      showCatalogSkeleton();
    }
    return fetch(purl, { headers: { "X-Requested-With": "XMLHttpRequest" } })
      .then(function (r) {
        return r.text();
      })
      .then(function (html) {
        if (replaceCatalogFromHtml(html)) {
          history.pushState({ catalog: true }, "", push);
          syncNavFormFromUrl();
        }
      })
      .catch(function () {
        var main = document.getElementById("catalog-main");
        if (main) main.classList.remove("is-catalog-fetching");
      });
  }

  window.runCatalogSearch = function () {
    var form = document.getElementById("nav-catalog-search");
    if (!document.getElementById("catalog-main")) {
      if (form) form.submit();
      return;
    }
    if (!form) return;
    var fd = new FormData(form);
    var params = new URLSearchParams(fd);
    fetchCatalogFromParams(params);
  };

  function bindCatalogUi() {
    var container = document.getElementById("tools-container");
    if (container) {
      var mode = localStorage.getItem("catalog_view") || "grid";
      container.classList.toggle("view-list", mode === "list");
      container.classList.toggle("view-grid", mode !== "list");
    }
    var g = document.querySelector(".js-view-grid");
    var l = document.querySelector(".js-view-list");
    if (g)
      g.onclick = function () {
        localStorage.setItem("catalog_view", "grid");
        if (container) {
          container.classList.remove("view-list");
          container.classList.add("view-grid");
        }
      };
    if (l)
      l.onclick = function () {
        localStorage.setItem("catalog_view", "list");
        if (container) {
          container.classList.add("view-list");
          container.classList.remove("view-grid");
        }
      };
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a.js-catalog-nav");
    if (!a || !document.getElementById("catalog-main")) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank") return;
    e.preventDefault();
    var u = new URL(a.href, window.location.origin);
    if (u.origin !== window.location.origin) return;
    fetchCatalogFromParams(u.searchParams);
  });

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".js-tool-preview");
    if (!btn) return;
    e.preventDefault();
    var url = btn.getAttribute("data-preview-url");
    if (!url) return;
    var body = document.getElementById("toolPreviewModalBody");
    if (!body) return;
    body.innerHTML = '<p class="text-muted small mb-0">Loading…</p>';
    var el = document.getElementById("toolPreviewModal");
    if (!el || !window.bootstrap) return;
    var modal = bootstrap.Modal.getOrCreateInstance(el);
    modal.show();
    fetch(url)
      .then(function (r) {
        return r.text();
      })
      .then(function (html) {
        body.innerHTML = html;
      });
  });

  var navInput = document.getElementById("nav-search-input");
  var suggestBox = document.getElementById("search-suggest");
  var tmr;
  if (navInput && suggestBox) {
    function esc(s) {
      if (s == null || s === "") return "";
      var d = document.createElement("div");
      d.textContent = s;
      return d.innerHTML;
    }
    function renderSuggest(items) {
      if (!items || !items.length) {
        suggestBox.classList.add("d-none");
        suggestBox.innerHTML = "";
        return;
      }
      suggestBox.innerHTML = items
        .map(function (it) {
          var u = it.url || "";
          if (!u || u.charAt(0) !== "/") u = "#";
          return (
            '<a class="search-suggest-item" href="' +
            u.replace(/"/g, "") +
            '"><span class="fw-medium">' +
            esc(it.name) +
            "</span>" +
            (it.type ? '<span class="small text-muted ms-1">' + esc(it.type) + "</span>" : "") +
            '<span class="small text-muted d-block text-truncate">' +
            esc(it.snippet || "") +
            "</span></a>"
          );
        })
        .join("");
      suggestBox.classList.remove("d-none");
    }
    var catDebounce;
    navInput.addEventListener("input", function () {
      clearTimeout(tmr);
      var q = navInput.value.trim();
      if (q.length < 2) {
        suggestBox.classList.add("d-none");
        suggestBox.innerHTML = "";
      } else {
        tmr = setTimeout(function () {
          fetch(suggestPath + "?q=" + encodeURIComponent(q))
            .then(function (r) {
              return r.json();
            })
            .then(function (data) {
              renderSuggest(data.results || []);
            });
        }, 220);
      }
      clearTimeout(catDebounce);
      if (document.getElementById("catalog-main")) {
        catDebounce = setTimeout(window.runCatalogSearch, 380);
      }
    });
    document.addEventListener("click", function (e) {
      if (!suggestBox.contains(e.target) && e.target !== navInput) {
        suggestBox.classList.add("d-none");
      }
    });
    navInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        window.runCatalogSearch();
        suggestBox.classList.add("d-none");
      }
    });
  }

  var mq = document.getElementById("mq");
  if (mq && document.getElementById("catalog-main")) {
    var deb2;
    mq.addEventListener("input", function () {
      clearTimeout(deb2);
      deb2 = setTimeout(function () {
        var nav = document.getElementById("nav-search-input");
        if (nav) nav.value = mq.value;
        window.runCatalogSearch();
      }, 380);
    });
  }

  window.addEventListener("popstate", function () {
    if (!document.getElementById("catalog-main")) return;
    var u = new URL(window.location.href);
    if (u.pathname.replace(/\/$/, "") !== indexPath.replace(/\/$/, "")) return;
    if (document.getElementById("catalog-dynamic")) showCatalogSkeleton();
    var purl = new URL(window.location.origin + partialPath);
    purl.search = u.search;
    fetch(purl.toString(), { headers: { "X-Requested-With": "XMLHttpRequest" } })
      .then(function (r) {
        return r.text();
      })
      .then(function (html) {
        if (replaceCatalogFromHtml(html)) syncNavFormFromUrl();
      });
  });

  function updateFavoriteBadges(count) {
    document.querySelectorAll(".js-fav-count-badge").forEach(function (el) {
      el.textContent = count;
      el.classList.toggle("d-none", !count);
    });
    document.querySelectorAll(".js-fav-nav-badge").forEach(function (el) {
      el.textContent = count;
      el.classList.toggle("d-none", !count);
    });
  }

  function updateFavLocalStorage(slug, isFavorite) {
    if (!slug) return;
    try {
      var list = JSON.parse(localStorage.getItem("dl_fav_slugs") || "[]");
      if (!Array.isArray(list)) list = [];
      if (isFavorite) {
        if (list.indexOf(slug) === -1) list.push(slug);
      } else {
        list = list.filter(function (s) { return s !== slug; });
      }
      localStorage.setItem("dl_fav_slugs", JSON.stringify(list));
    } catch (e) {}
  }

  document.addEventListener("submit", function (e) {
    var form = e.target.closest(".js-fav-form");
    if (!form) return;
    e.preventDefault();
    var fd = new FormData(form);
    fd.set("format", "json");
    fetch(form.action, {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "X-Requested-With": "XMLHttpRequest",
      },
      body: fd,
      credentials: "same-origin",
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (!data || !data.ok) return;
        var slug = form.getAttribute("data-tool-slug") || "";
        updateFavLocalStorage(slug, data.is_favorite);
        var btn = form.querySelector('button[type="submit"]');
        if (btn && btn.classList.contains("js-detail-fav-btn")) {
          btn.textContent = data.is_favorite ? "♥ Saved" : "♡ Add to favorites";
          btn.classList.toggle("is-favorite", data.is_favorite);
        }
        if (btn && btn.classList.contains("fav-heart-btn")) {
          form.classList.toggle("is-favorite", data.is_favorite);
          btn.classList.toggle("is-favorite", data.is_favorite);
          btn.setAttribute("aria-pressed", data.is_favorite ? "true" : "false");

          // If we're in favorites mode and just unfavorited, remove the card
          var isFavoritesMode = new URLSearchParams(window.location.search).get("favorites");
          if (!data.is_favorite && (isFavoritesMode === "1" || isFavoritesMode === "true" || isFavoritesMode === "yes")) {
            var slot = form.closest(".catalog-tool-slot");
            if (slot) {
              slot.style.transition = "opacity 0.3s ease, transform 0.3s ease";
              slot.style.opacity = "0";
              slot.style.transform = "scale(0.95)";
              setTimeout(function () {
                slot.remove();
                // Show empty state if no cards left
                var container = document.getElementById("tools-container");
                if (container && !container.querySelector(".catalog-tool-slot")) {
                  var dynArea = document.getElementById("catalog-dynamic");
                  if (dynArea) {
                    dynArea.innerHTML =
                      '<div class="catalog-empty-state card-glass border-0 text-center" role="status">' +
                      '<div class="catalog-empty-icon mx-auto mb-3" aria-hidden="true">' +
                      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
                      "</div>" +
                      '<p class="fw-semibold mb-1" style="color:var(--text);letter-spacing:-0.02em;">No favorites yet.</p>' +
                      '<p class="text-muted small mb-4" style="max-width:18rem;margin-left:auto;margin-right:auto;">Browse the catalog and save tools you love.</p>' +
                      '<a href="/" class="btn-primary-saas js-catalog-nav">Browse catalog</a>' +
                      "</div>";
                  }
                }
              }, 320);
            }
          }
        }
        if (btn) {
          btn.classList.remove("fav-pop");
          void btn.offsetWidth;
          btn.classList.add("fav-pop");
        }
        updateFavoriteBadges(data.favorite_count);
      })
      .catch(function () {});
  });

  try {
    if (new URLSearchParams(window.location.search).get("focus") === "search") {
      setTimeout(function () {
        var n = document.getElementById("nav-search-input");
        if (n) n.focus();
      }, 350);
    }
  } catch (err) {}

  var RECENT_KEY = "dl_recent_tools";
  var RECENT_MAX = 8;

  function readRecent() {
    try {
      var raw = localStorage.getItem(RECENT_KEY);
      var a = JSON.parse(raw || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function writeRecent(items) {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  function recordCurrentTool() {
    var meta = document.getElementById("tool-page-meta");
    if (!meta) return;
    var slug = meta.getAttribute("data-slug") || "";
    var name = meta.getAttribute("data-name") || "";
    var url = meta.getAttribute("data-url") || "";
    if (!slug || !url) return;
    var list = readRecent().filter(function (x) {
      return x && x.slug !== slug;
    });
    list.unshift({ slug: slug, name: name, url: url });
    if (list.length > RECENT_MAX) list = list.slice(0, RECENT_MAX);
    writeRecent(list);
  }

  function initialsFromName(n) {
    if (!n) return "?";
    var p = String(n).trim().split(/\s+/);
    var a = (p[0] && p[0][0]) || "?";
    var b = p[1] && p[1][0] ? p[1][0] : "";
    return (a + b).toUpperCase().slice(0, 2);
  }

  function renderRecentTools() {
    var items = readRecent();
    var ul = document.getElementById("recent-tools-list");
    var empty = document.getElementById("recent-tools-empty");
    var strip = document.getElementById("recent-strip");
    var stripInner = document.getElementById("recent-tools-strip");

    if (ul) {
      ul.innerHTML = "";
      items.forEach(function (it) {
        if (!it || !it.url) return;
        var li = document.createElement("li");
        li.className = "recent-viewed-item";
        var a = document.createElement("a");
        a.className = "recent-viewed-link";
        a.href = it.url;
        a.title = it.name || "";
        var ico = document.createElement("span");
        ico.className = "recent-viewed-ico";
        ico.textContent = initialsFromName(it.name);
        var nm = document.createElement("span");
        nm.className = "recent-viewed-name";
        nm.textContent = it.name || it.slug || "";
        a.appendChild(ico);
        a.appendChild(nm);
        li.appendChild(a);
        ul.appendChild(li);
      });
    }
    if (empty) {
      empty.classList.toggle("d-none", items.length > 0);
    }
    if (strip && stripInner) {
      stripInner.innerHTML = "";
      if (items.length) {
        strip.classList.remove("d-none");
        items.slice(0, 8).forEach(function (it) {
          if (!it || !it.url) return;
          var a = document.createElement("a");
          a.className = "recent-strip-chip";
          a.href = it.url;
          a.title = it.name || "";
          a.textContent = it.name || it.slug || "";
          stripInner.appendChild(a);
        });
      } else {
        strip.classList.add("d-none");
      }
    }
  }

  recordCurrentTool();
  renderRecentTools();

  bindCatalogUi();
})();
