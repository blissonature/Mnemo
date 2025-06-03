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
        <p><strong>Memory:</strong> ${a.memory || '—'}</p>
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
}

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
}
