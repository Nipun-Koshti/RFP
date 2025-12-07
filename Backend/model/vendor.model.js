import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    street:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    }
})

const supplierSchema = new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    }
})

const vendorSchema = new Schema({
    vendorName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    gst:{
        type:String,
        required:true,
        unique:true,
    },

    personal:{
        type:[supplierSchema]
    },

    address:{
        type: addressSchema ,
        required:true,
    }
},{timestamps:true})

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor 



/*
Test payload

{
  "vendorName": "SolarTech Solutions",
  "email": "contact@solartech.com",
  "phone": "9876543210",
  "gst": "123456789012",
  
  "personal": [
    {
      "name": "Ramesh Sharma",
      "email": "ramesh@solartech.com",
      "phone": "9876501122"
    },
    {
      "name": "Priya Mehta",
      "email": "priya@solartech.com",
      "phone": "9998801122"
    }
  ],

  "address": {
    "street": "12 Green Energy Road",
    "city": "Jaipur",
    "state": "Rajasthan"
  }
}

*/