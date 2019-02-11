const express = require('express'); //na backend-u imesto import
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survay');
require('./services/passport'); //samo require jer nista nismo exportovali vec hocemo samo da se izvrsi

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express(); //kreira exspress objekat

app.use(bodyParser.json())
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app); //uvozimo fju i pozivamo je odmah (IIFE)
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if(process.env.NODE_ENV === 'production'){
    //express will serve up production assets 
    //like out main.js file, or main.css file!
      app.use(express.static('client/build')) 

      //Express will serve up the index.html file
      //if it doesn't recognize the route
       const path = require('path');
       app.get('*', (req, res) => {
             res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
       })
}

const PORT = process.env.PORT || 5000; //dinamic port bindings
app.listen(PORT);