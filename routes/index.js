const express = require('express');
const router = express.Router();
const upload = require('../services/multerConfig');

const contactRoutes = require('../controllers/contact');
const sliderRoutes = require('../controllers/slider');
const testimonialRoutes = require('../controllers/testimonial');

router.use('/contacts', contactRoutes);
router.use('/slider',upload.single('image'), sliderRoutes);
router.use('/client',upload.single('image'), testimonialRoutes);

module.exports = router;
