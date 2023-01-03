const mongoose=require('mongoose');

//admin register model
const AdminSchema=new mongoose.Schema({
   ins_name:String,
   email:{ type: String, required: true, unique: true},
   password:String,
});

// Export Admin Schema
module.exports=mongoose.model("admin_reg",AdminSchema);