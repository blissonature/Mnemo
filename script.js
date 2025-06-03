// =========================
// Mnemo | View Mode + Anchor Image Upload (Icons Removed)
// =========================

window.addEventListener('DOMContentLoaded', () => {
  const activityContainer = document.getElementById('activity');

  renderGuide();
  renderFirstRoom();
  addJSONControls();
  addViewToggle();
  loadPalaceFromLocalStorage();

  // Auto-save anytime form updates
  activityContainer.addEventListener('input', savePalaceToLocalStorage);
});

function addViewToggle() {
  const controls = document.createElement('div');
  controls.innerHTML = `
    <hr/>
    <button onclick="renderViewMode()">👁️ View Palace</button>
  `;
  document.getElementById('activity').appendChild(controls);
}

function renderViewMode() {
  const data = getPalaceData();
  const activityContainer = document.getElementById('activity');
  activityContainer.innerHTML = `<h2>🧠 Memory Palace Summary</h2><p><strong>${data.palaceName}</strong></p>`;

  data.rooms.forEach((room, i) => {
    const section = document.createElement('section');
    section.className = 'field';
    section.innerHTML = `<h3>🚪 Room ${i + 1}: ${room.name}</h3>`;
    room.anchors.forEach((a, j) => {
      const anchor = document.createElement('div');
      anchor.className = 'field';
      anchor.innerHTML = `
        <h4>📍 ${a.name}</h4>
        <p><strong>Meaning:</strong> ${a.meaning}</p>
        <p><strong>Color:</strong> <span style='background:${a.color}; padding:0 10px;'>${a.color}</span></p>
        ${a.image ? `<img src="${a.image}" style="max-width:100px; margin-top:5px;" />` : ''}
      `;
      section.appendChild(anchor);
    });
    activityContainer.appendChild(section);
  });

  const back = document.createElement('button');
  back.textContent = '← Return to Builder';
  back.onclick = () => location.reload();
  activityContainer.appendChild(back);
}

// Add Save button per anchor (Icons Removed)
window.addAnchorToRoom = function (btn) {
  const group = btn.previousElementSibling;
  const index = group.children.length + 1;
  const anchor = document.createElement('div');
  anchor.className = 'field';

  anchor.innerHTML = `
    <h4>📍 Anchor ${index}</h4>
    <input type="text" placeholder="Name (e.g. Statue of Saturn)" class="anchor-name" />
    <input type="text" placeholder="Meaning (e.g. Self-discipline)" class="anchor-meaning" />
    <input type="color" class="anchor-color" title="Choose Color" />
    <div class="field">
      <label>Attach Image:</label>
      <input type="file" accept="image/*" class="anchor-image" onchange="previewImage(this)" />
      <img class="anchor-preview" style="display:none; max-width:100px; margin-top:5px;" />
    </div>
    <button type="button" onclick="savePalaceToLocalStorage()">💾 Save Anchor</button>
  `;
  group.appendChild(anchor);
}
