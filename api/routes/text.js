const express = require('express');
const multer = require('multer');
const upload = multer();

const router = express.Router();

const text = require('../controller/text');

router.post('/', text.textCheck);

router.post('/qna',upload.single('pdfData') , text.qnaCheck);

router.get('/similarity', text.similarity);

module.exports = router;
