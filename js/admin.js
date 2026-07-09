const API_BASE = '/api';

async function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return login();
    }
}

async function login() {
    const password = prompt('Enter admin password:');

    if (!password) {
        window.location.href = '/';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('adminToken', data.token);
        } else {
            alert(data.error || 'Login failed');
            window.location.href = '/';
        }
    } catch (err) {
        alert('Could not reach server');
        window.location.href = '/';
    }
}

function authHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

checkAuth();

// ================= PROJECTS =================
async function addProject() {
    const title = document.getElementById('proj-title').value.trim();
    const desc = document.getElementById('proj-desc').value.trim();
    const category = document.getElementById('proj-category').value;
    const tags = document.getElementById('proj-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    const github = document.getElementById('proj-github').value.trim();
    const live = document.getElementById('proj-live').value.trim();

    if (!title || !desc) {
        document.getElementById('proj-status').textContent = 'Title and description are required!';
        return;
    }

    const project = { title, description: desc, category, tags, github, live };

    try {
        const res = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(project),
        });

        if (res.ok) {
            document.getElementById('proj-status').textContent = 'Project saved!';
            document.getElementById('proj-title').value = '';
            document.getElementById('proj-desc').value = '';
            document.getElementById('proj-tags').value = '';
            document.getElementById('proj-github').value = '';
            document.getElementById('proj-live').value = '';
            loadProjects();
        }
    } catch (err) {
        document.getElementById('proj-status').textContent = 'Error saving project!';
    }
}

async function deleteProject(id) {
    if (!confirm('Delete this project?')) return;
    await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    loadProjects();
}

async function loadProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    const projects = await res.json();
    const list = document.getElementById('projects-list');

    if (projects.length === 0) {
        list.innerHTML = '<p style="color: var(--muted)">No projects yet.</p>';
        return;
    }

    list.innerHTML = projects.map(p => `
        <div class="admin-item">
            <div class="admin-item-main">
                <span class="admin-item-title">${p.title}</span>
                <span class="admin-badge">${p.category}</span>
                <div class="admin-item-tags">
                    ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="admin-item-links">
                    ${p.github ? `<a href="${p.github}" target="_blank">GitHub ↗</a>` : ''}
                    ${p.live ? `<a href="${p.live}" target="_blank">Live ↗</a>` : ''}
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-outline" onclick="deleteProject('${p._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// ================= CERTIFICATIONS =================
async function addCertification() {
    const title = document.getElementById('cert-title').value.trim();
    const issuer = document.getElementById('cert-issuer').value.trim();
    const dateEarned = document.getElementById('cert-date').value;
    const credentialUrl = document.getElementById('cert-url').value.trim();

    if (!title || !issuer) {
        document.getElementById('cert-status').textContent = 'Name and issuer are required!';
        return;
    }

    const certification = { title, issuer, dateEarned, credentialUrl };

    try {
        const res = await fetch(`${API_BASE}/certifications`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(certification),
        });

        if (res.ok) {
            document.getElementById('cert-status').textContent = 'Certification saved!';
            document.getElementById('cert-title').value = '';
            document.getElementById('cert-issuer').value = '';
            document.getElementById('cert-date').value = '';
            document.getElementById('cert-url').value = '';
            loadCertifications();
        }
    } catch (err) {
        document.getElementById('cert-status').textContent = 'Error saving certification!';
    }
}

async function deleteCertification(id) {
    if (!confirm('Delete this certification?')) return;
    await fetch(`${API_BASE}/certifications/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    loadCertifications();
}

async function loadCertifications() {
    const res = await fetch(`${API_BASE}/certifications`);
    const certifications = await res.json();
    const list = document.getElementById('certifications-list');

    if (certifications.length === 0) {
        list.innerHTML = '<p style="color: var(--muted)">No certifications yet.</p>';
        return;
    }

    list.innerHTML = certifications.map(c => `
        <div class="admin-item">
            <div class="admin-item-main">
                <span class="admin-item-title">${c.title}</span>
                <div class="admin-item-sub">${c.issuer}${c.dateEarned ? ` · ${new Date(c.dateEarned).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}` : ''}</div>
                ${c.credentialUrl ? `<div class="admin-item-links"><a href="${c.credentialUrl}" target="_blank">View Credential ↗</a></div>` : ''}
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-outline" onclick="deleteCertification('${c._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// ================= EXPERIENCE =================
async function addExperience() {
    const jobTitle = document.getElementById('exp-title').value.trim();
    const company = document.getElementById('exp-company').value.trim();
    const period = document.getElementById('exp-period').value.trim();
    const responsibilities = document.getElementById('exp-responsibilities').value
        .split('\n')
        .map(r => r.trim())
        .filter(Boolean);

    if (!jobTitle || !company) {
        document.getElementById('exp-status').textContent = 'Job title and company are required!';
        return;
    }

    const experience = { jobTitle, company, period, responsibilities };

    try {
        const res = await fetch(`${API_BASE}/experiences`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(experience),
        });

        if (res.ok) {
            document.getElementById('exp-status').textContent = 'Experience saved!';
            document.getElementById('exp-title').value = '';
            document.getElementById('exp-company').value = '';
            document.getElementById('exp-period').value = '';
            document.getElementById('exp-responsibilities').value = '';
            loadExperience();
        }
    } catch (err) {
        document.getElementById('exp-status').textContent = 'Error saving experience!';
    }
}

async function deleteExperience(id) {
    if (!confirm('Delete this experience?')) return;
    await fetch(`${API_BASE}/experiences/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    loadExperience();
}

async function loadExperience() {
    const res = await fetch(`${API_BASE}/experiences`);
    const experiences = await res.json();
    const list = document.getElementById('experience-list');

    if (experiences.length === 0) {
        list.innerHTML = '<p style="color: var(--muted)">No experience entries yet.</p>';
        return;
    }

    list.innerHTML = experiences.map(e => `
        <div class="admin-item">
            <div class="admin-item-main">
                <span class="admin-item-title">${e.jobTitle}</span>
                <div class="admin-item-sub">${e.company} · ${e.period}</div>
                ${e.responsibilities && e.responsibilities.length > 0 ? `<div class="admin-item-sub" style="margin-top: 0.3rem">${e.responsibilities[0]}${e.responsibilities.length > 1 ? ` (+${e.responsibilities.length - 1} more)` : ''}</div>` : ''}
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-outline" onclick="deleteExperience('${e._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// ================= TAB SWITCHING =================
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.admin-panel').forEach(panel => {
            panel.style.display = 'none';
        });

        const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
        if (targetPanel) {
            targetPanel.style.display = 'block';
        }
    });
});

// ================= LOAD EVERYTHING ON PAGE LOAD =================
loadProjects();
loadCertifications();
loadExperience();