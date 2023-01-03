const StudentReg = require('../model/studentRegister');
const ChoiceModel = require('../model/addChoice');
const AdminReg = require('../model/adminRegister');
const secretKey="Pragya_Fynd_Project"
//jwt require
const jwt=require('jsonwebtoken');


//student count fetch for admin dashboard
const students_count =async (req,res)=>{
    try {

        //verify jwt token
        jwt.verify(req.token,secretKey,async (err,authData)=>{
            if(err){
                res.status(404).json({'errmsg':'Invalid token !'}) 
            }else{
         //save data into database
        //  console.log(authData)
        const orgid=authData.login_data.id;
         const Reg_student_count=await StudentReg.find({org_id:orgid}).count();
        const Verify_student_count=await StudentReg.find({status:{$gte:1}}).count();
        const alloted_count=await StudentReg.find({status:{$eq:2}}).count();

            res.status(200).json({reg_student:Reg_student_count,verify:Verify_student_count,allotment:alloted_count})
       
     
            }
        })
  }
    catch(error){
        res.status(400).json({'errmsg':error})
    }
  }
  



//student information fetch for verification 
const notallotedstudents =async (req,res)=>{
    try {
//verify jwt token
jwt.verify(req.token,secretKey,async (err,authData)=>{
    if(err){
        res.status(404).json({'errmsg':'Invalid token !'}) 
    }else{
 //save data into database
//  console.log(authData)
const orgid=authData.login_data.id;
const student_info=await StudentReg.find({status:0,org_id:orgid},{password:0}).sort({rank:0}).limit(100)
if(student_info.length!=0){
    res.status(200).json(student_info)
}else{
    res.status(404).json({'errmsg':false})
}
    }
}) 
    }
    catch(error){
        res.status(400).json({'errmsg':error})
    }
  }
  
  

//get college list for student registration 
const allcollege =async (req,res)=>{
    try {
        const college_info=await AdminReg.find({},{_id:1,ins_name:1}).sort({ins_name:0})
        if(college_info.length!=0){
            res.status(200).json(college_info)
        }else{
            res.status(404).json({'errmsg':false})
        }
       
    }
    catch(error){
        res.status(400).json({'errmsg':error})
    }
  }
  





//export admin mopdule

module.exports={
    students_count,
    notallotedstudents,
    allcollege,
}