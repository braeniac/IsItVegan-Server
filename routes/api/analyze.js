const express = require("express"); 
const router = express.Router();
//auth 
const auth = require("../../middleware/auth"); 
//config
const config = require("config"); 
// Set the environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS = config.get('googleApplicationCredentials');
//google vision cloud api - ocr 
const vision = require('@google-cloud/vision');
//openAI 
const OpenAI = require("openai");

//image upload 
const multer  = require('multer'); 
const fs = require("fs");


const storage = multer.diskStorage({
    destination: function(_, _, cb) {
        return cb(null, "./public/images"); 
    },
    filename: function(_, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

//multer middleware
const upload = multer({ storage : storage })

//@route    POST api/analyze
//@desc     
//@access   private      
router.post("/", auth, upload.single("image"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ msg : "No file uploaded!" }); 
    }

    try { 
        const filepath = req.file.path;
        
        //use google vloud vision api for ocr 
        const client = new vision.ImageAnnotatorClient();

        const [result] = await client.textDetection(filepath); 
        const detections = result.textAnnotations;

        //set of characters to exclude
        const excludeChars = new Set(":[,]%().-1234567890");
        //create ingredients array with response text
        let ingredeints = detections.map(text => text.description).filter((char) => !excludeChars.has(char)).join(); 


        //send ingredeints to chatgpt for analysis
        const openAI = new OpenAI({
            apiKey: config.get("openAPI_Key")
        })
        
        const response = await openAI.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "user", 
                    content:`I have a list of ingredients, and I need to know if the product is vegan-friendly. 
                            If it is vegan, return "true". 
                            If it is not vegan, return "false". Here are the ingredients: ${ingredients}.`
                }
            ],
        });

        //delete file once processing is done.
        fs.unlink(filepath, (err) => {
            if (err) {
                console.log(err); 
                return res.status(500).json({ msg : "Failed to delete file" })
            }
            console.log('File deleted successfully');
        })

        res.send(response)

    } catch(err) {
        console.log(err.message); 
        res.status(500).send("Server error"); 
    }

})

module.exports = router; 