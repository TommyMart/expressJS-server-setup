const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController')
const authMiddleware = require('../authMiddleware');

// authMiddleware adds user data to request from token
router.post('/:targetUserId/follow', authMiddleware, followController.follow);
router.delete('/:targetUserId/unfollow', authMiddleware, followController.unfollow);
router.get('/:targetUserId/status', authMiddleware, followController.getFollowData);

module.exports = router;