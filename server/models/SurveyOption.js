const mongoose = require('mongoose');
const { Schema } = mongoose;

const surveyOptionSchema = new Schema({
    name: String,
    count: {type: Number, default: 0 }
});

module.exports = surveyOptionSchema;