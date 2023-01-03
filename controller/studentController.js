const StudentReg = require('../model/studentRegister');
const Institute_model = require('../model/addinstitute');

const secretKey="Student_login_fynd"

//hashing module for password
const bcrypt=require("bcrypt");

//jwt require
const jwt=require('jsonwebtoken');

//Student registration functions
const studentregister = async (req, res) => {
     //hashing password
     const pass=await bcrypt.hash(req.body.password,10);
    const register_data = new StudentReg({
        name: req.body.name,
        email: req.body.email,
        password: pass,
        fathers_name:req.body.fathers_name,
        org_id:req.body.orgid,
        rollno:req.body.rollno,
        rank:req.body.rank,
        marks:req.body.marks,
        categ:req.body.categ,
        dob:req.body.dob,
        mobile:req.body.mobile,
    });


   try{
    //save data into database
    const postdetails=await register_data.save();
    
    res.json(postdetails);
    
   }
   catch(err){
    res.status(400).send({'errmsg':err});
   }
}


//student login.........................................................................
const studentlogin =async (req,res)=>{
    try {

       
        const studentdetails=await StudentReg.find({email:req.body.email});
        if(studentdetails.length!=0){
 //store id in token
            const login_data={email:req.body.email,id:studentdetails[0]._id,orgid:studentdetails[0].org_id};
          
           
            const verify_pass=await bcrypt.compare(req.body.pass,studentdetails[0].password);
            //token generate
            if(verify_pass){
                //token generate
                jwt.sign({login_data},secretKey,{expiresIn:'8600s'},(err,token)=>{
                    res.status(200).json({'token':token,'data':studentdetails})
                  })
       

            }else{
                res.status(404).json({'errmsg':'Password Not Matched!'})
            }


            
        }else{
            res.status(404).json({'errmsg':'User not found!'})
        }
       
    }
    catch(error){
        res.status(400).json({'errmsg':error})
    }
}



//student information fetch for student dashboard

const fetchstudent =async (req,res)=>{
    try {

//verify jwt token
jwt.verify(req.token,secretKey,async (err,authData)=>{
    if(err){
        res.status(404).json({'errmsg':'Invalid token !'}) 
    }else{
 //fetch daata from database
 
 const student_info=await StudentReg.find({_id:authData.login_data.id})
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
  
  
  
//get institution list for choice filling

const allinstitute = (req,res)=>{
    try {
//verify jwt token
jwt.verify(req.token,secretKey,async (err,authData)=>{
    if(err){
        res.status(404).json({'errmsg':'Invalid token !'}) 
    }else{
 //fetch daata from database
 const orgid=authData.login_data.orgid;
 const ins_details=await Institute_model.find({org_id:orgid},{org_id:0,seatmatrix:0}).sort({name:0})
        if(ins_details.length!=0){
            res.status(200).json(ins_details)
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
  

//export admin mopdule

module.exports={
   studentregister,
   studentlogin,
   fetchstudent,
   allinstitute
  
}