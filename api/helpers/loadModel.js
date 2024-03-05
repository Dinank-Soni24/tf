const path = require('path');
const tf = require('@tensorflow/tfjs');

const loadModel = async (name) => {
  try {
    const modelPath = path.join(
      __dirname,
      '..',
      '..',
      'ml-models',
      `${name}`,
      'model.json'
    );
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log(model.summary());
    return model;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = loadModel;
