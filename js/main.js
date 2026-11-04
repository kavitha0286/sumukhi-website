/* ==========================================================
   SUMUKHI — site interactions
   ========================================================== */

// Enquiries are delivered to this inbox through FormSubmit (https://formsubmit.co).
// The very first submission triggers a one-time activation email to this address —
// open it and click "Activate Form", after which every enquiry arrives automatically.
const ENQUIRY_EMAIL = "giftsatsumukhi@gmail.com";
const ENQUIRY_ENDPOINT = `https://formsubmit.co/ajax/${ENQUIRY_EMAIL}`;
const WHATSAPP_NUMBER = "919363149188";

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  // each feature is isolated so one failure can never disable the enquiry form
  [
    setupHeader, setupNav, setupReveal, setupScrollSpy, setupFaq,
    setupPrefill, setupEnquiryForm, setupWhatsAppButton, setupCategoryCarousel,
  ].forEach((setup) => {
    try { setup(); } catch (err) { console.error(`${setup.name} failed:`, err); }
  });
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Hide the floating WhatsApp button where it would cover the form ---------- */
function setupWhatsAppButton() {
  const wa = document.querySelector(".wa-float");
  const zones = [document.getElementById("enquire"), document.querySelector(".site-footer")];
  if (!wa || !("IntersectionObserver" in window)) return;
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    wa.classList.toggle("is-hidden", visible.size > 0);
  }, { threshold: 0.05 });
  zones.forEach((z) => z && io.observe(z));
}

/* ---------- Phones: "n / 10" counter for the swipeable collections ---------- */
function setupCategoryCarousel() {
  const track = document.querySelector(".categories");
  const count = document.querySelector(".cat-count");
  if (!track || !count) return;
  const cards = track.querySelectorAll(".category");
  let ticking = false;
  track.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
      const i = Math.min(cards.length - 1, Math.round(track.scrollLeft / step));
      count.textContent = `${i + 1} / ${cards.length}`;
      ticking = false;
    });
  }, { passive: true });
}

/* ---------- Header shadow on scroll ---------- */
function setupHeader() {
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile navigation ---------- */
function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });

  // "Gifting for" dropdown (desktop); on phones its links are always listed
  const group = nav.querySelector(".nav-group");
  const groupToggle = group?.querySelector(".nav-group-toggle");
  const setGroup = (open) => {
    groupToggle?.setAttribute("aria-expanded", String(open));
    group?.classList.toggle("is-open", open);
  };
  groupToggle?.addEventListener("click", () => setGroup(groupToggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("click", (e) => { if (group && !group.contains(e.target)) setGroup(false); });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (group?.classList.contains("is-open")) { setGroup(false); groupToggle.focus(); }
    else if (nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 1101px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

/* ---------- Reveal on scroll ---------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // stagger siblings that enter together
      const siblings = [...entry.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
      entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target), 4) * 80}ms`;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach((el) => io.observe(el));
  // content rendered later (js/sections.js) registers its own .reveal elements here
  window.SumukhiReveal = (scope) => scope.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
}

/* ---------- Highlight current section in nav + collection index ---------- */
function setupScrollSpy() {
  if (!("IntersectionObserver" in window)) return;

  const spy = (links, targets, rootMargin) => {
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("is-active"));
        const link = byId.get(entry.target.id);
        if (!link) return;
        link.classList.add("is-active");
        if (link.parentElement.classList.contains("cat-index")) {
          link.parentElement.scrollTo({ left: link.offsetLeft - 16, behavior: "smooth" });
        }
      });
    }, { rootMargin });
    targets.forEach((t) => t && io.observe(t));
  };

  // only in-page links (the catalogue link points at a PDF, not a section)
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]:not(.btn)')];
  spy(navLinks, navLinks.map((a) => document.querySelector(a.getAttribute("href"))), "-45% 0px -50% 0px");

  const catLinks = [...document.querySelectorAll('.cat-index a[href^="#"]')];
  spy(catLinks, catLinks.map((a) => document.querySelector(a.getAttribute("href"))), "-40% 0px -55% 0px");
}

/* ---------- FAQ: keep one answer open at a time ---------- */
function setupFaq() {
  const items = document.querySelectorAll(".faq-list details");
  items.forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) items.forEach((other) => { if (other !== d) other.open = false; });
  }));
}

/* ---------- Prefill the enquiry form ----------
   Enquire buttons on other pages link to contact.html?category=…#enquire;
   buttons on the contact page itself carry the same hints as data-* attributes. */
function setupPrefill() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  const FIELDS = ["category", "occasion", "budget"];

  const apply = (values) => {
    let changed = false;
    FIELDS.forEach((name) => {
      const value = values[name];
      if (!value) return;
      const select = form.elements[name];
      const match = [...select.options].find((o) => o.text === value || o.value === value);
      if (match) { select.value = match.value; changed = true; }
    });
    return changed;
  };
  // focus the first empty field once any scroll has landed
  const focusFirstEmpty = () => setTimeout(() => {
    const firstEmpty = [...form.querySelectorAll("input[required], select[required]")].find((el) => !el.value);
    (firstEmpty || form.elements.name).focus({ preventScroll: true });
  }, 600);

  const params = new URLSearchParams(location.search);
  if (apply(Object.fromEntries(FIELDS.map((f) => [f, params.get(f)])))) focusFirstEmpty();

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-category], [data-occasion], [data-budget]");
    if (!trigger || !trigger.getAttribute("href")?.startsWith("#")) return;
    apply(trigger.dataset);
    focusFirstEmpty();
  });
}

/* ---------- Enquiry form: validation + email delivery ---------- */
function setupEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  const status = form.querySelector(".form-status");
  const submit = form.querySelector('button[type="submit"]');
  const submitLabel = submit.innerHTML;

  const messages = {
    valueMissing: "This field is required.",
    typeMismatch: "Please enter a valid email address.",
    patternMismatch: "Please enter a valid phone number.",
    rangeUnderflow: "Please enter at least 1.",
  };

  const showError = (field) => {
    const wrap = field.closest(".field");
    if (!wrap) return;
    let err = wrap.querySelector(".field-error");
    const key = Object.keys(messages).find((k) => field.validity[k]);
    if (!key) {
      wrap.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
      err?.remove();
      return;
    }
    wrap.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");
    if (!err) {
      err = document.createElement("span");
      err.className = "field-error";
      err.id = `${field.name}-error`;
      wrap.appendChild(err);
      field.setAttribute("aria-describedby", err.id);
    }
    err.textContent = messages[key];
  };

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => { if (field.closest(".has-error") || field.value) showError(field); });
    field.addEventListener("input", () => { if (field.closest(".has-error")) showError(field); });
  });

  const setStatus = (type, html) => {
    status.className = `form-status ${type ? `is-${type}` : ""}`;
    status.innerHTML = html;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
    form.querySelectorAll("input, select, textarea").forEach(showError);
    if (invalid.length) {
      invalid[0].focus();
      setStatus("error", "Please check the highlighted fields.");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    if (data._honey) return; // bot

    const payload = {
      _subject: `New gifting enquiry — ${data.organisation} (${data.occasion})`,
      _template: "table",
      _captcha: "false",
      Name: data.name,
      Organisation: data.organisation,
      email: data.email, // FormSubmit uses this as the reply-to address
      Phone: data.phone,
      "Gifting for": data.occasion,
      Collection: data.category || "Not sure yet",
      Quantity: data.quantity,
      "Budget per unit": data.budget || "Flexible",
      "Needed by": data.needed_by || "—",
      Message: data.message || "—",
    };

    submit.disabled = true;
    submit.textContent = "Sending…";
    setStatus("", "");

    try {
      const res = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== "true") throw new Error(json.message || `HTTP ${res.status}`);

      form.reset();
      form.querySelectorAll(".has-error").forEach((w) => w.classList.remove("has-error"));
      setStatus("success", `<strong>Thank you, ${escapeHtml(data.name.split(" ")[0])}!</strong> Your enquiry has reached the Sumukhi team — we'll be in touch shortly at ${escapeHtml(data.email)}.`);
    } catch (err) {
      console.error("Enquiry delivery failed:", err);
      const summary = Object.entries(payload)
        .filter(([k]) => !k.startsWith("_"))
        .map(([k, v]) => `${k === "email" ? "Email" : k}: ${v}`)
        .join("\n");
      const mailto = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(payload._subject)}&body=${encodeURIComponent(summary)}`;
      const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Sumukhi, gifting enquiry:\n${summary}`)}`;
      setStatus("error", `We couldn't send your enquiry just now. Your details are still filled in — send them in one tap instead:
        <span class="fallback">
          <a class="btn btn-dark btn-sm" href="${mailto}">Send by email</a>
          <a class="btn btn-ghost btn-sm" href="${wa}" target="_blank" rel="noopener">Send on WhatsApp</a>
        </span>`);
    } finally {
      submit.disabled = false;
      submit.innerHTML = submitLabel;
    }
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
