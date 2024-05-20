const express = require("express"); 
const router = express.Router(); 

//model 
const User = require("../../models/User");  
const Profile = require("../../models/Profile"); 

//auth 
const auth = require("../../middleware/auth"); 


//@route    POST api/profile
//@desc     Create or update profile.
//@access   private      
router.post("/", auth, async (req, res) => {

    const { 
        includeHoney,
        includeEggs, 
        includeMilk,
        includeCheese,
        includeYogart,
        includeButter,
        includeGeletin
    } = req.body; 

    const profileFields = {}; 
    profileFields.user = req.user.id; 
    if (includeHoney)   profileFields.includeHoney      = includeHoney; 
    if (includeEggs)    profileFields.includeEggs       = includeEggs; 
    if (includeGeletin) profileFields.includeGeletin    = includeGeletin; 

    profileFields.includeDairy = {}; 
    if (includeMilk)    profileFields.includeDairy.includeMilk      = includeMilk;
    if (includeCheese)  profileFields.includeDairy.includeCheese    = includeCheese;
    if (includeYogart)  profileFields.includeDairy.includeYogart    = includeYogart;
    if (includeButter)  profileFields.includeDairy.includeButter    = includeButter;

    try {
        let profile = await Profile.findOne({ user: req.user.id }); 

        //if a profile exists 
        if (profile) {
            //update profile 
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set : profileFields },
                { new : true }
            ); 
            return res.json(profile); 
        }

        //if profile doesn't exist 
        //create new profile
        profile = new Profile(profileFields); 
        await profile.save(); 
        return res.json(profile); 

    } catch(err) {
        console.log(err.message); 
        res.status(500).send("Server error"); 
    }
        
})


//@route    GET api/profile/me
//@desc     retieve profile 
//@access   private    
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user : req.user.id }).populate('user', ['firstName', 'lastName', 'email']); 
        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user"}); 
        }
        res.send(profile); 
    } catch(err) {
        console.log(err.message); 
        res.send(500).send("Server error"); 
    }
})


//@route    DELETE api/profile
//@desc     deleted profile
//@access   private   
router.delete("/", auth, async (req, res) => {
    try{
        //delete profile 
        await Profile.findOneAndDelete({ user : req.user.id }); 
        //delete user 
        await User.findByIdAndDelete({ _id : req.user.id }); 
        res.json({ msg : "User & Profile deleted" })
    } catch(err) {
        console.log(err.message); 
        res.status(500).send("Server error"); 
    }
}); 



module.exports = router; 