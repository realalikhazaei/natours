require('dotenv').config({ path: 'config.env' });
const fs = require('fs');
const mongoose = require('mongoose');

const DB = process.env.DATABASE_CONNECT.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB)
  .then(() => console.log('Connection to the database has been established')) //eslint-disable-line
  .catch(() => console.log('There has been a problem connecting to the database')); //eslint-disable-line

const importData = async function (filename) {
  const data = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/${filename}.json`));
  const modelName = filename.slice(0, -1);
  await require(`./models/${modelName}Model`).create(data);
  console.log('All data has been imported successfully'); //eslint-disable-line
  process.exit();
};

const deleteData = async function (filename) {
  const modelName = filename.slice(0, -1);
  await require(`./models/${modelName}Model`).deleteMany();
  console.log('All data has been deleted successfully'); //eslint-disable-line
  process.exit();
};

if (process.argv[2] === '--import') importData(process.argv[3]);
if (process.argv[2] === '--delete') deleteData(process.argv[3]);
