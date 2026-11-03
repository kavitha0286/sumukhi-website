/* ==========================================================
   SUMUKHI — admin-editable gifting pages
   Renders content/<page>.json (edited in /admin) into the page.
   A section shows only between its show_from and show_until dates
   (both optional, inclusive) and only while "hidden" is off.
   ========================================================== */

(function () {
  const root = document.getElementById("page-sections");
  if (!root) return;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
  const slug = (text) => String(text).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // local date as YYYY-MM-DD so schedules switch at local midnight, not UTC
  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const dateOnly = (v) => (v ? String(v).slice(0, 10) : "");
  const isLive = (s) => !s.hidden
    && (!dateOnly(s.show_from) || dateOnly(s.show_from) <= today)
    && (!dateOnly(s.show_until) || today <= dateOnly(s.show_until));

  const prettyDate = (v) => new Date(`${dateOnly(v)}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  function enquiryHref(occasion, category) {
    const params = new URLSearchParams();
    if (occasion) params.set("occasion", occasion);
    if (category) params.set("category", category);
    const qs = params.toString();
    return `contact.html${qs ? `?${qs}` : ""}#enquire`;
  }

  function button(section, occasion, extraClass) {
    const label = section.button_label || "Enquire";
    return `<a href="${esc(enquiryHref(occasion, section.enquiry_category))}" class="btn ${extraClass} btn-lg">${esc(label)} <span aria-hidden="true">→</span></a>`;
  }

  function head(section, seasonal) {
    return `
      ${section.kicker ? `<p class="kicker">${esc(section.kicker)}</p>` : ""}
      <h2 class="h2 h2-alt">${esc(section.title)}</h2>
      ${seasonal}
      ${section.intro ? `<p class="section-intro">${esc(section.intro)}</p>` : ""}`;
  }

  function seasonalBadge(section) {
    return dateOnly(section.show_until)
      ? `<p class="season-badge"><span class="dot" aria-hidden="true"></span>Available until ${esc(prettyDate(section.show_until))}</p>`
      : "";
  }

  const RENDER = {
    grid(section, occasion) {
      const products = (section.products || []).map((p) => `
        <article class="product-card reveal">
          <div class="product-media">
            ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : ""}
            ${p.badge ? `<span class="product-badge">${esc(p.badge)}</span>` : ""}
          </div>
          <div class="product-body">
            <h3>${esc(p.name)}</h3>
            ${p.description ? `<p>${esc(p.description)}</p>` : ""}
          </div>
        </article>`).join("");
      return `
        <div class="container">
          <header class="section-head reveal">${head(section, seasonalBadge(section))}</header>
          <div class="product-grid">${products}</div>
          <div class="section-actions reveal">${button(section, occasion, section.style === "dark" ? "btn-primary" : "btn-dark")}</div>
        </div>`;
    },

    feature(section, occasion, index) {
      const highlights = (section.highlights || []).filter(Boolean).map((h) => `<li>${esc(h)}</li>`).join("");
      const btnClass = section.style === "green" ? "btn-green" : "btn-primary";
      return `
        <div class="container feature${index % 2 ? " feature-flip" : ""}">
          <figure class="feature-media reveal">
            ${section.image ? `<img src="${esc(section.image)}" alt="${esc(section.title)}" loading="lazy">` : ""}
          </figure>
          <div class="feature-copy reveal">
            ${head(section, seasonalBadge(section))}
            ${highlights ? `<ul class="ticks">${highlights}</ul>` : ""}
            <div>${button(section, occasion, btnClass)}</div>
          </div>
        </div>`;
    },

    banner(section, occasion) {
      return `
        <div class="banner" ${section.image ? `style="--banner-image: url('${esc(section.image)}')"` : ""}>
          <div class="container banner-inner reveal">
            ${head(section, seasonalBadge(section))}
            <div>${button(section, occasion, "btn-primary")}</div>
          </div>
        </div>`;
    },
  };

  function renderHero(data) {
    const hero = data.hero || {};
    const set = (sel, html) => { const el = document.querySelector(sel); if (el && html) el.innerHTML = html; };
    set("[data-hero-eyebrow]", esc(hero.eyebrow));
    set("[data-hero-title]", `${esc(hero.title)} <em>${esc(hero.title_accent)}</em>`);
    set("[data-hero-intro]", esc(hero.intro));
    const img = document.querySelector("[data-hero-image]");
    if (img && hero.image) { img.src = hero.image; img.alt = hero.title_accent ? `${hero.title} ${hero.title_accent}` : hero.title || ""; }
    const cta = document.querySelector("[data-hero-cta]");
    if (cta) cta.href = enquiryHref(data.enquiry_occasion, "");
  }

  function render(data) {
    renderHero(data);
    const sections = (data.sections || []).filter(isLive);
    const occasion = data.enquiry_occasion || "";
    const used = new Set();

    const html = sections.map((s, i) => {
      let id = slug(s.title) || `section-${i + 1}`;
      while (used.has(id)) id += "-2";
      used.add(id);
      s._id = id;
      const layout = RENDER[s.layout] ? s.layout : "grid";
      const style = ["light", "tint", "dark", "green"].includes(s.style) ? s.style : "light";
      return `<section class="section cms-section cms-${layout} cms-style-${style}" id="${id}">${RENDER[layout](s, occasion, i)}</section>`;
    }).join("");

    const index = sections.length > 2
      ? `<nav class="page-index" aria-label="On this page"><div class="container page-index-inner">
           <span class="page-index-label">On this page</span>
           ${sections.map((s) => `<a href="#${s._id}">${esc(s.title)}</a>`).join("")}
         </div></nav>`
      : "";

    root.innerHTML = index + (html || `<section class="section"><div class="container"><p class="section-intro">New collections are on their way — <a href="contact.html#enquire">send us an enquiry</a> in the meantime.</p></div></section>`);
    root.setAttribute("aria-busy", "false");

    // hand the new .reveal elements to the shared animation, or just show them
    if (window.SumukhiReveal) window.SumukhiReveal(root);
    else root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));

    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }

  fetch(root.dataset.content, { cache: "no-cache" })
    .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
    .then(render)
    .catch((err) => {
      console.error("Could not load page content:", err);
      root.setAttribute("aria-busy", "false");
      root.innerHTML = `<section class="section"><div class="container"><p class="section-intro">This page couldn't load right now. Please refresh, or <a href="contact.html#enquire">send us an enquiry</a>.</p></div></section>`;
    });
})();
