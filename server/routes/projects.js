const requireAuth = require('../middleware/requireAuth');
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');

const projectValidation = [
    body('title').trim().isLength({ min: 1, max: 150 }).escape(),
    body('description').trim().isLength({ min: 1, max: 1000 }).escape(),
    body('category').trim().isIn(['software', 'networking', 'security']),
];

// GET all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// POST a new project
router.post('/', requireAuth, projectValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid project data' });
    }

    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save project' });
    }
});

// DELETE a project
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;