async function loadAchievements(type, url, containerId, emptyId, viewMoreBtnId) {
  const container = document.getElementById(containerId);
  const empty = document.getElementById(emptyId);
  const viewMoreBtn = viewMoreBtnId ? document.getElementById(viewMoreBtnId) : null;
  if (!container || !empty) return;

  if (type === 'research') { container.classList.add('research-list') } else { container.classList.remove('research-list') }

  try {
    container.innerHTML = '';
    empty.style.display = 'none';
    const resp = await fetch(url, { cache: "no-cache" });
    if (!resp.ok) throw new Error('Network error ' + resp.status);
    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) { empty.style.display = 'block'; return }

    data.forEach((item, idx) => {
      let card;
      if (type === 'research') {
        card = document.createElement('article');
        card.className = 'achievement-card horizontal';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
          <div class="badge-col">
            <div class="achievement-badge">#${item.badge ?? (idx + 1)}</div>
          </div>
          <div class="card-content">
            <div class="achievement-title">${escapeHtml(item.title)}</div>
            <div class="achievement-description">${escapeHtml(item.description)}</div>
          </div>
        `;
      }
      else if (type === 'competitions') {
        card = document.createElement('article');
        card.className = 'achievement-card';
        card.setAttribute('tabindex', '0');
        const photoPath = item.photo ? `/${item.photo}` : '';
        card.innerHTML = `
          <div>
            ${item.photo ? `<div class="achievement-photo"><img src="${escapeHtml(photoPath)}" alt="${escapeHtml(item.title)}"></div>` : ''}
            <div class="achievement-badge">#${item.badge ?? (idx + 1)}</div>
            <div class="achievement-title">${escapeHtml(item.title)}</div>
            <div class="achievement-description">${escapeHtml(item.description)}</div>
          </div>
        `;
      }
      else if (type === 'startups') {
        card = document.createElement('article');
        card.className = 'startup-card';
        card.innerHTML = `
    <img src="/${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} main image" class="startup-image">
    <div class="startup-info">
      <div class="startup-header">
        ${item.logo ? `<img src="/${escapeHtml(item.logo)}" alt="${escapeHtml(item.title)} logo" class="logo">` : ''}
        <h2>
          ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" title="Visit website">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}
        </h2>
        <div class="startup-links">
          ${item.link ? `
            <a href="${escapeHtml(item.link)}" target="_blank" title="Website">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
              </svg>
            </a>` : ''}
          ${item.linkedin ? `
            <a href="${escapeHtml(item.linkedin)}" target="_blank" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.7v2.2h.1c.5-.9 1.8-2.2 3.8-2.2 4 0 4.8 2.6 4.8 6V24h-4v-7.9c0-1.9 0-4.4-2.7-4.4-2.7 0-3.1 2.1-3.1 4.3V24h-4V8z"/>
              </svg>
            </a>` : ''}
        </div>
      </div>
      <div class="startup-desc">${escapeHtml(item.desc)}</div>
    </div>
  `;
      }

      if (type !== 'startups') {
        if (idx >= 4) { card.style.display = 'none'; card.classList.add('hidden-card') }
        else { card.style.display = 'flex' }
      }

      container.appendChild(card);
      setTimeout(() => card.classList.add('show'), 90 * idx);
    });

    if (type !== 'startups' && data.length > 4 && viewMoreBtn) {
      viewMoreBtn.style.display = 'inline-block';
      viewMoreBtn.replaceWith(viewMoreBtn.cloneNode(true));
      const newBtn = document.getElementById(viewMoreBtnId);
      newBtn.addEventListener('click', () => {
        container.querySelectorAll('.hidden-card').forEach(card => {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('show'), 60);
          card.classList.remove('hidden-card');
        });
        newBtn.style.display = 'none';
      });
    } else if (viewMoreBtn) { viewMoreBtn.style.display = 'none' }
  } catch (err) {
    console.error('Error', err);
    empty.style.display = 'block';
    empty.textContent = 'Could not load ' + url;
  }
}

function escapeHtml(str = '') {
  return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", "&#39;");
}

loadAchievements('competitions', '/src/data/achievements/competitions.json', 'achievements', 'empty-placeholder', 'view-more-achievements');
loadAchievements('startups', '/src/data/achievements/startups.json', 'startups', 'startups-empty');
loadAchievements('research', '/src/data/achievements/research.json', 'research', 'research-empty', 'view-more-research');
