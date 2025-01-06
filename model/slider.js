const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Create the Slider model
const Slider = mongoose.model('Slider', sliderSchema);

module.exports = Slider;
