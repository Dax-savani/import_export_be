const express = require('express');
const sliderRouter = express.Router();
const Slider = require('../model/slider');
const { uploadFile } = require('../services/uploadFile');

sliderRouter.get('/', async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.status(200).json(sliders);
    } catch (error) {
        console.error('Error fetching sliders:', error.message);
        res.status(500).json({ message: 'Failed to fetch sliders', error: error.message });
    }
});

sliderRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const slider = await Slider.findById(id);

        if (!slider) {
            return res.status(404).json({ message: 'Slider not found' });
        }

        res.status(200).json(slider);
    } catch (error) {
        console.error('Error fetching slider:', error.message);
        res.status(500).json({ message: 'Failed to fetch slider', error: error.message });
    }
});

sliderRouter.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        const { file } = req;
        if (!file || !file.buffer) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const imageUrl = await uploadFile(file.buffer);

        const newSlider = new Slider({
            title,
            image: imageUrl,
        });

        const savedSlider = await newSlider.save();
        res.status(201).json(savedSlider);
    } catch (error) {
        console.error('Error creating slider:', error.message);
        res.status(500).json({ message: 'Failed to create slider', error: error.message });
    }
});

// @desc Update a slider by ID
// @route PUT /slider/:id
sliderRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const { file } = req;

        let updateData = { title };

        if (file && file.buffer) {
            const imageUrl = await uploadFile(file.buffer);
            updateData.image = imageUrl;
        }

        const updatedSlider = await Slider.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedSlider) {
            return res.status(404).json({ message: 'Slider not found' });
        }

        res.status(200).json(updatedSlider);
    } catch (error) {
        console.error('Error updating slider:', error.message);
        res.status(500).json({ message: 'Failed to update slider', error: error.message });
    }
});

sliderRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSlider = await Slider.findByIdAndDelete(id);

        if (!deletedSlider) {
            return res.status(404).json({ message: 'Slider not found' });
        }

        res.status(200).json({ message: 'Slider deleted successfully' });
    } catch (error) {
        console.error('Error deleting slider:', error.message);
        res.status(500).json({ message: 'Failed to delete slider', error: error.message });
    }
});

module.exports = sliderRouter;
