const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.send('landing');
});

router.use(require('./auth'));
router.use(require('./openplaylist'));
router.use(require('./user'));

module.exports = router;
