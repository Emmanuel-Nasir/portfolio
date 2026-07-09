document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 650, once: true });
    loadCertifications();
});

async function loadCertifications() {
    try {
        const res = await fetch('/api/certifications');
        const certifications = await res.json();
        renderCertifications(certifications);
    } catch (err) {
        console.error('Failed to load certifications:', err);
    }
}

function renderCertifications(certifications) {
    const grid = document.getElementById('certs-grid');

    if (!certifications || certifications.length === 0) {
        grid.innerHTML = '<p style="color: var(--muted)">No certifications yet.</p>';
        return;
    }

    grid.innerHTML = certifications.map((c, i) => `
        <div class="project-card" data-aos="fade-up" data-aos-delay="${i * 100}">
            <h3 class="card-title">${c.title}</h3>
            <p class="card-desc">${c.issuer}</p>
            ${c.dateEarned ? `<p class="card-desc" style="margin-top: -0.5rem">${new Date(c.dateEarned).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>` : ''}
    ${c.credentialUrl ? `
    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
        <a href="${c.credentialUrl}" target="_blank" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.4rem 1rem">Preview ↗</a>
        <a href="${c.credentialUrl}" download class="btn btn-outline" style="font-size: 0.8rem; padding: 0.4rem 1rem">Download</a>
    </div>
` : ''}        </div>
    `).join('');

    AOS.refresh();
}