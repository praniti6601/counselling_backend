const router=require('express').Router();
const adminController=require('../controller/adminController');
const infoController=require('../controller/studentInfoController')
const CounsellingCon=require('../controller/CounsellingController')

//Admin Registration routes
router.post('/admin/reg',adminController.adminregister);

//admin login
router.post('/admin/login',adminController.adminlogin);

//add institutes
router.post('/admin/add_ins',verifyToken,adminController.addins);

//update student status
router.put('/admin/update_status/:id',verifyToken,adminController.verify_student);


//students count eg. verified,registered
router.get('/admin/student_count',verifyToken,infoController.students_count);



//not verified student info 
router.get('/admin/notallot_student/',verifyToken,infoController.notallotedstudents);


//verifed student list for counselling
router.get('/admin/verified_student',verifyToken,CounsellingCon.verifiedstudents);



//student status list after counselling
router.get('/admin/student_final_data',verifyToken,CounsellingCon.students_final_data);


//verify token
function verifyToken(req,res,next){
    
    const BearerHeader=req.headers['authorization'];
   
    if(typeof BearerHeader !=='undefined'){
        const Bearer=BearerHeader.split(" ");
        const token=Bearer[1];
        // console.log(token)
        req.token=token;
        next();
    }else{
        res.json({"error":"Invalid token !"});
    }
}


//export router
module.exports=router;