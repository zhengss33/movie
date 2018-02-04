const Category = require('../models/category');
const Movie = require('../models/movie');

exports.result = function(req, res) {
  const { p, tag, name } = req.query;
  const page = parseInt(p, 10) || 1;
  const COUNT = 6;
  const index = 0 + (COUNT * (page - 1));
  console.log(p, tag, name);

  if (tag) {
    Category
      .findOne({ name: tag })
      .populate({ path: 'movies', select: 'title poster'})
      .exec((err, category) => {
        if (err) {
          return console.log(err);
        }

        const totalPage = Math.ceil(category.movies.length / COUNT);
        const movies = category.movies.slice(index, index + COUNT);
        res.render('result', {
          title: category.name,
          curPage: page,
          tag: category.name,
          movies,
          totalPage,
        });
      });
  } else if (name) {
    Movie
      .find({ title: new RegExp(name, "i") })
      .exec((err, _movies) => {
        if (err) {
          return console.log(err);
        }

        const totalPage = Math.ceil(_movies.length / COUNT);
        const movies = _movies.slice(index, index + COUNT);

        res.render('result', {
          title: '搜索结果页',
          curPage: page,
          movies,
          totalPage,
        });
      });
  }
}
