const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/:postId/getComments', authMiddleware, commentsController.getComments);
router.post('/:postId/newComment', authMiddleware, commentsController.newComment);
router.patch('/:commentId/edit', authMiddleware, commentsController.editComment);
router.delete('/:commentId/delete', authMiddleware, commentsController.deleteComment);

module.exports = router;