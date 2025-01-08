const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Image is required'],
        },
        backgroundImage: {
            type: String,
            required: false
        },
        isMainProduct: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
