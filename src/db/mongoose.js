const mongoose=require('mongoose') //npm module which helps in validating and sanitizing our data and helps in directly connecting our object to database
 
mongoose.connect(process.env.Mongoose_URl,{useNewUrlParser:true,useCreateIndex:true}).then(()=>{
    console.log('connected')}).catch((e)=>{
        console.log(e)
    })

