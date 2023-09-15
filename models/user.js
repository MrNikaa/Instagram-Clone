const mongoose = require('mongoose');
const passportlocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: String,
});

userSchema.plugin(passportlocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
