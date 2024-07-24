import taskModel from "../../../DB/models/Task.model.js";
import userModel from "../../../DB/models/User.model.js";
import fs from 'fs'
import path from "path"

// 1-add task with status (toDo)(user must be logged in)
export const addtask = async (req, res,next) => {
    const { title, description,deadline } = req.body
    const {_id} = req.user;
    const userexist = await userModel.findById({_id})
    if(! userexist){
        return next(new Error ('user not found'))
                }
                const task = await taskModel.create({title,description,status: 'toDo', deadline,userID : req.user._id});
                  const add = await userModel.findByIdAndUpdate({_id}, {
                    $push: { tasks : task._id },
                });
                return res.json({msg:"task added successfully ",task})
  }

                          
//2-update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = async (req, res,next) => {
            const {_id} = req.params
            const userID = req.user._id;
            const assignto = req.assignToUser._id
            const { title, description, status } = req.body;
        const task = await taskModel.findById({_id})
        // console.log(taskid);
        // console.log(assignto);
        // console.log(task.userID);  
        // console.log(userID);
        if(!task){
            return next(new Error ('task not found'))
        }
         const assignedUser = await userModel.findById(assignto);
        if (!assignedUser) {

      return next(new Error ('Assigned user not found' ))
        }

        if (task.userID.equals(userID)){
          const updatetask = await taskModel.updateOne({_id},{ title, description, status, assignTo:req.assignToUser._id })
          return res.json({msg:"task updated successfully"})
        
                }
                return next(new Error ('you are not the owner of the task' ))
            }

//3-delete task(user must be logged in) (creator only can delete task)
export const deleteTask = async (req, res,next) => {
        const {_id} = req.params
        const userID = req.user._id;
    const task = await taskModel.findById({_id} )  
    if(!task){
        return next(new Error ('task not found'))
    }
    if (task.userID.equals(userID)){
                const findtask = await taskModel.findById({_id})
                if (findtask.attachments && findtask.attachments.length > 0) {
                  for (const attachments of findtask.attachments) {
                      if (fs.existsSync(path.resolve(`src/${attachments}`))) {
                          fs.unlinkSync(path.resolve(`src/${attachments}`));
                      }
                  }
              }
              const deletetask = await taskModel.deleteOne({_id})
                const pull = await userModel.findByIdAndUpdate(userID, {
                  $pull: { tasks : task._id }
              });

                return res.json({msg:"task deleted successfully"})
            }
            return next(new Error ('you are not the owner of the task' ))
    }

// 4-get all tasks with user data
export const tasksWuser= async (req, res) => {
    const tasks = await taskModel.find().populate('userID', 'userName email');
    return res.json({ msg: 'Done', tasks });
 
};

//5-get tasks of oneUser with user data (user must be logged in)
export const getTasksOfUser = async (req, res, next) => {

     const userID = req.user._id;

      const user = await userModel.findById(userID).populate('tasks', 'title description status deadline');
      if (!user) {
        return next(new Error ('User not found' ))
      }
      return res.json({ msg: 'Tasks retrieved successfully', user });
    }

// // 6-get all tasks that not done after deadline
export const incompletetasks = async (req, res,next) => {
    const currentDate = new Date();
//console.log(currentDate);
    const tasks = await taskModel.find({
      status: { $ne: 'done' },
      deadline: { $lt: currentDate },
    });

    return res.json({ msg: 'Done', tasks });
  }

//upload attachment to task

export const uploadattachmen = async (req, res,next) => {
  const attachments = []
  const {_id} = req.params
  const userID = req.user._id;
  req.files.forEach(element =>{
    attachments.push(element.finaldest)
      })
    const task = await taskModel.findById({_id} )  
    if(!task){
        return next(new Error ('task not found'))
    };
    if (task.userID.equals(userID)){
      const task = await taskModel.findByIdAndUpdate({_id},{$set : { attachments:attachments}},{new:true})
       return res.json({ message: 'Attachment uploaded successfully', task });
  }
  return next(new Error ('you are not the owner of the task' ))
};



