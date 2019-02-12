const _ = require('lodash');
const {Path} = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../midlewares/requireLogin');
const requireCredits = require('../midlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/serveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {

    app.post('/api/delete-survey', requireLogin, async (req, res) => {
        await Survey.deleteOne({ _id: req.body.surveyId});
        res.send({});
    })

    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id })
            .select({ recipients: false });

        res.send(surveys);
    });
    
    app.get('/api/surveys/:surveyId/:choice', (req,res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');

        _.chain(req.body)
            .map(({ email, url }) => {
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return { email, surveyId: match.surveyId, choice: match.choice};
                }
            })
            .compact()
            .uniqBy( 'email', 'surveyId')
            .each(({ surveyId, email, choice}) => {
                console.log(choice);
                Survey.updateOne(
                    {
                        _id: surveyId,
                        recipients: {
                            $elemMatch: { email: email, responded: false }
                        }
                    },
                    {
                        lastResponded: new Date(),
                        $set: { 'recipients.$.responded': true },
                        $inc: { 'options.$[element].count': 1 },  
                    },
                    { 
                        arrayFilters: [ { "element.name": choice } ]
                    }
                ).exec();
            })
            .value();

        res.send({}); 
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients, options } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            countRecipients: recipients.split(',').length,
            options: options.split(',').map(name => ({ name: name.trim() })),
            _user: req.user.id,
            dateSent:  Date.now()
        });

        //Great place to send an email!
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try{
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            res.status(422)
        }
    });
};