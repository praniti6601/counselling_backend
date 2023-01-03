const ChoiceReg = require('../model/addChoice')

const secretKey = "Student_login_fynd"
//jwt require
const jwt = require('jsonwebtoken');

//choice add function

const studentChoice = async (req, res) => {


    try {
        //verify jwt token
        var stuid;
        jwt.verify(req.token, secretKey, (err, authData) => {
            if (err) {
                res.status(404).json({ 'errmsg': 'Invalid token !' })
            } else {

                //store  suif in object
                stuid = authData.login_data.id;

            }
        })
        //save data into database
        const choice_details = new ChoiceReg({
            stu_id: stuid,
            choice: req.body,
        });

        const ins_details = await choice_details.save();
        res.json({ status: true });

    }
    catch (err) {
        res.status(400).send({ 'errmsg': err });
    }
}


//student choice list

const fetchstudent_choice =async (req,res)=>{
    try {
      
//verify jwt token
jwt.verify(req.token,secretKey,async (err,authData)=>{
    if(err){
        res.status(404).json({'errmsg':'Invalid token !'}) 
    }else{
 //fetch daata from database

 const student_info=await ChoiceReg.find({stu_id:authData.login_data.id})
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
  

//export choice module

module.exports = {
    studentChoice,
    fetchstudent_choice
}