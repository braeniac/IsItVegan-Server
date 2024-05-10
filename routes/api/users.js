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

//model 
const User = require("../../models/User");  


//@route    POST api/users
//@desc     register user
//@access   public      
router.post(
    "/",  
    [
        check("firstName", "First name is required")
        .not()
        .isEmpty(),
        check("lastName", "Last name is required")
        .not()
        .isEmpty(),
        check("email", "Please include a valid email")
        .isEmail(),
        check('password')
        .isLength({ min: 6, max: 20})
        .withMessage('Password must be between 6 and 20 characters')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),
    ],
    async (req, res) => {

        //errors
        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors : errors.array() })
        }

        const {firstName, lastName, email, password} = req.body; 

        try {

            // see if user exists
            let user = await User.findOne({ email }); 
            
            if (user) {
                return res.status(400).json({ errors : [{ msg : 'User already exists' }]}); 
            }


            //build new user 
            user = new User({
                firstName,
                lastName, 
                email, 
                password
            })

            // encrypt password 
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            
            //save new user to db
            //create new user 
            await user.save(); 

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


//@route    GET api/users
//@desc     register user
//@access   public    
router.get("/", (req, res) => {
   

    




})



module.exports = router; 