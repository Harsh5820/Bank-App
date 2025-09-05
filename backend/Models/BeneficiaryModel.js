const mongoose = require("mongoose");

const beneficiarySchema = mongoose.Schema(
  {
    beneficiaryName: {
      type: String,
      required: true,
    },
    beneficiaryAccountNumber: {
      type: Number,
      length: 9,
      required: true,
    },
    beneficiaryPhoneNumber: {
      type: Number,
      required: true,
    },
    beneficiaryNickName: {
      type: String,
    },
    beneficiaryTransactionLimit:{
      type:Number,
    },
    beneficiaryStatus:{
      type:String,
      enum:["Approved", "Rejected", "Pending for Approval"],
      default:"Pending for Approval"
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
