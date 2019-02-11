const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');
const SurveyOptionsSchema = require('./SurveyOption');

const surveyShema = new Schema({
    title: String,
    body: String,
    subject: String,
    recipients: [RecipientSchema],
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    options: [SurveyOptionsSchema],
    _user: { type: Schema.Types.ObjectId, ref: 'User'}, //referenca ka user-u, _ konvencija u Mongu
    dateSent: Date,
    lastResponded: Date
});

mongoose.model('surveys', surveyShema);