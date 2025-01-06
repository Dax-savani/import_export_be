const express = require('express');
const testimonialRouter = express.Router();
const Testimonial = require('../model/testimonial');
const { uploadFile } = require('../services/uploadFile');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});



testimonialRouter.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error.message);
        res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
    }
});



testimonialRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);

        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        res.status(200).json(testimonial);
    } catch (error) {
        console.error('Error fetching testimonial:', error.message);
        res.status(500).json({ message: 'Failed to fetch testimonial', error: error.message });
    }
});



testimonialRouter.post('/',upload.single('image'), async (req, res) => {
    try {
        const { name, role, description } = req.body;
        const { file } = req;

        if (!file || !file.buffer) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const imageUrl = await uploadFile(file.buffer);

        const newTestimonial = new Testimonial({
            image: imageUrl,
            name,
            role,
            description,
        });

        const savedTestimonial = await newTestimonial.save();
        res.status(201).json(savedTestimonial);
    } catch (error) {
        console.error('Error creating testimonial:', error.message);
        res.status(500).json({ message: 'Failed to create testimonial', error: error.message });
    }
});



testimonialRouter.put('/:id',upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, description } = req.body;
        const { file } = req;

        let updateData = { name, role, description };

        if (file && file.buffer) {
            const imageUrl = await uploadFile(file.buffer);
            updateData.image = imageUrl;
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedTestimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        res.status(200).json(updatedTestimonial);
    } catch (error) {
        console.error('Error updating testimonial:', error.message);
        res.status(500).json({ message: 'Failed to update testimonial', error: error.message });
    }
});



testimonialRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

        if (!deletedTestimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error('Error deleting testimonial:', error.message);
        res.status(500).json({ message: 'Failed to delete testimonial', error: error.message });
    }
});

module.exports = testimonialRouter;
