const express = require ('express');
const {gethomepage} = require('../controllers/user_profile.js')
const router = express.Router();

router.get('/v1', gethomepage);
module.exports = router;