import mongoose, { Schema } from "mongoose";

const lineItem = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 0
  },
});

const QuotationSchema = new Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  
  
  rfp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFP",
    required:true,
  },
  
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  
  quotevalue: {
    type: [lineItem],
    default: [],
  },
  
  // Quotation status
  status: {
    type: String,
    enum: ["quoted", "accepted", "rejected", "clarification_needed", "pending"],
    default: "quoted",
  },
  
  // Additional quotation details
  deliveryTimeline: {
    type: String,
  },
  
  gstDetails: {
    type: String,
  },
  
  termsAndConditions: {
    type: String,
  },
  
  remarks: {
    type: String,
  },
  
  validityPeriod: {
    type: String,
  },
  
  vendorResponse: {
    type: String,
  },
  
  // Metadata
  extractedAt: {
    type: Date,
    default: Date.now,
  },
  
  sourceEmail: {
    from: String,
    subject: String,
    receivedAt: Date,
  },
  
}, {
  timestamps: true, 
});


QuotationSchema.pre("save", function () {
  if (this.quotevalue && this.quotevalue.length > 0) {
    
    this.quotevalue.forEach(item => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      item.total = qty * price;
    });
    
    this.amount = this.quotevalue.reduce((sum, item) => {
      return sum + item.total;
    }, 0);
  } else {
    this.amount = 0;
  }
 
});

// Pre-update hook to calculate amount
QuotationSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.quotevalue) {
    // Calculate total for each line item
    update.quotevalue.forEach(item => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      item.total = qty * price;
    });
    
    // Calculate overall amount
    const newAmount = update.quotevalue.reduce((sum, item) => {
      return sum + item.total;
    }, 0);

    this.set({ amount: newAmount });
  }
});

// Index for faster queries
QuotationSchema.index({ vendor: 1, rfp: 1 });
QuotationSchema.index({ status: 1 });
QuotationSchema.index({ createdAt: -1 });

const Quotation = mongoose.model("quotation", QuotationSchema);
export default Quotation;