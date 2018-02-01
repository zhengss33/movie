const mongoose = require('mongoose');
const CommentSchema = require('../schemas/comment');
const Comment = mongoose.model('Comments', CommentSchema);

module.exports = Comment;
