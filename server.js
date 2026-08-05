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
 
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(DB);
    isConnected = true;
    console.log('DB connection successful! 😍 🪢');
  } catch (err) {
    console.error('DB connection error 💥:', err);
  }
};

// Middleware يضمن عدم تنفيذ أي Route إلا بعد تمام الاتصال بالداتابيز
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// mongoose
//   .connect(DB)
//   .then(() => {
//     console.log('DB connection successful! 😍 🪢');
//   });

// 4) Start server
// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

let server;
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
}

// unhandledRejection error  => فانكشن بتهندل الايرور اللي بتيجي من السيستم نفسه يعني مثلا حصل مشكله في connect moongoDB
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  }
});

module.exports=app