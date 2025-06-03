// =========================
// Mnemo | Room Template → Immediate Anchor + Working Save + No Guide Label + Visual Steps
// =========================

window.addEventListener('DOMContentLoaded', () => {
  const activityContainer = document.getElementById('activity');

  renderTemplateSelector();
  addJSONControls();
  addViewToggle();
  loadPalaceFromLocalStorage();

  activityContainer.addEventListener('input', savePalaceToLocalStorage);
});

function renderTemplateSelector() {
  const section = document.createElement('section');
  section.className = 'step-box';
  section.innerHTML = `
    <h2 class="branded-title">⟠ Mnemo</h2>
    <p class="subtitle">A Saturnian tool for memory and symbol work</p>
    <div class="step-instructions">
      <strong>Step 1:</strong> 🏛️ Choose a room for storing your memories (select an existing template or create a new one).<br/>
      <strong>Step 2:</strong> 📍 Choose an object within the room to anchor your memory to.<br/>
      <strong>Step 3:</strong> 🧠 Add the details of this memory to be displayed upon retrieval.<br/>
      <strong>Step 4:</strong> 👁️ View the immersive memory palace you’ve assembled.
    </div>`;
  document.getElementById('activity').appendChild(section);
}

let roomCounter = 1;

window.renderRoomWithTemplate = function(template) {
  if (!template) return;
  const section = document.createElement('section');
  section.className = 'field';
  section.innerHTML = `
    <h3>🚪 Create Room</h3>
    <input type="text" value="Room ${roomCounter++}" class="room-name" />
    <div class="field">
      <label for="template">Template:</label>
      <select class="room-template">
        <option selected>${template}</option>
      </select>
    </div>
    <div class="field anchor-group"></div>
    <button type="button" onclick="addAnchorToRoom(this)">➕ Add Anchor</button>
  `;
  document.getElementById('activity').appendChild(section);

  // Immediately add the first anchor
  const btn = section.querySelector('button');
  addAnchorToRoom(btn);
};

function addViewToggle() {
  const controls = document.createElement('div');
  controls.innerHTML = `
    <hr/>
    <button onclick="renderViewMode()">👁️ View Palace</button>
  `;
  document.getElementById('activity').appendChild(controls);
}

window.renderViewMode = function () {
  const container = document.getElementById('activity');
  container.innerHTML = '<h2>🧠 Your Memory Palace</h2>';

  const rooms = JSON.parse(localStorage.getItem('palace') || '[]');
  if (rooms.length === 0) {
    container.innerHTML += `<p>No palace found yet. Build one first!</p>`;
    return;
  }

  rooms.forEach((room, rIndex) => {
    const roomSection = document.createElement('section');
    roomSection.className = 'field';
    roomSection.innerHTML = `<h3>🏭️ ${room.name} (${room.template})</h3>`;

    room.anchors.forEach((a, aIndex) => {
      const anchorHTML = `
        <div class="field">
          <h4>📍 ${a.name}</h4>
          <p><strong>Meaning:</strong> ${a.meaning}</p>
          <p><strong>Memory:</strong> ${a.memory}</p>
          <p><strong>Placement:</strong> ${a.placement}</p>
          <p><strong>Color:</strong> <span style="display:inline-block;width:15px;height:15px;background:${a.color};border:1px solid #aaa;"></span></p>
          ${a.image ? `<img src="${a.image}" class="anchor-preview" />` : ''}
        </div>
        <hr/>
      `;
      roomSection.innerHTML += anchorHTML;
    });

    container.appendChild(roomSection);
  });
};

// ===== Core Logic: Prefab Anchors, Rendering, Storage =====

const prefabAnchorSets = {
  'Temple of Saturn': [
    ['Obsidian Cube', 'Unyielding truth'], ['Hourglass', 'Time mastery'], ['Scythe', 'Cutting away falsehood'],
    ['Black Gate', 'Threshold to discipline'], ['Lantern', 'Guided darkness'], ['Column', 'Unshakable structure'],
    ['Chain', 'Constraint and effort'], ['Star Map', 'Celestial orientation'], ['Mirror', 'Self-confrontation'],
    ['Altar', 'Sacred order'], ['Ring of Lead', 'Burden and focus'], ['Candle Stub', 'Endurance']
  ],
  'Garden of Mnemosyne': [
    ['Fountain', 'Overflowing inspiration'], ['Vine', 'Growth over time'], ['Shell', 'Listening inward'],
    ['Butterfly', 'Transience'], ['Book', 'Written memory'], ['Cloud', 'Dreamscape'], ['Feather', 'Whispers'],
    ['Bowl', 'Offering to muses'], ['Stream', 'Flow of thought'], ['Moss', 'Soft recollection'],
    ['Fruit', 'Sweet truth'], ['Pathway', 'Memory journey']
  ],
  'Library of Alexandria': [
    ['Scroll', 'Lost knowledge'], ['Quill', 'Authorship'], ['Inkpot', 'Fluid truth'], ['Torch', 'Guiding light'],
    ['Dusty Tome', 'Ancient record'], ['Globe', 'Wider view'], ['Ladder', 'Ascension'], ['Bust', 'Classical wisdom'],
    ['Desk', 'Studious discipline'], ['Map', 'Worldly knowledge'], ['Window', 'Perspective'], ['Key', 'Unlocking insight']
  ],
  'Labyrinth of Daedalus': [
    ['Thread', 'Way through'], ['Minotaur Mask', 'Shadow self'], ['Torch', 'Light in dark'], ['Footprint', 'Previous step'],
    ['Stone Door', 'Sealed truth'], ['Echo', 'Reverberation'], ['Puzzle Box', 'Complex thought'], ['Net', 'Caught ideas'],
    ['Spiral', 'Inner path'], ['Skull', 'Mortality'], ['Chalk Mark', 'Trail'], ['Eye', 'Hidden watcher']
  ]
};

window.addAnchorToRoom = function (btn) {
  const group = btn.previousElementSibling;
  const section = btn.closest('section');
  const template = section.querySelector('.room-template').value;

  const anchors = prefabAnchorSets[template] || [];
  const index = group.children.length;

  const data = anchors[index] || ['', ''];

  const anchor = document.createElement('div');
  anchor.className = 'field';

  anchor.innerHTML = `
    <h4>📍 Anchor ${index + 1}</h4>
    <input type="text" value="${data[0]}" placeholder="Name" class="anchor-name" />
    <input type="text" value="${data[1]}" placeholder="Meaning" class="anchor-meaning" />
    <textarea placeholder="Memory (optional)" class="anchor-memory"></textarea>
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
    <button type="button" onclick="saveAnchorFeedback(this)">📏 Save Anchor</button>
  `;

  group.appendChild(anchor);
};

window.previewImage = function(input) {
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
};

window.saveAnchorFeedback = function(btn) {
  savePalaceToLocalStorage();
  btn.textContent = '✅ Anchor Saved!';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '📏 Save Anchor';
    btn.disabled = false;
  }, 2000);
};
