(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---------- Splash (double safety net) ---------- */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    function hide() { splash.classList.add("is-out"); }
    if (document.readyState === "complete") setTimeout(hide, 550);
    else window.addEventListener("load", function () { setTimeout(hide, 400); });
    setTimeout(hide, 3200); // hard safety, matches CSS animation
  }

  /* ---------- Header / mobile nav ---------- */
  function initNav() {
    var header = $("[data-header]");
    var nav = $("[data-nav]");
    var toggle = $("[data-nav-toggle]");
    if (!nav || !toggle) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    if (header) {
      var onScroll = function () {
        header.style.boxShadow = window.scrollY > 12 ? "0 8px 24px rgba(0,0,0,.08)" : "none";
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ---------- Smooth anchor scroll (native, no Lenis — see gotcha B.1.4) ---------- */
  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ---------- Scroll reveals (IntersectionObserver + 6s safety net) ---------- */
  function initReveals() {
    var targets = $$("[data-reveal], .reveal");
    if (!targets.length) return;

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });

    targets.forEach(function (el) { io.observe(el); });

    // Safety net: force-reveal anything still hidden after 6s
    setTimeout(function () {
      targets.forEach(function (el) {
        if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ---------- Split words, preserving <br> and inline elements (gotcha A.4) ---------- */
  function splitWords(el) {
    var wrap = function (text) {
      return text.split(/(\s+)/).map(function (w) {
        return /^\s+$/.test(w) ? w : '<span class="split-word">' + w.replace(/[&<>"']/g, function (c) {
          return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        }) + "</span>";
      }).join("");
    };
    var html = Array.prototype.map.call(el.childNodes, function (node) {
      if (node.nodeType === 3) return wrap(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        var tag = node.tagName.toLowerCase();
        var cls = node.className ? ' class="' + node.className + '"' : "";
        return "<" + tag + cls + ">" + wrap(node.textContent) + "</" + tag + ">";
      }
      return "";
    }).join("");
    el.innerHTML = html;
    return $$(".split-word", el);
  }

  /* ---------- Hero: split-text entrance (progressive enhancement — content already visible via CSS) ---------- */
  function initSplitHero() {
    if (!window.gsap) return;
    var title = $(".hero-title[data-split]");
    if (!title) return;
    var words = splitWords(title);
    if (!words.length) return;
    gsap.set(words, { opacity: 0, y: 26, rotate: -2 });
    gsap.to(words, {
      opacity: 1, y: 0, rotate: 0,
      duration: 0.85, ease: "expo.out", stagger: 0.055, delay: 0.5
    });
  }

  /* ---------- Magnetic buttons — functional micro-interaction, hover-capable devices only ---------- */
  function initMagnetic() {
    if (!fineHover) return;
    $$("[data-magnetic]").forEach(function (el) {
      var strength = 14;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        if (window.gsap) {
          gsap.to(el, { x: x * strength, y: y * strength, duration: 0.35, ease: "power3.out" });
        } else {
          el.style.transform = "translate(" + (x * strength) + "px," + (y * strength) + "px)";
        }
      });
      el.addEventListener("mouseleave", function () {
        if (window.gsap) gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        else el.style.transform = "";
      });
    });
  }

  /* ---------- Custom cursor (gotcha A.3 — hidden until first mousemove, never at 0,0) ---------- */
  function initCursor() {
    if (!fineHover) return;
    var cursor = $("[data-cursor]");
    var dot = $(".cursor-dot", cursor);
    var ring = $(".cursor-ring", cursor);
    if (!cursor || !dot || !ring) return;

    var mx = 0, my = 0, rx = 0, ry = 0, firstMove = false;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0) translate(-50%,-50%)";
      if (!firstMove) {
        firstMove = true;
        rx = mx; ry = my;
        ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
        cursor.classList.add("is-ready");
        tick();
      }
    });

    function tick() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(tick);
    }

    $$("a, button, [data-tilt]").forEach(function (el) {
      el.addEventListener("mouseover", function (e) { if (!el.contains(e.relatedTarget)) cursor.classList.add("is-hovering"); });
      el.addEventListener("mouseout", function (e) { if (!el.contains(e.relatedTarget)) cursor.classList.remove("is-hovering"); });
    });
  }

  /* ---------- Case study: scroll-triggered entrance (not pinned — safe to animate children, gotcha A.7) ----------
     .case-grid has its own stagger via initLogoStagger()'s generic [data-stagger-group] handler,
     so it's deliberately excluded here to avoid animating those items twice. */
  function initCaseReveal() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var section = $(".case-study");
    if (!section) return;
    var devices = $(".case-devices", section);
    var copyChildren = $$(".case-lead, .case-grew, .case-cta", section);
    var tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 82%" } });
    if (devices) tl.from(devices, { opacity: 0, scale: 0.94, duration: 0.7, ease: "expo.out" });
    if (copyChildren.length) tl.from(copyChildren, { opacity: 0, y: 22, duration: 0.6, ease: "power3.out", stagger: 0.08 }, "-=0.45");
  }

  /* ---------- Stagger groups (logo cards, price cards, combos): settle-in on scroll ---------- */
  /* Owns its own opacity via GSAP — see .stagger-item default visible in CSS for the no-GSAP fallback */
  function initLogoStagger() {
    if (!window.gsap || !window.ScrollTrigger) return;
    $$("[data-stagger-group]").forEach(function (group) {
      var items = $$(".stagger-item", group);
      if (!items.length) return;
      /* No rotation here on purpose — every card stays perfectly straight, even mid-animation */
      gsap.from(items, {
        opacity: 0, y: 36,
        duration: 0.7, ease: "back.out(1.4)", stagger: 0.1,
        scrollTrigger: { trigger: group, start: "top 88%" }
      });
    });
  }

  /* ---------- Safety net for GSAP-hidden elements (mirrors the 6s IO safety net, gotcha A.8/A.9 pattern) ----------
     If ScrollTrigger never fires (throttled/background tab, slow device, unexpected error),
     force-reveal anything already in/near the viewport so content is never stuck invisible. */
  function initMotionSafety() {
    if (!window.gsap) return;
    var sel = ".split-word, .stagger-item, .case-devices, .case-lead, .case-grew, .case-cta";
    function rotationDeg(transform) {
      var m = transform && transform.match(/^matrix\(([^)]+)\)/);
      if (!m) return 0;
      var p = m[1].split(",").map(parseFloat);
      return Math.atan2(p[1], p[0]) * 180 / Math.PI;
    }
    function sweep() {
      $$(sel).forEach(function (el) {
        var cs = getComputedStyle(el);
        var op = parseFloat(cs.opacity);
        // Catch both "never finished" (opacity off) and "stuck mid-tween" (still visibly rotated)
        var stuck = op < 0.99 || op > 1.01 || Math.abs(rotationDeg(cs.transform)) > 0.5;
        if (stuck && el.getBoundingClientRect().top < window.innerHeight + 300) {
          gsap.set(el, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 });
        }
      });
    }
    setTimeout(sweep, 2000);
    setTimeout(sweep, 5000);
    window.addEventListener("scroll", function () {
      clearTimeout(window.__vgSafetyDebounce);
      window.__vgSafetyDebounce = setTimeout(sweep, 400);
    }, { passive: true });
  }

  /* ---------- NFC card: drag/keyboard to rotate in 3D, settles on front/back — functional, not gated ---------- */
  function initNfcCard3D() {
    var card = $(".nfc-card-inner[data-nfc-card]");
    if (!card) return;

    var ry = 0, dragging = false, startX = 0, startRy = 0;

    function setRotation(deg) {
      ry = deg;
      card.style.transform = "rotateY(" + deg + "deg)";
    }
    function settle() {
      card.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)";
      setRotation(Math.round(ry / 180) * 180);
      setTimeout(function () { card.style.transition = ""; }, 550);
    }

    if (!reduced) {
      card.classList.add("is-hinting");
      card.addEventListener("animationend", function () { card.classList.remove("is-hinting"); }, { once: true });
    }

    card.addEventListener("pointerdown", function (e) {
      dragging = true;
      card.classList.remove("is-hinting");
      card.style.transition = "";
      startX = e.clientX;
      startRy = ry;
      try { card.setPointerCapture(e.pointerId); } catch (_) {}
    });
    card.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      setRotation(startRy + (e.clientX - startX) * 0.5);
    });
    ["pointerup", "pointercancel"].forEach(function (evt) {
      card.addEventListener(evt, function () {
        if (!dragging) return;
        dragging = false;
        settle();
      });
    });
    card.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      card.classList.remove("is-hinting");
      card.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)";
      setRotation(Math.round(ry / 180) * 180 + (e.key === "ArrowRight" ? 180 : -180));
      setTimeout(function () { card.style.transition = ""; }, 550);
    });
  }

  /* ---------- Pricing "Ver planes más completos" — native <details>, this only enhances it ---------- */
  function initPriceDetails() {
    $$(".price-more").forEach(function (det) {
      det.addEventListener("toggle", function () {
        if (!det.open) return;
        if (window.gsap) {
          gsap.set($$(".stagger-item", det), { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 });
        }
        if (window.ScrollTrigger) { try { ScrollTrigger.refresh(); } catch (_) {} }
      });
    });
  }

  function boot() {
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initMagnetic, "initMagnetic");
    safe(initCursor, "initCursor");
    safe(initPriceDetails, "initPriceDetails");
    safe(initNfcCard3D, "initNfcCard3D");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
      safe(initSplitHero, "initSplitHero");
      safe(initCaseReveal, "initCaseReveal");
      safe(initLogoStagger, "initLogoStagger");
      safe(initMotionSafety, "initMotionSafety");

      var refresh = function () { try { ScrollTrigger.refresh(); } catch (_) {} };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh);
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
