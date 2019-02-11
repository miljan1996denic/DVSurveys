const mongoose = require('mongoose');
//const Shema = mongoose.Shema;
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    credits: { type: Number, default: 0 }
})

mongoose.model('users', userSchema);