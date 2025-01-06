const mongoose = require('mongoose');


const testimonialSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});


const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
