const sheetUrl = "https://opensheet.elk.sh/1ZTUWQ7A1WOKYwz4jz5Q09JaxKwdP-cZ_tK8EnupkMMI";
const pointsUrl = `${sheetUrl}/points`;
const legendUrl = `${sheetUrl}/legend`;
const titleUrl = `${sheetUrl}/title`;

console.log("✅ script.js loaded");

let legendMap = {};

fetch(legendUrl)
  .then(res => res.json())
  .then(legendData => {
    legendData.forEach(item => {
      legendMap[item.type.trim()] = {
        label: item.label,
        color: item.color,
        shape: item.shape
      };
    });
    renderLegend(legendData);
    return fetch(pointsUrl);
  })
  .then(res => res.json())
  .then(pointsData => {
    console.log("📦 포인트 데이터:", pointsData);

    renderPoints(pointsData);
  });

function renderLegend(legendData) {
  const legendEl = document.getElementById("legend");
  legendEl.innerHTML = legendData.map(item => `
    <span style="
      margin-right: 10px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
    ">
      <span style="color: ${item.color}; font-size: 16px;">${item.shape}</span>
      ${item.label}
    </span>
  `).join("");
}

function renderPoints(pointsData) {
  const layer = document.getElementById("points-layer");
  const tooltip = document.getElementById("tooltip");
  const mapImg = document.getElementById("map-image");

  const imgWidth = mapImg.naturalWidth;
  const imgHeight = mapImg.naturalHeight;
  const displayWidth = mapImg.clientWidth;
  const displayHeight = mapImg.clientHeight;

  const scaleX = displayWidth / imgWidth;
  const scaleY = displayHeight / imgHeight;

  pointsData.forEach(item => {
    const x = Number(item.x);
    const y = Number(item.y);
    const legend = legendMap[item.type.trim()];
    if (!legend) {
      console.warn("❌ 범례 없음:", item.type.trim());
      return;
    }

    const point = document.createElement("div");
    point.className = "point";
    point.style.left = `${x * scaleX}px`;
    point.style.top = `${y * scaleY}px`;
    point.style.width = "24px";
    point.style.height = "24px";
    point.style.backgroundColor = "transparent";
    point.style.color = legend.color;
    point.style.fontSize = "27px";
    point.style.display = "flex";
    point.style.justifyContent = "center";
    point.style.alignItems = "center";
    point.style.lineHeight = "24px";
    point.style.backgroundColor = "rgba(0, 0, 0, 0.001)";
    point.textContent = legend.shape;
    point.style.pointerEvents = "auto";
    point.style.zIndex = "100";

    point.addEventListener("mouseenter", (e) => {
      const rect = e.target.getBoundingClientRect();
      const frame = document.querySelector('.frame');
      const frameRect = frame.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let tooltipX = rect.left + rect.width / 2;
      let tooltipY = rect.top - 10 - tooltip.offsetHeight;

      if (tooltipX + tooltip.offsetWidth > frameRect.right) {
        tooltipX = frameRect.right - tooltip.offsetWidth - 8;
      }
      if (tooltipX < frameRect.left) {
        tooltipX = frameRect.left + 8;
      }
      if (tooltipY < frameRect.top) {
        tooltipY = rect.bottom + 10;
      }

      tooltip.style.left = `${tooltipX}px`;
      tooltip.style.top = `${tooltipY}px`;
      tooltip.innerHTML = `
        <div class="tip-title">${item.label}</div>
        <div class="tip-desc">${item.desc}</div>
        <div class="tip-phone">📞 ${item.phone}</div>
        <div class="tip-time"><span class="tip-sem">📚 학기 중:</span> ${item.sem_time}</div>
        <div class="tip-time"><span class="tip-vac">🏖 방학 중:</span> ${item.vac_time}</div>
      `;
    
      tooltip.style.opacity = 1;
    });

    point.addEventListener("mouseleave", () => {
      tooltip.style.opacity = 0;
    });
    
    point.addEventListener("touchstart", (e) => {
      e.preventDefault(); // prevent touch scrolling
      
      const rect = e.target.getBoundingClientRect();
      const frame = document.querySelector('.frame');
      const frameRect = frame.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let tooltipX = rect.left + rect.width / 2;
      let tooltipY = rect.top - 10 - tooltip.offsetHeight;

      if (tooltipX + tooltip.offsetWidth > frameRect.right) {
        tooltipX = frameRect.right - tooltip.offsetWidth - 8;
      }
      if (tooltipX < frameRect.left) {
        tooltipX = frameRect.left + 8;
      }
      if (tooltipY < frameRect.top) {
        tooltipY = rect.bottom + 10;
      }

      tooltip.style.left = `${tooltipX}px`;
      tooltip.style.top = `${tooltipY}px`;
      tooltip.innerHTML = `
        <div class="tip-title">${item.label}</div>
        <div class="tip-desc">${item.desc}</div>
        <div class="tip-phone">📞 ${item.phone}</div>
        <div class="tip-time"><span class="tip-sem">📚 학기 중:</span> ${item.sem_time}</div>
        <div class="tip-time"><span class="tip-vac">🏖 방학 중:</span> ${item.vac_time}</span></div>
      `;
      
      tooltip.style.opacity = 1;
    });

    point.addEventListener("touchstart", (e) => {
      e.stopPropagation(); // 다른 touchstart와 충돌 방지
      const rect = e.target.getBoundingClientRect();
      const frame = document.querySelector('.frame');
      const frameRect = frame.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
    
      let tooltipX = rect.left + rect.width / 2;
      let tooltipY = rect.top - 10 - tooltip.offsetHeight;

      if (tooltipX + tooltip.offsetWidth > frameRect.right) {
        tooltipX = frameRect.right - tooltip.offsetWidth - 8;
      }
      if (tooltipX < frameRect.left) {
        tooltipX = frameRect.left + 8;
      }
      if (tooltipY < frameRect.top) {
        tooltipY = rect.bottom + 10;
      }
    
      tooltip.style.left = `${tooltipX}px`;
      tooltip.style.top = `${tooltipY}px`;
      tooltip.innerHTML = `
        <div class="tip-title">${item.label}</div>
        <div class="tip-desc">${item.desc}</div>
        <div class="tip-phone">📞 ${item.phone}</div>
        <div class="tip-time"><span class="tip-sem">📚 학기 중:</span> ${item.sem_time}</div>
        <div class="tip-time"><span class="tip-vac">🏖 방학 중:</span> ${item.vac_time}</div>
      `;
    
      tooltip.style.opacity = 1;
    });

    document.addEventListener("touchstart", () => {
      tooltip.style.opacity = 0;
    }, { passive: true });

    layer.appendChild(point);
  });

  // const test = document.createElement("div");
  // test.className = "point";
  // test.style.position = "absolute";
  // test.style.left = "100px";
  // test.style.top = "100px";
  // test.style.width = "20px";
  // test.style.height = "20px";
  // test.style.backgroundColor = "magenta";
  // document.getElementById("points-layer").appendChild(test);
  // console.log("🟣 테스트 포인트 추가됨");
}


// 확대/이동 기능 초기화
window.addEventListener("DOMContentLoaded", () => {
  console.log("🔧 DOMContentLoaded triggered");
  const panzoomElem = document.querySelector(".pan-zoom-area");
  if (!panzoomElem) return;

  const panzoom = Panzoom(panzoomElem, {
    maxScale: 10
  });

  panzoomElem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

  // 확대 시 포인트 크기 유지
  panzoomElem.addEventListener("panzoomchange", () => {
    const scale = panzoom.getScale();
    document.querySelectorAll(".point").forEach(point => {
      point.style.setProperty("--zoom", scale);
    });
  });
  
  const legend = document.querySelector(".map-legend");
  if (legend) {
    legend.classList.remove("show");
  }
  
  let hideTimeout;
  function showLegendTemporarily() {
    if (!legend) return;
    console.log("📌 범례 표시 트리거됨");
    legend.classList.add("show");
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      legend.classList.remove("show");
    }, 1000);
  }

  ["wheel", "mousedown", "mousemove", "touchstart", "touchmove"].forEach(evt => {
    panzoomElem.parentElement.addEventListener(evt, showLegendTemporarily);
  });
});

["gesturestart", "gesturechange", "gestureend"].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault())
);

fetch(titleUrl)
  .then(res => res.json())
  .then(data => {
    if (data.length > 0 && data[0].title) {
      const titleEl = document.querySelector('.map-title');
      if (titleEl) titleEl.textContent = data[0].title;
    }
  })
  .catch(err => console.error("🔴 title fetch error:", err));