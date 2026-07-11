document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 650, once: true });
    loadExperience();
});

async function loadExperience() {
    try {
        const res = await  fetch('https://emmanuel-portfolio-lted.onrender.com/api/experiences');
        const experiences = await res.json();
        renderExperience(experiences);
    } catch (err) {
        console.error('Failed to load experience:', err);
    }
}

function renderExperience(experiences) {
    const timeline = document.getElementById('timeline-list');

    if (!experiences || experiences.length === 0) {
        timeline.innerHTML = '<p style="color: var(--muted)">No experience listed yet.</p>';
        return;
    }

    timeline.innerHTML = experiences.map((e, i) => `
        <div class="timeline-item" data-aos="fade-up" data-aos-delay="${i * 100}">
            <p class="timeline-role">${e.jobTitle}</p>
            <p class="timeline-company">${e.company}</p>
            <p class="timeline-period">${e.period}</p>
            ${e.responsibilities && e.responsibilities.length > 0 ? `
                <ul style="color: var(--muted); font-size: 0.85rem; padding-left: 1.2rem; line-height: 1.8;">
                    ${e.responsibilities.map(r => `<li>${r}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `).join('');

    AOS.refresh();
}