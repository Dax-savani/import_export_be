const express = require('express');
const router = express.Router();

const contactRoutes = require('../controllers/contact');

router.use('/contacts', contactRoutes);

module.exports = router;
