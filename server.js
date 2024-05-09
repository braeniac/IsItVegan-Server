const express = require("express"); 
const app = express(); 
const connectDB = require("./config/db"); 

const PORT = process.env.PORT || 3000;

//init middleware
app.use(express.json({ extended : false })); 

//define routes
app.use('/api/users', require("./routes/api/users")); 


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); 

connectDB(); 