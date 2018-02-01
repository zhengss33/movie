const Comment = require('../models/comment');

exports.save = function(req, res) {
  const _comment = req.body.comment;
  const cId = _comment.cid;
  const movieId = _comment.movie;

  if (cId) {
    Comment.findById(cId, (err, comment) => {
      if (err) {
        console.log(err);
      } else {
        comment.reply.push({
          from: _comment.from,
          to: _comment.tid,
          content: _comment.content,
        });
        comment.save((err, comment) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect(`/movie/${movieId}`);
          }
        });
      }
    });
  } else {
    const comment = new Comment(_comment);
    comment.save((err, comment) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/movie/${movieId}`);
      }
    });
  }
}
