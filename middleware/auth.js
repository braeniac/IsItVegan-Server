const jwt = require("jsonwebtoken"); 
const config = require("config");

module.exports = function (req, res, next) {

    // get token from the header 
    const token = req.header("x-auth-token");

    //auth denied 
    if (!token) {
        return res.status(401).json({ msg : "No token, authorization denied!"});
    }
    
    //verify token
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        req.user = decoded.user; 
        next(); 
    } catch(err) {
        console.log(err.message); 
        res.status(401).json({ msg : "Token is not valid!" })
    }

}