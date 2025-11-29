(async function () {
    const container = document.getElementById('projects-container');

    async function fetchProjects() {
        try {
            const r = await fetch('/src/data/projects/projects.json', { cache: 'no-cache' });
            if (!r.ok) throw new Error('projects.json load failed');
            const data = await r.json();
            if (!Array.isArray(data)) throw new Error('projects.json must be array');
            return data;
        } catch (e) {
            console.error('projects load failed, using fallback', e);
            return [
                { "title": "Sample Project Alpha", "short_description": "Fallback sample project to prevent empty UI.", "description": "This is sample descriptive text for Project Alpha. Replace with your projects.json data.", "image": "placeholder-1.jpg", "tags": ["UI", "Design"], "date": "2024-07-01", "url": "#" },
                { "title": "Sample Project Beta", "short_description": "Another fallback sample to test layout and interactions.", "description": "Longer description for Project Beta demonstrating the horizontal expansion and smooth collapse of the sibling card.", "image": "placeholder-2.jpg", "tags": ["Web", "Frontend"], "date": "2023-11-15", "url": "#" }
            ];
        }
    }

    function escapeHtml(s) { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
    function slug(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
    function formatDate(d) { try { const dt = new Date(d); if (isNaN(dt)) return ''; return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short' }); } catch (e) { return d || ''; } }

    function createCard(project, side) {
        const card = document.createElement('article');
        card.className = 'card ' + side;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.dataset.title = project.title || '';
        card.innerHTML = `
      <div class="media" aria-hidden="true">
        <img loading="lazy" src="/assets/images/projects/${encodeURIComponent(project.image || 'placeholder-1.jpg')}" alt="${escapeHtml(project.title || '')}">
      </div>
      <div class="info">
        <h3 class="title" id="title-${slug(project.title || Math.random().toString(36).slice(2, 7))}">${escapeHtml(project.title)}</h3>
        <div class="meta">
          <div class="chips">${(project.tags || []).slice(0, 4).map(t => `<span class="chip">${escapeHtml(t)}</span>`).join('')}</div>
          <div style="flex:1"></div>
          <div style="color:var(--muted-2);font-size:0.85rem;">${project.date ? formatDate(project.date) : ''}</div>
        </div>
        <p class="short">${escapeHtml(project.short_description || '')}</p>
        <div class="actions">
          <button class="btn primary btn-expand" aria-expanded="false" type="button">Read more</button>
          <button class="btn ghost btn-open" type="button">Open</button>
        </div>
        <div class="extra" aria-hidden="true">${escapeHtml(project.description || '')}</div>
      </div>
    `;
        card._proj = project;
        return card;
    }

    function renderRows(projects) {
        container.innerHTML = '';
        for (let i = 0; i < projects.length; i += 2) {
            const row = document.createElement('div');
            row.className = 'row';
            const left = createCard(projects[i], 'left');
            row.appendChild(left);
            if (i + 1 < projects.length) { const right = createCard(projects[i + 1], 'right'); row.appendChild(right); }
            else { row.classList.add('single'); }
            bindRowInteractions(row);
            container.appendChild(row);
        }
    }

    function bindRowInteractions(row) {
        const left = row.querySelector('.card.left');
        const right = row.querySelector('.card.right');
        function collapseRow() {
            row.classList.remove('expanded-left', 'expanded-right');
            if (left) { left.setAttribute('aria-expanded', 'false'); left.querySelector('.btn-expand').setAttribute('aria-expanded', 'false'); left.querySelector('.extra').setAttribute('aria-hidden', 'true'); left.querySelector('.btn-expand').textContent = 'Read more'; }
            if (right) { right.setAttribute('aria-expanded', 'false'); right.querySelector('.btn-expand').setAttribute('aria-expanded', 'false'); right.querySelector('.extra').setAttribute('aria-hidden', 'true'); right.querySelector('.btn-expand').textContent = 'Read more'; }
        }
        function expandLeft() {
            if (!left) return;
            row.classList.remove('expanded-right'); row.classList.add('expanded-left');
            left.setAttribute('aria-expanded', 'true'); left.querySelector('.btn-expand').setAttribute('aria-expanded', 'true'); left.querySelector('.extra').setAttribute('aria-hidden', 'false'); left.querySelector('.btn-expand').textContent = 'Show less';
            if (right) { right.setAttribute('aria-expanded', 'false'); right.querySelector('.btn-expand').setAttribute('aria-expanded', 'false'); right.querySelector('.extra').setAttribute('aria-hidden', 'true'); right.querySelector('.btn-expand').textContent = 'Read more'; }
        }
        function expandRight() {
            if (!right) return;
            row.classList.remove('expanded-left'); row.classList.add('expanded-right');
            right.setAttribute('aria-expanded', 'true'); right.querySelector('.btn-expand').setAttribute('aria-expanded', 'true'); right.querySelector('.extra').setAttribute('aria-hidden', 'false'); right.querySelector('.btn-expand').textContent = 'Show less';
            if (left) { left.setAttribute('aria-expanded', 'false'); left.querySelector('.btn-expand').setAttribute('aria-expanded', 'false'); left.querySelector('.extra').setAttribute('aria-hidden', 'true'); left.querySelector('.btn-expand').textContent = 'Read more'; }
        }
        if (left) {
            const btn = left.querySelector('.btn-expand');
            btn.addEventListener('click', e => { e.stopPropagation(); if (row.classList.contains('expanded-left')) collapseRow(); else expandLeft(); });
            left.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); if (row.classList.contains('expanded-left')) collapseRow(); else expandLeft(); } else if (ev.key === 'Escape') { collapseRow(); } });
            const openBtn = left.querySelector('.btn-open');
            openBtn.addEventListener('click', e => { e.stopPropagation(); const url = left._proj && left._proj.url; if (url) window.open(url, '_blank', 'noopener'); else expandLeft(); });
        }
        if (right) {
            const btn = right.querySelector('.btn-expand');
            btn.addEventListener('click', e => { e.stopPropagation(); if (row.classList.contains('expanded-right')) collapseRow(); else expandRight(); });
            right.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); if (row.classList.contains('expanded-right')) collapseRow(); else expandRight(); } else if (ev.key === 'Escape') { collapseRow(); } });
            const openBtn = right.querySelector('.btn-open');
            openBtn.addEventListener('click', e => { e.stopPropagation(); const url = right._proj && right._proj.url; if (url) window.open(url, '_blank', 'noopener'); else expandRight(); });
        }
    }

    const projects = await fetchProjects();
    renderRows(projects);
})();