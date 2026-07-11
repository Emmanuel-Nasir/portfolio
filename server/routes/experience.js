const requireAuth = require('../middleware/requireAuth');
const express = require('express');
const router = express.Router();
const experience = require('../models/experience');
const { body, validationResult } = require('express-validator');

const experienceValidation = [
    body('jobTitle').trim().isLength({ min: 1, max: 150 }).escape(),
    body('company').trim().isLength({ min: 1, max: 150 }).escape(),
    body('period').trim().isLength({ min: 1, max: 100 }).escape(),
    body('responsibilities').optional().isArray({ max: 20 }),
    body('responsibilities.*').trim().isLength({ max: 300 }).escape(),
];

// GET all experiences
router.get('/', async (req, res) => {
    try {
        const experiences = await experience.find();
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});

// POST a new experience
router.post('/', requireAuth, experienceValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid experience data' });
    }

    try {
        const newExperience = new experience(req.body);
        await newExperience.save();
        res.status(201).json(newExperience);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save experience' });
    }
});

// DELETE a experience
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await experience.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

module.exports = router;