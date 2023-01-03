const StudentReg=require('../model/studentRegister')
const InsReg = require('../model/addinstitute');
const ChoiceModel = require('../model/addChoice');
const mongoose=require('mongoose');


const secretKey="Pragya_Fynd_Project"
//jwt require
const jwt=require('jsonwebtoken');


//student information fetch for counselling 
const verifiedstudents =async (req,res)=>{
    try {
//verify jwt token
jwt.verify(req.token,secretKey,async (err,authData)=>{
    if(err){
        res.status(404).json({'errmsg':'Invalid token !'}) 
    }else{

//  console.log(authData)
const orgid=authData.login_data.id;
const student_info=await StudentReg.find({status:1,org_id:orgid},{password:0}).sort({rank:0});
if(student_info.length!=0){
//verified students eligible for counselling
 for(let i=0; i<student_info.length; i++){
const category=student_info[i].categ;
const stuid=student_info[i]._id;



//select choice of student
const student_choice=await ChoiceModel.find({stu_id:stuid},{choice:1,_id:0});
if(student_choice.length!=0){

//store choice for sort preference wise;
 const choicedata=student_choice[0].choice;

 choicedata.sort((a,b) => a.choice_no - b.choice_no); //sort 
 
    for(let j=0; j<choicedata.length; j++){

       
       //select institute for seat matrix
       const ins_seat=await InsReg.find({_id:choicedata[j].ins_id},{seatmatrix:1,_id:0});
       const seat_data=ins_seat[0].seatmatrix;
         //dynamic select category
       var select_category='seat_data[0].'+category;
       select_category=eval(select_category)
     
       
       //first all students allot in general category if seat available
       if(seat_data[0].GEN>0){
        
    //update student status and institute which is allot
        await StudentReg.findByIdAndUpdate({ _id:stuid }, {alloted_college_id: choicedata[j].ins_id,alloted_college_name: choicedata[j].name,branch_id:choicedata[j].branchs,alloted_category:"GEN",status:2});
        //update seat after allotment
       await InsReg.updateOne({_id:mongoose.Types.ObjectId(choicedata[j].ins_id),"seatmatrix.GEN":seat_data[0].GEN},{$set:{"seatmatrix.$.GEN":seat_data[0].GEN-1}})
      
        break;

       }else if(select_category>0){

         //update student status and institute which is allot
         await StudentReg.findByIdAndUpdate({ _id:stuid }, {alloted_college_id: choicedata[j].ins_id,alloted_college_name: choicedata[j].name,branch_id:choicedata[j].branchs,alloted_category:category,status:2});
        
        //filter query
         const category_query = {
            _id:mongoose.Types.ObjectId(choicedata[j].ins_id)
         };
      //dynamically assign key of object for filter
         let seatcategory="seatmatrix."+category;
         category_query[seatcategory]=select_category

      //update query
      const update_query = {};
      let updatekey="seatmatrix.$."+category;
      update_query[updatekey]=select_category-1;

      //update seat after allotment
        await InsReg.updateOne(category_query,{$set:update_query})
     //stop loop
         break;
       }else if(j==choicedata.length-1 && select_category==0){

    //update student status if not allot any college
    await StudentReg.findByIdAndUpdate({ _id:stuid }, {status:3});
       }
      
    }
  

}

}
//response for successfully allotment
  res.status(200).json({update_status:true});

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
  

  

//counselling status data of students
const students_final_data =async (req,res)=>{
    try {
//verify jwt token
jwt.verify(req.token,secretKey,async (err,authData)=>{
    if(err){
        res.status(404).json({'errmsg':'Invalid token !'}) 
    }else{
 //save data into database
//  console.log(authData)
const orgid=authData.login_data.id;
const student_info=await StudentReg.find({status:2,org_id:orgid},{password:0}).sort({rank:0})
const notallot_info=await StudentReg.find({status:3,org_id:orgid},{password:0}).sort({rank:0})
if(student_info.length!=0){
    res.status(200).json({list1:student_info,list2:notallot_info});
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
 verifiedstudents,
 students_final_data
}