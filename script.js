// =========================
// Mnemo | Rooms, Anchor Grouping, Auto-Color Swatches + JSON Save/Load + localStorage + Image Attachment
// =========================

window.addEventListener('DOMContentLoaded', () => {
  const activityContainer = document.getElementById('activity');

  renderGuide();
  renderFirstRoom();
  addJSONControls();
  loadPalaceFromLocalStorage();

  // Auto-save anytime form updates
  activityContainer.addEventListener('input', savePalaceToLocalStorage);
});

function renderGuide() {
  const guide = document.createElement('div');
  guide.innerHTML = `
    <section class="guide">
      <h2>🧭 Guide: Building a Memory Palace</h2>
      <p>Begin by imagining a place composed of rooms. Each room can represent a theme or category. Inside each room, you'll place memory anchors—symbols that hold meaning, emotion, or association.</p>
      <p>This system draws on classical memory techniques from antiquity and modern memory champions. Let your creativity guide your structuring.</p>
    </section>
    <hr/>
  `;
  document.getElementById('activity').appendChild(guide);
}

function renderFirstRoom() {
  const builder = document.createElement('form');
  builder.id = 'palaceForm';
  builder.innerHTML = `
    <h2>🏰 Memory Palace Designer</h2>
    <div class="field">
      <label>Palace Name:</label>
      <input type="text" id="palaceName" placeholder="Temple of Echoes" required />
    </div>
    <div id="rooms"></div>
    <button type="button" onclick="addRoom()">➕ Add Room</button>
    <button type="button" onclick="resetPalace()" style="margin-left:10px;">Reset Palace</button>
  `;
  document.getElementById('activity').appendChild(builder);
  addRoom();
}

function addJSONControls() {
  const controls = document.createElement('div');
  controls.className = 'json-controls';
  controls.innerHTML = `
    <hr/>
    <button onclick="savePalaceToJSON()">📂 Save Palace</button>
    <input type="file" id="loadFile" accept=".json" style="display:none;" onchange="loadPalaceFromJSON(event)" />
    <button onclick="document.getElementById('loadFile').click()">📂 Load Palace</button>
  `;
  document.getElementById('activity').appendChild(controls);
}

window.addRoom = function () {
  const container = document.getElementById('rooms');
  const roomIndex = container.children.length + 1;
  const room = document.createElement('div');
  room.className = 'field';
  room.innerHTML = `
    <h3>🚪 Room ${roomIndex}</h3>
    <input type="text" placeholder="Room name (e.g. Library of Law)" class="room-name" />
    <div class="anchor-group"></div>
    <button type="button" onclick="addAnchorToRoom(this)">➕ Add Anchor</button>
    <hr />
  `;
  container.appendChild(room);
}

window.addAnchorToRoom = function (btn) {
  const group = btn.previousElementSibling;
  const index = group.children.length + 1;
  const anchor = document.createElement('div');
  anchor.className = 'field';

  const emojiSet = [
    '⛩️','🕍','🕯️','🐚','🦉','📜','🚁','🌌','🔮','🌿','📖','⚖️','🧾','🪞','📳','🗿','🏩','✨','🔔','🔠','🧠','🪬','🪄','ἰd','ἰc','ἰa',
    '🔥','💧','🌬️','🌱','🧐','🌕','🌑','🌗','🌓','🌙','☀️','⭐','🪨','🩵','🕳️','🛡️','🗡️','🪸','🧪','🧬','🧻','⚗️','📱','🔭','🪰','🎭','🪙',
    '🏺','🪔','📚','🔓','🔐','🎼','🎨','🧵','🧶','🪡','὘b️','🗂️','🧬','🧸','🎠','🚀','🥢','🦋','🐉','🐍','🗿','🪢','🦎','🧒','🔯','♾️','☯','⚛'
  ];

  anchor.innerHTML = `
    <h4>📍 Anchor ${index}</h4>
    <input type="text" placeholder="Name (e.g. Statue of Saturn)" class="anchor-name" />
    <input type="text" placeholder="Meaning (e.g. Self-discipline)" class="anchor-meaning" />
    <input type="color" class="anchor-color" title="Choose Color" />
    <div class="icon-picker">
      <label>Choose Icon:</label>
      <div class="icon-grid-wrapper">
        <button class="icon-grid-toggle" onclick="toggleIconGrid(this)" type="button">Show Icons ▾</button>
        <div class="icon-grid" style="display:none;">
          ${emojiSet.map(i => `<button type='button' onclick='selectIcon(this)'>${i}</button>`).join('')}
        </div>
      </div>
      <input type="hidden" class="anchor-icon" />
    </div>
    <div class="field">
      <label>Attach Image:</label>
      <input type="file" accept="image/*" class="anchor-image" onchange="previewImage(this)" />
      <img class="anchor-preview" style="display:none; max-width:100px; margin-top:5px;" />
    </div>
  `;
  group.appendChild(anchor);
}

window.previewImage = function (input) {
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

window.selectIcon = function (button) {
  const icon = button.textContent;
  const field = button.closest('.field');
  const hiddenInput = field.querySelector('.anchor-icon');
  hiddenInput.value = icon;
  [...button.parentNode.children].forEach(b => {
    if (b !== button) b.style.outline = 'none';
  });
  button.style.outline = '2px solid #fff';
}

window.toggleIconGrid = function (btn) {
  const grid = btn.nextElementSibling;
  const showing = grid.classList.toggle('show');
  grid.style.display = showing ? 'grid' : 'none';
  btn.textContent = showing ? 'Hide Icons ▴' : 'Show Icons ▾';
}

function getPalaceData() {
  const palaceName = document.getElementById('palaceName').value;
  const rooms = [...document.querySelectorAll('#rooms > .field')].map(room => {
    const name = room.querySelector('.room-name').value;
    const anchors = [...room.querySelectorAll('.anchor-group > .field')].map(anchor => ({
      name: anchor.querySelector('.anchor-name').value,
      meaning: anchor.querySelector('.anchor-meaning').value,
      color: anchor.querySelector('.anchor-color').value,
      icon: anchor.querySelector('.anchor-icon').value,
      image: anchor.querySelector('.anchor-image')?.dataset.imageData || ''
    }));
    return { name, anchors };
  });
  return { palaceName, rooms };
}

function populatePalaceFromData(data) {
  document.getElementById('palaceName').value = data.palaceName || '';
  const roomsContainer = document.getElementById('rooms');
  roomsContainer.innerHTML = '';
  data.rooms.forEach((roomData, i) => {
    addRoom();
    const room = roomsContainer.children[i];
    room.querySelector('.room-name').value = roomData.name;
    const anchorBtn = room.querySelector('button[onclick^="addAnchorToRoom"]');
    roomData.anchors.forEach(() => addAnchorToRoom(anchorBtn));
    const anchors = room.querySelectorAll('.anchor-group > .field');
    roomData.anchors.forEach((a, j) => {
      anchors[j].querySelector('.anchor-name').value = a.name;
      anchors[j].querySelector('.anchor-meaning').value = a.meaning;
      anchors[j].querySelector('.anchor-color').value = a.color;
      anchors[j].querySelector('.anchor-icon').value = a.icon;
      if (a.image) {
        const input = anchors[j].querySelector('.anchor-image');
        const preview = anchors[j].querySelector('.anchor-preview');
        input.dataset.imageData = a.image;
        preview.src = a.image;
        preview.style.display = 'block';
      }
    });
  });
}

window.savePalaceToJSON = function () {
  const data = getPalaceData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${data.palaceName || 'memory-palace'}.json`;
  link.click();
}

window.loadPalaceFromJSON = function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    populatePalaceFromData(data);
    savePalaceToLocalStorage();
  };
  reader.readAsText(file);
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

function resetPalace() {
  localStorage.removeItem('mnemo-palace');
  document.getElementById('rooms').innerHTML = '';
  document.getElementById('palaceName').value = '';
  addRoom();
}
