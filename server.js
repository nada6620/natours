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
 

// // mongoose
// //   .connect(DB)
// //   .then(() => {
// //     console.log('DB connection successful!😍 🪢');
// //   })

// mongoose
//   .connect(DB)
//   .then(() => {
//     console.log("DB connected");
//     console.log(mongoose.connection.readyState);
//     console.log(mongoose.connection.host);
//     console.log(mongoose.connection.name);
//   })
//   .catch(err => {
//     console.error(err);
//   });
// console.log("NODE_ENV =", process.env.NODE_ENV);
// console.log("URI =", process.env.MONGODB_URI);
// console.log("Password exists =", !!process.env.MONGODB_PASSWORD); 

// mongoose.connection.on('connected', () => {
//   console.log('Connected');
// });

// mongoose.connection.on('error', err => {
//   console.log('Mongo Error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('Disconnected');
// });


// const port = process.env.PORT || 3000;

// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}`);
// });


(async () => {
  try {
    await mongoose.connect(DB);

    console.log('Connected!');
    console.log('readyState =', mongoose.connection.readyState);

    const app = require('./app');

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  } catch (err) {
  console.error('====== MONGOOSE ERROR ======');
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
}
})();

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


process.on('SIGTERM',()=>{
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
  server.close(()=>{
    console.log('💥 Process terminated!');
  })
})