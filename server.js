const express = require('express');
const cors = require('cors')
const path = require('path');
const { connectDB } = require('./src/config/db.js');
const {PORT} = require('./src/utils/config.js')

const auth = require('./src/routes/auth.js')
const userProfile = require('./src/routes/userRouter.js')
const userPost = require('./src/routes/user_post.js')
const friendship = require('./src/routes/friend_ship.js')
const interaction = require('./src/routes/component/post-interaction.js')
connectDB();

const app = express(); 
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // allow subdomains
    allowedHeaders: ['Content-Type', 'Authorization'], // Thêm các header được phép
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Thêm các phương thức được phép
  })
);

app.use('/api/auth', auth);
app.use('/api/profile', userProfile);
app.use('/api/userpost', userPost);
app.use('/api/userpost', interaction);
app.use('/api/friendship', friendship);
// Tạo endpoint tĩnh để truy cập file đã upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));