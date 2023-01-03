const mongoose=require('mongoose');

//student register model
const AddinsSchema=new mongoose.Schema({
   name:String,
   org_id:String,
   branchs:String,
   seatmatrix:[{"GEN":Number,"OBC":Number,"SC":Number,"ST":Number}]
});

// Export student Schema
module.exports=mongoose.model("ins_list",AddinsSchema);