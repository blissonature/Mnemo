// =========================
// Mnemo | Rooms, Anchor Grouping, and Auto-Color Swatches (Updated UI Flow)
// =========================

window.addEventListener('DOMContentLoaded', () => {
  const activityContainer = document.getElementById('activity');

  renderGuide();
  renderFirstRoom();

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
    activityContainer.appendChild(guide);
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
    `;
    activityContainer.appendChild(builder);
    addRoom();
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
      '⛩️','🜍','🕯️','🐚','🦉','📜','🗝️','🌌','🔮','🌿','📖','⚖️','🧿','🪞','📿','🗿','🏛️','✨','🔔','💠','🧠','🪬','🪄','🜁','🜂','🜃','🜄',
      '🔥','💧','🌬️','🌱','🪐','🌕','🌑','🌗','🌓','🌙','☀️','⭐','🪨','🪵','🕳️','🛡️','🗡️','🩸','🧪','🧬','🧫','⚗️','📡','🔭','🧰','🎴','🪙',
      '🏺','🪔','📚','🔓','🔐','🎼','🎨','🧵','🧶','🪡','🖋️','🗂️','🪆','🧸','🎠','🛸','🦢','🦋','🐉','🐍','🦂','🪲','🦎','🧿','🔯','♾️','☯️','⚛️'
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
    `;
    group.appendChild(anchor);
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
});
