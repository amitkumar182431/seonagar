/**
 * ==========================================================================
 * NAGAR ASSOCIATES – MAIN APPLICATION SCRIPT
 * Interactive UI, Services Engine, Animations & Navigation
 * ==========================================================================
 */

(function () {
  'use strict';

  // Legal Services Database with Categories and Badges
  const SERVICES = [
    { id: "matrimonial", icon: "users", title: "Matrimonial Cases", desc: "Divorce (contested and mutual consent), maintenance, child custody, domestic violence, restitution of conjugal rights, and family dispute settlements.", category: "family", tag: "Confidential", featured: true },
    { id: "criminal", icon: "shield", title: "Criminal Cases", desc: "Bail, anticipatory bail, FIR and quashing matters, trial defence, cheque bounce complaints, and appeals before Magistrate and Sessions Courts.", category: "criminal", tag: "Criminal Defence", featured: true },
    { id: "civil-matters", icon: "scale", title: "Civil Matters", desc: "Civil suits, injunctions, partition, recovery suits, and dispute resolution before trial and appellate civil courts.", category: "civil", tag: "Civil Court", featured: true },
    { id: "labour-law", icon: "brief", title: "Labour Law Advisor", desc: "Advisory and representation on employer-employee disputes, termination, wages and dues, industrial disputes, and labour compliance.", category: "labour", tag: "Labour Law", featured: true },
    { id: "vakalat", icon: "file", title: "Vakalat & Court Representation", desc: "Appearing on your behalf in court under vakalatnama at District Court Gurgaon and other courts across Delhi NCR and other states.", category: "court", tag: "Vakalat", featured: true },
    { id: "property-documentation", icon: "home", title: "Property Documentation", desc: "Sale deeds, lease deeds, title search, verification, mutation, registry, and property dispute support.", category: "civil", tag: "Title Verification", featured: false },
    { id: "legal-notice", icon: "file", title: "Legal Notice Drafting & Replies", desc: "Professional drafting of legal notices and tactical replies across civil, criminal and commercial disputes.", category: "corporate", tag: "Drafting", featured: false },
    { id: "agreements-contracts", icon: "file", title: "Agreements & Documentation", desc: "Rental, partnership, employment, NDA, and commercial agreements with watertight clauses.", category: "corporate", tag: "Agreements", featured: false },
    { id: "legal-consultation", icon: "shield", title: "Legal Consultation & Guidance", desc: "Strategic legal advice, second opinions, and clear next steps before you take legal action.", category: "corporate", tag: "First Consult", featured: false }
  ];

  // FAQ Database
  const FAQS = [
    {
      q: "How soon can I schedule an initial consultation?",
      a: "You can schedule a consultation on the same day or within 24 hours. Once you submit the booking form or contact us via WhatsApp, our team will review your requirement and confirm your preferred slot."
    },
    {
      q: "What documents should I prepare before our meeting?",
      a: "Please carry or email all relevant agreements, notices, court summons, proof of payments, correspondence (emails/WhatsApp messages), and property papers pertinent to your matter."
    },
    {
      q: "Is our conversation and consultation kept confidential?",
      a: "Yes, completely. Client-attorney privilege and strict professional confidentiality are maintained for every client inquiry, documents shared, and consultation session."
    },
    {
      q: "Do you represent clients outside Gurgaon?",
      a: "Yes. Our office is at District Court Gurgaon, and we serve clients across Delhi NCR and other states, including appearances under vakalat, drafting, notices, and consultations."
    },
    {
      q: "How are legal fees structured?",
      a: "We believe in 100% upfront transparency. Fees are agreed upon in advance based on the complexity, stage of litigation, or documentation required. There are no hidden or surprise expenses."
    }
  ];

  /**
   * Render Services Grid with Category and Search Support
   */
  function initServices() {
    const grid = document.getElementById("grid");
    const select = document.getElementById("sel");
    const searchInput = document.getElementById("service-search");
    const clearSearchBtn = document.getElementById("clear-search");
    const filterBtns = document.querySelectorAll(".filter-btn");

    if (!grid) return;

    // Populate service options in contact form select
    if (select && select.options.length <= 1) {
      SERVICES.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.title;
        opt.textContent = s.title;
        select.appendChild(opt);
      });
    }

    let activeCategory = "all";
    let searchQuery = "";

    function renderCards() {
      grid.innerHTML = "";

      const filtered = SERVICES.filter(s => {
        const matchesCategory = (activeCategory === "all") || (s.category === activeCategory);
        const matchesSearch = !searchQuery || 
                              s.title.toLowerCase().includes(searchQuery) || 
                              s.desc.toLowerCase().includes(searchQuery) ||
                              s.tag.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="no-results">
            <svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <p>No legal services found matching "<b>${escapeHtml(searchQuery)}</b>".</p>
            <button type="button" class="btn line" id="reset-search-btn" style="margin-top:16px;padding:8px 18px;font-size:13px">View All Services</button>
          </div>
        `;
        const resetBtn = document.getElementById("reset-search-btn");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            searchQuery = "";
            activeCategory = "all";
            filterBtns.forEach(b => b.classList.toggle("active", b.dataset.category === "all"));
            if (clearSearchBtn) clearSearchBtn.classList.remove("visible");
            renderCards();
          });
        }
        return;
      }

      filtered.forEach((s, idx) => {
        const card = document.createElement("a");
        card.className = "card rv in";
        card.href = "#contact";
        card.dataset.service = s.title;
        card.style.setProperty("--d", `${(idx % 4) * 0.08}s`);

        card.innerHTML = `
          <span class="card-tag">${s.tag}</span>
          <span class="dot">
            <svg class="ico"><use href="#${s.icon}"/></svg>
          </span>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
          <div class="card-action">
            <span>Select & Consult</span>
            <svg class="ico ar"><use href="#arrow"/></svg>
          </div>
        `;

        card.addEventListener("click", () => {
          if (select) {
            select.value = s.title;
            select.classList.add("highlight");
            setTimeout(() => select.classList.remove("highlight"), 1200);
          }
        });

        grid.appendChild(card);
      });
    }

    // Category Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category || "all";
        renderCards();
      });
    });

    // Search Input
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle("visible", searchQuery.length > 0);
        }
        renderCards();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        searchQuery = "";
        clearSearchBtn.classList.remove("visible");
        renderCards();
      });
    }

    // Initial render
    renderCards();
  }

  /**
   * Render FAQ Accordion
   */
  function initFAQ() {
    const list = document.getElementById("faq-list");
    if (!list) return;

    list.innerHTML = "";
    FAQS.forEach((item, index) => {
      const el = document.createElement("div");
      el.className = `faq-item ${index === 0 ? "open" : ""}`;
      el.innerHTML = `
        <button class="faq-q" type="button" aria-expanded="${index === 0}">
          <span>${item.q}</span>
          <svg class="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        </button>
        <div class="faq-a">
          <p>${item.a}</p>
        </div>
      `;

      const qBtn = el.querySelector(".faq-q");
      qBtn.addEventListener("click", () => {
        const isOpen = el.classList.contains("open");
        // Close other items
        document.querySelectorAll(".faq-item").forEach(other => {
          other.classList.remove("open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          el.classList.add("open");
          qBtn.setAttribute("aria-expanded", "true");
        }
      });

      list.appendChild(el);
    });
  }

  /**
   * Header Navigation & Mobile Drawer
   */
  function initHeader() {
    const header = document.querySelector("header");
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelectorAll("nav a");

    if (!header) return;

    // Sticky header shadow on scroll
    window.addEventListener("scroll", () => {
      header.classList.toggle("sc", window.scrollY > 15);
    }, { passive: true });

    // Mobile Hamburger Toggle
    if (burger) {
      const toggleMenu = (open) => {
        header.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", String(open));
        burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        document.body.style.overflow = open && window.innerWidth <= 980 ? "hidden" : "";
      };

      burger.addEventListener("click", () => {
        const isOpen = header.classList.contains("open");
        toggleMenu(!isOpen);
      });

      navLinks.forEach(link => {
        link.addEventListener("click", () => toggleMenu(false));
      });

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") toggleMenu(false);
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 980 && header.classList.contains("open")) {
          toggleMenu(false);
        }
      });
    }

    // Scroll-Spy for Active Nav Link
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
      const scrollY = window.pageYOffset + 120;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute("id");

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(a => {
            a.classList.toggle("on", a.getAttribute("href") === `#${id}`);
          });
        }
      });
    }, { passive: true });
  }

  /**
   * Animated Numeric Counters (Stats Section)
   */
  function initStatsCounters() {
    const statsSection = document.querySelector(".stats");
    if (!statsSection) return;

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          entry.target.querySelectorAll("[data-n]").forEach(counter => {
            const target = +counter.dataset.n;
            const duration = 1600;
            const startTime = performance.now();

            function update(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Cubic ease-out
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.round(target * easeProgress);

              counter.textContent = currentVal.toLocaleString("en-IN");

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                counter.textContent = target.toLocaleString("en-IN");
              }
            }

            requestAnimationFrame(update);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  }

  /**
   * Scroll Reveal Animation Observer
   */
  function initScrollReveal() {
    const elements = document.querySelectorAll(".rv");
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    elements.forEach(el => observer.observe(el));
  }

  /**
   * Back to Top Button
   */
  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /**
   * Animate Rating Bars on scroll
   */
  function initRatingBars() {
    const rateSection = document.getElementById("rate-us");
    if (!rateSection) return;

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          // The bars already have their widths set inline;
          // we temporarily set them to 0 and animate them in
          const fills = rateSection.querySelectorAll(".rate-bar-fill");
          fills.forEach((fill, idx) => {
            const targetWidth = fill.style.width;
            fill.style.width = "0%";
            fill.style.transition = "none";
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                fill.style.transition = `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.06}s`;
                fill.style.width = targetWidth;
              });
            });
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(rateSection);
  }

  /**
   * Utility: Escape HTML strings
   */
  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }

  // Self Initialization on DOM Ready
  document.addEventListener("DOMContentLoaded", () => {
    initServices();
    initFAQ();
    initHeader();
    initStatsCounters();
    initScrollReveal();
    initBackToTop();
    initRatingBars();
  });
})();
