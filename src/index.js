const express=require('express') //importing express module... provided by npm(node package manager)  
//express helps in setting routes, bringing request and sending response, helps in creating dynamic web pages

const taskRouter= require('./db/routers/tasks') //router
const userRouter=require('./db/routers/users') //router

require('./db/mongoose') // by writing this the code within this file gets executed(i.e. connecting mongoose to our database) 
const app=express()

app.use(express.json()) //since path is not mentioned so every request will go through this fn(parse the json data).

app.use(userRouter)
app.use(taskRouter)
 const port=process.env.PORT

 
 
app.listen(port,()=>{
    console.log('server is up on'+port)
})