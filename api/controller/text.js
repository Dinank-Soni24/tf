const toxicity = require('@tensorflow-models/toxicity');
const qna = require('@tensorflow-models/qna');
const tf = require('@tensorflow/tfjs-node');
const pdfParser = require('pdf-parse');
const natural = require('natural');

// Set TensorFlow.js backend
tf.setBackend('tensorflow');

const textCheck = async (req, res) => {
  const { text } = req.body;
  const toxicityModel = await toxicity.load(0.9);
  const results = await toxicityModel.classify(text);
  res.json(results);
};

const qnaCheck = async (req, res) => {
  try {
    // Assuming req.body contains the PDF file as base64 data
    const pdfBuffer = req.file.buffer;
    const text = req.body.text;

    // Convert the PDF buffer data to a string
    const pdfText = await pdfParser(pdfBuffer);
    const pdfString = pdfText.text;

    const qnaModel = await qna.load();
    const results = await qnaModel.findAnswers(text, pdfString);

    res.json({
      results,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: 'error',
    });
  }
};

const similarity = async (req, res) => {
  try {
    const word1 = 'apple';
    const word2 = 'hyvapp';

    // Check for similarity using Jaro-Winkler distance
    const similarity = natural.JaroWinklerDistance(word1, word2);
    console.log('Jaro-Winkler similarity:', similarity);

    res.json({
      similarity,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: 'error',
    });
  }
};

module.exports = {
  textCheck,
  qnaCheck,
  similarity,
};
