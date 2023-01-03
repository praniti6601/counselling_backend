const AdminReg = require('../model/adminRegister');
const StuReg=require('../model/studentRegister')
const InsReg = require('../model/addinstitute');
const secretKey="Pragya_Fynd_Project"

//hashing module for password
const bcrypt=require("bcrypt");
//jwt require
const jwt=require('jsonwebtoken');

//Admin registration functions
const adminregister = async (req, res) => {

    //hashing password
    const pass=await bcrypt.hash(req.body.password,10);
    const register_data = new AdminReg({
        ins_name: req.body.name,
        email: req.body.email,
        password: pass,
        
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



//admin login function

const adminlogin =async (req,res)=>{
    try {

        
        const admindetails=await AdminReg.find({email:req.body.email});
        if(admindetails.length!=0){
            //token data
            const login_data={email:req.body.email,id:admindetails[0]._id};
           
          
           
           
        

                       //verify password
            const verify_pass=await bcrypt.compare(req.body.pass,admindetails[0].password);
            if(verify_pass){
                //token generate
                jwt.sign({login_data},secretKey,{expiresIn:'8600s'},(err,token)=>{
                    res.status(200).json({'token':token,'data':admindetails})
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







//add institute controller......................................................

const addins = (req, res) => {
  
    const ins_data = new InsReg({
        name: req.body.name,
        branchs: req.body.branch,
        seatmatrix:req.body.seatmatrix,
        
    });


   try{
//verify jwt token
    jwt.verify(req.token,secretKey,async (err,authData)=>{
        if(err){
            res.status(404).json({'errmsg':'Invalid token !'}) 
        }else{
     //save data into database
     //store  org_id in object
     ins_data.org_id=authData.login_data.id;
     const ins_details=await ins_data.save();
     res.json({status:true});
 
        }
    })
   
   }
   catch(err){
    res.status(400).send({'errmsg':err});
   }
}



//verify student and update status..............................................

const verify_student = (req, res) => {
    try {


//verify jwt token
jwt.verify(req.token,secretKey,async (err,authData)=>{
    if(err){
        res.status(404).json({'errmsg':'Invalid token !'}) 
    }else{
        const student_data = {
            status: req.body.status,
        };
    
        await StuReg.findByIdAndUpdate({ _id: req.params.id }, student_data);
        res.json({query_status:true});

    }
})

        
      } catch (error) {
        res.json({ message: error });
      }
}


//export admin mopdule

module.exports={
    adminregister,
    adminlogin,
    addins,
    verify_student,
}