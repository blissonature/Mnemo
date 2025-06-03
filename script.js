// =========================
// Mnemo | Full Emoji Picker with 100 Icons — Direct Wizard Mode
// =========================

window.addEventListener('DOMContentLoaded', () => {
  const activityContainer = document.getElementById('activity');

  // Start immediately without buttons or guide toggle
  renderGuide();
  renderPalaceBuilder();

  function renderGuide() {
    const guide = document.createElement('div');
    guide.innerHTML = `
      <section class="guide">
        <h2>🧭 Guide: Building a Memory Palace</h2>
        <p>Choose a familiar location—your childhood home, a temple, a garden—and walk through it mentally. Place vivid, symbolic objects at meaningful spots. These become your memory anchors.</p>
        <p>Each anchor represents an idea, memory, or fact. Return to your palace mentally to recall the sequence.</p>
      </section>
      <hr/>
    `;
    activityContainer.appendChild(guide);
  }

  function renderPalaceBuilder() {
    const builder = document.createElement('form');
    builder.id = 'palaceForm';
    builder.innerHTML = `
      <h2>🧱 Memory Palace Builder</h2>
      <div class="field">
        <label>Palace Name:</label>
        <input type="text" id="palaceName" placeholder="Temple of Echoes" required />
      </div>
      <div id="anchors"></div>
      <button type="button" onclick="addAnchor()">➕ Add Anchor</button>
      <button type="submit">💾 Save & Preview</button>
    `;
    builder.addEventListener('submit', (e) => {
      e.preventDefault();
      renderSummary();
    });
    activityContainer.appendChild(builder);
    addAnchor();
  }

  window.addAnchor = function () {
    const container = document.getElementById('anchors');
    const index = container.children.length + 1;
    const anchor = document.createElement('div');
    anchor.className = 'field';

    const emojiSet = [
      '⛩️','🜍','🕯️','🐚','🦉','📜','🗝️','🌌','🔮','🌿','📖','⚖️','🧿','🪞','📿','🗿','🏛️','✨','🔔','💠','🧠','🪬','🪄','🜁','🜂','🜃','🜄',
      '🔥','💧','🌬️','🌱','🪐','🌕','🌑','🌗','🌓','🌙','☀️','⭐','🪨','🪵','🕳️','🛡️','🗡️','🩸','🧪','🧬','🧫','⚗️','📡','🔭','🧰','🎴','🪙',
      '🏺','🪔','📚','🔓','🔐','🎼','🎨','🧵','🧶','🪡','🖋️','🗂️','🪆','🧸','🎠','🛸','🦢','🦋','🐉','🐍','🦂','🪲','🦎','🧿','🔯','♾️','☯️','⚛️'
    ];

    anchor.innerHTML = `
      <h3>📍 Anchor ${index}</h3>
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
    container.appendChild(anchor);
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
    const anchors = [...document.querySelectorAll('.field')].slice(1).map(div => {
      return {
        name: div.querySelector('.anchor-name').value.trim(),
        meaning: div.querySelector('.anchor-meaning').value.trim(),
        color: div.querySelector('.anchor-color').value,
        icon: div.querySelector('.anchor-icon').value.trim()
      };
    });

    let text = `Memory Palace: ${name}\n\n`;
    anchors.forEach((a, i) => {
      text += `Anchor ${i + 1}: ${a.icon} ${a.name}\n  Meaning: ${a.meaning}\n  Color: ${a.color}\n\n`;
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
