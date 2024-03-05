const tf = require('@tensorflow/tfjs-node');

const predictModel = async (model, input) => {
  try {
    const example = tf.tensor2d(input);

    const prediction = model.predict(example);

    // // Print predictions
    // prediction.array().then((array) => {
    //   array.forEach((probabilities, exampleIndex) => {

    //   });
    // });

    const result = await prediction.array();
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = predictModel;
