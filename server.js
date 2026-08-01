const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

// handle UNCAUGHT EXCEPTION! => هيهندل الايرور اللي مش مسكاهم ب try , catch
// هنااول ما هتلاقي ايرور في مكان هتطلع event اسمه uncaughtException وبعدين تبدا تنفذ الفانكشن
process.on('uncaughtException',err=>{
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name,err.message)
  // close program 
  process.exit(1);
}) 


const DB = process.env.MONGODB_URI.replace('<db_password>', process.env.MONGODB_PASSWORD);
 

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!😍 🪢');
  })


const server=app.listen(3000, () => {
  console.log('app running on port 3000');
});

// unhandledRejection error  => فانكشن بتهندل الايرور اللي بتيجي من السيستم نفسه يعني مثلا حصل مشكله في connect moongoDB
process.on('unhandledRejection',err=>{
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name,err.message);
  // server.close => عشان لو عندي اكتر من يوزر كانو بيعملو ريكوست في نفس الوقت اللي السيستم وقع فيه فعشان ميخسرهمش 
  // متستقبلش Requests جديدة، لكن خلص الـ Requests الحالية الأول.
  server.close(()=>{
    process.exit(1);
  })
})
