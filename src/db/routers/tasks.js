const express=require('express')
const task=require('../models/tasks')
const auth=require('../middleware/auth')
const router=express.Router()

router.post('/tasks',auth,async(req,res)=>{
    const obj=new task({...req.body,owner: req.user._id})
    try{
       await obj.save()
         res.send(obj)
     }catch(e){
         res.status(400).send(e)
     }
})
router.get('/tasks',auth, async (req, res) => { //route for getting all the tasks created by the user
   const match={}
   const sort={}
    
   if(req.query.completed)
   {
       match.completed= req.query.completed===true
   }
   if(req.query.sortby)
   {
       const part=req.query.sortby.split(':')
       sort[part[0]]=part[1]==='desc'?-1:1
   }
    try {
       await  req.user.populate({
             path:'tasks',
             match,
             options:{
                 limit:parseInt(req.query.limit),
                 skip: parseInt(req.query.skip),
                 sort
             }
         }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id,owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth,async (req, res) => {
    try {
        const task = await Task.findAndDelete({_id:req.params.id,owner:req.user._id})

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports=router