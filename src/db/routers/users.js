const express=require('express')
const user=require('../models/users')
const auth=require('../middleware/auth')
const sharp= require('sharp')
const multer=require('multer')
const {SendingSignupEmail,SendingCancellationEmail}=require('../email/test.js')

const avatar=multer({ //this can be used multiple times if we wanna accept different types of documents and create different section for storing them
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
    {
         cb(new Error('upload .jgp or .jpeg or .png extension file'))
    }
    cb(undefined,true)
  }
})
const router= express.Router()//middleware function(functions which run in between fecthing request and sending response )

router.post('/users/signup',async(req,res)=>{   //sign up
    const obj=new user(req.body)
   try
   {
      await obj.save()
       SendingSignupEmail(obj.email,obj.name)
      const token=await obj.generatetoken() //method on instance
           res.send({obj,token})
     }catch(e){
        res.status(400).send(e)     
  }
})
router.post('/users/logout',auth,async (req,res)=>{
  const obj= req.user
  obj.tokens=obj.tokens.filter((token)=>{
      return token!==req.token
  })
  await obj.save()
})
router.post('/users/login',async (req,res)=>{
    try{
        const temp= await user.findByCredentials(req.body.email,req.body.password) //function defined on whole collection
        const token=await temp.generatetoken() //method on instance
           res.send({temp,token})
    }
    catch(e)
    {
        res.status(400).send()
    }
})
router.post('/users/me/avatar',auth,avatar.single('upload'),async (req,res)=>{
  const buffer= await sharp(req.file.buffer).resize({width: 250,height: 250}).png().toBuffer()
  req.user.avatar=buffer
  await req.user.save()
  res.send(req.user)
},(error,req,res,next)=>{
  res.status(400).send({error: error.message})
})
router.get('/users/me',auth,async (req,res)=>{    
    try{
       res.send(req.user,req.token)
    }catch(e){
      res.status(500).send()
    }
  })
router.get('/users/:id/avatar',async (req,res)=>{
  try{ 
  
  const User=  await user.findById(req.params.id)
  if(!User || !User.avatar)
  {
    throw new Error()
  }
   res.set('Content-Type','image/png')
   res.send(User.avatar)
  }catch(e){
     res.status(404).send()
  }
})
router.delete('/users/me/avatar',auth,async (req,res)=>{
    if(req.user.avatar){
      req.user.avatar=undefined
     await req.user.save()
    }
    res.send(req.user)
})
  router.get('/users/me',auth,async(req,res)=>{
    
      if(!req.user)
      { 
        res.status(404).send()
    }
      res.send(req.user)
})
router.patch('/users',auth,async(req,res)=>{
  
   const tobeupdated= Object.keys(req.body)
   const array=['name','password','age','email']
   const match=tobeupdated.every((temp)=>{
      return array.includes(temp)  
   })
   if(!match)
     return res.send('Invalid update')
  try{
   req.user
   tobeupdated.forEach((update)=>{
       req.user[update]=req.body[update]})

    try{
      await req.user.save()
      res.send(req.user)
    }
    catch(e)
    {
        res.send('unable to save')
    }
  }
  catch(e){
       res.status(500).send()
  }
})
router.delete('/users/me',auth,async (req,res)=>{
   req.user.remove()
   SendingCancellationEmail(req.user.email,req.user.name)
res.send(req.user)
})
module.exports=router