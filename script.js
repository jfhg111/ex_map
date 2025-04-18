const sheetUrl = "https://opensheet.elk.sh/1ZTUWQ7A1WOKYwz4jz5Q09JaxKwdP-cZ_tK8EnupkMMI";
const pointsUrl = `${sheetUrl}/points`;
const legendUrl = `${sheetUrl}/legend`;

let legendMap = {};

fetch(legendUrl)
  .then(res => res.json())
  .then(legendData => {
    legendData.forEach(item => {
      legendMap[item.type] = {
        label: item.label,
        color: item.color,
        shape: item.shape
      };
    });
    renderLegend(legendData);
  });

fetch(pointsUrl)
  .then(res => res.json())
  .then(data => {
    const layer = document.getElementById("points-layer");
    const tooltip = document.getElementById("tooltip");
    const mapImg = document.getElementById("map-image");

    mapImg.onload = () => {
      const imgWidth = mapImg.naturalWidth;
      const imgHeight = mapImg.naturalHeight;
      const displayWidth = mapImg.clientWidth;
      const displayHeight = mapImg.clientHeight;

      const scaleX = displayWidth / imgWidth;
      const scaleY = displayHeight / imgHeight;

      data.forEach(item => {
        const legend = legendMap[item.type];
        if (!legend) return;

        const point = document.createElement("div");
        point.className = "point";
        point.style.left = `${item.x * scaleX}px`;
        point.style.top = `${item.y * scaleY}px`;
        point.style.width = "16px";
        point.style.height = "16px";
        point.style.backgroundColor = legend.color;
        point.style.borderRadius = legend.shape === "circle" ? "50%" : "0";

        point.addEventListener("click", (e) => {
          tooltip.innerHTML = `
            <strong>${item.lable}</strong><br>
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
    };
  });

function renderLegend(legendData) {
  const legendEl = document.getElementById("legend");
  legendEl.innerHTML = legendData.map(item => `
    <span style="margin-right:10px;">
      <span style="display:inline-block;width:12px;height:12px;background:${item.color};border-radius:${item.shape === 'circle' ? '50%' : '0'};margin-right:4px;"></span>
      ${item.label}
    </span>
  `).join("");
}

let dragging = false;
document.addEventListener("mousedown", () => {
  dragging = true;
  document.getElementById("legend").classList.add("show");
});
document.addEventListener("mouseup", () => {
  dragging = false;
  document.getElementById("legend").classList.remove("show");
});