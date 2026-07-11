const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: process.env.EMAIL_USER,
            subject: `Portfolio contact from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email,
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;