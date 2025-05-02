
const Contact = require('../models/Contact');

exports.submitForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();
    res.status(200).json({ message: 'Message submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit message' });
  }
};
