const { time } = require('console');
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    tags: [String],
    github: String,
    live: String},
    {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);