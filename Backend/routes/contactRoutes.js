
const express = require('express');
const router = express.Router();
const { submitForm } = require('../controllers/contactController');

router.post('/contact', submitForm);

module.exports = router;
