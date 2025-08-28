const mongoose = require("mongoose")

const bannerSchema = mongoose.Schema({
    bannerUrl : {
        type:String,
        required: true
    },
    bannerAlt:{
        type:String,
        required:true
    }

},{timestamps:true})

module.exports = mongoose.model("Banner", bannerSchema)