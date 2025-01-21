const express = require('express');
const productRouter = express.Router();
const Product = require('../model/product');
const multer = require('multer');
const { uploadFile } = require('../services/uploadFile');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        let filter = {};
        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter).populate('category');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
});


productRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
});


productRouter.post(
    '/',
    upload.array('image', 10),
    async (req, res) => {
        try {
            const { title, subtitle, other_info, category } = req.body;
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'At least one image is required' });
            }

            const imageUrls = await Promise.all(
                files.map(file => uploadFile(file.buffer))
            );

            const newProduct = new Product({
                title,
                subtitle,
                other_info: JSON.parse(other_info),
                category,
                image: imageUrls,
            });

            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            console.error('Error creating product:', error.message);
            res.status(500).json({ message: 'Failed to create product', error: error.message });
        }
    }
);



productRouter.put(
    '/:id',
    upload.array('image', 10),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title, subtitle, other_info, category } = req.body;
            const files = req.files;

            const parsedOtherInfo = other_info ? JSON.parse(other_info) : undefined;

            let uploadedImages = [];

            if (req.body.image) {
                if (Array.isArray(req.body.image)) {
                    uploadedImages = [...req.body.image];
                } else {
                    uploadedImages.push(req.body.image);
                }
            }

            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (files && files.length > 0) {
                for (const file of files) {
                    if (file.path && file.path.startsWith("http")) {
                        uploadedImages.push(file.path);
                    } else if (file.buffer) {
                        const url = await uploadFile(file.buffer);
                        if (url) {
                            uploadedImages.push(url);
                        }
                    } else {
                        console.warn("File structure not as expected:", file);
                    }
                }
            }

            const imagesToUpdate = uploadedImages.length > 0 ? uploadedImages : existingProduct.image;

            const updateData = {
                title,
                subtitle,
                other_info: parsedOtherInfo || existingProduct.other_info,
                category,
                image: imagesToUpdate,
            };

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
    }
);



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
