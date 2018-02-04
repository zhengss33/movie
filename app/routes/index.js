const Movie = require('../models/movie');
const Category = require('../models/category');

// index
exports.index = function(req, res) {
  Category
    .find({})
    .populate({ path: 'movies', options: { limit: 6 }})
    .exec((err, categories) => {
      if (err) {
        console.log(err);
      } else {
        res.render('index', {
          title: '电影首页',
          categories,
        });
      }
    });
}
