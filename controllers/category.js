const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../services/uploadFile');
const Category = require('../model/category');

const categoryRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fetch all categories
categoryRouter.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
});

// Fetch a single category by ID
categoryRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error.message);
        res.status(500).json({ message: 'Failed to fetch category', error: error.message });
    }
});

// Create a new category
categoryRouter.post('/', upload.fields([{ name: 'image' }, { name: 'backgroundImage' }]), async (req, res) => {
    try {
        const { name, isMainProduct } = req.body;
        const files = req.files;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        if (!files || !files.image || !files.image[0].buffer) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        if (isMainProduct === 'true' && (!files.backgroundImage || !files.backgroundImage[0].buffer)) {
            return res.status(400).json({ message: 'Background image is required when isMainProduct is true' });
        }

        const imageUrl = await uploadFile(files.image[0].buffer);
        const backgroundImageUrl = isMainProduct === 'true' ? await uploadFile(files.backgroundImage[0].buffer) : null;

        const newCategory = new Category({
            name,
            image: imageUrl,
            backgroundImage: backgroundImageUrl,
            isMainProduct: isMainProduct === 'true',
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error.message);
        res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
});

// Update a category by ID
categoryRouter.put('/:id', upload.fields([{ name: 'image' }, { name: 'backgroundImage' }]), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, isMainProduct } = req.body;
        const files = req.files;

        let updateData = { name, isMainProduct: isMainProduct === 'true' };

        if (files && files.image && files.image[0].buffer) {
            const imageUrl = await uploadFile(files.image[0].buffer);
            updateData.image = imageUrl;
        }

        if (isMainProduct === 'true' && (!files.backgroundImage || !files.backgroundImage[0].buffer)) {
            return res.status(400).json({ message: 'Background image is required when isMainProduct is true' });
        }

        if (files && files.backgroundImage && files.backgroundImage[0].buffer) {
            const backgroundImageUrl = await uploadFile(files.backgroundImage[0].buffer);
            updateData.backgroundImage = backgroundImageUrl;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error.message);
        res.status(500).json({ message: 'Failed to update category', error: error.message });
    }
});

// Delete a category by ID
categoryRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error.message);
        res.status(500).json({ message: 'Failed to delete category', error: error.message });
    }
});

module.exports = categoryRouter;
