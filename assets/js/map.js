/* Sorrel & Smoke. Interactive festival map on a real map of Hope Gardens. */
(function () {
  "use strict";

  var el = document.getElementById("garden-map");
  if (!el) return;
  var fig = el.closest(".map");
  var status = document.getElementById("map-status");

  function start() {
    if (!window.L) { fig.classList.add("no-map"); return; }
    fig.classList.add("has-map");

    var GATE = [18.0197, -76.7508];
    var POINTS = [
      { k: "A", name: "Main gate", note: "Wristbands, coffee and the info desk. Shuttles drop off here.", at: GATE },
      { k: "B", name: "Jerk Pit Row", note: "Four pits under the trees. Follow the smoke.", at: [18.0223, -76.7523], where: "Jerk Pit Row" },
      { k: "C", name: "Seafood Walk", note: "Escovitch, pepper shrimp and the demo kitchen stage.", at: [18.0213, -76.7497], where: "Seafood Walk" },
      { k: "D", name: "Ital Grove", note: "Plant based cooking in the shade.", at: [18.0244, -76.7516], where: "Ital Grove" },
      { k: "E", name: "Sweets Lane", note: "Gizzada, Christmas cake and grapenut ice cream.", at: [18.0233, -76.7467], where: "Sweets Lane" },
      { k: "F", name: "Rum Tent", note: "Tastings every hour. Adults only.", at: [18.0254, -76.7463], where: "Rum Tent" },
      { k: "G", name: "The bandstand", note: "Live music from noon. The sorrel toast starts here.", at: [18.0235, -76.7493] },
      { k: "H", name: "Sunset Lawn", note: "Bring a blanket. Best view of the hills at six.", at: [18.0258, -76.7491] },
      { k: "I", name: "Family Garden", note: "Shade, a bounce house and first aid.", at: [18.0207, -76.7474] }
    ];
    var SHUTTLES = [
      { name: "Papine Square shuttle stop", at: [18.0171, -76.7429] },
      { name: "Liguanea shuttle stop", at: [18.0138, -76.7694] }
    ];

    var vendors = (window.SS_VENDORS || []);

    var map = L.map(el, {
      center: [18.0228, -76.7492], zoom: 16, minZoom: 13, maxZoom: 19,
      scrollWheelZoom: false, zoomControl: false, attributionControl: false
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 19, className: "ss-tiles"
    }).addTo(map);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 19, className: "ss-labels", pane: "shadowPane"
    }).addTo(map);

    /* festival grounds and walking loop */
    L.polygon([[18.0193, -76.7532], [18.0262, -76.7532], [18.0266, -76.7455], [18.0200, -76.7450], [18.0190, -76.7500]], {
      color: "#5C0F1D", weight: 1.5, dashArray: "2 6", fill: true, fillColor: "#5C0F1D", fillOpacity: 0.06, interactive: false
    }).addTo(map);
    var loop = [GATE, [18.0213, -76.7497], [18.0223, -76.7520], [18.0244, -76.7514], [18.0235, -76.7493], [18.0258, -76.7491], [18.0254, -76.7465], [18.0233, -76.7469], [18.0208, -76.7476], [18.0213, -76.7497]];
    L.polyline(loop, { color: "#5C0F1D", weight: 2, dashArray: "1 7", lineCap: "round", interactive: false }).addTo(map);

    function icon(k, cls) {
      return L.divIcon({ className: "ss-pin " + (cls || ""), html: "<span>" + k + "</span>", iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -18] });
    }
    function walk(a, b) {
      var m = map.distance(a, b);
      return Math.max(1, Math.round(m / 75)); /* about 75 m a minute, strolling */
    }
    function popup(p) {
      var list = vendors.filter(function (v) { return v.where === p.where; });
      var html = '<div class="ss-pop"><h3>' + p.k + '. ' + p.name + '</h3><p>' + p.note + '</p>';
      if (list.length) html += '<ul>' + list.map(function (v) { return '<li>' + v.name + '</li>'; }).join("") + '</ul>';
      if (p.k !== "A") html += '<p class="ss-walk">About ' + walk(GATE, p.at) + ' min walk from the gate</p>';
      return html + '</div>';
    }

    var markers = {};
    var rows = Array.prototype.slice.call(document.querySelectorAll(".legend .pt"));
    function setActive(k) {
      rows.forEach(function (r) { r.classList.toggle("on", r.dataset.pt === k); r.setAttribute("aria-pressed", r.dataset.pt === k); });
      Object.keys(markers).forEach(function (key) {
        var n = markers[key].getElement(); if (n) n.classList.toggle("on", key === k);
      });
    }
    POINTS.forEach(function (p) {
      var m = L.marker(p.at, { icon: icon(p.k), title: p.name, keyboard: true, riseOnHover: true })
        .bindPopup(popup(p), { className: "ss-popup", maxWidth: 260, closeButton: true })
        .addTo(map);
      m.on("click", function () { setActive(p.k); });
      m.on("popupclose", function () { setActive(null); });
      markers[p.k] = m;
    });

    rows.forEach(function (r) {
      r.addEventListener("click", function () {
        var m = markers[r.dataset.pt]; if (!m) return;
        setActive(r.dataset.pt);
        map.flyTo(m.getLatLng(), 17, { duration: 0.6 });
        setTimeout(function () { m.openPopup(); }, 650);
        if (window.innerWidth < 900) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    var grounds = L.latLngBounds(POINTS.map(function (p) { return p.at; })).pad(0.15);
    map.fitBounds(grounds);

    var shuttleLayer = L.layerGroup(SHUTTLES.map(function (s) {
      var l = L.polyline([s.at, GATE], { color: "#3E5B3A", weight: 2, dashArray: "6 6", interactive: false });
      var m = L.marker(s.at, { icon: icon("", "bus"), title: s.name })
        .bindPopup('<div class="ss-pop"><h3>' + s.name + '</h3><p>Free buses every twenty minutes, 9am till 10.30pm. Drops you at the main gate.</p></div>', { className: "ss-popup", maxWidth: 240 });
      return L.layerGroup([l, m]);
    }));

    var meLayer = L.layerGroup().addTo(map);
    var tools = fig.querySelectorAll("[data-map]");
    function say(t) { if (status) status.textContent = t; }
    Array.prototype.forEach.call(tools, function (b) {
      b.addEventListener("click", function () {
        var mode = b.dataset.map;
        if (mode === "all") { map.removeLayer(shuttleLayer); map.flyToBounds(grounds, { duration: 0.6 }); say(""); }
        if (mode === "shuttle") {
          shuttleLayer.addTo(map);
          map.flyToBounds(L.latLngBounds(SHUTTLES.map(function (s) { return s.at; }).concat([GATE])).pad(0.2), { duration: 0.8 });
          say("Shuttles run from Papine Square and Liguanea every twenty minutes.");
        }
        if (mode === "me") {
          if (!navigator.geolocation) { say("Your browser cannot share its location."); return; }
          say("Finding you…");
          navigator.geolocation.getCurrentPosition(function (pos) {
            var here = [pos.coords.latitude, pos.coords.longitude];
            meLayer.clearLayers();
            L.circleMarker(here, { radius: 8, color: "#F4EADB", weight: 3, fillColor: "#D9963A", fillOpacity: 1 }).addTo(meLayer);
            L.polyline([here, GATE], { color: "#D9963A", weight: 2, dashArray: "4 6" }).addTo(meLayer);
            var km = map.distance(here, GATE) / 1000;
            map.flyToBounds(L.latLngBounds([here, GATE]).pad(0.25), { duration: 0.8 });
            say(km < 1.5 ? "You are about " + walk(here, GATE) + " minutes on foot from the main gate." : "You are about " + km.toFixed(1) + " km from the main gate as the crow flies.");
          }, function () { say("Location is off, so we cannot work out the distance. The gate is on Old Hope Road."); }, { timeout: 8000 });
        }
      });
    });

    /* zoom with the wheel only after the map is clicked, so the page still scrolls */
    map.on("click", function () { map.scrollWheelZoom.enable(); });
    el.addEventListener("mouseleave", function () { map.scrollWheelZoom.disable(); });
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();
