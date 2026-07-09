document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 650, once: true });
    loadProjects('all');
    setupFilters();
});

let allProjects = [];

async function loadProjects(filter) {
    try {
        const res = await fetch('/api/projects');
        allProjects = await res.json();
        renderProjects(filter);
    } catch (err) {
        console.error('Failed to load projects:', err);
    }
}

function renderProjects(filter) {
    const grid = document.getElementById('projects-grid');
    const filtered = filter === 'all' 
        ? allProjects 
        : allProjects.filter(p => p.category === filter);

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color: var(--muted)">No projects found.</p>';
        return;
    }

    grid.innerHTML = filtered.map((p, i) => `
        <div class="project-card" data-aos="fade-up" data-aos-delay="${i * 100}">
            <h3 class="card-title">${p.title}</h3>
            <p class="card-desc">${p.description}</p>
            <div class="card-tags">
                ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            ${p.github ? `<a href="${p.github}" target="_blank" class="btn btn-outline" style="margin-top: 1rem; font-size: 0.8rem; padding: 0.4rem 1rem">GitHub ↗</a>` : ''}
        ${p.live ? `<a href="${p.live}" target="_blank" class="btn btn-outline" style="margin-top: 0.5rem; font-size: 0.8rem; padding: 0.4rem 1rem">Live Demo ↗</a>` : ''}
            </div>
    `).join('');

    AOS.refresh();
}

function setupFilters() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProjects(tab.dataset.filter);
        });
    });
}