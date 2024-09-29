const express = require('express');
const {PORT , configViewEngine} = require('./src/config/viewEngine.js')
const userProfile = require('./src/routes/user_profile.js')

const app = express();

configViewEngine(app);

app.use('/profile', userProfile);
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));