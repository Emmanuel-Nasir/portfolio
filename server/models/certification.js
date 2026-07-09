const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
    title: String,
    issuer: String,
    description: String,
    dateEarned: Date,
    credentialUrl: String,
},{timestamps: true});

module.exports = mongoose.model('Certification', CertificationSchema);