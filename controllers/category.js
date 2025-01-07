const express = require('express');
const multer = require('multer');
const {uploadFile} = require('../services/uploadFile');
const Category = require('../model/category');

const categoryRouter = express.Router();


const storage = multer.memoryStorage();
const upload = multer({storage: storage});


categoryRouter.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({message: 'Failed to fetch categories', error: error.message});
    }
});


categoryRouter.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error.message);
        res.status(500).json({message: 'Failed to fetch category', error: error.message});
    }
});


categoryRouter.post('/', upload.single('image'), async (req, res) => {
    try {
        const {name} = req.body;
        const {file} = req;

        if (!name) {
            return res.status(400).json({message: 'Category name is required'});
        }

        if (!file || !file.buffer) {
            return res.status(400).json({message: 'Image file is required'});
        }

        const imageUrl = await uploadFile(file.buffer);

        const newCategory = new Category({
            name,
            image: imageUrl,
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error.message);
        res.status(500).json({message: 'Failed to create category', error: error.message});
    }
});


categoryRouter.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        const {file} = req;

        let updateData = {name};

        if (file && file.buffer) {
            const imageUrl = await uploadFile(file.buffer);
            updateData.image = imageUrl;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateData,
            {new: true, runValidators: true}
        );

        if (!updatedCategory) {
            return res.status(404).json({message: 'Category not found'});
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error.message);
        res.status(500).json({message: 'Failed to update category', error: error.message});
    }
});


categoryRouter.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({message: 'Category not found'});
        }

        res.status(200).json({message: 'Category deleted successfully'});
    } catch (error) {
        console.error('Error deleting category:', error.message);
        res.status(500).json({message: 'Failed to delete category', error: error.message});
    }
});

module.exports = categoryRouter;
