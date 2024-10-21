const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')

router.get('/:postId/getComments', postController.getComments);
router.post('/:postId/postComment', postController.newComment);


module.exports = router;