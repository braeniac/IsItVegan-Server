const { default: mongoose } = require("mongoose");

const ProfileSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    includeHoney:  {
        type: Boolean, 
        required: true,
        default: false
    },
    includeEggs: {
        type: Boolean, 
        required: true,
        default: false
    },
    includeDairy: {
        type: Boolean, 
        required: true,
        default: false
    },
    includeGeletin: {
        type: Boolean, 
        required: true,
        default: false
    }
})

module.exports = Profile = mongoose.model("profile", ProfileSchema); 