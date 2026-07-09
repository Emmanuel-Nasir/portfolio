const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    jobTitle: String,
    company: String,
    period: String,
    responsibilities: [String]
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);