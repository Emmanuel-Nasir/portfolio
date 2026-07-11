document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim(),
            };

            try {
const response = await fetch('https://emmanuel-portfolio-lted.onrender.com/api/contact', {                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    document.getElementById('form-status').textContent = 'Message sent successfully!';
                    contactForm.reset();
                } else {
                    document.getElementById('form-status').textContent = 'Failed to send message. Please try again later.';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('form-status').textContent = 'An error occurred. Please try again later.';
            }
        });
    }
});