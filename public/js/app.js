/* ============================================================
   Saif Sidhik - Personal Site
   App entry: load JSON data, render sections, wire up UI.
   ============================================================ */

(() => {
  "use strict";

  // ---------- Tiny helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeHtml = (str = "") =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const fetchJSON = (url) =>
    fetch(url, { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status}`);
      return r.json();
    });

  // ---------- SVG icon set (inline) ----------
  const ICONS = {
    github:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    youtube:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    chevronDown:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    arrowUp:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
    sun:
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    moon:
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    menu:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    briefcase:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    cap:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 4 2 10l10 6 10-6z"/><path d="M6 12v5c3 1.5 9 1.5 12 0v-5"/></svg>',
    external:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    copy:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    download:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  };

  // ---------- Citation store (for copy-to-clipboard) ----------
  const citationStore = new Map();
  const addCitation = (id, kind, value) => {
    if (!value) return;
    citationStore.set(`${id}:${kind}`, value);
  };

  // ---------- Theme ----------
  const THEME_KEY = "ss-theme";
  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }
  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }
  function initTheme() {
    const stored = getStoredTheme();
    if (stored) applyTheme(stored);
  }
  initTheme();

  // ---------- Render: head / meta ----------
  function renderHead(profile) {
    document.title = `${profile.name} - ${profile.tagline.split("·")[0].trim()}`;

    const descMeta = $('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", profile.metaDescription);
    const authorMeta = $('meta[name="author"]');
    if (authorMeta) authorMeta.setAttribute("content", profile.name);
    const favicon = $('link[rel="icon"]');
    if (favicon && profile.favicon) favicon.setAttribute("href", profile.favicon);

    // Google Analytics (optional)
    if (profile.analytics && profile.analytics.gtagId) {
      const id = profile.analytics.gtagId;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", id);
      window.gtag = gtag;
    }
    if (profile.analytics && profile.analytics.googleSiteVerification) {
      const m = document.createElement("meta");
      m.name = "google-site-verification";
      m.content = profile.analytics.googleSiteVerification;
      document.head.appendChild(m);
    }
  }

  // ---------- Render: navbar/hero/about/contact/footer ----------
  function renderShell(profile) {
    // Hero
    $("#heroName").innerHTML = `Hi, I'm <span class="accent">${escapeHtml(profile.name)}</span>.`;
    $("#heroLede").innerHTML = profile.lede || profile.about[0] || "";
    const rolesEl = $("#heroRoles");
    rolesEl.innerHTML = (profile.roles || [])
      .map((r) => `<li>${escapeHtml(r)}</li>`)
      .join("");

    // Hero social
    const heroSocial = $("#heroSocial");
    heroSocial.innerHTML = (profile.social || [])
      .map(
        (s) =>
          `<a class="icon-btn" href="${escapeHtml(s.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(s.label)}" title="${escapeHtml(s.label)}">${ICONS[s.icon] || ""}</a>`
      )
      .join("");

    // About
    $("#aboutAvatar").innerHTML = `<img src="${escapeHtml(profile.profileImage)}" alt="Portrait of ${escapeHtml(profile.name)}" loading="lazy" />`;
    $("#aboutText").innerHTML = profile.about.map((p) => `<p>${p}</p>`).join("");

    // Contact
    $("#contactEmail").textContent = profile.email;
    $("#contactEmail").setAttribute("href", `mailto:${profile.email}`);

    // CV buttons
    if (profile.cv) {
      $("#cvView").setAttribute("href", profile.cv.viewUrl);
      $("#cvDownload").setAttribute("href", profile.cv.downloadUrl);
    }

    // Footer
    $("#footerCopy").textContent = profile.footer.copyright;
    $("#footerSocial").innerHTML = (profile.social || [])
      .map(
        (s) =>
          `<a class="icon-btn" href="${escapeHtml(s.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(s.label)}" title="${escapeHtml(s.label)}">${ICONS[s.icon] || ""}</a>`
      )
      .join("");
  }

  // ---------- Card builder (shared by publications & projects) ----------
  function buildLinkButtons(links) {
    if (!Array.isArray(links) || links.length === 0) return "";
    return `<div class="card__links">${links
      .map(
        (l) =>
          `<a class="btn btn-ghost btn-small" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)} ${ICONS.external}</a>`
      )
      .join("")}</div>`;
  }

  function buildCiteRow(id, pub) {
    const parts = [];
    if (pub.bibtex) {
      addCitation(id, "bibtex", pub.bibtex);
      parts.push(
        `<button class="cite-btn" type="button" data-copy="${id}:bibtex">${ICONS.copy}<span>Copy BibTeX</span></button>`
      );
    }
    if (pub.plainCite) {
      addCitation(id, "plain", pub.plainCite);
      parts.push(
        `<button class="cite-btn" type="button" data-copy="${id}:plain">${ICONS.copy}<span>Copy plaintext</span></button>`
      );
    }
    if (pub.doi && pub.doi.url && pub.doi.badge) {
      parts.push(
        `<a class="card__doi-badge" href="${escapeHtml(pub.doi.url)}" target="_blank" rel="noopener"><img src="${escapeHtml(pub.doi.badge)}" alt="DOI ${escapeHtml(pub.doi.id || "")}"/></a>`
      );
    }
    if (parts.length === 0) return "";
    return `<div class="card__cite">${parts.join("")}</div>`;
  }

  function buildVideo(url) {
    if (!url) return "";
    return `<div class="card__video"><iframe loading="lazy" src="${escapeHtml(url)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  }

  function publicationCard(pub) {
    const id = `pub-${pub.id}`;
    const videoHtml = buildVideo(pub.video);
    const tags = [
      `<span class="tag">${escapeHtml(pub.typeLabel || pub.type || "Publication")}</span>`,
      pub.year ? `<span class="card__year">${escapeHtml(String(pub.year))}</span>` : "",
      pub.award ? `<span class="tag tag--award">★ ${escapeHtml(pub.award)}</span>` : "",
    ]
      .filter(Boolean)
      .join("");

    const publishedHtml = pub.publishedIn
      ? `<p class="card__sub" style="margin-top:1rem">${pub.publishedIn}</p>`
      : "";

    return `
      <li class="card" id="${id}" data-search="${escapeHtml(
        [pub.title, pub.authors, pub.venue, pub.typeLabel, String(pub.year || "")].join(" ").toLowerCase()
      )}" data-type="${escapeHtml(pub.type || "")}" data-year="${escapeHtml(String(pub.year || ""))}">
        <button class="card__header" aria-expanded="false" aria-controls="${id}-body">
          <div class="card__thumb">${pub.image ? `<img src="${escapeHtml(pub.image)}" alt="" loading="lazy" />` : ""}</div>
          <div class="card__head-text">
            <div class="card__meta">${tags}</div>
            <h3 class="card__title">${escapeHtml(pub.title)}</h3>
            <p class="card__authors">${escapeHtml(pub.authors || "")}</p>
            <p class="card__sub">${escapeHtml(pub.venue || "")}</p>
          </div>
          <span class="card__chevron" aria-hidden="true">${ICONS.chevronDown}</span>
        </button>
        <div class="card__body" id="${id}-body">
          <div class="card__body-inner">
            <div class="card__body-content">
              ${videoHtml}
              ${pub.abstract ? `<p class="card__abstract"><span class="card__abstract-label">Abstract</span>${escapeHtml(pub.abstract)}</p>` : ""}
              ${publishedHtml}
              ${buildLinkButtons(pub.links)}
              ${buildCiteRow(pub.id, pub)}
            </div>
          </div>
        </div>
      </li>
    `;
  }

  function projectCard(proj) {
    const id = `proj-${proj.id}`;
    const videoHtml = buildVideo(proj.video);
    const features = Array.isArray(proj.features) && proj.features.length
      ? `<ul class="card__features">${proj.features.map((f) => `<li>${f}</li>`).join("")}</ul>`
      : "";

    const githubBadge = proj.githubRepo
      ? `<a class="btn btn-ghost btn-small" href="https://github.com/${escapeHtml(proj.githubRepo)}" target="_blank" rel="noopener">${ICONS.github} <span>${escapeHtml(proj.githubRepo)}</span></a>`
      : "";

    const tags = [
      `<span class="tag tag--warm">${escapeHtml(proj.categoryLabel || proj.category || "Project")}</span>`,
      ...(proj.tags || []).map((t) => `<span class="tag tag--muted">${escapeHtml(t)}</span>`),
    ].join("");

    return `
      <li class="card" id="${id}" data-search="${escapeHtml(
        [proj.title, proj.shortDescription, proj.categoryLabel, (proj.tags || []).join(" ")].join(" ").toLowerCase()
      )}" data-category="${escapeHtml(proj.category || "")}">
        <button class="card__header" aria-expanded="false" aria-controls="${id}-body">
          <div class="card__thumb">${proj.image ? `<img src="${escapeHtml(proj.image)}" alt="" loading="lazy" />` : ""}</div>
          <div class="card__head-text">
            <div class="card__meta">${tags}</div>
            <h3 class="card__title">${escapeHtml(proj.title)}</h3>
            <p class="card__sub">${escapeHtml(proj.shortDescription || "")}</p>
          </div>
          <span class="card__chevron" aria-hidden="true">${ICONS.chevronDown}</span>
        </button>
        <div class="card__body" id="${id}-body">
          <div class="card__body-inner">
            <div class="card__body-content">
              ${videoHtml}
              ${proj.description ? `<p>${proj.description}</p>` : ""}
              ${features}
              <div class="card__links">
                ${githubBadge}
                ${(proj.links || [])
                  .map(
                    (l) =>
                      `<a class="btn btn-ghost btn-small" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)} ${ICONS.external}</a>`
                  )
                  .join("")}
              </div>
              ${buildCiteRow(proj.id, proj)}
            </div>
          </div>
        </div>
      </li>
    `;
  }

  // ---------- Render: publications ----------
  function renderPublications(pubs) {
    const groupBy = (arr, key) =>
      arr.reduce((acc, item) => {
        const k = item[key] || "Other";
        (acc[k] = acc[k] || []).push(item);
        return acc;
      }, {});

    // sort: by year desc, conf/journal before workshop within year
    const typeOrder = { journal: 0, conference: 1, workshop: 2 };
    pubs = pubs.slice().sort((a, b) => {
      if (b.year !== a.year) return (b.year || 0) - (a.year || 0);
      return (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
    });

    const list = $("#publicationsList");
    list.innerHTML = pubs.map(publicationCard).join("");

    // Build year/type filter chips dynamically
    const types = Array.from(new Set(pubs.map((p) => p.type))).filter(Boolean);
    const years = Array.from(new Set(pubs.map((p) => p.year))).filter(Boolean).sort((a, b) => b - a);
    const filtersEl = $("#publicationsFilters");
    filtersEl.innerHTML =
      `<button class="chip is-active" data-filter="all" data-target="publications">All</button>` +
      types
        .map(
          (t) =>
            `<button class="chip" data-filter="type:${escapeHtml(t)}" data-target="publications">${escapeHtml(t.charAt(0).toUpperCase() + t.slice(1))}</button>`
        )
        .join("") +
      years
        .map(
          (y) =>
            `<button class="chip" data-filter="year:${escapeHtml(String(y))}" data-target="publications">${escapeHtml(String(y))}</button>`
        )
        .join("");

    setupFilter("publications");
  }

  // ---------- Render: projects ----------
  function renderProjects(projects) {
    // Group by category but render all in one list with filterable category
    const order = { app: 0, library: 1, academic: 2 };
    projects = projects.slice().sort((a, b) => {
      const oa = order[a.category] ?? 9;
      const ob = order[b.category] ?? 9;
      if (oa !== ob) return oa - ob;
      return 0;
    });

    const list = $("#projectsList");
    list.innerHTML = projects.map(projectCard).join("");

    const categories = Array.from(new Set(projects.map((p) => p.category))).filter(Boolean);
    const filtersEl = $("#projectsFilters");
    filtersEl.innerHTML =
      `<button class="chip is-active" data-filter="all" data-target="projects">All</button>` +
      categories
        .map((c) => {
          const label =
            c === "library" ? "Open Source"
            : c === "academic" ? "Academic"
            : c === "app" ? "Side Projects"
            : c;
          return `<button class="chip" data-filter="category:${escapeHtml(c)}" data-target="projects">${escapeHtml(label)}</button>`;
        })
        .join("");

    setupFilter("projects");
  }

  // ---------- Render: experience & education ----------
  function renderTimeline(targetId, items, type) {
    const el = $(targetId);
    if (!items || !items.length) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML = items
      .map((it) => {
        if (type === "experience") {
          return `
            <li class="timeline__item ${it.current ? "is-current" : ""}">
              <span class="timeline__dot"></span>
              <div class="timeline__head">
                <h4 class="timeline__title">${escapeHtml(it.role)}</h4>
                <span class="timeline__period">${escapeHtml(it.period)}</span>
              </div>
              <p class="timeline__org"><a href="${escapeHtml(it.organizationUrl || "#")}" target="_blank" rel="noopener">${escapeHtml(it.organization)}</a></p>
              <p class="timeline__desc">${it.description || ""}</p>
            </li>`;
        }
        return `
          <li class="timeline__item">
            <span class="timeline__dot"></span>
            <div class="timeline__head">
              <h4 class="timeline__title">${escapeHtml(it.degree)}</h4>
              <span class="timeline__period">${escapeHtml(it.period)}</span>
            </div>
            <p class="timeline__org"><a href="${escapeHtml(it.institutionUrl || "#")}" target="_blank" rel="noopener">${escapeHtml(it.institution)}</a></p>
            <p class="timeline__desc">${it.description || ""}</p>
          </li>`;
      })
      .join("");
  }

  // ---------- Filter / Search wiring ----------
  function setupFilter(target) {
    const search = $(`#${target}Search`);
    const list = $(`#${target}List`);
    const filtersEl = $(`#${target}Filters`);
    const countEl = $(`#${target}Count`);

    let currentFilter = "all";
    let currentQuery = "";

    function apply() {
      const items = $$(":scope > li", list);
      let visible = 0;
      items.forEach((li) => {
        let pass = true;
        if (currentFilter !== "all") {
          const [key, val] = currentFilter.split(":");
          if (key === "type") pass = li.getAttribute("data-type") === val;
          else if (key === "year") pass = li.getAttribute("data-year") === val;
          else if (key === "category") pass = li.getAttribute("data-category") === val;
        }
        if (pass && currentQuery) {
          pass = (li.getAttribute("data-search") || "").includes(currentQuery);
        }
        li.style.display = pass ? "" : "none";
        if (pass) visible++;
      });
      countEl.textContent = `${visible} of ${items.length}`;
      let empty = $(`#${target}Empty`);
      if (!visible) {
        if (!empty) {
          empty = document.createElement("div");
          empty.id = `${target}Empty`;
          empty.className = "empty";
          empty.textContent = "No results match your filters.";
          list.parentNode.insertBefore(empty, list.nextSibling);
        }
        empty.style.display = "";
      } else if (empty) {
        empty.style.display = "none";
      }
    }

    if (filtersEl) {
      filtersEl.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-filter]");
        if (!btn) return;
        filtersEl.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
        btn.classList.add("is-active");
        currentFilter = btn.getAttribute("data-filter");
        apply();
      });
    }

    if (search) {
      search.addEventListener("input", (e) => {
        currentQuery = e.target.value.trim().toLowerCase();
        apply();
      });
    }

    apply();
  }

  // ---------- Expand/collapse cards ----------
  function wireUpCardToggles() {
    document.body.addEventListener("click", (e) => {
      const header = e.target.closest(".card__header");
      if (header) {
        const card = header.closest(".card");
        const open = card.classList.toggle("is-open");
        header.setAttribute("aria-expanded", open ? "true" : "false");
        return;
      }
      const copyBtn = e.target.closest("[data-copy]");
      if (copyBtn) {
        const key = copyBtn.getAttribute("data-copy");
        const text = citationStore.get(key);
        if (!text) return;
        navigator.clipboard.writeText(text).then(
          () => {
            copyBtn.classList.add("is-copied");
            const label = copyBtn.querySelector("span");
            const orig = label ? label.textContent : "";
            copyBtn.innerHTML = `${ICONS.check}<span>Copied!</span>`;
            setTimeout(() => {
              copyBtn.classList.remove("is-copied");
              copyBtn.innerHTML = `${ICONS.copy}<span>${orig}</span>`;
            }, 1600);
          },
          () => {
            alert("Copy failed - please copy manually.");
          }
        );
      }
    });
  }

  // ---------- Theme toggle ----------
  function wireUpThemeToggle() {
    const btn = $("#themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      // Default is light; toggle flips to/from dark
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      storeTheme(next);
    });
  }

  // ---------- Nav: sticky shadow + mobile toggle + active link ----------
  function wireUpNav() {
    const nav = $("#mainNav");
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
      const top = $("#backToTop");
      if (top) top.classList.toggle("is-visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile menu
    const toggle = $("#mobileNavToggle");
    const links = $("#navLinks");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        links.classList.toggle("is-open");
      });
      links.addEventListener("click", (e) => {
        if (e.target.closest("a")) links.classList.remove("is-open");
      });
    }

    // Active section observer
    const sections = $$("section[id]");
    if ("IntersectionObserver" in window && sections.length) {
      const linkMap = new Map();
      $$("#navLinks a[href^='#']").forEach((a) => {
        linkMap.set(a.getAttribute("href").slice(1), a);
      });
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              linkMap.forEach((a) => a.classList.remove("is-active"));
              const link = linkMap.get(entry.target.id);
              if (link) link.classList.add("is-active");
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      sections.forEach((s) => io.observe(s));
    }
  }

  function wireUpBackToTop() {
    const btn = $("#backToTop");
    if (!btn) return;
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // ---------- Static icon insertion ----------
  function inflateIcons() {
    $$("[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      if (ICONS[name]) el.innerHTML = ICONS[name];
    });
  }

  // ---------- Boot ----------
  async function boot() {
    try {
      const [profile, publications, projects, experience, education] =
        await Promise.all([
          fetchJSON("data/profile.json"),
          fetchJSON("data/publications.json"),
          fetchJSON("data/projects.json"),
          fetchJSON("data/experience.json"),
          fetchJSON("data/education.json"),
        ]);

      renderHead(profile);
      renderShell(profile);
      renderPublications(publications);
      renderProjects(projects);
      renderTimeline("#experienceTimeline", experience, "experience");
      renderTimeline("#educationTimeline", education, "education");
      inflateIcons();
      wireUpCardToggles();
      wireUpThemeToggle();
      wireUpNav();
      wireUpBackToTop();
    } catch (err) {
      console.error(err);
      const main = $("main");
      if (main) {
        main.innerHTML =
          `<div class="container" style="padding:6rem 1rem;text-align:center;color:var(--color-text-muted)"><h2>Something went wrong loading the page.</h2><p>${escapeHtml(err.message)}</p></div>`;
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
