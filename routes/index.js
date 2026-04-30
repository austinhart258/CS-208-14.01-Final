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
  const limit = 10;
  const offset = (pageNum - 1) * limit;

  req.db.query( 
    'SELECT * FROM todos ORDER BY id DESC LIMIT ? OFFSET ?', 
    [limit, offset], 
    (err, results) => {
      if (err) {
        return res.render('index', { 
          page: 'comments', 
          todos: [], 
          error: "Server is currently unavailable. Please try again later."
        });
      }

      res.render('index', {
        title: 'Comments',
        page: 'comments',
        currentPage: pageNum,
        todos: results.map((r, i) => {
          let parsed;

          // TRY TO PARSE NEW COMMENTS
          if (typeof r.task === "string" && r.task.trim().startsWith("{")) {
            try {
              parsed = JSON.parse(r.task);
            } catch {
              parsed = null;
            }
          }

          // FALLBACK
          if (!parsed || !parsed.time) {
            parsed = {
              text: r.task,
              // OLDER TIMESTAMPS
              time: Date.now() - (i * 3600000)
            };
          }

          const diff = Math.floor((Date.now() - parsed.time) / 1000);

          let timeAgo;

          if (diff < 60) {
            timeAgo = `${diff} second${diff !== 1 ? 's' : ''} ago`;
          } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
          } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
          } else {
            const days = Math.floor(diff / 86400);
            timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
          }

          return {
            ...r,
            task: parsed.text,
            formattedTime: timeAgo
          };
        }),
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
  const timestamp = Date.now();

  // store both text + time together
  const stored = JSON.stringify({
    text: clean,
    time: timestamp
  });

  /* INSERT TASK + TIME */
  req.db.query(
    'INSERT INTO todos (task) VALUES (?)',
    [stored],
    (err) => {
      if (err) {
        console.error(err);
        return reloadComments();
      }
      res.redirect('/comments');
    }
  );
});

/* DELETE COMMENT */
router.post('/delete-comment', function (req, res) {
  const { id } = req.body;

  try {
    req.db.query(
      'DELETE FROM todos WHERE id = ?;',
      [id],
      (err, results) => {
        if (err) {
          console.error('Error deleting comment:', err);
          return res.status(500).send('Error deleting comment');
        }

        console.log('Comment deleted:', results);

        // REDIRECT TO COMMENTS
        res.redirect('/comments');
      }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Error deleting comment');
  }
});

module.exports = router;