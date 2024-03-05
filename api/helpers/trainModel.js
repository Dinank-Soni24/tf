/**
 * Asynchronously trains the model using the provided inputs and labels for the specified number of epochs.
 *
 * @param {Object} model - The model to be trained
 * @param {Array} inputs - The input data for training
 * @param {Array} labels - The corresponding labels for the input data
 * @param {number} epochs - The number of epochs for training
 * @return {Promise<boolean>} A promise that resolves to true if training is successful, otherwise false
 */

const saveModel = require('./saveModel');

const trainModel = async (model, inputs, labels, epochs, name) => {
  try {
    await model.fit(inputs, labels, {
      epochs,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(
            `Epoch ${epoch + 1} - loss: ${logs.loss.toFixed(
              4
            )}, accuracy: ${logs.acc.toFixed(4)}`
          );
        },
      },
    });

    await saveModel(model, name);
    return model;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = trainModel;
