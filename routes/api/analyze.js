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
//@desc     analyze list of ingredients 
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

        //list of ingredients to ignore
        let profile = await Profile.findOne({ user : req.user.id }); 
        const ignoreIngredients = []; 
        if (profile.includeDairy.includeMilk)   ignoreIngredients.push("milk");
        if (profile.includeDairy.includeCheese) ignoreIngredients.push("cheese");
        if (profile.includeDairy.includeYogart) ignoreIngredients.push("yogart");
        if (profile.includeDairy.includeButter) ignoreIngredients.push("butter");
        if (profile.includeHoney)               ignoreIngredients.push("honey");
        if (profile.includeEggs)                ignoreIngredients.push("eggs");
        if (profile.includeGeletin)             ignoreIngredients.push("gelatin");

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
                             Ignore the presence of the following ingredients: ${ignoreIngredients.join(", ")}
                             If it is vegan, return "true". 
                             If it is not vegan, return "false". Here are the ingredients: ${ingredeints}.`
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

        res.send(response.choices[0].message.content.trim()); 

    } catch(err) {
        console.log(err.message); 
        res.status(500).send("Server error"); 
    }

})

module.exports = router; 


