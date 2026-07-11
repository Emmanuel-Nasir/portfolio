const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const resend = new Resend(process.env.RESEND_API_KEY);

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Too many messages sent. Please try again later.' },
});

const contactValidation = [
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('message').trim().isLength({ min: 1, max: 2000 }).escape(),
];

router.post('/', contactLimiter, contactValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Please check your name, email, and message are valid.' });
    }

    const { name, email, message } = req.body;

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