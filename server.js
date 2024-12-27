const express = require('express');
const cors = require('cors')
const { connectDB } = require('./src/config/db.js');
const {PORT} = require('./src/utils/config.js')

const auth = require('./src/routes/auth.js')
const userProfile = require('./src/routes/userRouter.js')
const userPost = require('./src/routes/user_post.js')
const friendship = require('./src/routes/friend_ship.js')

connectDB();

const app = express(); 
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // allow subdomains
  })
);

app.use('/api/auth', auth);
app.use('/api/profile', userProfile);
app.use('/api/userpost', userPost);
app.use('/api/friendship', friendship);
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));