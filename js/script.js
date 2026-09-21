/* =========================================================
   FLORES AMARILLAS — script.js
   Contador de amor, generación de flores, pétalos, destellos
   y corazones flotantes, más interactividad táctil / mouse.
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     1) CONTADOR DE AMOR
     Calcula años, meses, días y minutos transcurridos desde
     el 06 de octubre de 2021 hasta el momento actual.
     --------------------------------------------------------- */

  const START_DATE = new Date(2021, 9, 6, 0, 0, 0); // mes 9 = octubre (0-indexado)

  const yearsEl   = document.getElementById("years");
  const monthsEl  = document.getElementById("months");
  const daysEl    = document.getElementById("days");
  const hoursEl   = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCounter() {
    const now = new Date();

    let years  = now.getFullYear() - START_DATE.getFullYear();
    let months = now.getMonth() - START_DATE.getMonth();
    let days   = now.getDate() - START_DATE.getDate();

    // Horas/minutos restantes del día (para pedir prestado un día si hace falta)
    let minutesOfDay =
      now.getHours() * 60 + now.getMinutes() -
      (START_DATE.getHours() * 60 + START_DATE.getMinutes());

    if (minutesOfDay < 0) {
      minutesOfDay += 24 * 60;
      days -= 1;
    }

    if (days < 0) {
      // Tomar prestados los días del mes anterior al mes actual
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    // minutesOfDay se reparte en horas completas + minutos restantes
    const hours   = Math.floor(minutesOfDay / 60);
    const minutes = minutesOfDay % 60;

    yearsEl.textContent   = pad(years);
    monthsEl.textContent  = pad(months);
    daysEl.textContent    = pad(days);
    hoursEl.textContent   = pad(hours);
    minutesEl.textContent = pad(minutes);
  }

  updateCounter();
  setInterval(updateCounter, 1000 * 15); // se refresca cada 15s para mantener los minutos al día

  /* ---------------------------------------------------------
     2) CAMPO DE FLORES — generación dinámica
     --------------------------------------------------------- */

  const field = document.getElementById("flowerField");
  const FLOWER_COUNT = window.innerWidth < 600 ? 16 : 26;

  function randBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFlower(index, total) {
    const flower = document.createElement("div");
    flower.className = "flower";

    // Distribuir a lo largo del ancho con algo de aleatoriedad, en 2 filas de profundidad
    const depthRow = index % 3; // 0 = fondo, 1 = medio, 2 = frente
    const baseLeft = (index / total) * 100;
    const jitter = randBetween(-3.5, 3.5);
    const left = Math.min(97, Math.max(1, baseLeft + jitter));

    const size = depthRow === 2 ? randBetween(50, 68) : depthRow === 1 ? randBetween(36, 52) : randBetween(24, 38);
    const stemH = depthRow === 2 ? randBetween(70, 110) : depthRow === 1 ? randBetween(50, 80) : randBetween(30, 55);
    const duration = randBetween(4, 7.5);
    const delay = randBetween(-5, 0);
    const breatheDelay = randBetween(0, 4);
    const zIndex = depthRow + 1;
    const brightness = depthRow === 0 ? 0.82 : depthRow === 1 ? 0.92 : 1;

    flower.style.left = left + "%";
    flower.style.setProperty("--bloom-size", size + "px");
    flower.style.setProperty("--stem-h", stemH + "px");
    flower.style.setProperty("--breathe-delay", breatheDelay + "s");
    flower.style.animationDuration = duration + "s";
    flower.style.animationDelay = delay + "s";
    flower.style.zIndex = zIndex;
    flower.style.filter = `brightness(${brightness})`;

    flower.innerHTML = `
      <div class="stem"></div>
      <div class="leaf left"></div>
      <div class="leaf right"></div>
      <div class="bloom">
        ${buildPetals()}
        <div class="center"></div>
      </div>
    `;

    flower.addEventListener("click", onFlowerTap);
    flower.addEventListener("touchstart", onFlowerTap, { passive: true });

    return flower;
  }

  function buildPetals() {
    const petalCount = 8;
    let html = "";

    // Capa exterior: pétalos largos con ligera variación natural de ángulo y tamaño
    for (let i = 0; i < petalCount; i++) {
      const angle = (360 / petalCount) * i + randBetween(-4, 4);
      const scale = randBetween(0.9, 1.08);
      html += `<div class="petal-el" style="transform: translate(-50%, -100%) rotate(${angle}deg) scale(${scale.toFixed(2)});"></div>`;
    }

    // Capa interior: pétalos más cortos y claros, intercalados, dan volumen
    for (let i = 0; i < petalCount; i++) {
      const angle = (360 / petalCount) * i + (180 / petalCount) + randBetween(-3, 3);
      html += `<div class="petal-el petal-inner" style="transform: translate(-50%, -100%) rotate(${angle}deg);"></div>`;
    }

    return html;
  }

  function renderField() {
    field.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < FLOWER_COUNT; i++) {
      frag.appendChild(createFlower(i, FLOWER_COUNT));
    }
    field.appendChild(frag);
  }

  renderField();

  /* ---------------------------------------------------------
     3) INTERACTIVIDAD — tocar / hacer clic en una flor
     --------------------------------------------------------- */

  function onFlowerTap(e) {
    const flower = e.currentTarget;

    flower.classList.add("pop");
    setTimeout(() => flower.classList.remove("pop"), 350);

    spawnTapHearts(flower);
  }

  function spawnTapHearts(flower) {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "tap-heart";
      heart.textContent = Math.random() > 0.5 ? "❤" : "♥";
      heart.style.setProperty("--tx", randBetween(-24, 24) + "px");
      heart.style.left = randBetween(35, 65) + "%";
      heart.style.animationDelay = i * 0.08 + "s";
      flower.appendChild(heart);
      setTimeout(() => heart.remove(), 1100);
    }
  }

  /* ---------------------------------------------------------
     4) PÉTALOS DE ROSA CAYENDO
     --------------------------------------------------------- */

  const petalsLayer = document.getElementById("petalsLayer");
  // Solo tonos rojos, de claro a oscuro, para un pétalo de rosa realista
  const ROSE_COLORS = ["#e2495a", "#b81f31", "#7a0f1f", "#c22638"];

  function spawnPetal() {
    const petal = document.createElement("div");
    petal.className = "petal";

    const size = randBetween(9, 17);
    const left = randBetween(0, 100);
    const fallDuration = randBetween(9, 18);
    const swayDuration = randBetween(2.5, 4.5);
    const spinDuration = randBetween(3, 6);
    const rotation = randBetween(0, 360);
    const gradientAngle = randBetween(120, 200);
    const base = ROSE_COLORS[Math.floor(Math.random() * ROSE_COLORS.length)];
    const tip = ROSE_COLORS[Math.floor(Math.random() * ROSE_COLORS.length)];

    petal.style.left = left + "%";
    petal.style.width = size + "px";
    petal.style.height = size * 1.25 + "px";
    petal.style.background = `linear-gradient(${gradientAngle}deg, ${base} 0%, ${tip} 60%, #4a0a14 100%)`;
    petal.style.transform = `rotate(${rotation}deg)`;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s, ${spinDuration}s`;

    petalsLayer.appendChild(petal);
    setTimeout(() => petal.remove(), fallDuration * 1000 + 200);
  }

  setInterval(spawnPetal, 700);
  for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 300);

  /* ---------------------------------------------------------
     5) PARTÍCULAS DE LUZ (destellos sutiles)
     --------------------------------------------------------- */

  const sparklesLayer = document.getElementById("sparklesLayer");

  function spawnSparkle() {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";

    const left = randBetween(0, 100);
    const bottom = randBetween(0, 60);
    const floatDuration = randBetween(6, 12);
    const twinkleDuration = randBetween(2, 4);

    sparkle.style.left = left + "%";
    sparkle.style.bottom = bottom + "%";
    sparkle.style.animationDuration = `${floatDuration}s, ${twinkleDuration}s`;

    sparklesLayer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), floatDuration * 1000 + 200);
  }

  setInterval(spawnSparkle, 900);
  for (let i = 0; i < 10; i++) setTimeout(spawnSparkle, i * 200);

  /* ---------------------------------------------------------
     6) CORAZONES FLOTANTES OCASIONALES
     --------------------------------------------------------- */

  const heartsLayer = document.getElementById("heartsLayer");
  const HEART_COLORS = ["#ffffff", "#f3a6c1", "#d96b8a"];

  function spawnHeart() {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "❤";
    heart.style.left = randBetween(5, 95) + "%";
    heart.style.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    heart.style.setProperty("--drift", randBetween(-30, 30) + "px");
    heart.style.fontSize = randBetween(0.8, 1.6) + "rem";

    heartsLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 8200);
  }

  // Aparecen de forma ocasional, no constante
  setInterval(spawnHeart, randBetween(5000, 9000));

  /* ---------------------------------------------------------
     7) LIGERO PARALLAX CON EL MOUSE (solo escritorio)
     --------------------------------------------------------- */

  const isTouchDevice = matchMedia("(hover: none)").matches;

  if (!isTouchDevice) {
    const sky = document.querySelector(".sky");
    let ticking = false;

    window.addEventListener("mousemove", (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 6;
        sky.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
        ticking = false;
      });
    });
  }

  /* ---------------------------------------------------------
     8) REGENERAR CAMPO SI CAMBIA MUCHO EL ANCHO DE PANTALLA
     --------------------------------------------------------- */

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newCount = window.innerWidth < 600 ? 16 : 26;
      if (newCount !== field.children.length) {
        renderField();
      }
    }, 400);
  });
})();
