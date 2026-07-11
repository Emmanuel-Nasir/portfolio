const requireAuth = require('../middleware/requireAuth');
const express = require('express');
const router = express.Router();
const certification = require('../models/certification');
const { body, validationResult } = require('express-validator');

const certificationValidation = [
    body('title').trim().isLength({ min: 1, max: 150 }).escape(),
    body('issuer').trim().isLength({ min: 1, max: 150 }).escape(),
    body('dateEarned').optional({ checkFalsy: true }).isISO8601(),
    body('credentialUrl').optional({ checkFalsy: true }).isURL(),
];

// GET all certifications
router.get('/', async (req, res) => {
    try {
        const certifications = await certification.find();
        res.json(certifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch certifications' });
    }
});

// POST a new certification
router.post('/', requireAuth, certificationValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid certification data' });
    }

    try {
        const newCertification = new certification(req.body);
        await newCertification.save();
        res.status(201).json(newCertification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save certification' });
    }
});

// DELETE a certification
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await certification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Certification deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete certification' });
    }
});

module.exports = router;