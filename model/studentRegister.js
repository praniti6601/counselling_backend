const mongoose=require('mongoose');

//student register model
const StudentSchema=new mongoose.Schema({
   name:String,
   fathers_name:{ type: String, required: true},
   org_id:{ type: String, required: true},
   email:{ type: String, required: true, unique: true},
   password:{ type: String, required: true},
   rollno:{ type: Number, required: true},
   rank:{ type: Number, required: true},
   marks:{ type: Number, required: true},
   categ:{ type: String, required: true},
   dob:{ type: String, required: true},
   mobile:{ type: Number, required: true},
   status: { type: Number, default: 0},
   alloted_college_id:{ type: String, default:''},
   alloted_college_name:{ type: String, default:''},
   alloted_category:{ type: String, default:''},
   branch_id:{ type: String, default:''},
});

// Export student Schema
module.exports=mongoose.model("student_reg",StudentSchema);