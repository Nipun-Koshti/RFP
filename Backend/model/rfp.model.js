import mongoose, { Schema } from "mongoose";


const vendorQuoteSchema = new Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  quotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quotation",
    default:null
  }
});


const itemSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
    },
    unitPrice:{
        type:String,
    }
})


const RfpSchema = new Schema({
    subject:{
        type:String,
        required:true,
    },
    budget:{
        type:Number,
        required:true,
        default:0,
    },
    billingAddress:{
        type:String,
        required:true,
    },
    delivery:{
        type:Date,
        required:true,
    },
    vendors:{
        type:[vendorQuoteSchema],
    },
    lineItem:{
        type:[itemSchema],

    },
    remark:{
        type:String,
    },
    status:{
        type:String,
        enum: ["Pending","Cancelled","Quoted","Submitted"],
        default:"Submitted",
    }


},{timestamps:true});

const RfpModel = mongoose.model("Rfp",RfpSchema);;

export default RfpModel 