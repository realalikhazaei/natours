const hpp = require('./hpp');
const sanitize = require('./sanitize');

const APIFeatures = class {
  constructor(queryObj, queryStr) {
    this.query = queryObj;
    this.queryStr = this.#secure(queryStr);
  }

  filter() {
    let queryStr = { ...this.queryStr };
    const filterOut = ['sort', 'fields', 'page', 'limit'];
    filterOut.forEach(el => delete queryStr[el]);
    queryStr = JSON.stringify(queryStr).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    queryStr = JSON.parse(queryStr);
    this.query.find(queryStr);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else this.query.sort('-createdAt');

    return this;
  }

  projection() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query.select(fields);
    } else this.query.select('-__v');

    return this;
  }

  pagination() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);

    return this;
  }

  #secure(queryStr) {
    return sanitize(hpp(queryStr));
  }
};

module.exports = APIFeatures;
