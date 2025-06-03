// =========================
// Mnemo | Room Templates, Anchor Tips, Spatial Labels + Save + Preview Fixes
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

function renderGuide() {
  const guide = document.createElement('div');
  guide.innerHTML = `
    <section class="guide">
      <h2>🧭 Guide: Building a Memory Palace</h2>
      <p>Each room holds a symbolic theme. Each anchor should be vivid, symbolic, and emotionally resonant.</p>
      <p>Use placement and color to deepen association. Upload an image or visualize one clearly in your mind.</p>
    </section>
    <hr/>
  `;
  document.getElementById('activity').appendChild(guide);
}

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
    section.innerHTML = `<h3>🚪 Room ${i + 1}: ${room.name} (${room.template || 'Custom'})</h3>`;
    room.anchors.forEach((a, j) => {
      const anchor = document.createElement('div');
      anchor.className = 'field';
      anchor.innerHTML = `
        <h4>📍 ${a.name}</h4>
        <p><strong>Meaning:</strong> ${a.meaning}</p>
        <p><strong>Placement:</strong> ${a.placement || 'Unspecified'}</p>
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

window.addAnchorToRoom = function (btn) {
  const group = btn.previousElementSibling;
  const index = group.children.length + 1;
  const anchor = document.createElement('div');
  anchor.className = 'field';

  anchor.innerHTML = `
    <h4>📍 Anchor ${index}</h4>
    <input type="text" placeholder="Name (e.g. Statue of Saturn)" class="anchor-name" />
    <input type="text" placeholder="Meaning (e.g. Self-discipline)" class="anchor-meaning" />
    <select class="anchor-placement">
      <option value="">Select Placement</option>
      <option>Left Wall</option>
      <option>Right Wall</option>
      <option>Center Pedestal</option>
      <option>Ceiling</option>
      <option>Floor</option>
      <option>Doorway</option>
    </select>
    <input type="color" class="anchor-color" title="Choose Color" />
    <div class="field">
      <label>Attach Image:</label>
      <input type="file" accept="image/*" class="anchor-image" onchange="previewImage(this)" />
      <img class="anchor-preview" style="display:none; max-width:100px; margin-top:5px;" />
    </div>
    <p class="tip">💡 Tip: Make it surreal. Imagine this object floating, glowing, or making sound.</p>
    <button type="button" onclick="savePalaceToLocalStorage()">💾 Save Anchor</button>
  `;
  group.appendChild(anchor);
}

function previewImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = input.nextElementSibling;
    img.src = reader.result;
    img.style.display = 'block';
    input.dataset.imageData = reader.result;
    savePalaceToLocalStorage();
  };
  reader.readAsDataURL(file);
}

function renderFirstRoom() {
  const activityContainer = document.getElementById('activity');
  const section = document.createElement('section');
  section.className = 'field';
  section.innerHTML = `
    <h3>🚪 Create First Room</h3>
    <input type="text" placeholder="Room Name (e.g. Library of Saturn)" class="room-name" />
    <select class="room-template">
      <option value="">Choose Template</option>
      <option>Temple</option>
      <option>Library</option>
      <option>Cave</option>
      <option>Garden</option>
      <option>Tower</option>
      <option>Celestial Dome</option>
    </select>
    <div class="field anchor-group"></div>
    <button type="button" onclick="addAnchorToRoom(this)">➕ Add Anchor</button>
  `;
  activityContainer.appendChild(section);
}

function getPalaceData() {
  const palaceName = document.querySelector('header h1')?.textContent || 'Untitled';
  const rooms = [...document.querySelectorAll('section')].filter(s => s.querySelector('.room-name')).map(room => {
    return {
      name: room.querySelector('.room-name').value,
      template: room.querySelector('.room-template').value,
      anchors: [...room.querySelectorAll('.anchor-group .field')].map(anchor => ({
        name: anchor.querySelector('.anchor-name')?.value || '',
        meaning: anchor.querySelector('.anchor-meaning')?.value || '',
        placement: anchor.querySelector('.anchor-placement')?.value || '',
        color: anchor.querySelector('.anchor-color')?.value || '#000000',
        image: anchor.querySelector('.anchor-image')?.dataset.imageData || ''
      }))
    }
  });
  return { palaceName, rooms };
}

function savePalaceToLocalStorage() {
  const data = getPalaceData();
  localStorage.setItem('mnemo-palace', JSON.stringify(data));
}

function loadPalaceFromLocalStorage() {
  const saved = localStorage.getItem('mnemo-palace');
  if (saved) {
    const data = JSON.parse(saved);
    populatePalaceFromData(data);
  }
}

function populatePalaceFromData(data) {
  document.querySelector('.room-name').value = data.rooms[0].name;
  document.querySelector('.room-template').value = data.rooms[0].template;

  const anchorBtn = document.querySelector('button[onclick^="addAnchorToRoom"]');
  data.rooms[0].anchors.forEach(() => addAnchorToRoom(anchorBtn));

  const anchors = document.querySelectorAll('.anchor-group .field');
  data.rooms[0].anchors.forEach((a, i) => {
    anchors[i].querySelector('.anchor-name').value = a.name;
    anchors[i].querySelector('.anchor-meaning').value = a.meaning;
    anchors[i].querySelector('.anchor-placement').value = a.placement;
    anchors[i].querySelector('.anchor-color').value = a.color;
    if (a.image) {
      const input = anchors[i].querySelector('.anchor-image');
      const preview = anchors[i].querySelector('.anchor-preview');
      input.dataset.imageData = a.image;
      preview.src = a.image;
      preview.style.display = 'block';
    }
  });
}
