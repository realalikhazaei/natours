const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
console.log(app.get('env'));

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(con => {
    // console.log(con.connections);
    console.log('Connection to database has been established');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Name is required'],
    unique: [true, 'Name must be unqiue'],
  },
  rating: {
    type: 'number',
    default: 4.5,
  },
  price: {
    type: 'number',
    required: [true, 'Price is required'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save()
  .then(doc => console.log(doc))
  .catch(err => console.log(`ERROR 💥💥 ${err}`));

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Starting the API service on port ${process.env.PORT}...`);
});
