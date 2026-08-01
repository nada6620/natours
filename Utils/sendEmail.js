const Nodemailer = require("nodemailer");
const pug = require('pug')
const htmlToText = require('html-to-text');
const { MailtrapTransport } = require('mailtrap');

module.exports = class Email {

  constructor(user,url){
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url=url;
    this.from = `Nada Ayman <${process.env.EMAIL_FROM}>`
  }

  // 1- transport Object
  newTransport(){

    if(process.env.NODE_ENV === 'production'){
      // sendgrid
      return Nodemailer.createTransport({
        service:'SendGrid',
        auth:{
          user:process.env.SENDGRID_USERNAME,
          pass:process.env.SENDGRID_PASSWORD
        }
      })
    }

   return Nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN,
    sandbox: true,
    testInboxId: 4757669,  
  }));

  }

  // send the actual email

  async send (template,subject){

    // 1- render HTML based on a pug template
   const html = pug.renderFile(
  `${__dirname}/../views/email/${template}.pug`,
  {
    firstName: this.firstName,
    url: this.url,
    subject
  }
);

 

    // 2- email option

    const mailOptions ={
      from : this.from,
      to: this.to,
      subject,
      html ,
      text:htmlToText.convert(html)
       };

       // 3- create a transport and send email
       await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(){
    await this.send('welcome','Welcome to the Natours Family!')
  }

 async sendPasswordReset(){
  await this.send('passwordReset',
    'Your password reset token ( valid for only 10 minutes)')
 }


}



// const { MailtrapTransport } = require("mailtrap");

// const TOKEN =  process.env.MAILTRAP_TOKEN; 

// const transport = Nodemailer.createTransport(
//   MailtrapTransport({
//     token: TOKEN,
//     sandbox: true,
//     testInboxId: 4757669,  
//   })
// );

 
// const sendEmail = (toEmail, subject, text) => {
//   const sender = {
//     address: "hello@example.com",
//     name: "Mailtrap Test",
//   };

 
//   return transport.sendMail({
//     from: sender,
//     to: [toEmail],  
//     subject: subject,
//     text: text,
//     category: "Integration Test",
//   });
// };

 
// module.exports = { sendEmail };