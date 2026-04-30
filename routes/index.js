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
  const pageNum = parseInt(req.query.p) || 1;
  const limit = 5;
  const offset = (pageNum - 1) * limit;

  req.db.query(
    'SELECT * FROM todos ORDER BY id DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, results) => {
      if (err) return res.render('index', { page: 'comments', todos: [], error: "Server is currently unavailable. Please try again later."});

      res.render('index', {
        title: 'Comments',
        page: 'comments',
        todos: results.map((r, i) => ({
          ...r,
          // simulate timestamp based on order
          formattedTime: new Date(Date.now() - i * 60000).toLocaleString()
        })),
        currentPage: pageNum
      });
    }
  );
});

router.post('/add-comment', function (req, res) {
  let { task } = req.body;

  /* MAKE SURE TODO EXISTS FOR ERROR HANDLING */
  const reloadComments = () => {
    req.db.query('SELECT * FROM todos ORDER BY id DESC', (err, results) => {
      res.render('index', {
        title: 'Comments',
        page: 'comments',
        todos: results || [],
        error: "Something went wrong"
      });
    });
};

  /* VALIDATION */
  if (!task || task.trim() === '') {
    return reloadComments();
  }

  if (task.length > 300) {
    return reloadComments();
  }

  const clean = task.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* INSERT TASK */
  req.db.query(
    'INSERT INTO todos (task) VALUES (?)',
    [clean],
    (err) => {
      if (err) {
        console.error(err);
        return reloadComments();
      }
      res.redirect('/comments');
    }
  );
});

module.exports = router;