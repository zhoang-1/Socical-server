const express = require('express');
const { connectDB } = require('./src/config/db.js');
const {PORT} = require('./src/utils/config.js')

const userProfile = require('./src/routes/user_profile.js')

connectDB();
const app = express(); 



app.use('/profile', userProfile);
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));