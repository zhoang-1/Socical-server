const express = require('express');
const { connectDB } = require('./src/config/db.js');
const {PORT} = require('./src/utils/config.js')

const userProfile = require('./src/routes/userRouter.js')
const userPost = require('./src/routes/user_post.js')
const friendship = require('./src/routes/friend_ship.js')
connectDB();
const app = express(); 

app.use(express.json())
app.use('/profile', userProfile);
app.use('/userpost', userPost);
app.use('/friendship', friendship);
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));