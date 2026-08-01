const mongoose = require('mongoose');
const validator =require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const userSchema = new mongoose.Schema ({
    name:{
        type:String,
        required:[true,'A User must has a name'],
        trim: true,
        maxlength:[40,'A user name must has less or equal 40 character ']
    },
    email:{
        type:String,
        required:[true,'A User must has an email'],
        unique:[true,'A user must has a unique email'],
        lowercase: true,
        validate:[validator.isEmail,'Please provid a valid email']
    },
    photo: {
        type:String,
        default:'default.jpg'
    },
    role:{
        type:String,
        enum: ['user', 'admin', 'guide', 'lead-guid'],
        default:'user'
    }
    ,
    password:{
        type:String,
        required:[true,'A user must has a password'],
        minlength:8,
        // validate:{
        //     validator:function(value){
        //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)
        //     },
        //     message: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number'
        //     },
        //? never show automatically when get all users
        select:false
        },
    passwordConfirm:{
        type:String,
        required:[true,'Repeat the password plz'],
        // Only work with Save and Create
        validate:{
            validator:function(value){
                return this.password===value;
            },
            message:'passwords are not the same'
        }
    } ,
    passwordChangedAt:Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }


})

userSchema.pre('save', async function(next){
// check if password is modified or new , ( this = document)
if(!this.isModified('password')) return  ;

// hased password and add salt Rounds on it (salt is the string added on password before it hased)
this.password=await bcrypt.hash(this.password,12);

// delete passwordConfirm from DB , it just exist for validation and check
this.passwordConfirm=undefined;
 

})

userSchema.pre(/^find/,function(){
    this.find({active:{$ne:false}})
})


userSchema.pre('save',async function(){
    if(!this.isModified('password')||this.isNew) return 

        this.passwordChangedAt = Date.now()-1000;
        
})



// create an instance method 
// instance method : is a function that add on user schema 
// so every user(document) is created has this method , can access this method 

userSchema.methods.correctPassword = async function (Password,userPasswordDB){
    return await bcrypt.compare(Password,userPasswordDB); // return true or false
}

// check if password is changed after the token is created
// not changed = false , changed = true
userSchema.methods.changedPasswordAfter= function(jwtTime) {
    if(this.passwordChangedAt){
        // getTime()=> return time with ms but iat (jwt time) is s so we divided by 1000
        const timeStamp =(this.passwordChangedAt.getTime())/1000;
       
        return jwtTime<timeStamp
    }
    return false
}

userSchema.methods.createPasswordResetToken= function(){
    // generate reset token 
    const resetToken = crypto.randomBytes(32).toString('hex');
    // hashed reset token , save in DB
    this.passwordResetToken =crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken},this.passwordResetToken);

    // expired after 10 min =>(ms)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;

}

const User =mongoose.model('User',userSchema)

module.exports= User;