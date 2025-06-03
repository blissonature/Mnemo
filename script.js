// =========================
// Mnemo | Rooms, Anchor Grouping, and Auto-Color Swatches
// =========================

window.addEventListener('DOMContentLoaded', () => {
  const activityContainer = document.getElementById('activity');

  renderGuide();
  renderPalaceBuilder();

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

  function renderPalaceBuilder() {
    const builder = document.createElement('form');
    builder.id = 'palaceForm';
    builder.innerHTML = `
      <h2>🏰 Memory Palace Designer</h2>
      <div class="field">
        <label>Palace Name:</label>
        <input type="text" id="palaceName" placeholder="Temple of Echoes" required />
      </div>
      <div class="field">
        <label>Number of Rooms:</label>
        <input type="number" id="roomCount" placeholder="3" min="1" max="12" value="3" />
        <button type="button" onclick="createRooms()">Create Rooms</button>
      </div>
      <div id="rooms"></div>
      <button type="submit">💾 Save & Preview</button>
    `;
    builder.addEventListener('submit', (e) => {
      e.preventDefault();
      renderSummary();
    });
    activityContainer.appendChild(builder);
  }

  window.createRooms = function () {
    const roomCount = parseInt(document.getElementById('roomCount').value) || 1;
    const container = document.getElementById('rooms');
    container.innerHTML = '';
    for (let i = 0; i < roomCount; i++) {
      const room = document.createElement('div');
      room.className = 'field';
      room.innerHTML = `
        <h3>🚪 Room ${i + 1}</h3>
        <input type="text" placeholder="Room name (e.g. Library of Law)" class="room-name" />
        <div class="anchor-group"></div>
        <button type="button" onclick="addAnchorToRoom(this)">➕ Add Anchor</button>
      `;
      container.appendChild(room);
    }
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
          <div class="icon-grid">
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
    btn.textContent = showing ? 'Hide Icons ▴' : 'Show Icons ▾';
  }

  function renderSummary() {
    const name = document.getElementById('palaceName').value.trim();
    const rooms = [...document.querySelectorAll('#rooms > .field')];

    let text = `Memory Palace: ${name}\n\n`;

    rooms.forEach((room, i) => {
      const roomName = room.querySelector('.room-name').value.trim() || `Room ${i + 1}`;
      text += `Room ${i + 1}: ${roomName}\n`;

      const anchors = [...room.querySelectorAll('.anchor-group > .field')];
      anchors.forEach((a, j) => {
        const icon = a.querySelector('.anchor-icon').value.trim();
        const title = a.querySelector('.anchor-name').value.trim();
        const meaning = a.querySelector('.anchor-meaning').value.trim();
        const color = a.querySelector('.anchor-color').value;
        text += `  Anchor ${j + 1}: ${icon} ${title}\n    Meaning: ${meaning}\n    Color: ${color}\n`;
      });

      text += `\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    activityContainer.innerHTML = `
      <h2>📜 Memory Palace Summary</h2>
      <pre>${text}</pre>
      <a href="${url}" download="${name.replace(/\s+/g, '_')}_palace.txt">⬇️ Download .txt</a>
      <button onclick="window.print()">🖨️ Print</button>
      <button onclick="location.reload()">🔁 Start Over</button>
    `;
  }
});
