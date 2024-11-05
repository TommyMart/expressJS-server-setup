const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// router.get('/:postId/getComments', postController.getComments);
// router.post('/:postId/postComment', postController.newComment);
router.delete('/:postId/delete', authMiddleware, postController.deletePost);
router.post('/post', authMiddleware, postController.postNewPost);
router.get('/getPosts', authMiddleware, postController.getPosts);
router.patch('/:postId/editPost', authMiddleware, postController.editPost);


module.exports = router;