/* Sorrel & Smoke. Concept festival site by Douglas Byfield. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Data ---------- */
  var VENDORS = [
    { id: "v1", photo: "1621790404813-df280c2de418", alt: "Pork cooking slowly over a charcoal grill", name: "Boston Smoke Yard", cook: "Delroy Brammer, Portland", cat: "Jerk", where: "Jerk Pit Row", dishes: "Jerk pork shoulder, roast breadfruit, hard dough bread, his own pepper sauce" },
    { id: "v2", photo: "1560358371-8460bf45a844", alt: "A cook turning chicken on an outdoor grill", name: "Drum and Pimento", cook: "The Clarke brothers, Spanish Town", cat: "Jerk", where: "Jerk Pit Row", dishes: "Quarter jerk chicken, festival, pimento roasted yam" },
    { id: "v3", photo: "1605908580297-f3e1c02e64ff", alt: "Jerk chicken and sausage charring on a black grill", name: "Uncle Fitz Jerk Centre", cook: "Fitzroy Bailey, Half Way Tree", cat: "Jerk", where: "Jerk Pit Row", dishes: "Jerk sausage, jerk chicken wings, roast corn with scallion butter" },
    { id: "v4", photo: "1592011432621-f7f576f44484", crop: "bottom", alt: "Smoked meat resting on the grill bars", name: "Cedar Valley Smokehouse", cook: "Marcia and Desmond Powell, St Thomas", cat: "Jerk", where: "Jerk Pit Row", dishes: "Smoked jerk goat, pumpkin rice, cucumber and pepper pickle" },
    { id: "v5", photo: "1632852576480-c10a8e19496a", alt: "A plate of fried fish and sides, close up", name: "Old Harbour Catch", cook: "Kemar Lyttle, Old Harbour Bay", cat: "Seafood", where: "Seafood Walk", dishes: "Escovitch snapper, bammy, fried sprat by the bag" },
    { id: "v6", photo: "1663530761401-15eefb544889", alt: "A cook spooning sauce over a plated dish", name: "Lobster Pot Lime", cook: "Simone Gayle, Port Royal", cat: "Seafood", where: "Seafood Walk", dishes: "Curried lobster, garlic butter shrimp, steamed fish with okra" },
    { id: "v7", photo: "1632852576480-c10a8e19496a", crop: "entropy", alt: "Pepper shrimp and bread on a plate, close up", name: "Pepper Shrimp Lady", cook: "Miss Pearline, Middle Quarters", cat: "Seafood", where: "Seafood Walk", dishes: "Hot pepper shrimp by the bag, the same recipe since 1979" },
    { id: "v8", photo: "1720630351938-1233133223f4", alt: "A man cooking at a busy stove", name: "Run Dung Kitchen", cook: "Trevor Facey, Kingston", cat: "Seafood", where: "Seafood Walk", dishes: "Mackerel rundown, ackee and saltfish fritters, boiled green banana" },
    { id: "v9", photo: "1779315375132-3a218587d64b", crop: "entropy", alt: "Imani Tafari's table of traditional food", name: "Ital Garden Kitchen", cook: "Imani Tafari, St Thomas", cat: "Ital", where: "Ital Grove", dishes: "Coconut rundown with callaloo, steamed cabbage, ground provisions" },
    { id: "v10", photo: "1610851467843-fe4a65aea9c0", alt: "A cook in a red shirt at his stall", name: "Roots and Calabash", cook: "Brother Ras Kebra, Bull Bay", cat: "Ital", where: "Ital Grove", dishes: "Ital stew in a calabash, jerk tofu, sky juice with lime" },
    { id: "v11", photo: "1788530757669-417558f26bef", alt: "Slices of ripe plantain, fried golden", name: "Green Fig Stand", cook: "Tamika Reid, Mandeville", cat: "Ital", where: "Ital Grove", dishes: "Plantain tarts, ackee and callaloo patties, bammy with avocado" },
    { id: "v12", photo: "1641529148223-093a513ed44e", alt: "Sweet dough frying golden in a pot of oil", name: "Gizzada and Grater Cake", cook: "Miss Ivy Henry, Linstead", cat: "Sweets", where: "Sweets Lane", dishes: "Gizzada, grater cake, coconut drops wrapped in brown paper" },
    { id: "v13", photo: "1514362545857-3bc16c4c7d1b", alt: "A tumbler of dark rum on a wooden table, for the Christmas cake", name: "Blackwood Bakery", cook: "Andre Blackwood, Mona", cat: "Sweets", where: "Sweets Lane", dishes: "Rum soaked Christmas cake by the slice, sweet potato pudding" },
    { id: "v14", photo: "1765118527329-6ed7fa0d10ac", alt: "A glass mug of something cold and deep red", name: "Devon Cream Parlour", cook: "The Morrison family, Ocho Rios", cat: "Sweets", where: "Sweets Lane", dishes: "Grapenut ice cream, sorrel sorbet, rum and raisin cones" },
    { id: "v15", photo: "1621873495884-845a939892d1", alt: "A glass of aged rum, amber against the light", name: "The Overproof Library", cook: "Paulette Gordon, Clarendon", cat: "Drinks", where: "Rum Tent", dishes: "Flights of aged and overproof rum, rum punch by the jug" },
    { id: "v16", photo: "1566851723089-bf4a4bf23e96", alt: "Fresh sorrel flowers, the hibiscus that makes the drink", name: "Sorrel House", cook: "Grace Whyte, Linstead", cat: "Drinks", where: "Rum Tent", dishes: "Sorrel with ginger and pimento, with rum or without, by the bottle" },
    { id: "v17", photo: "1777303457307-4cf339a800ac", alt: "A street vendor with a cart of cold drinks", name: "Irish Moss Bar", cook: "Leroy Samuels, Kingston", cat: "Drinks", where: "Sweets Lane", dishes: "Irish moss with peanut and nutmeg, carrot juice, coconut water from the shell" }
  ];

  window.SS_VENDORS = VENDORS;
  var SESSIONS = [];
  document.querySelectorAll(".t-item").forEach(function (li) {
    SESSIONS.push({
      id: li.getAttribute("data-session"),
      time: li.querySelector("time").textContent.trim(),
      name: li.querySelector("h3").textContent.trim(),
      where: li.querySelector(".t-where").textContent.trim()
    });
  });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Plan state ---------- */
  var plan = new Set();
  try {
    var saved = JSON.parse(localStorage.getItem("ss-plan") || "[]");
    if (Array.isArray(saved)) saved.forEach(function (id) { plan.add(id); });
  } catch (e) { /* storage unavailable */ }
  function savePlan() {
    try { localStorage.setItem("ss-plan", JSON.stringify(Array.from(plan))); } catch (e) { /* ignore */ }
  }

  /* ---------- Vendor directory ---------- */
  var list = document.getElementById("vendor-list");
  var statusEl = document.getElementById("menu-status");
  var emptyEl = document.getElementById("menu-empty");
  var searchEl = document.getElementById("menu-search");
  var filterBtns = document.querySelectorAll(".filter");
  var activeCat = "all";

  function photoUrl(v, w) {
    return "https://images.unsplash.com/photo-" + v.photo + "?auto=format&fit=crop&w=" + w + "&h=" + Math.round(w * .75) + "&q=80" + (v.crop ? "&crop=" + v.crop : "");
  }
  function photo(v) {
    if (!v.photo) return "";
    return '<figure class="ph v-photo"><span class="ph-frame"><img src="' + esc(photoUrl(v, 480)) + '" srcset="' + esc(photoUrl(v, 480)) + ' 480w, ' + esc(photoUrl(v, 960)) + ' 960w"' +
      ' sizes="(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 400px" width="480" height="360" alt="' + esc(v.alt) + '" loading="lazy" decoding="async"></span></figure>';
  }

  list.innerHTML = VENDORS.map(function (v) {
    return '<li class="vendor" data-id="' + v.id + '" data-cat="' + v.cat + '">' +
      photo(v) +
      '<p class="v-cat">' + v.cat + '</p>' +
      '<h3>' + esc(v.name) + '</h3>' +
      '<p class="v-cook">' + esc(v.cook) + '</p>' +
      '<p class="v-dishes" data-text="' + esc(v.dishes) + '">' + esc(v.dishes) + '</p>' +
      '<div class="v-foot"><span class="v-where">' + esc(v.where) + '</span>' +
      '<button type="button" class="plan-add" data-plan="' + v.id + '" aria-pressed="false" aria-label="Add ' + esc(v.name) + ' to my day">' +
      '<svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg><span>Add to my day</span></button></div>' +
      '</li>';
  }).join("");

  document.querySelectorAll("[data-count]").forEach(function (el) {
    var c = el.getAttribute("data-count");
    el.textContent = c === "all" ? VENDORS.length : VENDORS.filter(function (v) { return v.cat === c; }).length;
  });

  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  function applyFilter() {
    var q = norm(searchEl.value.trim());
    var shown = 0;
    list.querySelectorAll(".vendor").forEach(function (li) {
      var v = VENDORS.find(function (x) { return x.id === li.dataset.id; });
      var hay = norm([v.name, v.cook, v.dishes, v.cat, v.where].join(" "));
      var ok = (activeCat === "all" || v.cat === activeCat) && (!q || hay.indexOf(q) !== -1);
      li.hidden = !ok;
      var d = li.querySelector(".v-dishes");
      if (ok && q) {
        var raw = v.dishes, i = norm(raw).indexOf(q);
        d.innerHTML = i === -1 ? esc(raw) : esc(raw.slice(0, i)) + "<mark>" + esc(raw.slice(i, i + q.length)) + "</mark>" + esc(raw.slice(i + q.length));
      } else {
        d.textContent = v.dishes;
      }
      if (ok) shown++;
    });
    emptyEl.hidden = shown !== 0;
    var catLabel = activeCat === "all" ? "" : " in " + activeCat;
    var qLabel = q ? " matching “" + searchEl.value.trim() + "”" : "";
    statusEl.textContent = shown === 0 ? "No stalls" + catLabel + qLabel + "." :
      "Showing " + shown + (shown === 1 ? " stall" : " stalls") + catLabel + qLabel + ".";
  }

  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      activeCat = b.dataset.cat;
      filterBtns.forEach(function (x) {
        var on = x === b;
        x.classList.toggle("is-active", on);
        x.setAttribute("aria-pressed", on ? "true" : "false");
      });
      applyFilter();
    });
  });
  searchEl.addEventListener("input", applyFilter);
  emptyEl.addEventListener("click", function (e) {
    var t = e.target.closest("[data-suggest]");
    if (!t) return;
    searchEl.value = t.getAttribute("data-suggest");
    if (!searchEl.value) filterBtns[0].click();
    applyFilter();
    searchEl.focus();
  });
  applyFilter();

  /* ---------- Planner ---------- */
  var pickSessions = document.getElementById("pick-sessions");
  var pickVendors = document.getElementById("pick-vendors");
  var dayList = document.getElementById("my-day-list");
  var dayEmpty = document.getElementById("my-day-empty");
  var printBtn = document.getElementById("print-plan");

  pickSessions.innerHTML = SESSIONS.map(function (s) {
    return '<label class="pick"><input type="checkbox" value="' + s.id + '">' +
      '<span class="box" aria-hidden="true"><svg class="ico"><use href="#i-check"/></svg></span>' +
      '<span class="pick-t">' + s.time + '</span><span>' + esc(s.name) + '<span class="pick-sub">' + esc(s.where) + '</span></span></label>';
  }).join("");
  pickVendors.innerHTML = VENDORS.map(function (v) {
    return '<label class="pick"><input type="checkbox" value="' + v.id + '">' +
      '<span class="box" aria-hidden="true"><svg class="ico"><use href="#i-check"/></svg></span>' +
      '<span>' + esc(v.name) + '<span class="pick-sub">' + v.cat + ', ' + esc(v.where) + '</span></span></label>';
  }).join("");

  function renderPlan() {
    document.querySelectorAll(".pick input").forEach(function (i) { i.checked = plan.has(i.value); });
    document.querySelectorAll(".plan-add").forEach(function (b) {
      var on = plan.has(b.dataset.plan);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.querySelector("use").setAttribute("href", on ? "#i-check" : "#i-plus");
      b.querySelector("span").textContent = on ? "On my list" : "Add to my day";
    });
    var ss = SESSIONS.filter(function (s) { return plan.has(s.id); });
    var MAPKEY = { "Jerk Pit Row": "B", "Seafood Walk": "C", "Ital Grove": "D", "Sweets Lane": "E", "Rum Tent": "F" };
    var vs = VENDORS.filter(function (v) { return plan.has(v.id); })
      .sort(function (a, b) { return MAPKEY[a.where] < MAPKEY[b.where] ? -1 : MAPKEY[a.where] > MAPKEY[b.where] ? 1 : 0; });
    var html = "";
    if (ss.length) {
      html += '<li class="md-group">Sessions</li>';
      html += ss.map(function (s) {
        return '<li><span class="md-t">' + s.time + '</span><span>' + esc(s.name) + '<span class="md-sub">' + esc(s.where) + '</span></span></li>';
      }).join("");
    }
    if (vs.length) {
      html += '<li class="md-group">Stalls to find, by map point</li>';
      html += vs.map(function (v) {
        return '<li><span class="md-t" aria-label="Map point ' + MAPKEY[v.where] + '">' + MAPKEY[v.where] + '</span><span>' + esc(v.name) + '<span class="md-sub">' + esc(v.where) + ', ' + esc(v.dishes.split(",")[0].toLowerCase()) + '</span></span></li>';
      }).join("");
    }
    dayList.innerHTML = html;
    dayEmpty.hidden = !!html;
    printBtn.disabled = !html;
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".plan-add");
    if (!b) return;
    var id = b.dataset.plan;
    var adding = !plan.has(id);
    if (adding) plan.add(id); else plan.delete(id);
    savePlan(); renderPlan(); announce(id, adding, b);
  });
  document.querySelector(".planner-pick").addEventListener("change", function (e) {
    if (e.target.type !== "checkbox") return;
    if (e.target.checked) plan.add(e.target.value); else plan.delete(e.target.value);
    savePlan(); renderPlan(); announce(e.target.value, e.target.checked, e.target.closest(".pick"));
  });
  document.getElementById("clear-plan").addEventListener("click", function () {
    plan.clear(); savePlan(); renderPlan(); announce(null, false, null);
  });
  /* Tell the paper bag (moments.js) what changed */
  function labelFor(id) {
    var s = SESSIONS.find(function (x) { return x.id === id; });
    if (s) return s.name;
    var v = VENDORS.find(function (x) { return x.id === id; });
    return v ? v.name : "";
  }
  function announce(id, added, from) {
    document.dispatchEvent(new CustomEvent("ss:plan", { detail: { size: plan.size, added: added, label: id ? labelFor(id) : "", from: from } }));
  }
  printBtn.addEventListener("click", function () { window.print(); });
  renderPlan();
  announce(null, false, null);

  /* ---------- Booking form ---------- */
  var form = document.getElementById("booking-form");
  var confirmEl = document.getElementById("confirm");
  var totalEl = document.getElementById("total");
  var PRICES = { day: 6500, tasting: 12000, family: 16500, rsvp: 0 };
  var NAMES = { day: "Day pass", tasting: "Tasting pass", family: "Family pass", rsvp: "Free RSVP" };
  var fmt = function (n) { return "J$" + n.toLocaleString("en-US"); };

  function updateTotal() {
    var p = form.pass.value, q = parseInt(form.qty.value, 10) || 0;
    if (!p) { totalEl.innerHTML = "Choose a pass to see the total"; return; }
    totalEl.innerHTML = p === "rsvp" ? "Total <strong>Free</strong>" : "Total <strong>" + fmt(PRICES[p] * q) + "</strong>";
  }
  form.addEventListener("input", updateTotal);
  form.addEventListener("change", updateTotal);

  document.querySelectorAll("[data-pass]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!confirmEl.hidden) resetBooking();
      form.pass.value = b.dataset.pass;
      updateTotal();
      document.getElementById("rsvp").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      setTimeout(function () { form.name.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
    });
  });

  var RULES = {
    name: function (v) { return v.trim().length < 2 ? "Tell us the name the tickets should be under." : ""; },
    email: function (v) { return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter an email like name@example.com so we can send your tickets." : ""; },
    phone: function (v) { return v.trim() && v.replace(/\D/g, "").length < 7 ? "That number looks short. Leave it blank or add the full number." : ""; },
    pass: function (v) { return !v ? "Choose a pass, or the free RSVP if you only want updates." : ""; },
    qty: function (v) { var n = Number(v); return !(Number.isInteger(n) && n >= 1 && n <= 10) ? "Choose between 1 and 10 tickets." : ""; }
  };
  function check(name) {
    var input = form[name], msg = RULES[name](input.value);
    document.getElementById("e-" + name).textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  Object.keys(RULES).forEach(function (n) {
    form[n].addEventListener("blur", function () { if (form[n].value || form[n].getAttribute("aria-invalid")) check(n); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(RULES).forEach(function (n) { if (!check(n) && !firstBad) firstBad = form[n]; });
    if (firstBad) { firstBad.focus(); return; }
    var p = form.pass.value, q = parseInt(form.qty.value, 10);
    var first = form.name.value.trim().split(/\s+/)[0];
    var ref = "SS27" + Math.random().toString(36).slice(2, 7).toUpperCase();
    document.getElementById("confirm-title").textContent = "See you at Hope Gardens, " + first + ".";
    document.getElementById("confirm-text").textContent = p === "rsvp"
      ? "You are on the list for updates. We will write to " + form.email.value.trim() + " when the vendor map and the band times are out."
      : "Your tickets are held for 48 hours. A payment link is on its way to " + form.email.value.trim() + ".";
    var rows = [["Reference", ref], ["Pass", NAMES[p]], ["People", String(q)], ["Total", p === "rsvp" ? "Free" : fmt(PRICES[p] * q)], ["Date", "Saturday 18 December 2027"]];
    document.getElementById("confirm-dl").innerHTML = rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
    form.hidden = true;
    confirmEl.hidden = false;
    confirmEl.classList.add("show");
    confirmEl.focus();
  });
  function resetBooking() {
    form.reset(); updateTotal();
    form.querySelectorAll("[aria-invalid]").forEach(function (i) { i.removeAttribute("aria-invalid"); });
    form.querySelectorAll(".err").forEach(function (p) { p.textContent = ""; });
    confirmEl.hidden = true; form.hidden = false;
  }
  document.getElementById("book-again").addEventListener("click", function () { resetBooking(); form.name.focus(); });
  updateTotal();

  /* ---------- Accordion ---------- */
  document.querySelectorAll(".acc-item button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
      if (!open) { panel.classList.remove("opening"); void panel.offsetWidth; panel.classList.add("opening"); }
    });
  });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function setNav(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
    toggle.querySelector("span").textContent = open ? "Close" : "Menu";
    nav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setNav(false); toggle.focus(); } });

  /* ---------- Load sequence ---------- */
  function go() { requestAnimationFrame(function () { doc.classList.add("loaded"); }); }
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 900); })]).then(go);
  } else { go(); }

  /* ---------- Smoke shader ---------- */
  var STILL_SVG = '<svg viewBox="0 0 220 360" preserveAspectRatio="xMinYMax meet"><path d="M110 360c-34-40 30-64 0-110s-40-70 4-112 26-78-6-110"/><path d="M138 350c-22-32 22-54 2-92s-26-56 8-88 18-58-4-84"/><path d="M84 340c-18-30 16-48 0-80s-20-46 6-72"/></svg>';
  var still = document.querySelector(".hero-smoke-still");
  var canvas = document.getElementById("smoke");

  function fallback() {
    doc.classList.add("no-webgl");
    still.innerHTML = STILL_SVG;
  }

  var gl = null;
  try { gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" }); } catch (e) { gl = null; }
  if (!gl) { fallback(); return; }

  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FRAG = [
    "precision mediump float;",
    "uniform vec2 uRes;uniform float uTime;uniform vec2 uPtr;",
    "float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);",
    " return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=r*p*2.02;a*=.5;}return v;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;",
    " vec2 p=vec2((uv.x-.5)*asp,uv.y);",
    " float t=uTime*.055;",
    " p.x+=(uPtr.x-.5)*.18*uv.y;",
    " vec2 q=p*vec2(1.7,1.1);q.y-=t*2.2;",
    " vec2 w=vec2(fbm(q+vec2(0.,t)),fbm(q+vec2(5.2,1.3)-t*.6));",
    " vec2 r=vec2(fbm(q+3.*w+vec2(1.7,9.2)+t*.4),fbm(q+3.*w+vec2(8.3,2.8)));",
    " float f=fbm(q+2.6*r+(uPtr-.5)*.35);",
    " float col=smoothstep(.0,.9,1.-abs(p.x-.18*asp+.25*sin(uv.y*2.6+t*3.))*1.05);",
    " float rise=smoothstep(1.15,.05,uv.y)*.55+.45;",
    " float s=smoothstep(.42,.95,f*(.55+.6*col))*rise;",
    " s*=.62;",
    " vec3 base=vec3(.361,.059,.114);",
    " vec3 deep=vec3(.26,.04,.08);",
    " vec3 bg=mix(deep,base,smoothstep(0.,.75,uv.y)*.6+.4*uv.x);",
    " vec3 smoke=vec3(.95,.87,.76);",
    " vec3 ember=vec3(.85,.59,.23);",
    " vec3 c=mix(bg,smoke,s*.42);",
    " c=mix(c,ember,smoothstep(.55,1.,f)*smoothstep(.45,0.,uv.y)*.16);",
    " c*=.92+.08*h(gl_FragCoord.xy+fract(uTime));",
    " gl_FragColor=vec4(c,1.);",
    "}"
  ].join("\n");

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); }
    return s;
  }
  var prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
  } catch (err) { fallback(); return; }

  gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uRes = gl.getUniformLocation(prog, "uRes");
  var uTime = gl.getUniformLocation(prog, "uTime");
  var uPtr = gl.getUniformLocation(prog, "uPtr");

  var scale = 0.5;
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cw = Math.max(1, Math.round(w * dpr * scale)), ch = Math.max(1, Math.round(h * dpr * scale));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw; canvas.height = ch;
      gl.viewport(0, 0, cw, ch);
      gl.uniform2f(uRes, cw, ch);
    }
  }

  var ptr = { x: .5, y: .5 }, ptrT = { x: .5, y: .5 };
  var hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    ptrT.x = (e.clientX - r.left) / r.width;
    ptrT.y = 1 - (e.clientY - r.top) / r.height;
  });

  var visible = true, running = false, start = performance.now(), last = 0;
  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    ptr.x += (ptrT.x - ptr.x) * .03;
    ptr.y += (ptrT.y - ptr.y) * .03;
    resize();
    gl.uniform1f(uTime, (now - start) / 1000 + 20);
    gl.uniform2f(uPtr, ptr.x, ptr.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    last = now;
    requestAnimationFrame(frame);
  }
  function play() { if (!running && !reduceMotion) { running = true; requestAnimationFrame(frame); } }

  if (reduceMotion) {
    resize();
    gl.uniform1f(uTime, 34.0);
    gl.uniform2f(uPtr, .5, .5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.addEventListener("resize", function () { resize(); gl.drawArrays(gl.TRIANGLES, 0, 3); });
  } else {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) play(); }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () { if (!document.hidden) play(); });
    play();
  }
  canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); fallback(); });
})();
