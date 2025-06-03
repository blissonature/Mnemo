// =========================
// Mnemo | Prefab Anchors per Room Template + Custom Option
// =========================

window.addEventListener('DOMContentLoaded', () => {
  const activityContainer = document.getElementById('activity');

  renderGuide();
  renderFirstRoom();
  addJSONControls();
  addViewToggle();
  loadPalaceFromLocalStorage();

  activityContainer.addEventListener('input', savePalaceToLocalStorage);
});

function renderGuide() {
  const guide = document.createElement('div');
  guide.innerHTML = `
    <section class="guide">
      <h2>🧭 Guide: Building a Memory Palace</h2>
      <p>Each room holds a symbolic theme. Each anchor should be vivid, symbolic, and emotionally resonant.</p>
      <p>Use placement and color to deepen association. Upload an image or visualize one clearly in your mind. Add memories to transform insight into retrieval.</p>
    </section>
    <hr/>
  `;
  document.getElementById('activity').appendChild(guide);
}

function renderFirstRoom() {
  const section = document.createElement('section');
  section.className = 'field';
  section.innerHTML = `
    <h3>🚪 Create First Room</h3>
    <input type="text" placeholder="Room Name (e.g. Temple of Saturn)" class="room-name" />
    <select class="room-template">
      <option value="">Choose Template</option>
      <option>Temple of Saturn</option>
      <option>Garden of Mnemosyne</option>
      <option>Library of Alexandria</option>
      <option>Labyrinth of Daedalus</option>
    </select>
    <div class="field anchor-group"></div>
    <button type="button" onclick="addAnchorToRoom(this)">➕ Add Anchor</button>
  `;
  document.getElementById('activity').appendChild(section);
}

function addViewToggle() {
  const controls = document.createElement('div');
  controls.innerHTML = `
    <hr/>
    <button onclick="renderViewMode()">👁️ View Palace</button>
  `;
  document.getElementById('activity').appendChild(controls);
}

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
    <button type="button" onclick="savePalaceToLocalStorage()">💾 Save Anchor</button>
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
