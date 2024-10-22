const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')

// router.get('/:postId/getComments', postController.getComments);
// router.post('/:postId/postComment', postController.newComment);
router.delete('/:postId/delete', postController.deletePost);
router.post('/post', postController.postNewPost);
router.get('/getPosts', postController.getPosts);
router.patch('/:postId/editPost', postController.editPost);


module.exports = router;