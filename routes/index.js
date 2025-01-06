const express = require('express');
const router = express.Router();
const upload = require('../services/multerConfig');

const contactRoutes = require('../controllers/contact');
const sliderRoutes = require('../controllers/slider');

router.use('/contacts', contactRoutes);
router.use('/slider',upload.single('image'), sliderRoutes);

module.exports = router;
