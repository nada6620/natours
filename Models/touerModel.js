const mongoose =require('mongoose')
const slugify =require('slugify')
// const userSchema = require('./userModel')
const tourSchema = new mongoose.Schema ({
    name: {
        type:String,
        required:[true,"A tour must have a name"],
        unique:true,
        tirm:true,
        maxlength:[40,'A tour must have less or equal 40 character ']
    },
    slug: String,
    duration:{
        type:Number,
        required:[true,"Tour must have a duration"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:'String',
        require:[true,'A tour must have a difficulty'],
        enum:{
          values:  ['easy','difficult','medium'],
          message:'Difficulty is either : easy , medium , difficult '
        }
    }
    ,
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0'],
        set:val => Math.round(val*10)/10

    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"A tour must have price"]
    },
    priceDiscond:Number,
    summary:{
        type:String,
        trim:true ,// remove the beging and end space
        required:[true,'A tour must have a description']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String , // because this is the name of image in DB
        required:[true,'A tour must have a cover image']
    },
    images:[String], // array of string 
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startLocation:{
        type:{
            type:String,
            default:"Point",
            enum:["Point"]
        },
         coordinates:[Number],
         description:String,
         address:String
    },
    locations: [
        {
            type:{
            type:String,
            default:"Point",
            enum:["Point"]
        },
         coordinates:[Number],
         description:String,
         address:String,
          day: Number
        }
    ],
    guides:[{
        type:mongoose.Schema.ObjectId,
        ref : "User"
    }]
    ,
    secretTour:{
        type:Boolean,
        default:false
    }
    ,
    startDates:[
        {
            date: Date,
            participants:{
                type:Number,
                default:0
            },
            soldOut:{
                type:Boolean,
                default:false
            }
        }
    ] // because the tour might have more than one start Date , so we will stor in an array
},  
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
)

// index
tourSchema.index({price:1,ratingsAverage:-1});
tourSchema.index({slug:1});
tourSchema.index({startLocation:'2dsphere'});

// virtual property
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

// virtual populate 
tourSchema.virtual('Review',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})

// Document middelware 
tourSchema.pre('save',function(){
this.slug= slugify(this.name,{lower:true});
})

// tourSchema.pre('save', async function(){
//     const guidesPromises = this.guides.map( async id => await userSchema.findById(id) )
//     this.guides = await Promise.all(guidesPromises)
// })

tourSchema.post('save',function(doc){
    console.log(`Will save ${doc}`)
})

// Query middelware 
tourSchema.pre(/^find/,function(){
    this.find({secretTour:{$ne:true}})
    this.start = Date.now();
})

tourSchema.pre(/^find/,function(){
 this.populate({path:'guides',
      select:"-__v -passwordChangedAt"
    })
})

// tourSchema.post(/^find/, function(docs) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
// });


 
// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate',function(){
//     this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
//     console.log(this.pipeline());
// })
const Tour = mongoose.model('Tour',tourSchema);

module.exports=Tour;