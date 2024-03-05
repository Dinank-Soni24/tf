const path = require('path');
const fs = require('fs');

const saveModel = async (model, name) => {
  try {
    const savePath = path.join(__dirname, '..', '..', 'ml-models', `${name}`);

    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }

    await model.save(`file://${savePath}`);
    console.log(`Saving model to ${savePath}`);

    return savePath;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = saveModel;
