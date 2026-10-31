/* Sorrel & Smoke. Two small moments: photos develop out of smoke, and your day goes in a paper bag. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Photos develop out of smoke as they scroll in ---------- */
  var frames = document.querySelectorAll(".ph-frame");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var f = e.target;
        io.unobserve(f);
        var img = f.querySelector("img");
        var go = function () { f.classList.add("is-dev"); };
        /* wait for the photo so the smoke never clears onto an empty frame, but never wait forever */
        if (!img || img.complete) { go(); return; }
        var done = false;
        var once = function () { if (!done) { done = true; go(); } };
        img.addEventListener("load", once, { once: true });
        img.addEventListener("error", once, { once: true });
        setTimeout(once, 2500);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });

    frames.forEach(function (f) {
      var r = f.getBoundingClientRect();
      if (!r.height) return; /* hidden at this width */
      if (r.top < window.innerHeight * .9 && r.bottom > 0) return; /* already on screen, show as is */
      f.classList.add("is-veiled");
      io.observe(f);
    });
  }

  /* ---------- Prose that inks in, and a pull quote that smoulders ---------- */
  function splitWords(el) {
    var words = [];
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) { if (!n.parentNode.closest(".cutout")) nodes.push(n); }
    nodes.forEach(function (node) {
      var parts = node.nodeValue.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement("span");
        w.className = "w";
        w.textContent = part;
        frag.appendChild(w);
        words.push(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return words;
  }

  var inkParas = document.querySelectorAll(".ink");
  if (!reduceMotion && inkParas.length) {
    var inkWords = [];
    inkParas.forEach(function (p) {
      p.classList.add("ink-on");
      splitWords(p).concat([].slice.call(p.querySelectorAll(".cutout"))).forEach(function (w) {
        if (w.classList.contains("cutout")) w.classList.add("w");
        inkWords.push(w);
      });
    });
    var inkQueued = false;
    var inkPass = function () {
      inkQueued = false;
      var line = window.innerHeight * .78;
      var left = 0;
      for (var i = 0; i < inkWords.length; i++) {
        var w = inkWords[i];
        if (w.classList.contains("inked")) continue;
        left++;
        if (w.getBoundingClientRect().top < line) w.classList.add("inked");
      }
      if (!left) window.removeEventListener("scroll", inkSchedule);
    };
    var inkSchedule = function () { if (!inkQueued) { inkQueued = true; requestAnimationFrame(inkPass); } };
    window.addEventListener("scroll", inkSchedule, { passive: true });
    window.addEventListener("resize", inkSchedule);
    inkSchedule();
  }

  var sizzle = document.querySelector(".sizzle");
  if (sizzle && !reduceMotion && "IntersectionObserver" in window) {
    sizzle.querySelectorAll("p").forEach(function (p) {
      splitWords(p).forEach(function (w, i) { w.style.setProperty("--i", i); });
    });
    var sio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { sizzle.classList.add("lit"); sio.disconnect(); }
    }, { threshold: .6 });
    sio.observe(sizzle);
  }

  /* ---------- The paper bag ---------- */
  var bag = document.getElementById("bag");
  if (!bag) return;
  var count = bag.querySelector(".bag-n");
  var planSec = document.getElementById("plan");
  var hero = document.querySelector(".hero");
  var size = 0, nearPlan = false, inHero = true;

  function setVisible() {
    var show = size > 0 && !nearPlan && !inHero;
    bag.classList.toggle("is-on", show);
    bag.setAttribute("tabindex", show ? "0" : "-1");
    bag.setAttribute("aria-hidden", show ? "false" : "true");
  }

  if ("IntersectionObserver" in window) {
    if (planSec) new IntersectionObserver(function (es) { nearPlan = es[0].isIntersecting; setVisible(); }, { threshold: 0.05 }).observe(planSec);
    if (hero) new IntersectionObserver(function (es) { inHero = es[0].isIntersecting; setVisible(); }, { threshold: 0.35 }).observe(hero);
  } else { inHero = false; }

  function setCount(n) {
    size = n;
    count.textContent = n;
    bag.setAttribute("aria-label", "My day list, " + n + (n === 1 ? " thing" : " things") + " saved");
    setVisible();
  }

  /* A paper tag with the stall or session name arcs from the button into the bag */
  function fly(label, from, n) {
    var fr = from.getBoundingClientRect();
    var bagShown = bag.classList.contains("is-on");
    if (!bagShown) { bag.classList.add("is-on"); }
    var br = bag.getBoundingClientRect();
    var tag = document.createElement("span");
    tag.className = "bag-fly";
    tag.setAttribute("aria-hidden", "true");
    tag.textContent = label;
    document.body.appendChild(tag);
    var tw = tag.offsetWidth, th = tag.offsetHeight;
    var x0 = fr.left + fr.width / 2 - tw / 2, y0 = fr.top + fr.height / 2 - th / 2;
    var x1 = br.left + br.width / 2 - tw / 2, y1 = br.top + 18 - th / 2;
    tag.style.transform = "translate3d(" + x0 + "px," + y0 + "px,0) rotate(-8deg)";
    var lift = Math.min(220, Math.max(90, Math.abs(y1 - y0) * .35));
    var t0 = 0, dur = 720;
    bag.classList.add("is-open");

    function step(now) {
      if (!t0) t0 = now;
      var t = Math.min(1, (now - t0) / dur);
      var e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var x = x0 + (x1 - x0) * e;
      var y = y0 + (y1 - y0) * e - Math.sin(Math.PI * e) * lift;
      var sc = 1 - .55 * e;
      var rot = -8 + 22 * e;
      tag.style.transform = "translate3d(" + x + "px," + y + "px,0) rotate(" + rot + "deg) scale(" + sc + ")";
      tag.style.opacity = t > .82 ? String(1 - (t - .82) / .18) : "1";
      if (t < 1) { requestAnimationFrame(step); return; }
      tag.remove();
      bag.classList.remove("is-open");
      setCount(n);
      bag.classList.remove("is-catch");
      void bag.offsetWidth;
      bag.classList.add("is-catch");
    }
    requestAnimationFrame(step);
  }

  document.addEventListener("ss:plan", function (e) {
    var d = e.detail || {};
    /* no flight when adding from the planner itself (the list is right there) or with reduced motion */
    var fromPlanner = d.from && d.from.closest && d.from.closest("#plan");
    if (d.added && d.from && !reduceMotion && !fromPlanner && !nearPlan) {
      fly(d.label, d.from, d.size);
    } else {
      setCount(d.size || 0);
    }
  });
  bag.addEventListener("animationend", function () { bag.classList.remove("is-catch"); });
})();
