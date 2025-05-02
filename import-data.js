require('dotenv').config({ path: './config.env' });
const fs = require('fs');
const mongoose = require('mongoose');

const DB = process.env.DATABASE_CONNECT.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB)
  .then(() => console.log('Connection to the database has been established')) //eslint-disable-line
  .catch(() => console.log('Could not connect to the database')); //eslint-disable-line

const importData = async dataset => {
  const data = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/${dataset}s.json`));

  await require(`./models/${dataset}Model.js`).create(data);

  console.log('Date has been imported successfully'); //eslint-disable-line
  process.exit(0);
};

const deleteData = async dataset => {
  await require(`./models/${dataset}Model.js`).deleteMany();

  console.log('Data has been deleted successfully'); //eslint-disable-line
  process.exit(0);
};

if (process.argv[2] === '--import') importData(process.argv[3]);
if (process.argv[2] === '--delete') deleteData(process.argv[3]);
