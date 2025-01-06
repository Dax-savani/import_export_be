const express = require('express');
const contactRouter = express.Router();
const Contact = require('../model/contact');

contactRouter.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error.message);
        res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
    }
});

contactRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error.message);
        res.status(500).json({ message: 'Failed to fetch contact', error: error.message });
    }
});

contactRouter.post('/', async (req, res) => {
    try {
        const { name, email, contact, comments } = req.body;

        // Validate required fields
        if (!name || !email || !contact) {
            return res.status(400).json({ message: 'Name, email, and contact are required' });
        }

        const newContact = new Contact({ name, email, contact, comments });
        const savedContact = await newContact.save();

        res.status(201).json(savedContact);
    } catch (error) {
        console.error('Error creating contact:', error.message);
        res.status(500).json({ message: 'Failed to create contact', error: error.message });
    }
});

contactRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, contact, comments } = req.body;

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { name, email, contact, comments },
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        console.error('Error updating contact:', error.message);
        res.status(500).json({ message: 'Failed to update contact', error: error.message });
    }
});

contactRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error.message);
        res.status(500).json({ message: 'Failed to delete contact', error: error.message });
    }
});

module.exports = contactRouter;
