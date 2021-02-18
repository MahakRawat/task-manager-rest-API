const mongoose=require('mongoose')
const taskschema= new mongoose.Schema({
    description:{
        type:String,
        required: true,
        trim: true
    },
     completed:{
         type: Boolean,
          default: false 
     },
     owner:{
         type:mongoose.Schema.Types.ObjectId,
         required:true,
         ref:'users' //provides reference i.e. both are related to each other
     }
    },{timestamps:true})

const task=mongoose.model('tasks',taskschema)
module.exports=task