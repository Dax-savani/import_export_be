const express = require('express');
const productRouter = express.Router();
const Product = require('../model/product');
const { uploadFile } = require('../services/uploadFile');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


productRouter.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
});


productRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
});


productRouter.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, subtitle, other_info, productCategory, isMainProduct } = req.body;
        const files = req.files;

        if (!files || !files.image) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const imageUrl = await uploadFile(files.image[0].buffer);
        const backgroundImageUrl = await uploadFile(files.backgroundImage[0].buffer);

        const newProduct = new Product({
            title,
            subtitle,
            other_info: JSON.parse(other_info),
            productCategory,
            image: imageUrl,
            backgroundImage: backgroundImageUrl,
            isMainProduct: isMainProduct || false,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
});



productRouter.put('/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, other_info, productCategory, isMainProduct } = req.body;
        const files = req.files;

        let updateData = {
            title,
            subtitle,
            other_info: JSON.parse(other_info),
            productCategory,
            isMainProduct,
        };
        if (files) {
            if (files.image && files.image.length > 0) {
                const imageUrl = await uploadFile(files.image[0].buffer);
                updateData.image = imageUrl;
            }

            if (files.backgroundImage && files.backgroundImage.length > 0) {
                const backgroundImageUrl = await uploadFile(files.backgroundImage[0].buffer);
                updateData.backgroundImage = backgroundImageUrl;
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
});



productRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
});

module.exports = productRouter;
