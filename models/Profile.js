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
        default: false
    },
    includeEggs: 
    {
        type: Boolean, 
        default: false
    },
    includeDairy: 
    {
        includeMilk: 
        {
            type: Boolean, 
            default: false
        },
        includeCheese: 
        {
            type: Boolean, 
            default: false
        },
        includeYogart: 
        {
            type: Boolean, 
            default: false
        },
        includeButter: 
        {
            type: Boolean, 
            default: false
        }
    },
    includeGeletin: 
    {
        type: Boolean, 
        default: false
    }, 
})

module.exports = Profile = mongoose.model("profile", ProfileSchema); 



