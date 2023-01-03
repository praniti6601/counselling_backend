const router=require('express').Router();
const studentController=require('../controller/studentController');
const ChoiceController=require('../controller/StudentChoiceController')
const InfoController=require('../controller/studentInfoController');

//Student Registration routes
router.post('/student/reg',studentController.studentregister);

//Student Registration routes
router.post('/student/login',studentController.studentlogin);

//Student add choice routes 
router.post('/student/add_choice',verify_student_Token,ChoiceController.studentChoice);

//student choice list
router.get('/student/choice_list',verify_student_Token,ChoiceController.fetchstudent_choice);


//student information for student dashboard
router.get('/student/student_info',verify_student_Token,studentController.fetchstudent);


//college list for student registration
router.get('/student/college_list',InfoController.allcollege);


//institute list for choice filling
router.get('/student/institute_list_choice',verify_student_Token,studentController.allinstitute);







//verify token
function verify_student_Token(req,res,next){
    
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