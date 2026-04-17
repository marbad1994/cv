// ScreenLink Demo — embedded version
function initScreenLinkDemo(container) {
  const state = { mac: 'disconnected', win: 'disconnected', running: false };

  const $ = (sel) => container.querySelector(sel);
  const $$ = (sel) => container.querySelectorAll(sel);

  function startService() {
    if (state.running) return;
    state.running = true;

    $('#sl-widget-status').textContent = 'Online';
    $('#sl-widget-status').className = 'widget-status online';
    $('#sl-host-dot').className = 'widget-status-dot online';
    $('#sl-tray-dot').style.background = '#4CAF50';

    const termBody = $('.terminal-body');
    termBody.innerHTML = '<div class="terminal-line"><span class="prompt">marcus@desktop:~$</span> screenlink start</div>';

    setTimeout(() => {
      termBody.innerHTML += '<div class="terminal-line dim">Starting ScreenLink...</div>';
    }, 400);

    setTimeout(() => {
      termBody.innerHTML += '<div class="terminal-line dim green">Connected: MacBook Air (192.168.50.22)</div>';
      state.mac = 'extended';
      updateScreens();
      $('#sl-line-right').setAttribute('stroke', 'rgba(76,175,80,0.4)');
    }, 1200);

    setTimeout(() => {
      termBody.innerHTML += '<div class="terminal-line dim green">Connected: Windows Laptop (192.168.50.45)</div>';
      state.win = 'extended';
      updateScreens();
      $('#sl-line-left').setAttribute('stroke', 'rgba(76,175,80,0.4)');
    }, 2000);

    setTimeout(() => {
      termBody.innerHTML += '<div class="terminal-line"><span class="prompt">marcus@desktop:~$</span> <span class="sl-cursor">_</span></div>';
    }, 2500);

    $('.hint').textContent = 'Click "Remote" to switch a client to remote desktop mode';
  }

  function stopService() {
    state.running = false;
    state.mac = 'disconnected';
    state.win = 'disconnected';

    $('#sl-widget-status').textContent = 'Offline';
    $('#sl-widget-status').className = 'widget-status offline';
    $('#sl-host-dot').className = 'widget-status-dot offline';
    $('#sl-tray-dot').style.background = '#f44336';

    $('#sl-line-left').setAttribute('stroke', 'rgba(76,175,80,0)');
    $('#sl-line-right').setAttribute('stroke', 'rgba(76,175,80,0)');

    const termBody = $('.terminal-body');
    termBody.innerHTML = '<div class="terminal-line"><span class="prompt">marcus@desktop:~$</span> screenlink stop</div>';
    termBody.innerHTML += '<div class="terminal-line dim">Stopped.</div>';
    termBody.innerHTML += '<div class="terminal-line"><span class="prompt">marcus@desktop:~$</span> <span class="sl-cursor">_</span></div>';

    updateScreens();
    $('.hint').textContent = 'Click the ScreenLink icon in the taskbar, then press \u25B6 to connect';
  }

  function restartService() {
    stopService();
    setTimeout(startService, 800);
  }

  function toggleMode(client) {
    if (!state.running) return;
    if (state[client] === 'disconnected') return;
    state[client] = state[client] === 'extended' ? 'remote' : 'extended';
    updateScreens();
  }

  function updateClient(client, screenId, labelId, btnId, toggleId) {
    const screen = $(screenId);
    const label = $(labelId);
    const btn = $(btnId);
    const toggle = $(toggleId);

    screen.querySelectorAll('.extended-overlay, .remote-overlay-indicator').forEach(el => el.remove());

    if (state[client] === 'disconnected') {
      label.textContent = 'Disconnected';
      label.className = 'widget-item-name disconnected-label';
      btn.textContent = '\u2014';
      toggle.className = 'widget-mode-btn disabled';
      return;
    }

    label.className = 'widget-item-name';
    toggle.className = 'widget-mode-btn';

    if (state[client] === 'extended') {
      label.textContent = 'Extended Screen';
      btn.textContent = 'Remote';

      const overlay = document.createElement('div');
      overlay.className = 'extended-overlay';
      overlay.innerHTML = `
        <div class="extended-content">
          <div class="extended-badge">EXTENDED</div>
          ${client === 'mac' ? `
            <div class="extended-window" style="top:18px;left:10px;width:110px;height:65px;">
              <div class="ext-win-titlebar">
                <div class="ext-win-dot" style="background:#e74c3c"></div>
                <div class="ext-win-dot" style="background:#f39c12"></div>
                <div class="ext-win-dot" style="background:#2ecc71"></div>
              </div>
              <div class="ext-win-body">$ npm run dev<br>Server running on :3000<br>Watching for changes...</div>
            </div>
          ` : `
            <div class="extended-window" style="top:16px;left:12px;width:120px;height:68px;">
              <div class="ext-win-titlebar">
                <div class="ext-win-dot" style="background:#e74c3c"></div>
                <div class="ext-win-dot" style="background:#f39c12"></div>
                <div class="ext-win-dot" style="background:#2ecc71"></div>
              </div>
              <div class="ext-win-body" style="background:#111827;">
                <div style="color:#4CAF50;font-size:5px;">Dashboard</div>
                <div style="display:flex;gap:3px;margin-top:3px;">
                  <div style="width:16px;height:12px;background:rgba(76,175,80,0.2);border-radius:2px;"></div>
                  <div style="width:16px;height:12px;background:rgba(33,150,243,0.2);border-radius:2px;"></div>
                  <div style="width:16px;height:12px;background:rgba(124,77,255,0.2);border-radius:2px;"></div>
                </div>
              </div>
            </div>
          `}
        </div>
      `;
      screen.appendChild(overlay);
    } else {
      label.textContent = 'Remote Desktop';
      btn.textContent = 'Extend';

      const badge = document.createElement('div');
      badge.className = 'remote-overlay-indicator';
      badge.style.cssText = `position:absolute;top:${client === 'mac' ? '16' : '6'}px;left:6px;`;
      badge.textContent = 'REMOTE CONTROL';
      screen.appendChild(badge);
    }
  }

  function updateScreens() {
    updateClient('mac', '#sl-right-screen', '#sl-mac-mode-label', '#sl-mac-btn-text', '#sl-mac-toggle');
    updateClient('win', '#sl-left-screen', '#sl-win-mode-label', '#sl-win-btn-text', '#sl-win-toggle');
  }

  // Init
  updateScreens();
  $('#sl-widget-status').textContent = 'Offline';
  $('#sl-widget-status').className = 'widget-status offline';
  $('#sl-host-dot').className = 'widget-status-dot offline';
  $('#sl-tray-dot').style.background = '#f44336';

  // Events
  $('#sl-tray-icon').addEventListener('click', (e) => {
    e.stopPropagation();
    $('#sl-widget-popup').classList.toggle('visible');
  });

  container.addEventListener('click', (e) => {
    const popup = $('#sl-widget-popup');
    if (!popup.contains(e.target) && !$('#sl-tray-icon').contains(e.target)) {
      popup.classList.remove('visible');
    }
  });

  $('#sl-widget-popup').addEventListener('click', (e) => e.stopPropagation());
  $('#sl-start-btn').addEventListener('click', startService);
  $('#sl-stop-btn').addEventListener('click', stopService);
  $('#sl-restart-btn').addEventListener('click', restartService);
  $('#sl-mac-toggle').addEventListener('click', () => toggleMode('mac'));
  $('#sl-win-toggle').addEventListener('click', () => toggleMode('win'));
}
