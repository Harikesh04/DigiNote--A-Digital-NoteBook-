const mongoose = require('mongoose');
const { Schema } = mongoose;

// schere is an orgainsed way in which we are going to store owr data in database.

const UserSchema = new Schema({
   name:{
       type: String,
       required: true
   },
   email:{
       type: String,
       required: true,
       unique: true

    //    this  required: true makes sure that email must be present
    //    this  unique: true makes sure that email must be unique

    // similiarly we can make anything as per our requirement
   },
  password:{
       type: String,
       required: true
   },
  date:{
       type: Date,
      default: Date.now
   },
  });

  const User = mongoose.model('user',UserSchema);

  module.exports = User;