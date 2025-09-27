const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      role: {
        type: String,
        enum: ['junior', 'senior'],
        default: 'junior'
      }
    });

  userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, "secrete", { expiresIn: '24h' });
    return token;
  }
  userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
  }
  
  userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
  }

 const user=mongoose.model('User',userSchema);

 module.exports=user;