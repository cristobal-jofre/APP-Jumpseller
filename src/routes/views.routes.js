const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.render('<h1>hello world</h1>')
});

exports.router = router;