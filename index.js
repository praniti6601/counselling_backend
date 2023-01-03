const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');

//server port
const PORT=process.env.PORT || 4040

//require routes
const adminroutes=require('./routes/adminroute')
const studentroutes=require('./routes/studentroutes')

const application=express();

//Middleware
application.use(cors());
application.use(express.json());


//admin middleware
application.use('/api',adminroutes);

//student middleware
application.use('/student_api',studentroutes);







//database connection
dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log('successfully connected with database !');
})
.catch((error)=>{
    console.log('Error occured : '+error);
})






application.listen(PORT,()=>{
console.log('Server is connected successfully on port '+PORT)
})