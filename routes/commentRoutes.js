const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');


router.get('/:postId/getComments', commentsController.getComments);
router.post('/:postId/newComment', commentsController.newComment);
router.patch('/:commentId/edit', commentsController.editComment);
router.delete('/:commentId/delete', commentsController.deleteComment);

module.exports = router;