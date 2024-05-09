const express = require("express"); 
const router = express.Router(); 

//model 
const User = require("../../models/User");  
const Profile = require("../../models/Profile"); 


//@route    POST api/profile
//@desc     update profile 
//@access   private      
router.post("/", (req, res) => {
    console.log("post profile")
})


//@route    GET api/profile
//@desc     retrieve profile information
//@access   private    
router.get("/", (req, res) => {


})



module.exports = router; 