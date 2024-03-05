const tf = require('@tensorflow/tfjs-node');
const csv = require('csv-parser');
const streamify = require('streamify');
const fs = require('fs');
const shuffleSeed = require('shuffle-seed');
const saveModel = require('../helpers/saveModel');
const loadModel = require('../helpers/loadModel');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const trainModel = require('../helpers/trainModel');
const predictModel = require('../helpers/predictModel');
const env = require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const tensorTest = async (req, res) => {
  // console.log(req.file);

  // Assuming req.file contains the file buffer data
  // const fileBuffer = req.file.buffer;
  // // Split the filename by the period (.)
  // const parts = req.file.originalname.split('.');

  // let cld_upload_stream = cloudinary.uploader.upload_stream(
  //   {
  //     resource_type: 'raw',
  //     folder: 'csv',
  //     public_id: `${parts[0]}_${Date.now()}`,
  //   },
  //   function (error, result) {
  //     console.log(error, result);
  //   }
  // );
  // console.log(cld_upload_stream);
  // streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);

  // Assuming you have the URL of the uploaded CSV file
  const fileUrl =
    'https://res.cloudinary.com/dc7m9ahok/raw/upload/v1709542202/csv/IRIS_1709542200799';

  // You can use this URL to access the file in your application
  const data = await axios.get(fileUrl)

  console.log("dsffv",data.data)

  res.json({
    message: 'success',
  });
};

const irisData = async (req, res) => {
  const irisData = fs.readFileSync('./iris.data', 'utf8');

  // Split the contents into lines
  const irisLines = irisData.split('\n');

  // Parse each line and create objects representing iris flowers
  const irisObjects = irisLines.map((line) => {
    const values = line.trim().split(',');
    return {
      sepal_length: parseFloat(values[0]),
      sepal_width: parseFloat(values[1]),
      petal_length: parseFloat(values[2]),
      petal_width: parseFloat(values[3]),
      species: values[4],
    };
  });

  // Convert species labels to one-hot encoded arrays
  const data = irisObjects.map((item) => ({
    ...item,
    species:
      item.species === 'Iris-setosa'
        ? [1, 0, 0]
        : item.species === 'Iris-versicolor'
        ? [0, 1, 0]
        : [0, 0, 1],
  }));

  // Shuffle the data using a fixed seed for consistency
  const shuffledData = shuffleSeed.shuffle(data, 'seed');

  // Convert data to tensors
  const inputs = tf.tensor2d(
    shuffledData.map((item) => [
      item.sepal_length,
      item.sepal_width,
      item.petal_length,
      item.petal_width,
    ])
  );
  const labels = tf.tensor2d(shuffledData.map((item) => item.species));

  // Define the model architecture
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [4], units: 10, activation: 'relu' })
  );
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  // Train the model
  // async function trainModel() {
  //   await model.fit(inputs, labels, {
  //     epochs: 10,
  //     callbacks: {
  //       onEpochEnd: (epoch, logs) => {
  //         console.log(
  //           `Epoch ${epoch + 1} - loss: ${logs.loss.toFixed(
  //             4
  //           )}, accuracy: ${logs.acc.toFixed(4)}`
  //         );
  //       },
  //     },
  //   });
  //   // Save the model in the current directory
  //   await saveModel(model, 'iris_model');
  // }

  // Make predictions
  // async function predict(modelNew) {
  //   const example = tf.tensor2d([
  //     [6.2, 2.9, 4.3, 1.3], // Setosa
  //     [5.1, 3.5, 1.4, 0.2], // Versicolor
  //     [7.7, 3.0, 6.1, 2.3], // Virginica
  //   ]);

  //   const prediction = modelNew.predict(example);

  //   // Define the species labels
  //   const speciesLabels = ['Setosa', 'Versicolor', 'Virginica'];

  //   // Print predictions
  //   prediction.array().then((array) => {
  //     array.forEach((probabilities, exampleIndex) => {
  //       const maxProbabilityIndex = probabilities.indexOf(
  //         Math.max(...probabilities)
  //       );
  //       console.log(
  //         `Example ${exampleIndex + 1}: Predicted species is ${
  //           speciesLabels[maxProbabilityIndex]
  //         }`
  //       );
  //     });
  //   });
  // }
const inputData = [
      [6.2, 2.9, 4.3, 1.3], // Setosa
      [5.1, 3.5, 1.4, 0.2], // Versicolor
      [7.7, 3.0, 6.1, 2.3], // Virginica
    ]
  // // Train the model and make predictions
  // // trainModel().then(predict);
  // const modelPath = path.join(__dirname, 'iris_model', 'model.json');

  // const loadedModel = await tf.loadLayersModel(`file://${modelPath}`);
  // console.log(loadedModel.summary());

  // // Use the loaded model for predictions
  // const example = tf.tensor2d([
  //   [5.1, 3.5, 1.4, 0.2], // Setosa
  //   [6.2, 2.9, 4.3, 1.3], // Versicolor
  //   [7.7, 3.0, 6.1, 2.3], // Virginica
  // ]);

  // const prediction = loadedModel.predict(example);
  // prediction.print();
  // // Define the species labels
  // const speciesLabels = ['Setosa', 'Versicolor', 'Virginica'];

  // const result = [];
  // // Print predictions
  // await prediction.array().then((array) => {
  //   array.forEach((probabilities, exampleIndex) => {
  //     const maxProbabilityIndex = probabilities.indexOf(
  //       Math.max(...probabilities)
  //     );
  //     console.log(
  //       `Example ${exampleIndex + 1}: Predicted species is ${
  //         speciesLabels[maxProbabilityIndex]
  //       }`
  //     );
  //     result.push(speciesLabels[maxProbabilityIndex]);
  //   });
  // });
  modelNew = await trainModel(model, inputs, labels, 100, 'iris_model');
  const prediction = await predictModel(modelNew, inputData);

  res.json({
    result: prediction,
  });
};

const trainAgain = async (req, res) => {
  // Load the model
  const loadedModel = await loadModel('iris_model');
  // const modelPath = path.join(__dirname, 'iris_model', 'model.json');

  // const loadedModel = await tf.loadLayersModel(`file://${modelPath}`);
  // console.log(loadedModel.summary()); // Example of new input data for Iris flowers
  const newInputs = [
    [5.1, 3.5, 1.4, 0.2], // Sample 1
    [6.2, 2.9, 4.3, 1.3], // Sample 2
    [7.7, 3.0, 6.1, 2.3], // Sample 3
    [5.0, 3.6, 1.4, 0.2], // Sample 4
    [5.4, 3.9, 1.7, 0.4], // Sample 5
    // Add more samples here...
    [5.0, 3.4, 1.5, 0.2], // Sample 6
    [4.4, 2.9, 1.4, 0.2], // Sample 7
    [4.9, 3.1, 1.5, 0.1], // Sample 8
    [5.4, 3.7, 1.5, 0.2], // Sample 9
    [4.8, 3.4, 1.6, 0.2], // Sample 10
    // Add more samples here...
    [5.0, 3.0, 1.6, 0.2], // Sample 11
    [5.0, 3.4, 1.6, 0.4], // Sample 12
    [5.2, 3.5, 1.5, 0.2], // Sample 13
    [5.2, 3.4, 1.4, 0.2], // Sample 14
    [4.7, 3.2, 1.6, 0.2], // Sample 15
    // Add more samples here...
    // Add 35 more samples to reach a total of 50
    [4.6, 3.1, 1.5, 0.2], // Sample 16
    [5.1, 3.8, 1.6, 0.2], // Sample 17
    [5.2, 3.4, 1.5, 0.2], // Sample 18
    [4.4, 3.0, 1.3, 0.2], // Sample 19
    [5.1, 3.4, 1.5, 0.2], // Sample 20
    // Add more samples here...
    [6.7, 3.1, 4.4, 1.4], // Sample 46
    [6.3, 2.3, 4.4, 1.3], // Sample 47
    [6.2, 2.9, 4.3, 1.3], // Sample 48
    [6.4, 2.9, 4.3, 1.3], // Sample 49
    [6.9, 3.1, 4.9, 1.5], // Sample 50
  ];

  // Example of corresponding labels for the new input data
  const newLabels = [
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 1)
    [0, 1, 0], // One-hot encoded label for 'versicolor' (Sample 2)
    [0, 0, 1], // One-hot encoded label for 'virginica' (Sample 3)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 4)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 5)
    // Add more labels here...
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 6)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 7)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 8)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 9)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 10)
    // Add more labels here...
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 11)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 12)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 13)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 14)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 15)
    // Add more labels here...
    // Add corresponding labels for the 35 additional samples
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 16)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 17)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 18)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 19)
    [1, 0, 0], // One-hot encoded label for 'setosa' (Sample 20)
    // Add more labels here...
    [0, 1, 0], // One-hot encoded label for 'versicolor' (Sample 46)
    [0, 1, 0], // One-hot encoded label for 'versicolor' (Sample 47)
    [0, 1, 0], // One-hot encoded label for 'versicolor' (Sample 48)
    [0, 1, 0], // One-hot encoded label for 'versicolor' (Sample 49)
    [0, 1, 0], // One-hot encoded label for 'versicolor' (Sample 50)
  ];

  // Compile the model
  loadedModel.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  // Convert input data to tensors
  const newInputsTensor = tf.tensor2d(newInputs);

  // Convert labels to tensors (assuming newLabels is already in tensor format)
  const newLabelsTensor = tf.tensor2d(newLabels);

  // Train your model again
  await loadedModel.fit(newInputsTensor, newLabelsTensor, {
    epochs: 35,
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

  // Save the model in the current directory
  await saveModel(loadedModel, 'iris_model');

  res.json('result');
};

const predict = async (req, res) => {
  try {
    const model = await loadModel('iris_model');

    const inputs = [
      [6.1, 2.8, 4.7, 1.2], // Sample 1
      [2.9, 1.0, 1.4, 0.2], // Sample 2
      [5.7, 3.8, 1.7, 0.3], // Sample 3
      [4.6, 3.1, 1.5, 0.2], // Sample 4
    ];

    // Convert input data to tensors
    const inputsTensor = tf.tensor2d(inputs);

    // Make predictions
    const predictions = model.predict(inputsTensor);

    const result = [];
    // Define the species labels
    const speciesLabels = ['Setosa', 'Versicolor', 'Virginica'];

    // Convert predictions to class labels
    await predictions.array().then((array) => {
      array.forEach((probabilities, exampleIndex) => {
        const maxProbabilityIndex = probabilities.indexOf(
          Math.max(...probabilities)
        );
        console.log(
          `Example ${exampleIndex + 1}: Predicted species is ${
            speciesLabels[maxProbabilityIndex]
          }`
        );
        result.push(speciesLabels[maxProbabilityIndex]);
      });
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  tensorTest,
  irisData,
  trainAgain,
  predict,
};
