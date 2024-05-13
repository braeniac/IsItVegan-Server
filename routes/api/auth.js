const express = require("express"); 
const router = express.Router(); 
//validation 
const { check, validationResult } = require('express-validator');
//bcrypt 
const bcrypt = require('bcryptjs');
//jwt
const jwt = require('jsonwebtoken'); 
const config = require('config'); 
const jwtSecret = config.get('jwtSecret'); 

//middleware 
const auth = require("../../middleware/auth"); 

//model 
const User = require("../../models/User");  

//@route    GET api/auth
//@desc     get user 
//@access   protected    
router.get("/", auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select('-password'); 
        res.json(user); 

    } catch(err) {
        return res.status(500).send("Server error!"); 
    }

})

//@route    POST api/auth
//@desc     Authenticate user/get existing user token
//@access   public      
router.post(
    "/",  
    [
        check("email", "Please include a valid email")
        .isEmail(),
        check("password", "Password is required")
        .exists()   
    ],
    async (req, res) => {

        //errors
        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors : errors.array() })
        }

        const {email, password} = req.body; 

        try {

            // see if user exists
            let user = await User.findOne({ email }); 
            
            //user doesn't exist 
            if (!user) {
                return res.status(400).json({ errors : [{ msg : 'Sorry, invalid credentials' }]}); 
            }


            //we found user 
            //does password match
            const isMatch = await bcrypt.compare(password, user.password); 

            //if password doesn't match 
            if (!isMatch) {
                return res.status(400).json({ errors : [{ msg : 'Sorry, invalid credentials' }]}); 
            }

            //payload
            const payload = {
                user : {
                    id : user.id
                }
            }

            //return jsonwebtoken
            //automatically sign in upon creation 
            jwt.sign(
                payload,
                jwtSecret,
                { expiresIn : 36000 },
                (err, token) => {
                    if (err) throw err; 
                    res.json({ token })
                }
            )
        
        } catch(err) {
            console.error(err.message); 
            res.status(500).send("Server error!"); 
        }
        
    }

)

module.exports = router; 