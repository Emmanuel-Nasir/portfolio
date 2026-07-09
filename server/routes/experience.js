const requireAuth = require('../middleware/requireAuth');
const express = require('express');
const router = express.Router();
const experience = require('../models/experience');

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
router.post('/', requireAuth, async (req, res) => {
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