const sheetUrl = "https://opensheet.elk.sh/1ZTUWQ7A1WOKYwz4jz5Q09JaxKwdP-cZ_tK8EnupkMMI";
const pointsUrl = `${sheetUrl}/points`;
const legendUrl = `${sheetUrl}/legend`;

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
    point.style.width = "16px";
    point.style.height = "16px";
    point.style.backgroundColor = legend.color;
    point.style.borderRadius = legend.shape === "circle" ? "50%" : "0";

    point.addEventListener("click", (e) => {
      tooltip.innerHTML = `
        <strong>${item.label}</strong><br>
        ${item.desc}<br>
        📞 ${item.phone}<br>
        📚 학기 중: ${item.sem_time}<br>
        🏖 방학 중: ${item.vac_time}
      `;
      tooltip.style.left = e.clientX + "px";
      tooltip.style.top = e.clientY + "px";
      tooltip.style.opacity = 1;
    });

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

document.addEventListener("mousedown", () => {
  document.getElementById("legend").classList.add("show");
});
document.addEventListener("mouseup", () => {
  document.getElementById("legend").classList.remove("show");
});