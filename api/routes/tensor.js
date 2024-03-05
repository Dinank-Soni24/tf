const express = require('express');
const multer = require('multer');
const upload = multer();

const router = express.Router();

const tensor = require('../controller/tensor');

router.post('/',upload.single('file'), tensor.tensorTest);
router.get('/iris', tensor.irisData);
router.post('/train', tensor.trainAgain);
router.post('/predict', tensor.predict);

module.exports = router;
