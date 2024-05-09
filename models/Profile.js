const { default: mongoose } = require("mongoose");

const ProfileSchema  = new mongoose.Schema({
    user: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    includeHoney:  
    {
        type: Boolean, 
        required: true,
        default: false
    },
    includeEggs: 
    {
        type: Boolean, 
        required: true,
        default: false
    },
    includeDairy: 
    {
        includeMilk: 
        {
            type: Boolean, 
            required: true,
            default: false
        },
        includeCheese: 
        {
            type: Boolean, 
            required: true,
            default: false
        },
        includeYogart: 
        {
            type: Boolean, 
            required: true,
            default: false
        },
        includeButter: 
        {
            type: Boolean, 
            required: true,
            default: false
        }
    },
    includeGeletin: 
    {
        type: Boolean, 
        required: true,
        default: false
    }
})

module.exports = Profile = mongoose.model("profile", ProfileSchema); 



