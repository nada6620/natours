const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const fs = require('fs')
const DB = process.env.MONGODB_URI.replace('<db_password>', process.env.MONGODB_PASSWORD);
 const tourSchema= require('../../Models/touerModel')
 const reviewSchema = require('../../Models/reviewModel');
 const userSchema =require('../../Models/userModel');

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!😍 🪢');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });


  // we make a script to import the json data into DataBase

  // 1- read data from json file 

  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
  const users = JSON.parse(fs.readFileSync(`${__dirname}/user.json`,'utf-8'));
  const reviews = JSON.parse(fs.readFileSync(`${__dirname}/review.json`,'utf-8'));



  // 2- Import data into DB

  const importData=async()=>{
    try{
        await tourSchema.create(tours)
        await userSchema.create(users,{validateBeforeSave:false})
        await reviewSchema.create(reviews);

        console.log('Data successfully loaded!');
        // أنا خلصت المهمة اللي اتشغلت عشانها( انه ضاف الداتا في الداتا بيز )، اقفل البرنامج الآن.
        process.exit();
    }catch(err){
        console.log(err.message)
    }
    
  }

  // delete current Data From DB

  const deleteData=async()=>{
    try{
         await tourSchema.deleteMany();
         await userSchema.deleteMany();
         await reviewSchema.deleteMany();

         console.log('Data successfully deleted!')
         process.exit();
    }catch(err){
    console.log(err.message);
    }
   

  }
  // to exexcute function 
  // 1- we execute server with => node dev-data/data/import-dev-data.js --import
  // in process.argv array we find 👇🏻 
//  [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'D:\\nodeJs\\Nada\\Natours\\dev-data\\data\\import-dev-data.js',
//   '--import'
// ] then we execute function by process.argv array

if(process.argv[2]==='--import'){
    importData()
}else if(process.argv[2]==='--delete'){
    deleteData();
}

