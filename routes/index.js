const express = require('express');
const router = express.Router();


const contactRoutes = require('../controllers/contact');
const sliderRoutes = require('../controllers/slider');
const testimonialRoutes = require('../controllers/testimonial');
const productsRoutes = require('../controllers/product');
const categoriesRoutes = require('../controllers/category');

router.use('/contacts', contactRoutes);
router.use('/slider', sliderRoutes);
router.use('/testimonial', testimonialRoutes);
router.use('/product', productsRoutes);
router.use('/category', categoriesRoutes);

module.exports = router;
