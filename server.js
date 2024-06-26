const express = require("express"); 
const app = express(); 
const connectDB = require("./config/db"); 

const PORT = process.env.PORT || 3000;

//init middleware
app.use(express.json({ extended : false })); 

//define routes
app.use('/api/users',       require("./routes/api/users"    )); 
app.use('/api/auth',        require("./routes/api/auth"     )); 
app.use('/api/profile',     require("./routes/api/profile"  )); 
app.use('/api/analyze',     require("./routes/api/analyze"  )); 


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); 

connectDB(); 