var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Downtown Donuts', page: 'home' });
});

/* MENU */
router.get('/menu', function(req, res) {
  res.render('index', { title: 'Menu', page: 'menu' });
});

/* ABOUT */
router.get('/about', function(req, res) {
  res.render('index', { title: 'About', page: 'about' });
});

/* COMMENTS */
router.get('/comments', function(req, res) {
  req.db.query('SELECT * FROM todos ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).send("DB error");

    res.render('index', {
      title: 'Comments',
      page: 'comments',
      todos: results
    });
  });
});

module.exports = router;