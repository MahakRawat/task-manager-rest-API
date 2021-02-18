const mongoose=require('mongoose')
const validator= require('validator')
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')
const task=require('../models/tasks')
const { deleteMany } = require('./tasks')
const userschema= mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    age:{
       type: Number,
       default: 0 
    } ,
    password:{
        type: String,
        required: true,
        trim:true,
        minLength:7,
        validate(value){
          if(value.toLowerCase().includes('password'))
          {throw new Error('invalid password');}
          }
    },
    email:{
        type: String,
        required:true,
        trim:true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
             throw new Error('invalid email')
        }
    },
    tokens: [{
        token:{
            type:String,
            required:true
        }
    }],
    avatar: {
        type: Buffer
    }

},
{timestamps: true})
userschema.virtual('tasks',{
    ref: 'tasks',
    localField:'_id',
    foreignField:'owner'
})
userschema.methods.toJSON=function(){
    const temp= this.toObject()
    delete temp.tokens
    delete temp.password
    delete temp.avatar
    return temp
}
 userschema.statics.findByCredentials= async (email,password)=> //model method
{
    const temp=await user.findOne({email})
    if(!temp)
      { 
          throw new Error('unable to login')
        }
          const ismatch = await bcrypt.compare(password,temp.password)
     if(!ismatch)
          throw new Error('unable to login')
    return temp
}
userschema.methods.generatetoken = async function(){ //instance method //arrow function is not made since it doesn't has access to this  
    try{
     const token= await jwt.sign({_id:this._id.toString()},'thisismynewcourse',{expiresIn:"7 days"})
     this.tokens=this.tokens.concat({token})
       this.save()
     return token
    }
    catch(e){
        console.log(e)
        return e
    }
} 
userschema.pre('save',async function(next){

    if(this.isModified('password'))
       this.password= await bcrypt.hash(this.password,8)
    next()
})
userschema.pre('remove',async function(next){
    await task.deleteMany({owner:this._id})
    next()
})
const user= mongoose.model('users',userschema)
module.exports=user
 