const Category = require('../models/category');

exports.new = function(req, res) {
  res.render('category', {
    title: '电影分类 录入页',
    category: {},
  });
}

exports.save = function(req, res) {
  const _category = req.body.category;
  const category = new Category(_category);

  category.save((err, categories) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin/category/list');
    }
  });
}

exports.list = function(req, res) {
  Category.fetch((err, categories) => {
    if (err) {
      console.log(err);
    } else {
      res.render('categories', {
        title: '电影分类列表',
        categories,
      });
    }
  });
}
