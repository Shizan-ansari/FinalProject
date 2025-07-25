const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose);//automatically username, hashing , salting and hash password implement by plugin
module.exports = mongoose.model('User', userSchema);