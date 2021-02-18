const user=require('../models/users')
const jwt=require('jsonwebtoken')


const auth= async(req,res,next)=>{
try{
  const token=req.header('Authorization').replace('bearer ','')
  const decode= jwt.verify(token,process.env.JWT_SECRET) //return payload...which is _id here
  const obj= await user.findOne({_id:decode._id,'tokens.token':token})
  if(!obj)
  {
     throw new Error()
  }
  req.token=token
  req.user=obj
   next()
}
catch(e){
  res.status(503).send('not authenticated')
}
}
module.exports=auth